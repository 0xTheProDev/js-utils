import { HttpService } from "@theprodev/nest-http";
import { InjectLock, Lock } from "@theprodev/nest-lock";
import { Injectable } from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    @InjectLock() private readonly lock: Lock,
  ) {}

  async getHello(): Promise<string> {
    try {
      return await this.lock.execute("appService", () => "Hello World!", {
        ttl: 1000,
      });
    } catch (err) {
      console.log((err as any).cause);
    }

    return "Bye World!";
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
