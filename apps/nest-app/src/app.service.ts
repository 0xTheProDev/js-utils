import { HttpService } from "@theprodev/nest-http";
import { Injectable } from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello() {
    return {
      message: "Hello World!",
    };
  }

  getQuote(): Observable<unknown> {
    return this.httpService
      .get({
        origin: "https://animechan.io",
        path: "/api/v1/quotes/random",
      })
      .pipe(map((response) => response.body.json()));
  }
}
