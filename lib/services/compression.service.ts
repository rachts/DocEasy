import { execFile } from 'child_process';
import { promisify } from 'util';
import { rm } from 'fs/promises';
import os from 'os';
import { APIError } from '../errors';

const execFileAsync = promisify(execFile);

export type CompressionLevel = 'low' | 'recommended' | 'extreme';

export class PDFCompressionService {
  private gsBinary: string | null = null;
  private qpdfBinary: string | null = null;
  private binCheckPromise: Promise<void> | null = null;

  constructor() {
    this.binCheckPromise = this.detectBinaries();
  }

  /**
   * Detect ghostscript and qpdf binaries based on OS
   */
  private async detectBinaries(): Promise<void> {
    const isWin = os.platform() === 'win32';
    const gsCandidates = isWin ? ['gswin64c', 'gswin32c', 'gs'] : ['gs'];
    const qpdfCandidates = isWin ? ['qpdf.exe', 'qpdf'] : ['qpdf'];

    for (const bin of gsCandidates) {
      try {
        await execFileAsync(bin, ['--version']);
        this.gsBinary = bin;
        break;
      } catch {
        // Continue checking
      }
    }

    for (const bin of qpdfCandidates) {
      try {
        await execFileAsync(bin, ['--version']);
        this.qpdfBinary = bin;
        break;
      } catch {
        // Continue checking
      }
    }
  }

  async ensureBinaries() {
    if (this.binCheckPromise) {
      await this.binCheckPromise;
    }
    if (!this.gsBinary || !this.qpdfBinary) {
      throw new APIError('Server compression engine is unavailable (missing Ghostscript or qpdf)', 'ENGINE_UNAVAILABLE', 503, true);
    }
  }

  /**
   * Compress a PDF using Ghostscript
   */
  async compress(inputPath: string, outputPath: string, level: CompressionLevel = 'recommended'): Promise<void> {
    await this.ensureBinaries();

    const gsProfile = this.getGhostscriptProfile(level);

    const args = [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      `-dPDFSETTINGS=${gsProfile}`,
      '-dNOPAUSE',
      '-dQUIET',
      '-dBATCH',
      `-sOutputFile=${outputPath}`,
      inputPath,
    ];

    try {
      await execFileAsync(this.gsBinary!, args);
    } catch (error: any) {
      console.error('Ghostscript compression failed:', error);
      throw new APIError(`Compression failed: ${error.message || error}`, 'COMPRESSION_FAILED', 500, true);
    }
  }

  /**
   * Remove redundant PDF objects, optimize streams, and linearize for fast web view
   */
  async linearize(inputPath: string, outputPath: string): Promise<void> {
    await this.ensureBinaries();

    const args = [
      '--linearize',
      '--stream-data=compress',
      inputPath,
      outputPath,
    ];

    try {
      await execFileAsync(this.qpdfBinary!, args);
    } catch (error: any) {
      console.error('qpdf linearization failed:', error);
      throw new APIError(`Optimization failed: ${error.message || error}`, 'COMPRESSION_FAILED', 500, true);
    }
  }

  /**
   * Combine Ghostscript compression and qpdf linearization
   */
  async fullOptimize(inputPath: string, outputPath: string, level: CompressionLevel = 'recommended'): Promise<void> {
    const tempPath = `${outputPath}.tmp`;
    
    try {
      // 1. Compress with Ghostscript
      await this.compress(inputPath, tempPath, level);
      
      // 2. Linearize & strip metadata with qpdf
      await this.linearize(tempPath, outputPath);
    } finally {
      // 3. Clean up temp file safely
      await rm(tempPath, { force: true }).catch(() => {});
    }
  }

  private getGhostscriptProfile(level: CompressionLevel): string {
    switch (level) {
      case 'low': return '/printer';      // 300 DPI images
      case 'recommended': return '/ebook'; // 150 DPI images
      case 'extreme': return '/screen';    // 72 DPI images
      default: return '/ebook';
    }
  }
}

export const compressionService = new PDFCompressionService();
