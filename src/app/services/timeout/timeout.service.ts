import { Injectable } from "@angular/core";
import { SsrService } from "../ssr/ssr.service";

@Injectable({
  providedIn: "root"
})
export class TimeoutService {
  constructor(private readonly ssrService: SsrService) {}

  public setTimeout(callback: () => void, delay: number = 0) {
    if (this.ssrService.isServerSide) {
      return;
    }

    setTimeout(callback, delay);
  }
}
