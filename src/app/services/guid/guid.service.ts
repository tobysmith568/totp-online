import { Injectable } from "@angular/core";
import { v4 } from "uuid";

@Injectable({
  providedIn: "root"
})
export class GuidService {
  constructor() {}

  public v4(): string {
    return v4();
  }
}
