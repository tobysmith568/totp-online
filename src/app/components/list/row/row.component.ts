import { Component, Input, OnInit, Optional } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { Totp } from "src/app/services/totp-store/totp";
import { TotpStoreService } from "src/app/services/totp-store/totp-store.service";
import { ClockService } from "src/app/services/clock/clock.service";
import { Router } from "@angular/router";
import { TimeoutService } from "src/app/services/timeout/timeout.service";

@Component({
  selector: "app-row",
  templateUrl: "./row.component.html",
  styleUrls: ["./row.component.scss"]
})
export class RowComponent implements OnInit {
  public totpContextMenu: MenuItem[] = [
    { label: "View code range", command: () => this.codeRange() },
    { label: "Copy as JSON", command: () => this.copy() },
    { label: "Delete", command: () => this.delete() }
  ];

  @Input()
  public totp?: Totp;

  @Input()
  public totpTitle: string = "";

  @Input()
  public showContext = false;

  @Input()
  public offset = 0;

  public code: string = "";
  public percent = 0;
  public animationDuration = 0;
  public startFromZero = false;

  constructor(
    private readonly router: Router,
    private readonly totpStore: TotpStoreService,
    private readonly clockService: ClockService,
    private readonly timeoutService: TimeoutService,
    @Optional() private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const period = this.totp?.period ?? 30;

    this.clockService.secondOfTheHour$().subscribe(secondOfTheHour => {
      this.code = this.totpStore.generate(this.totp, this.offset * period) ?? "";

      const position = secondOfTheHour % period;
      if (position === 0 || this.startFromZero === false) {
        this.startFromZero = position === 0;
        this.animationDuration = (period - position) * 1000;

        this.percent = (100 / period) * position;
        this.timeoutService.setTimeout(() => {
          this.percent = 100;
        });
      }
    });
  }

  public openContext(thing: ContextMenu, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    thing.show(event);
  }

  public codeRange() {
    this.router.navigate(["codes", this.totp?.id]);
  }

  public copy() {
    if (!this.totp) {
      return;
    }

    const objectForJson = { ...this.totp } as any;
    delete objectForJson.id;

    const json = JSON.stringify(objectForJson);
    navigator.clipboard.writeText(json);
  }

  public delete() {
    if (!this.totp) {
      return;
    }

    this.confirmationService.confirm({
      header: "Are you sure?",
      message: `Are you sure that you want to delete ${this.totpTitle}?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        if (!this.totp) {
          return;
        }

        this.totpStore.delete(this.totp.id);
      }
    });
  }
}
