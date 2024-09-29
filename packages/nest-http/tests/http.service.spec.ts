import { Test } from "@nestjs/testing";
import { MockInstance } from "vitest";

import { ClientService, RequestOptions } from "../src/client.service";
import { HttpModule } from "../src/http.module";
import { HttpService } from "../src/http.service";

type ClientRequestSpy = MockInstance<ClientService["request"]>;

describe("HttpService", () => {
  let clientReqSpy: ClientRequestSpy,
    clientService: ClientService,
    httpService: HttpService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [HttpModule.register()],
    }).compile();

    clientService = module.get<ClientService>(ClientService);
    httpService = module.get<HttpService>(HttpService);

    clientReqSpy = vi.spyOn(clientService, "request");
  });

  afterEach(() => {
    clientReqSpy.mockReset();
  });

  afterAll(() => {
    clientReqSpy.mockRestore();
  });

  it("should be defined", () => {
    expect(httpService).toBeDefined();
  });

  describe("#close", () => {
    let clientCloseSpy: MockInstance;

    beforeEach(() => {
      clientCloseSpy = vi.spyOn(clientService, "close");
    });

    afterEach(() => {
      clientCloseSpy.mockReset();
    });

    afterAll(() => {
      clientCloseSpy.mockRestore();
    });

    it("should close client connection", () => {
      httpService.close();
      expect(clientCloseSpy).toHaveBeenCalledOnce();
    });
  });

  describe("#delete", () => {
    it("should make DELETE request", () => {
      httpService.delete({
        path: "/items/1",
      });
      expect(clientReqSpy).toHaveBeenCalledOnce();
      expect(clientReqSpy).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/items/1",
      } satisfies RequestOptions);
    });
  });

  describe("#get", () => {
    it("should make GET request", () => {
      httpService.get({
        path: "/items",
        query: {
          startsWith: "test",
        },
      });
      expect(clientReqSpy).toHaveBeenCalledOnce();
      expect(clientReqSpy).toHaveBeenCalledWith({
        method: "GET",
        path: "/items",
        query: {
          startsWith: "test",
        },
      } satisfies RequestOptions);
    });
  });

  describe("#head", () => {
    it("should make HEAD request", () => {
      httpService.head({
        path: "/items",
      });
      expect(clientReqSpy).toHaveBeenCalledOnce();
      expect(clientReqSpy).toHaveBeenCalledWith({
        method: "HEAD",
        path: "/items",
      } satisfies RequestOptions);
    });
  });

  describe("#patch", () => {
    it("should make PATCH request", () => {
      httpService.patch({
        body: '{"name":"test"}',
        path: "/items/1",
      });
      expect(clientReqSpy).toHaveBeenCalledOnce();
      expect(clientReqSpy).toHaveBeenCalledWith({
        body: '{"name":"test"}',
        method: "PATCH",
        path: "/items/1",
      } satisfies RequestOptions);
    });
  });

  describe("#post", () => {
    it("should make POST request", () => {
      httpService.post({
        body: '{"name":"test"}',
        path: "/items",
      });
      expect(clientReqSpy).toHaveBeenCalledOnce();
      expect(clientReqSpy).toHaveBeenCalledWith({
        body: '{"name":"test"}',
        method: "POST",
        path: "/items",
      } satisfies RequestOptions);
    });
  });

  describe("#put", () => {
    it("should make PUT request", () => {
      httpService.put({
        body: '{"name":"test"}',
        path: "/items/1",
      });
      expect(clientReqSpy).toHaveBeenCalledOnce();
      expect(clientReqSpy).toHaveBeenCalledWith({
        body: '{"name":"test"}',
        method: "PUT",
        path: "/items/1",
      } satisfies RequestOptions);
    });
  });

  describe("#trace", () => {
    it("should make TRACE request", () => {
      httpService.trace({
        path: "/",
      });
      expect(clientReqSpy).toHaveBeenCalledOnce();
      expect(clientReqSpy).toHaveBeenCalledWith({
        method: "TRACE",
        path: "/",
      } satisfies RequestOptions);
    });
  });
});
