import { Component, OnDestroy, OnInit, Optional } from "@angular/core";
import { Subscription } from "rxjs";
import { Totp } from "src/app/services/totp-store/totp";
import { TotpStoreService } from "src/app/services/totp-store/totp-store.service";
import { ConfirmationService, MenuItem } from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { SsrService } from "src/app/services/ssr/ssr.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit, OnDestroy {
  public totps: Totp[] = [];
  private totpsSubscription?: Subscription;

  constructor(public readonly ssrService: SsrService, private readonly totpStore: TotpStoreService) {}

  ngOnInit(): void {
    this.totpsSubscription = this.totpStore.getAll$().subscribe(totps => (this.totps = totps));
  }

  ngOnDestroy(): void {
    this.totpsSubscription?.unsubscribe();
  }
}
