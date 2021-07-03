import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class StringService {
  public leftpad(str: string, len: number, pad = "0") {
    if (len + 1 >= str.length) {
      str = Array(len + 1 - str.length).join(pad) + str;
    }
    return str;
  }
}
