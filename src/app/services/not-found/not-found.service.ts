import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class NotFoundService {
  constructor(private readonly router: Router) {}

  public goTo404() {
    this.router.navigate(["404"], {
      skipLocationChange: true
    });
  }
}
