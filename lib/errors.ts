export type ErrorCode = 
  | 'INVALID_FILE'
  | 'INVALID_PDF'
  | 'FILE_TOO_LARGE'
  | 'ENGINE_UNAVAILABLE'
  | 'COMPRESSION_FAILED'
  | 'STORAGE_FAILED'
  | 'INTERNAL_ERROR';

export class APIError extends Error {
  public code: ErrorCode;
  public status: number;
  public fallbackToClient: boolean;

  constructor(message: string, code: ErrorCode, status: number = 500, fallbackToClient: boolean = false) {
    super(message);
    this.code = code;
    this.status = status;
    this.fallbackToClient = fallbackToClient;
    this.name = 'APIError';
  }
}

export function formatErrorResponse(error: unknown) {
  if (error instanceof APIError) {
    return {
      error: error.code,
      message: error.message,
      fallbackToClient: error.fallbackToClient,
      status: error.status,
    };
  }

  // Handle generic / unexpected errors safely without exposing stack traces
  console.error('[Unhandled API Error]:', error);
  return {
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred during processing.',
    fallbackToClient: false,
    status: 500,
  };
}
