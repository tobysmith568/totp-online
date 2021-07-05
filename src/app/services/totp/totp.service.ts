import { Inject, Injectable, InjectionToken } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Base32Service } from "../base32/base32.service";
import { GuidService } from "../guid/guid.service";
import { HexidecimalService } from "../hexidecimal/hexidecimal.service";
import { StringService } from "../string/string.service";
import { Totp } from "./totp";
import JsSHA from "jssha";

export const LOCAL_STORAGE = new InjectionToken<typeof window.localStorage | null>("Local Storage");

@Injectable({
  providedIn: "root"
})
export class TotpService {
  private storageKey = "TOTP-CONFIGS";

  public allSubject = new BehaviorSubject<Totp[]>(this.getAll());

  constructor(
    @Inject(LOCAL_STORAGE) private readonly localStorage: typeof window.localStorage | null,
    private readonly stringService: StringService,
    private readonly base32Service: Base32Service,
    private readonly hexidecimalService: HexidecimalService,
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

    const interfaceValues: Totp[] = JSON.parse(stringValue);
    return interfaceValues;
  }

  public getById(id: string): Totp | undefined {
    const all = this.getAll();

    for (const totp of all) {
      if (totp.id === id) {
        return totp;
      }
    }

    return undefined;
  }

  public create(totp: Omit<Totp, "id">) {
    const id = this.guidService.v4();

    const currentTotps = this.getAll();

    currentTotps.push({
      id,
      ...totp
    });

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

  public generate(totp?: Totp, offsetInSeconds = 0) {
    if (!totp) {
      return;
    }

    const hexSecret = this.base32Service.base32tohex(totp.secret);
    const epoch = Math.round(Date.now() / 1000.0) + offsetInSeconds;
    const time = this.stringService.leftpad(this.hexidecimalService.dec2hex(Math.floor(epoch / totp.period)), 16, "0");

    const shaObj = new JsSHA(totp.algorithm, "HEX", { hmacKey: { value: hexSecret, format: "HEX" } });
    shaObj.update(time);
    const hmac = shaObj.getHMAC("HEX");
    const offset = this.hexidecimalService.hex2dec(hmac.substring(hmac.length - 1));

    let otp =
      (this.hexidecimalService.hex2dec(hmac.substr(offset * 2, 8)) & this.hexidecimalService.hex2dec("7fffffff")) + "";
    otp = otp.substr(otp.length - totp.digits, totp.digits);
    return otp;
  }

  public getTitle(totp?: Totp) {
    if (!totp) {
      return "";
    }

    if (!!totp.issuer) {
      return `${totp.issuer} (${totp.account})`;
    }

    return totp.account;
  }

  public getUrl(totp?: Totp) {
    if (!totp) {
      return "";
    }

    const name = this.getUrlName(totp);

    const url = new URL(`otpauth://totp/${name}`);
    url.searchParams.append("secret", totp.secret);
    url.searchParams.append("algorithm", totp.algorithm);
    url.searchParams.append("digits", totp.digits.toString());
    url.searchParams.append("period", totp.period.toString());

    return url.toString();
  }

  private getUrlName(totp: Totp) {
    const urlAccount = encodeURIComponent(totp.account);

    if (totp.issuer.length === 0) {
      return urlAccount;
    }

    const urlIssuer = encodeURIComponent(totp.issuer);
    return `${urlIssuer}:${urlAccount}`;
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
