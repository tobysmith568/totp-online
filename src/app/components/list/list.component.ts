import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Totp } from "src/app/services/totp/totp";
import { TotpService } from "src/app/services/totp/totp.service";
import { MetaService } from "src/app/services/meta/meta.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit, OnDestroy {
  public totps: Totp[] = [];
  private totpsSubscription?: Subscription;

  constructor(private readonly totpService: TotpService, private readonly metaService: MetaService) {}

  ngOnInit(): void {
    this.totpsSubscription = this.totpService.getAll$().subscribe(totps => (this.totps = totps));

    this.metaService
      .title()
      .description("Generate TOTP secrets and codes to use while making and testing software secured by TOTP.");
  }

  ngOnDestroy(): void {
    this.totpsSubscription?.unsubscribe();
  }

  public getTitle(totp: Totp) {
    return this.totpService.getTitle(totp);
  }
}
