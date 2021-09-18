import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Message } from "primeng/api";
import { MetaService } from "./services/meta/meta.service";
import { SsrService } from "./services/ssr/ssr.service";
import { Location } from "@angular/common";

interface BeforeInstallPromptEvent {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "rejected" }>;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  public title = "";
  private isOnHomepage = true;

  public beforeInstallEvent?: BeforeInstallPromptEvent;

  public get headerButtonIcon() {
    return this.isOnHomepage ? "pi-plus" : "pi-angle-left";
  }
  public get headerButtonText() {
    return this.isOnHomepage ? "" : "Back";
  }

  private innerWidth: number;
  public get isMobile(): boolean {
    return this.innerWidth < 425;
  }

  public messages: Message[] = [];

  constructor(
    public readonly ssrService: SsrService,
    private readonly router: Router,
    private readonly metaService: MetaService,
    private readonly cdr: ChangeDetectorRef,
    private readonly location: Location
  ) {
    this.innerWidth = ssrService.isServerSide ? 0 : window.innerWidth;
  }

  ngOnInit(): void {
    const update = (path: string) => {
      const url = new URL(path, "http://any.domain");
      this.isOnHomepage = url.pathname === "/";
    };

    this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd) {
          const { url } = event;
          update(url);
        }
      },
    });
    update(this.router.url);

    this.metaService.title$().subscribe((title) => {
      this.title = title;
      this.cdr.detectChanges();
    });
  }

  @HostListener("window:resize")
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  @HostListener("window:beforeinstallprompt", ["$event"])
  installedEvent(e: BeforeInstallPromptEvent) {
    this.beforeInstallEvent = e;
  }

  public async headerButton(): Promise<void> {
    if (this.isOnHomepage) {
      await this.router.navigate(["new"]);
      return;
    }

    this.location.back();
  }

  public async pwaInstall(): Promise<void> {
    if (!this.beforeInstallEvent) {
      return;
    }

    this.beforeInstallEvent.prompt();

    const { outcome } = await this.beforeInstallEvent.userChoice;
    if (outcome === "accepted") {
      this.beforeInstallEvent = undefined;
    }
  }

  public removePwaEvent() {
    this.beforeInstallEvent = undefined;
  }
}
