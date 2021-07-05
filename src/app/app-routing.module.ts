import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CodesComponent } from "./components/codes/codes.component";
import { ListComponent } from "./components/list/list.component";
import { NewComponent } from "./components/new/new.component";

const routes: Routes = [
  { path: "", component: ListComponent },
  { path: "new", component: NewComponent },
  { path: "codes/:id", component: CodesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
