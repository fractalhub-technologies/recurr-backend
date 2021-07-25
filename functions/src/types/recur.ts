// Model Schema on document
export interface Response {
  success: boolean;
  error?: string;
  data?: object;
}

export interface Commit {
  id: number;
  action: string;
  payload: any
}