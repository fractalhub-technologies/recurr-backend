// Model Schema on document
export interface Recur {
  title: string;
  duration: number;
}

export interface CreateRecurParams {
  title: string;
  duration: number;
}

export interface CreateRecurResponse {
  success: boolean;
  id: string;
}

export interface ListRecurResponse {
  success: boolean;
  data: Recur[];
}
