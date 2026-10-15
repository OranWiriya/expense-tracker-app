export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
  }
}

type Options = Omit<RequestInit, "body"> & {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

async function request<T>(
  path: string,
  { params, body, headers, ...initOption }: Options = {},
): Promise<T> {
  const query = params
    ? new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)]),
      ).toString()
    : "";
  const isFormData = body instanceof FormData;

  const res = await fetch(query ? `${path}?${query}` : path, {
    ...initOption,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body:
      body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new HttpError(
      res.status,
      data?.message ?? `Request failed (${res.status})`,
      data,
    );
  }

  return res.status === 204 ? (undefined as T) : res.json();
}

export const http = {
  get: <T>(path: string, opts?: Options) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: Options) =>
    request<T>(path, { ...opts, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, opts?: Options) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: Options) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
