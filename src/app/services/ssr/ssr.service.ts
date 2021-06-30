import { isPlatformServer } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class SsrService {
  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  public get isServerSide(): boolean {
    return isPlatformServer(this.platformId);
  }
}
