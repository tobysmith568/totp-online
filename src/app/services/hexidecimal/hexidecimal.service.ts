import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class HexidecimalService {
  public hex2dec(s: string) {
    return parseInt(s, 16);
  }

  public dec2hex(s: number) {
    return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
  }
}
