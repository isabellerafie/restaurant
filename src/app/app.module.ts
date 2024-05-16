//app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewLeftoversComponent } from './view-leftovers/view-leftovers.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReservationCalendarComponent } from './reservation-calendar/reservation-calendar.component';
import { HttpClientModule } from '@angular/common/http';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { CommonModule } from '@angular/common'; 
import { DatePipe } from '@angular/common';
import { AddLeftoverComponent } from './add-leftover/add-leftover.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupLoginComponent } from './signup-login/signup-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AboutUsComponent } from './about-us/about-us.component';
import { CountryServiceService } from './service/country-service.service';

@NgModule({
  declarations: [
    AppComponent,
    ViewLeftoversComponent,
    ReservationCalendarComponent,
    AddLeftoverComponent,
    ProfileComponent,
    SignupLoginComponent,
    AboutUsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgForOf,
    CalendarModule
  ],
  providers: [DatePipe, CountryServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
