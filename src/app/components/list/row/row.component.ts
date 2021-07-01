import { Component, Input, OnInit, Optional } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { ContextMenu } from "primeng/contextmenu";
import { Totp } from "src/app/services/totp-store/totp";
import { TotpStoreService } from "src/app/services/totp-store/totp-store.service";
import JsSHA from "jssha";
import { ClockService } from "src/app/services/clock/clock.service";

@Component({
  selector: "app-row",
  templateUrl: "./row.component.html",
  styleUrls: ["./row.component.scss"]
})
export class RowComponent implements OnInit {
  public totpContextMenu: MenuItem[] = [{ label: "Delete", command: () => this.delete() }];

  @Input()
  public totp?: Totp;

  public code = this.generate();

  public chartData: any;
  public chartOptions = {
    animation: {
      duration: 0
    },
    legend: {
      display: false
    },
    tooltips: { enabled: false },
    hover: { mode: null }
  };

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
    @Optional() private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.chartData = {
      datasets: [
        {
          data: [0, 100],
          backgroundColor: ["#00a2ff", "white"]
        }
      ]
    };

    this.clockService.secondOfTheHour$().subscribe(secondOfTheHour => {
      if (!this.totp) {
        return;
      }

      this.code = this.generate();

      const position = secondOfTheHour % this.totp.period;
      this.chartData = {
        datasets: [
          {
            data: [position, this.totp.period - position],
            backgroundColor: ["#00a2ff", "white"]
          }
        ]
      };
    });
  }

  public openContext(thing: ContextMenu, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    thing.show(event);
  }

  public delete() {
    if (!this.totp) {
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure that you want to delete ${this.title}?`,
      accept: () => {
        if (!this.totp) {
          return;
        }

        this.totpStore.delete(this.totp.id);
      }
    });
  }

  private generate(): string {
    if (!this.totp) {
      return "";
    }

    const base32Secret = base32tohex(this.totp.secret);
    const epoch = Math.round(Date.now() / 1000.0);
    const time = leftpad(dec2hex(Math.floor(epoch / this.totp.period)), 16, "0");

    const shaObj = new JsSHA(this.totp.algorithm, "HEX", { hmacKey: { value: base32Secret, format: "HEX" } });
    shaObj.update(time);
    const hmac = shaObj.getHMAC("HEX");
    const offset = hex2dec(hmac.substring(hmac.length - 1));

    let otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
    otp = otp.substr(otp.length - this.totp.digits, this.totp.digits);
    return otp;
  }
}

function hex2dec(s: string) {
  return parseInt(s, 16);
}

function dec2hex(s: number) {
  return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
}

function base32tohex(base32: string) {
  let base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    bits = "",
    hex = "";

  base32 = base32.replace(/=+$/, "");

  for (let i = 0; i < base32.length; i++) {
    let val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    if (val === -1) throw new Error("Invalid base32 character in key");
    bits += leftpad(val.toString(2), 5, "0");
  }

  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let chunk = bits.substr(i, 8);
    hex = hex + leftpad(parseInt(chunk, 2).toString(16), 2, "0");
  }
  return hex;
}

function leftpad(str: string, len: number, pad = "0") {
  if (len + 1 >= str.length) {
    str = Array(len + 1 - str.length).join(pad) + str;
  }
  return str;
}
