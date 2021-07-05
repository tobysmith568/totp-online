export type Durations = "15 Seconds" | "30 Seconds" | "1 Minute" | "2 Minutes" | "5 Minutes" | "10 Minutes";
export type Algorithm = "SHA-1" | "SHA-224" | "SHA-256" | "SHA-384" | "SHA-512";

export interface Totp {
  id: string;

  account: string;
  issuer: string;

  secret: string;
  period: number;
  digits: number;
  algorithm: Algorithm;
}
