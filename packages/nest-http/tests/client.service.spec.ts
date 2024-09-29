import { Test } from "@nestjs/testing";
import { lastValueFrom } from "rxjs";
import { Dispatcher } from "undici";
import { MockInstance } from "vitest";

import {
  ClientService,
  ConnectOptions,
  PipelineOptions,
  RequestOptions,
  StreamOptions,
} from "../src/client.service";
import { HttpModule } from "../src/http.module";
import { DISPATCHER } from "../src/http.provider-tokens";

describe("ClientService", () => {
  let clientService: ClientService, dispatcher: Dispatcher;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          defaultConnectOptions: {
            maxRedirections: 5,
          },
          defaultPipelineOptions: {
            objectMode: true,
          },
          defaultRequestOptions: {
            origin: "http://example.com",
          },
          defaultStreamOptions: {
            bodyTimeout: 5000,
          },
        }),
      ],
    }).compile();

    clientService = module.get<ClientService>(ClientService);
    dispatcher = module.get<Dispatcher>(DISPATCHER);
  });

  it("should be defined", () => {
    expect(clientService).toBeDefined();
    expect(dispatcher).toBeDefined();
  });

  describe("#close", () => {
    let closeSpy: MockInstance;

    beforeEach(() => {
      closeSpy = vi.spyOn(dispatcher, "close");
    });

    afterEach(() => {
      closeSpy.mockRestore();
    });

    it("should close dispatcher connection", async () => {
      await lastValueFrom(clientService.close());
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("#connect", () => {
    type ConnectSpy = MockInstance<[ConnectOptions]>;
    let connectSpy: ConnectSpy;

    beforeEach(() => {
      connectSpy = vi
        .spyOn(dispatcher, "connect")
        .mockResolvedValue(null) as unknown as ConnectSpy;
    });

    afterEach(() => {
      connectSpy.mockRestore();
    });

    it("should open a two-way communication channel", async () => {
      await lastValueFrom(
        clientService.connect({
          origin: "http://connect.example.com",
          path: "/test",
        }),
      );
      expect(connectSpy).toHaveBeenCalledOnce();
      expect(connectSpy).toHaveBeenCalledWith({
        origin: "http://connect.example.com",
        maxRedirections: 5,
        path: "/test",
      });
    });
  });

  describe("#destroy", () => {
    let destroySpy: MockInstance;

    beforeEach(() => {
      destroySpy = vi.spyOn(dispatcher, "destroy");
    });

    afterEach(() => {
      destroySpy.mockRestore();
    });

    it("should teardown dispatcher connection", async () => {
      await lastValueFrom(clientService.destroy(null));
      expect(destroySpy).toHaveBeenCalledWith(null);
    });
  });

  describe("#pipeline", () => {
    type PipelineSpy = MockInstance<[PipelineOptions]>;
    let pipelineHandlerMock: MockInstance, pipelineSpy: PipelineSpy;

    beforeEach(() => {
      pipelineHandlerMock = vi.fn();
      pipelineSpy = vi
        .spyOn(dispatcher, "pipeline")
        .mockResolvedValue(null) as unknown as PipelineSpy;
    });

    afterEach(() => {
      pipelineSpy.mockRestore();
    });

    it("should perform an HTTP stream request", () => {
      clientService.pipeline(
        {
          method: "POST",
          path: "/stream",
        },
        pipelineHandlerMock as unknown as Dispatcher.PipelineHandler,
      );
      expect(pipelineSpy).toHaveBeenCalledOnce();
      expect(pipelineSpy).toHaveBeenCalledWith(
        {
          method: "POST",
          objectMode: true,
          path: "/stream",
        },
        pipelineHandlerMock,
      );
    });
  });

  describe("#request", () => {
    type RequestSpy = MockInstance<[RequestOptions]>;
    let requestSpy: RequestSpy;

    beforeEach(() => {
      requestSpy = vi
        .spyOn(dispatcher, "request")
        .mockResolvedValue(null) as unknown as RequestSpy;
    });

    afterEach(() => {
      requestSpy.mockRestore();
    });

    it("should perform an HTTP/1.1 request", async () => {
      await lastValueFrom(
        clientService.request({
          method: "GET",
          path: "/test",
        }),
      );
      expect(requestSpy).toHaveBeenCalledOnce();
      expect(requestSpy).toHaveBeenCalledWith({
        method: "GET",
        origin: "http://example.com",
        path: "/test",
      });
    });
  });

  describe("#stream", () => {
    type StreamSpy = MockInstance<[StreamOptions]>;
    let streamFactoryMock: MockInstance, streamSpy: StreamSpy;

    beforeEach(() => {
      streamFactoryMock = vi.fn();
      streamSpy = vi
        .spyOn(dispatcher, "stream")
        .mockResolvedValue(null) as unknown as StreamSpy;
    });

    afterEach(() => {
      streamSpy.mockRestore();
    });

    it("should perform an HTTP stream request", async () => {
      await lastValueFrom(
        clientService.stream(
          {
            method: "POST",
            path: "/test",
          },
          streamFactoryMock as unknown as Dispatcher.StreamFactory,
        ),
      );
      expect(streamSpy).toHaveBeenCalledOnce();
      expect(streamSpy).toHaveBeenCalledWith(
        {
          bodyTimeout: 5000,
          method: "POST",
          path: "/test",
        },
        streamFactoryMock,
      );
    });
  });
});
