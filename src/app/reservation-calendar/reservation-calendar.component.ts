import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-reservation-calendar',
  templateUrl: './reservation-calendar.component.html',
  styleUrls: ['./reservation-calendar.component.css']
})
export class ReservationCalendarComponent implements OnInit {
  selectedDate!: Date;
  reservations: any[] = [];
  tempReservations: any[] = [];
  leftovers: any[] = [];
  dateString: string = '';
  public showTableReservation: boolean = false;
  sessionData: any;

  constructor(private datePipe: DatePipe, private http: HttpClient) { }

  ngOnInit() {
    this.fetchReservations();
  }

  fetchReservations() {
    new BehaviorSubject(sessionStorage.getItem("sessionData") ?? '{}').subscribe(
      (data) => {
        this.sessionData = JSON.parse(data);
        const accountId = this.sessionData.session?.user?.account_id;
        this.http.get<any[]>(`http://localhost:3000/reservations/restaurant/${accountId}`).subscribe(
          data => {
            this.reservations = data;
            this.tempReservations = this.reservations;
            this.leftovers = data; // Assuming leftovers is the same as reservations data
          },
          error => {
            console.error('Error fetching reservations:', error);
          }
        );
      }
    );
  }

  onDateSelect(event: any) {
    const transformedDate = this.datePipe.transform(this.selectedDate, "yyyy-MM-dd");
    this.dateString = transformedDate ? transformedDate : '';
    this.filterData();
  }

  private filterData() {
    this.reservations = this.tempReservations.filter((reservation) => {
      return reservation.pickupdate === this.dateString;
    });

    this.showTableReservation = this.reservations.length > 0;
  }

  getTotalQuantity(leftovers: any[]): number {
    return leftovers.reduce((sum, leftover) => sum + leftover.leftover_quantity, 0);
  }
}