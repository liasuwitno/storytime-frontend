interface RequestProps {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
}

export const request = async ({
  url,
  method = "GET",
  headers = {},
  body = undefined,
}: RequestProps): Promise<any> => {
  const result = await $fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return result;
};
