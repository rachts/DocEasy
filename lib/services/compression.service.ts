import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

export type CompressionLevel = 'low' | 'recommended' | 'extreme';

export class PDFCompressionService {
  /**
   * Compress a PDF using Ghostscript
   * @param inputPath Path to input PDF
   * @param outputPath Path to output PDF
   * @param level Compression intensity
   */
  async compress(inputPath: string, outputPath: string, level: CompressionLevel = 'recommended'): Promise<void> {
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
      await execFileAsync('gs', args);
    } catch (error) {
      console.error('Ghostscript compression failed:', error);
      throw new Error(`Compression failed: ${error}`);
    }
  }

  /**
   * Remove redundant PDF objects, optimize streams, and linearize for fast web view
   * @param inputPath Path to input PDF
   * @param outputPath Path to output PDF
   */
  async linearize(inputPath: string, outputPath: string): Promise<void> {
    const args = [
      '--linearize',
      '--stream-data=compress',
      inputPath,
      outputPath,
    ];

    try {
      await execFileAsync('qpdf', args);
    } catch (error) {
      console.error('qpdf linearization failed:', error);
      throw new Error(`Optimization failed: ${error}`);
    }
  }

  /**
   * Combine Ghostscript compression and qpdf linearization
   */
  async fullOptimize(inputPath: string, outputPath: string, level: CompressionLevel = 'recommended'): Promise<void> {
    const tempPath = `${outputPath}.tmp`;
    
    // 1. Compress with Ghostscript
    await this.compress(inputPath, tempPath, level);
    
    // 2. Linearize & strip metadata with qpdf
    await this.linearize(tempPath, outputPath);
    
    // 3. Clean up temp file (in a real app, you'd use fs/promises here)
    const { rm } = await import('fs/promises');
    await rm(tempPath).catch(() => {});
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
