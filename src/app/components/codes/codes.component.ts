import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { MetaService } from "src/app/services/meta/meta.service";
import { Totp } from "src/app/services/totp/totp";
import { TotpService } from "src/app/services/totp/totp.service";

@Component({
  selector: "app-codes",
  templateUrl: "./codes.component.html",
  styleUrls: ["./codes.component.scss"]
})
export class CodesComponent implements OnInit, OnDestroy {
  public totp?: Totp;
  private totpSubscription?: Subscription;

  public indexes = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly totpService: TotpService,
    private readonly metaService: MetaService
  ) {}

  ngOnInit(): void {
    this.metaService.title("TOTP Range").description().noIndex(true);

    this.totpSubscription = this.route.paramMap.subscribe(paramMap => {
      const totpId = paramMap.get("id");

      if (!!totpId) {
        this.totp = this.totpService.getById(totpId);
      }
    });
  }

  ngOnDestroy(): void {
    this.totpSubscription?.unsubscribe();
  }

  public getTitle(totp: Totp | undefined) {
    if (!totp) {
      return "";
    }

    if (!!totp.issuer) {
      return `${totp.issuer} (${totp.account})`;
    }

    return totp.account;
  }

  public getOffset(index: number) {
    if (!this.totp?.period || index === undefined) {
      return "";
    }

    if (index === 0) {
      return "Now";
    }

    const direction = index < 0 ? "before" : "after";
    const offset = this.totp.period * index;

    if (this.totp.period < 60) {
      return `${Math.abs(index)} ${direction} (${offset} seconds)`;
    }

    if (this.totp.period === 60 && Math.abs(offset) === 60) {
      return "1 minute";
    }

    return `${Math.abs(index)} ${direction} (${offset} minutes)`;
  }
}
