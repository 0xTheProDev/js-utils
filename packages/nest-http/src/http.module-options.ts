import { ClassProvider, FactoryProvider, ModuleMetadata } from "@nestjs/common";
import { Agent, RetryHandler } from "undici";

import type {
  ConnectOptions,
  PipelineOptions,
  RequestOptions,
  StreamOptions,
} from "./client.service";

/**
 * @internal
 * Configuration Options for the HTTP Client.
 */
type ClientOptions = Omit<Agent.Options, "factory">;

/**
 * @internal
 * Configuration Options for the Retry Handler.
 */
type RetryOptions = RetryHandler.RetryOptions;

/**
 * @public
 * Configuration Options for Http Module.
 *
 * @memberof HttpModule
 *
 * @example
 * \@Injectable()
 *  export class AppService {
 *    constructor(@Inject(HTTP_MODULE_OPTIONS) private readonly options: HttpModuleOptions) { }
 *  }
 */
export type HttpModuleOptions = {
  /**
   * Http Client Construction Options (optional).
   */
  clientOptions?: ClientOptions;
  /**
   * Default Configuration Options for Connect Request Handler (optional).
   */
  defaultConnectOptions?: Partial<ConnectOptions>;
  /**
   * Default Configuration Options for Stream Pipeline Handler (optional).
   */
  defaultPipelineOptions?: Partial<PipelineOptions>;
  /**
   * Default Configuration Options for HTTP/1.1 Request Handler (optional).
   */
  defaultRequestOptions?: Partial<RequestOptions>;
  /**
   * Default Configuration Options for HTTP Stream Request Handler (optional).
   */
  defaultStreamOptions?: Partial<StreamOptions>;
  /**
   * Retry Handler Construction Options (optional).
   * If found Falsy, Retry will not be performed.
   */
  retryOptions?: RetryOptions;
};

/**
 * @public
 * Factory for creating Http Module Configuration Options through Class Provider.
 *
 * @memberof HttpModule
 */
export interface HttpModuleOptionsFactory {
  /** This method must return all the necessary configuration for Http Module. */
  createHttpModuleOptions(): HttpModuleOptions;
}

/**
 * @internal
 * Class Provider for creating Http Module Configuration Options.
 */
type HttpModuleClassProviders = ClassProvider<HttpModuleOptionsFactory>;

/**
 * @internal
 * Factory Provider for creating Http Module Configuration Options.
 */
type HttpModuleFactoryProviders = FactoryProvider<HttpModuleOptions>;

/**
 * @public
 * Asynchronous Configuration Options for Http Module.
 *
 * @memberof HttpModule
 */
export type HttpModuleAsyncOptions = Pick<ModuleMetadata, "imports"> & {
  inject?: HttpModuleFactoryProviders["inject"];
  useClass?: HttpModuleClassProviders["useClass"];
  useFactory?: HttpModuleFactoryProviders["useFactory"];
};
