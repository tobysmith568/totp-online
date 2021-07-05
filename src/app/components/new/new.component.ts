import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { TotpService } from "src/app/services/totp/totp.service";
import { Algorithm } from "src/app/services/totp/totp";
import { Router } from "@angular/router";
import { MetaService } from "src/app/services/meta/meta.service";
import { base32chars, Base32Service } from "src/app/services/base32/base32.service";

@Component({
  selector: "app-new",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"]
})
export class NewComponent implements OnInit, AfterViewInit {
  public base32Regex = new RegExp(`[${base32chars}]+`, "i");

  public periods = [
    { name: "15 seconds", value: 15 },
    { name: "30 seconds", value: 30 },
    { name: "1 minute", value: 60 },
    { name: "2 minutes", value: 60 * 2 },
    { name: "5 minutes", value: 60 * 5 },
    { name: "10 minutes", value: 60 * 10 }
  ];
  public algorithms = ["SHA-1", "SHA-224", "SHA-256", "SHA-384", "SHA-512"] as Algorithm[];

  public account: string = "";
  public issuer: string = "";

  public secret: string = "";
  public period: number = 30;
  public digits: number = 6;
  public algorithm: Algorithm = "SHA-1";

  public get formIsValid() {
    return this.account.length > 0 && this.secret.length > 0 && !!this.digits && this.digits > 0 && this.digits <= 12;
  }

  @ViewChild("accountInput") accountInput?: ElementRef<HTMLInputElement>;

  constructor(
    private readonly totpStorageService: TotpService,
    private readonly router: Router,
    private readonly metaService: MetaService,
    private readonly base32Service: Base32Service
  ) {}

  ngOnInit(): void {
    this.metaService.title("Add a new TOTP").description("Configure a new TOTP secret");
  }

  ngAfterViewInit(): void {
    this.accountInput?.nativeElement.focus();
  }

  public add() {
    this.totpStorageService.create({
      account: this.account,
      issuer: this.issuer,
      secret: this.secret,
      period: this.period,
      digits: this.digits,
      algorithm: this.algorithm
    });

    this.router.navigate([""]);
  }

  public generateSecret() {
    this.secret = this.base32Service.random();
  }
}
