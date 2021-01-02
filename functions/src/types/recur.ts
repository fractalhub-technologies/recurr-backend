// Model Schema on document
export interface Recur {
  title: string;
  duration: number;
  type?: "personal" | "group";
}

export interface Response {
  success: boolean;
  error?: string;
  data?: object;
}

export interface CreateRecurParams {
  title: string;
  duration: number;
}

export interface CreateRecurResponse extends Response {
  data: {
    id: string;
  };
}

export interface ListRecurResponse extends Response {
  data: FirebaseFirestore.DocumentData[];
}

export interface DeleteRecurParams {
  id: number;
}

export interface DeleteRecurResponse extends Response {}

export interface UpdateRecurParams {
  id: string;
  updateData: {
    title?: string;
    duration?: number;
  };
}
