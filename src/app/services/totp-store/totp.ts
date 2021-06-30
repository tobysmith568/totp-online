import JsSHA from "jssha";

export type Algorithm = "SHA-1" | "SHA-224" | "SHA-256" | "SHA-384" | "SHA-512";

export interface ITotp {
  id: string;

  account: string;
  issuer: string;

  secret: string;
  period: number;
  digits: number;
  algorithm: Algorithm;
}

export class Totp implements ITotp {
  id: string;
  account: string;
  issuer: string;
  secret: string;
  period: number;
  digits: number;
  algorithm: Algorithm;

  constructor(fromJson: ITotp) {
    this.id = fromJson.id;
    this.account = fromJson.account;
    this.issuer = fromJson.issuer;
    this.secret = fromJson.secret;
    this.period = fromJson.period;
    this.digits = fromJson.digits;
    this.algorithm = fromJson.algorithm;
  }

  public generate(): string {
    const base32Secret = base32tohex(this.secret);
    const epoch = Math.round(Date.now() / 1000.0);
    const time = leftpad(dec2hex(Math.floor(epoch / this.period)), 16, "0");

    const shaObj = new JsSHA(this.algorithm, "HEX", { hmacKey: { value: base32Secret, format: "HEX" } });
    shaObj.update(time);
    const hmac = shaObj.getHMAC("HEX");
    const offset = hex2dec(hmac.substring(hmac.length - 1));

    let otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
    otp = otp.substr(otp.length - this.digits, this.digits);
    return otp;
  }
}

function hex2dec(s: string) {
  return parseInt(s, 16);
}

function dec2hex(s: number) {
  return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
}

function base32tohex(base32: string) {
  let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    bits = "",
    hex = "";

  base32 = base32.replace(/=+$/, "");

  for (let i = 0; i < base32.length; i++) {
    let val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    if (val === -1) throw new Error("Invalid base32 character in key");
    bits += leftpad(val.toString(2), 5, "0");
  }

  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let chunk = bits.substr(i, 8);
    hex = hex + leftpad(parseInt(chunk, 2).toString(16), 2, "0");
  }
  return hex;
}

function leftpad(str: string, len: number, pad = "0") {
  if (len + 1 >= str.length) {
    str = Array(len + 1 - str.length).join(pad) + str;
  }
  return str;
}
