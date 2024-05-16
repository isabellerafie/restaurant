import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewLeftoversComponent } from './view-leftovers/view-leftovers.component';
import { AddLeftoverComponent } from './add-leftover/add-leftover.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: ViewLeftoversComponent },
  { path: 'add-leftover', component: AddLeftoverComponent },
  { path: 'view-leftovers', component: ViewLeftoversComponent }, // Add this line
];

// const routes: Routes = [  { path: 'profile', component: ProfileComponent }]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
