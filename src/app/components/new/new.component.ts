import { Component } from "@angular/core";
import { TotpStoreService } from "src/app/services/totp-store/totp-store.service";
import { Algorithm } from "src/app/services/totp-store/totp";

@Component({
  selector: "app-new",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"]
})
export class NewComponent {
  public periods = [
    { name: "30 seconds", value: 30 },
    { name: "60 seconds", value: 60 }
  ];
  public algorithms = ["SHA-1", "SHA-224", "SHA-256", "SHA-384", "SHA-512"] as Algorithm[];

  public account: string = "";
  public issuer: string = "";

  public secret: string = "";
  public period: number = 30;
  public digits: number = 6;
  public algorithm: Algorithm = "SHA-1";

  public result = "";

  constructor(private readonly totpStorageService: TotpStoreService) {}

  public add() {
    this.totpStorageService.create({
      account: this.account,
      issuer: this.issuer,
      secret: this.secret,
      period: this.period,
      digits: this.digits,
      algorithm: this.algorithm
    });
  }
}
