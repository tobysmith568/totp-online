import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { MetaService } from "./services/meta/meta.service";
import { SsrService } from "./services/ssr/ssr.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  public title = "";
  private isOnHomepage = true;

  public get headerButtonIcon() {
    return this.isOnHomepage ? "pi-plus" : "pi-angle-left";
  }
  public get headerButtonText() {
    return this.isOnHomepage ? "" : "Back";
  }

  constructor(
    public readonly ssrService: SsrService,
    private readonly router: Router,
    private readonly metaService: MetaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const update = (url: string) => {
      const urlSegments = url.split("/");
      this.isOnHomepage = urlSegments.length < 2 || urlSegments[1] === "";
    };

    this.router.events.subscribe({
      next: event => {
        if (event instanceof NavigationEnd) {
          const { url } = event;
          update(url);
        }
      }
    });
    update(this.router.url);

    this.metaService.title$().subscribe(title => {
      this.title = title;
      this.cdr.detectChanges();
    });
  }

  public async headerButton(): Promise<void> {
    if (this.isOnHomepage) {
      await this.router.navigate(["new"]);
      return;
    }

    await this.router.navigate([""]);
  }
}
