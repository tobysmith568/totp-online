import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CodesComponent } from "./components/codes/codes.component";
import { ListComponent } from "./components/list/list.component";
import { NewComponent } from "./components/new/new.component";
import { QrComponent } from "./components/qr/qr.component";

const routes: Routes = [
  { path: "", component: ListComponent },
  { path: "new", component: NewComponent },
  { path: "codes/:id", component: CodesComponent },
  { path: "qr/:id", component: QrComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
