import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { MetaService } from "src/app/services/meta/meta.service";
import { NotFoundService } from "src/app/services/not-found/not-found.service";
import { TotpService } from "src/app/services/totp/totp.service";

@Component({
  selector: "app-qr",
  templateUrl: "./qr.component.html",
  styleUrls: ["./qr.component.scss"]
})
export class QrComponent implements OnInit, OnDestroy {
  public totpUrl?: string;
  public totpTitle?: string;
  private totpSubscription?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly totpService: TotpService,
    private readonly metaService: MetaService,
    private readonly notFoundService: NotFoundService
  ) {}

  ngOnInit(): void {
    this.metaService.title("TOTP QR Code").description().noIndex(true);

    this.totpSubscription = this.route.paramMap.subscribe(paramMap => {
      const totpId = paramMap.get("id");

      if (!totpId) {
        this.notFoundService.goTo404();
        return;
      }

      const totp = this.totpService.getById(totpId);

      if (!totp) {
        this.notFoundService.goTo404();
        return;
      }

      this.totpUrl = this.totpService.getUrl(totp);
      this.totpTitle = this.totpService.getTitle(totp);
    });
  }

  ngOnDestroy(): void {
    this.totpSubscription?.unsubscribe();
  }
}
