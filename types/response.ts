export interface ApiResponse<T> {
  status: "success" | "error";
  code: number;
  message: string;
  data: T;
}

export interface ErrorPayload {
  errors: Array<{
    field: string;
    messages: string;
  }>;
}

export interface RequestProps<T> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: T;

  useToken?: boolean;
}
