import { AfterViewInit, Component, Input, OnInit, Optional } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { Totp } from "src/app/services/totp-store/totp";
import { TotpStoreService } from "src/app/services/totp-store/totp-store.service";
import JsSHA from "jssha";
import { ClockService } from "src/app/services/clock/clock.service";
import { StringService } from "src/app/services/string/string.service";
import { Base32Service } from "src/app/services/base32/base32.service";
import { HexidecimalService } from "src/app/services/hexidecimal/hexidecimal.service";

@Component({
  selector: "app-row",
  templateUrl: "./row.component.html",
  styleUrls: ["./row.component.scss"]
})
export class RowComponent implements OnInit, AfterViewInit {
  public totpContextMenu: MenuItem[] = [
    { label: "Copy as JSON", command: () => this.copy() },
    { label: "Delete", command: () => this.delete() }
  ];

  @Input()
  public totp?: Totp;

  public code: string = "";
  public percent = 0;
  public animationDuration = 0;
  public startFromZero = false;

  public get title() {
    if (!this.totp) {
      return "";
    }

    if (!!this.totp?.issuer) {
      return `${this.totp.issuer} (${this.totp.account})`;
    }

    return this.totp.account;
  }

  constructor(
    private readonly totpStore: TotpStoreService,
    private readonly clockService: ClockService,
    private readonly stringService: StringService,
    private readonly base32Service: Base32Service,
    private readonly hexidecimalService: HexidecimalService,
    @Optional() private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const period = this.totp?.period ?? 30;

    this.clockService.secondOfTheHour$().subscribe(secondOfTheHour => {
      this.generate();

      const position = secondOfTheHour % period;

      if (position === 0) {
        this.animationDuration = period * 1000;
        this.startFromZero = true;

        this.percent = 0;
        setTimeout(() => (this.percent = 100));
      }
    });

    this.generate();

    const secondOfTheHour = this.clockService.secondOfTheHour();
    const position = secondOfTheHour % period;
    this.percent = (100 / period) * position;
    setTimeout(() => {
      this.animationDuration = (period - position) * 1000;
      this.percent = 100;
    });
  }

  ngAfterViewInit(): void {}

  public openContext(thing: ContextMenu, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    thing.show(event);
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
      message: `Are you sure that you want to delete ${this.title}?`,
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        if (!this.totp) {
          return;
        }

        this.totpStore.delete(this.totp.id);
      }
    });
  }

  private generate() {
    if (!this.totp) {
      return;
    }

    const base32Secret = this.base32Service.base32tohex(this.totp.secret);
    const epoch = Math.round(Date.now() / 1000.0);
    const time = this.stringService.leftpad(
      this.hexidecimalService.dec2hex(Math.floor(epoch / this.totp.period)),
      16,
      "0"
    );

    const shaObj = new JsSHA(this.totp.algorithm, "HEX", { hmacKey: { value: base32Secret, format: "HEX" } });
    shaObj.update(time);
    const hmac = shaObj.getHMAC("HEX");
    const offset = this.hexidecimalService.hex2dec(hmac.substring(hmac.length - 1));

    let otp =
      (this.hexidecimalService.hex2dec(hmac.substr(offset * 2, 8)) & this.hexidecimalService.hex2dec("7fffffff")) + "";
    otp = otp.substr(otp.length - this.totp.digits, this.totp.digits);
    this.code = otp;
  }
}
