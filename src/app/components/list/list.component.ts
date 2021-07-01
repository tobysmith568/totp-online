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

  public totpContextMenu: MenuItem[] = [{ label: "Delete", command: () => this.delete() }];
  private contextMenuSubject?: Totp;

  constructor(
    public readonly ssrService: SsrService,
    private readonly totpStore: TotpStoreService,
    @Optional() private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.totpsSubscription = this.totpStore.getAll$().subscribe(totps => (this.totps = totps));
  }

  ngOnDestroy(): void {
    this.totpsSubscription?.unsubscribe();
  }

  public getTotpTitle(totp: Totp) {
    if (!!totp.issuer) {
      return `${totp.issuer} (${totp.account})`;
    }

    return totp.account;
  }

  public openContext(thing: ContextMenu, event: MouseEvent, totp: Totp) {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenuSubject = totp;
    thing.show(event);
  }

  public delete() {
    if (!this.contextMenuSubject) {
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure that you want to delete ${this.getTotpTitle(this.contextMenuSubject)}?`,
      accept: () => {
        if (!this.contextMenuSubject) {
          return;
        }

        this.totpStore.delete(this.contextMenuSubject.id);
      }
    });
  }
}
