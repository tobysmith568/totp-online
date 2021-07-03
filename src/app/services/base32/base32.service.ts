import { Injectable } from "@angular/core";

export const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

@Injectable({
  providedIn: "root"
})
export class Base32Service {
  public base32tohex(base32: string) {
    let bits = "";
    let hex = "";

    base32 = base32.replace(/=+$/, "");

    for (let i = 0; i < base32.length; i++) {
      const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
      if (val === -1) throw new Error("Invalid base32 character in key");
      bits += this.leftpad(val.toString(2), 5, "0");
    }

    for (let i = 0; i + 8 <= bits.length; i += 8) {
      const chunk = bits.substr(i, 8);
      hex = hex + this.leftpad(parseInt(chunk, 2).toString(16), 2, "0");
    }
    return hex;
  }

  private leftpad(str: string, len: number, pad = "0") {
    if (len + 1 >= str.length) {
      str = Array(len + 1 - str.length).join(pad) + str;
    }
    return str;
  }
}
