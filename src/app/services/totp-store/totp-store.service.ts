import { Inject, Injectable, InjectionToken } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ClockService } from "../clock/clock.service";
import { GuidService } from "../guid/guid.service";
import { ITotp, Totp } from "./totp";

export const LOCAL_STORAGE = new InjectionToken<typeof window.localStorage | null>("Local Storage");

@Injectable({
  providedIn: "root"
})
export class TotpStoreService {
  private storageKey = "TOTP-CONFIGS";

  public allSubject = new BehaviorSubject<Totp[]>(this.getAll());

  constructor(
    @Inject(LOCAL_STORAGE) private readonly localStorage: typeof window.localStorage | null,
    private readonly guidService: GuidService
  ) {}

  public getAll$(): Observable<Totp[]> {
    return this.allSubject.asObservable();
  }

  public getAll(): Totp[] {
    if (!this.localStorage) {
      return [];
    }

    const stringValue = this.localStorage.getItem(this.storageKey);

    if (!stringValue) {
      return [];
    }

    const interfaceValues: ITotp[] = JSON.parse(stringValue);
    return interfaceValues.map(iv => new Totp(iv));
  }

  public create(totp: Omit<ITotp, "id">) {
    const id = this.guidService.v4();

    const currentTotps = this.getAll();

    currentTotps.push(
      new Totp({
        id,
        ...totp
      })
    );

    this.setAll(currentTotps);
  }

  public update(totp: Totp) {
    const currentTotps = this.getAll();

    for (let i = 0; i < currentTotps.length; i++) {
      if (currentTotps[i].id === totp.id) {
        currentTotps[i] = totp;
        this.setAll(currentTotps);
        return;
      }
    }
  }

  public delete(id: string) {
    const currentTotps = this.getAll();

    for (let i = 0; i < currentTotps.length; i++) {
      if (currentTotps[i].id === id) {
        currentTotps.splice(i, 1);
        this.setAll(currentTotps);
        return;
      }
    }
  }

  private setAll(totps: Totp[]) {
    if (!this.localStorage) {
      return;
    }

    const stringVersion = JSON.stringify(totps);
    this.localStorage.setItem(this.storageKey, stringVersion);
    this.allSubject.next(totps);
  }
}
