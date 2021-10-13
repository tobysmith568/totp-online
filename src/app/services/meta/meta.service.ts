import { Inject, Injectable, Optional } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { RESPONSE } from "@nguniversal/express-engine/tokens";
import { Response } from "express";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MetaService {
  private defaultTitle = "TOTP Manager";
  private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.defaultTitle);

  constructor(
    private readonly titleService: Title,
    private readonly meta: Meta,
    @Optional() @Inject(RESPONSE) private response: Response<any> | undefined
  ) {}

  public statusCode(code: number = 200): MetaService {
    this.response?.status(code);
    return this;
  }

  public title(title?: string): MetaService {
    if (!title || title.length === 0) {
      this.titleService.setTitle(this.defaultTitle);
      this.titleSubject.next(this.defaultTitle);
      return this;
    }

    this.titleService.setTitle(title);
    this.titleSubject.next(title);
    return this;
  }

  public title$() {
    return this.titleSubject.asObservable();
  }

  public description(description?: string): MetaService {
    if (!description || description.length === 0) {
      this.meta.removeTag("name='description'");
      return this;
    }

    this.meta.updateTag({ name: "description", content: description });
    return this;
  }

  public noIndex(noIndex?: boolean): MetaService {
    if (!noIndex) {
      this.meta.removeTag("name='robots'");
      return this;
    }

    this.meta.updateTag({ name: "robots", content: "noIndex" });
    return this;
  }
}
