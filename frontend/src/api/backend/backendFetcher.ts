import { BackendContext } from "./backendContext";

const baseUrl = import.meta.env["VITE_API_URL"]; // TODO add your baseUrl

export type ErrorWrapper<TError> = TError | { status: "unknown"; payload: string };

export type BackendFetcherOptions<TBody, THeaders, TQueryParams, TPathParams> = {
  url: string;
  method: string;
  body?: TBody;
  headers?: THeaders;
  queryParams?: TQueryParams;
  pathParams?: TPathParams;
  signal?: AbortSignal;
} & BackendContext["fetcherOptions"];

export async function backendFetch<
  TData,
  TError,
  TBody extends {} | FormData | undefined | null,
  THeaders extends {},
  TQueryParams extends {},
  TPathParams extends {}
>({
  url,
  method,
  body,
  headers,
  pathParams,
  queryParams,
  signal
}: BackendFetcherOptions<TBody, THeaders, TQueryParams, TPathParams>): Promise<TData> {
  try {
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers
    };

    /**
     * As the fetch API is being used, when multipart/form-data is specified
     * the Content-Type header must be deleted so that the browser can set
     * the correct boundary.
     * https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects#sending_files_using_a_formdata_object
     */
    if (
      // @ts-ignore
      requestHeaders["Content-Type"]
        .toLowerCase()
        .includes("multipart/form-data")
    ) {
      delete requestHeaders["Content-Type"];
    }

    const response = await window.fetch(
      `${baseUrl}${resolveUrl(url, queryParams, pathParams)}`,
      {
        signal,
        method: method.toUpperCase(),
        body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
        headers: requestHeaders
      }
    );
    // if (!response.ok) {
    //   let error: ErrorWrapper<TError>;
    //   try {
    //     // @ts-ignore
    //     error = await response.json();
    //   } catch (e) {
    //     error = {
    //       status: 'unknown' as const,
    //       payload:
    //         e instanceof Error
    //           ? `Unexpected error (${e.message})`
    //           : 'Unexpected error'
    //     };
    //   }

    //   throw error;
    // }

    if (!response.ok) {
      let error: ErrorWrapper<TError>;

      // Handle Unauthorized (401)
      if (response.status === 401) {
        alertSessionExpired();
        return Promise.reject({
          status: "unauthorized",
          message: "User is unauthorized"
        });
      }

      try {
        // @ts-ignore
        error = await response.json();
      } catch (e) {
        error = {
          status: "unknown" as const,
          payload:
            e instanceof Error ? `Unexpected error (${e.message})` : "Unexpected error"
        };
      }

      throw error;
    }

    if (response.headers.get("content-type")?.includes("json")) {
      // @ts-ignore
      return await response.json();
    } else {
      // if it is not a json response, assume it is a blob and cast it to TData
      return (await response.blob()) as unknown as TData;
    }
  } catch (e) {
    const errorObject: Error = {
      name: "unknown" as const,
      message: e instanceof Error ? `Network error (${e.message})` : "Network error",
      stack: e as string
    };
    throw errorObject;
  }
}

const resolveUrl = (
  url: string,
  queryParams: Record<string, string> = {},
  pathParams: Record<string, string> = {}
) => {
  let query = new URLSearchParams(queryParams).toString();
  if (query) query = `?${query}`;
  return url.replace(/\{\w*\}/g, key => String(pathParams[key.slice(1, -1)])) + query;
};

function alertSessionExpired() {
  // const userConfirmed = window.confirm(
  //   "Your session has expired. Please log in again to continue."
  // );
  // if (userConfirmed) {
  //   window.location.href = "/logout"; // Redirect to logout page
  // }
}
