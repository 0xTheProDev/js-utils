import { Controller, Get } from "@nestjs/common";

import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("ping")
  getPing() {
    return "ok" as const;
  }

  @Get("hello")
  getHello() {
    return this.appService.getHello();
  }

  @Get("quote")
  getQuote() {
    return this.appService.getQuote();
  }
}
