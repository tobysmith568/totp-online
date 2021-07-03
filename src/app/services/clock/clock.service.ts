import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { SsrService } from "../ssr/ssr.service";

@Injectable({
  providedIn: "root"
})
export class ClockService {
  private secondSubject = new BehaviorSubject<number>(this.secondOfTheHour());

  constructor(ssrService: SsrService) {
    if (ssrService.isServerSide) {
      return;
    }

    setTimeout(() => {
      setInterval(() => this.secondSubject.next(this.secondOfTheHour()), 1000);
    }, 1000 - new Date().getMilliseconds());
  }

  public secondOfTheHour$() {
    return this.secondSubject.asObservable();
  }

  public secondOfTheHour() {
    const date = new Date();
    return date.getMinutes() * 60 + date.getSeconds();
  }
}
