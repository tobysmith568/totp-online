import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { MetaService } from "src/app/services/meta/meta.service";
import { Totp } from "src/app/services/totp/totp";
import { TotpService } from "src/app/services/totp/totp.service";

@Component({
  selector: "app-qr",
  templateUrl: "./qr.component.html",
  styleUrls: ["./qr.component.scss"]
})
export class QrComponent implements OnInit, OnDestroy {
  public totp?: Totp;
  private totpSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly totpService: TotpService,
    private readonly metaService: MetaService
  ) {}

  ngOnInit(): void {
    this.metaService.title("TOTP QR Code").description().noIndex(true);

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
}
