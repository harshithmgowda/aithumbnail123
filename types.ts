export enum LoadingState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedImage {
  imageUrl: string;
  originalPrompt: string;
}

export interface ThumbnailRequest {
  imageFiles: File[];
  description: string;
}

export interface ApiError {
  message: string;
}