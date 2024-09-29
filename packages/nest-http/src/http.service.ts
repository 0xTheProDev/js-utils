import { Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

import { ClientService, RequestOptions, ResponseData } from "./client.service";

/**
 * @internal
 * Request Options for Http Client.
 */
export type HttpRequestOptions = Omit<RequestOptions, "method">;

/**
 * @public
 * HTTP/1.1 REST Client. The HTTP Client is responsible for sending
 * HTTP/1.1 requests to both the internal and the external services. The HTTP Client is
 * instantiated once in every dependency tree to avoid any global taint or side effect.
 *
 * @memberof HttpModule
 *
 * @example
 * // app.service.ts
 * \@Injectable()
 * export class AppService {
 *   constructor(
 *     private readonly httpClient: HttpService,
 *   ) {}
 *
 *   getItems(): Observable<unknown> {
 *     return this.httpClient.get({
 *       origin: 'http://internal-service',
 *       path: '/items',
 *     });
 *   }
 * }
 */
@Injectable()
export class HttpService {
  constructor(private readonly client: ClientService) {}

  /**
   * Closes the Http Client and gracefully waits for enqueued requests to complete
   * before returning.
   */
  close(): Observable<void> {
    return this.client.close();
  }

  /**
   * Performs a DELETE HTTP/1.1 request.
   * @param options - Configuration options for the HTTP Request Handler.
   * @returns HTTP Response object.
   */
  delete(options: HttpRequestOptions): Observable<ResponseData> {
    return this.client.request({ ...options, method: "DELETE" });
  }

  /**
   * Performs a GET HTTP/1.1 request.
   * @param options - Configuration options for the HTTP Request Handler.
   * @returns HTTP Response object.
   */
  get(options: HttpRequestOptions): Observable<ResponseData> {
    return this.client.request({ ...options, method: "GET" });
  }

  /**
   * Performs a HEAD HTTP/1.1 request.
   * @param options - Configuration options for the HTTP Request Handler.
   * @returns HTTP Response object.
   */
  head(options: HttpRequestOptions): Observable<ResponseData> {
    return this.client.request({ ...options, method: "HEAD" });
  }

  /**
   * Performs a PATCH HTTP/1.1 request.
   * @param options - Configuration options for the HTTP Request Handler.
   * @returns HTTP Response object.
   */
  patch(options: HttpRequestOptions): Observable<ResponseData> {
    return this.client.request({ ...options, method: "PATCH" });
  }

  /**
   * Performs a POST HTTP/1.1 request.
   * @param options - Configuration options for the HTTP Request Handler.
   * @returns HTTP Response object.
   */
  post(options: HttpRequestOptions): Observable<ResponseData> {
    return this.client.request({ ...options, method: "POST" });
  }

  /**
   * Performs a PUT HTTP/1.1 request.
   * @param options - Configuration options for the HTTP Request Handler.
   * @returns HTTP Response object.
   */
  put(options: HttpRequestOptions): Observable<ResponseData> {
    return this.client.request({ ...options, method: "PUT" });
  }

  /**
   * Performs a TRACE HTTP/1.1 request.
   * @param options - Configuration options for the HTTP Request Handler.
   * @returns HTTP Response object.
   */
  trace(options: HttpRequestOptions): Observable<ResponseData> {
    return this.client.request({ ...options, method: "TRACE" });
  }
}
