export type Durations = "15 Seconds" | "30 Seconds" | "1 Minute" | "2 Minutes" | "5 Minutes" | "10 Minutes";
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
    this.secret = fromJson.secret ?? "";
    this.period = fromJson.period ?? 30;
    this.digits = fromJson.digits ?? 6;
    this.algorithm = fromJson.algorithm ?? "SHA-1";
  }
}
