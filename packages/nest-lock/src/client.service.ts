import { Inject, Injectable } from "@nestjs/common";
import { deepmerge } from "deepmerge";

import { makeObservable } from "./observable";

import { DISPATCHER, HTTP_MODULE_OPTIONS } from "./http.provider-tokens";

import type { Observable } from "rxjs";
import type { Duplex } from "stream";
import type { Dispatcher } from "undici";
import type { HttpModuleOptions } from "./http.module-options";

/**
 * @internal
 * Configuration Options for the Connect Request Handler.
 */
export type ConnectOptions = Dispatcher.ConnectOptions;

/**
 * @internal
 * Configuration Options for the Stream Pipeline Handler.
 */
export type PipelineOptions = Dispatcher.PipelineOptions;

/**
 * @internal
 * Configuration Options for the HTTP/1.1 Request Handler.
 */
export type RequestOptions = Dispatcher.RequestOptions;

/**
 * Schema for the HTTP/1.1 Response Object.
 */
export type ResponseData = Dispatcher.ResponseData;

/**
 * @internal
 * Configuration Options for the HTTP Stream Handler.
 */
export type StreamOptions = Dispatcher.RequestOptions;

/**
 * @public
 * HTTP/1.1 Request Client. The Client is responsible for sending
 * requests to both the internal and the external services. The Client is
 * instantiated once in every dependency tree to avoid any taint or side effect.
 * This is a low-level Service and better equipped with handling mixed protocol
 * requests. If you wish to perform only HTTP requests, use `HttpService` instead.
 *
 * @memberof HttpModule
 *
 * @example
 * // app.service.ts
 * \@Injectable()
 * export class AppService {
 *   constructor(
 *     private readonly client: ClientService,
 *   ) {}
 *
 *   getItems(): Observable<unknown> {
 *     return this.client.request({
 *       method: 'GET',
 *       origin: 'http://internal-service',
 *       path: '/items',
 *     });
 *   }
 * }
 */
@Injectable()
export class ClientService {
  constructor(
    @Inject(HTTP_MODULE_OPTIONS)
    private readonly httpModuleOptions: HttpModuleOptions,
    @Inject(DISPATCHER) private dispatcher: Dispatcher,
  ) {}

  /**
   * Closes the Http Client and gracefully waits for enqueued requests to complete before returning.
   */
  close(): Observable<void> {
    return makeObservable(() => this.dispatcher.close());
  }

  /**
   * Compose a chain of dispatchers. This is useful for Tracing and Performance Monitoring.
   * Note that, invoking this method would update it's own dispatcher instance as a side effect.
   * @param dispatchers - A list of Interceptors with Dispatcher.
   * @returns A Composite Dispatcher instance.
   */
  compose(
    ...dispatchers: Dispatcher.DispatcherComposeInterceptor[]
  ): Dispatcher.ComposedDispatcher {
    this.dispatcher = this.dispatcher.compose(dispatchers);
    return this.dispatcher;
  }

  /**
   * Starts two-way communications with the requested resource.
   * @param options - Configuration options for the Connect Request Handler.
   * @returns Connection object for the Two-way Communication.
   */
  connect(options: ConnectOptions): Observable<Dispatcher.ConnectData> {
    return makeObservable(() => {
      return this.dispatcher.connect(
        deepmerge(this.httpModuleOptions.defaultConnectOptions, options),
      );
    });
  }

  /**
   * Destroy the client abruptly with the given err. All the pending and running
   * requests will be asynchronously aborted and error. Waits until socket is
   * closed before invoking the callback (or returning a promise if no callback
   * is provided). Since this operation is asynchronously dispatched there might
   * still be some progress on dispatched requests.
   * @param err - Error object with trace information, due to which the connection
   * has been closed abruptly. Explicitly provide `null` to ignore the tracing.
   */
  destroy(err: Error | null): Observable<void> {
    return makeObservable(() => this.dispatcher.destroy(err));
  }

  /**
   * Open a Readable Stream Pipeline.
   * @param options - Configuration options for the Stream Pipeline Handler.
   * @param handler - Handler to convert Pipeline output into Readable Stream.
   * @returns HTTP Response object.
   */
  pipeline(
    options: PipelineOptions,
    handler: Dispatcher.PipelineHandler,
  ): Duplex {
    return this.dispatcher.pipeline(
      deepmerge(this.httpModuleOptions.defaultPipelineOptions, options),
      handler,
    );
  }

  /**
   * Performs an HTTP/1.1 request.
   * @param options - Configuration options for the HTTP Request Handler.
   * @returns HTTP Response object.
   */
  request(options: RequestOptions): Observable<ResponseData> {
    return makeObservable(() =>
      this.dispatcher.request(
        deepmerge(this.httpModuleOptions.defaultRequestOptions, options),
      ),
    );
  }

  /**
   * Performs an HTTP Stream request.
   * @param options - Configuration options for the HTTP Stream Request Handler.
   * @returns HTTP Stream Response object.
   */
  stream(
    options: StreamOptions,
    factory: Dispatcher.StreamFactory,
  ): Observable<Dispatcher.StreamData> {
    return makeObservable(() =>
      this.dispatcher.stream(
        deepmerge(this.httpModuleOptions.defaultStreamOptions, options),
        factory,
      ),
    );
  }
}
