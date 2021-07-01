import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { SsrService } from "../ssr/ssr.service";

@Injectable({
  providedIn: "root"
})
export class ClockService {
  private secondSubject = new Subject<void>();

  constructor(ssrService: SsrService) {
    if (ssrService.isServerSide) {
      return;
    }

    setTimeout(() => {
      setInterval(() => this.secondSubject.next(), 1000);
    }, 1000 - new Date().getMilliseconds());
  }

  public everySecond$() {
    return this.secondSubject.asObservable();
  }
}
