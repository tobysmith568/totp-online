import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListComponent } from "./components/list/list.component";
import { NewComponent } from "./components/new/new.component";

const routes: Routes = [
  { path: "new", component: NewComponent },
  { path: "**", component: ListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
