import { Component, OnInit } from "@angular/core";
import { MetaService } from "src/app/services/meta/meta.service";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.scss"]
})
export class NotFoundComponent implements OnInit {
  constructor(private readonly metaService: MetaService) {}

  ngOnInit(): void {
    this.metaService.title("404 - Not Found!").description().noIndex(true).statusCode(404);
  }
}
