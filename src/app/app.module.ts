import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NewComponent } from "./components/new/new.component";
import { SsrService } from "./services/ssr/ssr.service";
import { ListComponent } from "./components/list/list.component";
import { AppRoutingModule } from "./app-routing.module";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from "primeng/dataview";
import { ContextMenuModule } from "primeng/contextmenu";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { ConfirmationService } from "primeng/api";
import { KeyFilterModule } from "primeng/keyfilter";
import { TotpRowComponent } from "./components/totp-row/totp-row.component";
import { NgCircleProgressModule } from "ng-circle-progress";
import { processConfig } from "src/environments/progress.config";
import { NgScrollbarModule } from "ngx-scrollbar";
import { scrollConfig } from "src/environments/scroll.config";
import { CodesComponent } from "./components/codes/codes.component";
import { QrComponent } from "./components/qr/qr.component";
import { QrCodeModule } from "ng-qrcode";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { environment } from "../environments/environment";
import { LOCAL_STORAGE } from "./services/totp/totp.service";

@NgModule({
  declarations: [
    AppComponent,
    NewComponent,
    ListComponent,
    TotpRowComponent,
    CodesComponent,
    QrComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    DataViewModule,
    ContextMenuModule,
    ConfirmDialogModule,
    DialogModule,
    KeyFilterModule,
    MessagesModule,
    MessageModule,
    NgCircleProgressModule.forRoot(processConfig),
    NgScrollbarModule.withConfig(scrollConfig),
    QrCodeModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
  providers: [
    {
      provide: LOCAL_STORAGE,
      useFactory: (ssrService: SsrService) => {
        if (ssrService.isServerSide) {
          return null;
        }

        return window.localStorage;
      },
      deps: [SsrService],
    },
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
