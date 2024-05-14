import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-reservation-calendar',
    templateUrl: './reservation-calendar.component.html',
    styleUrls: ['./reservation-calendar.component.css']
})
export class ReservationCalendarComponent implements OnInit {
    selectedDate: Date;
    reservations: any[] = []; // Define the reservations property as an array of any type
    tempReservations: any[] = []; // Define the reservations property as an array of any type
    leftovers: any[] = []; // Define the leftovers property as an array of any type
    dateString: string;
    public showTableReservation: boolean = false;
    constructor(private datePipe: DatePipe) {

    }

    ngOnInit() {
        // Fetch mock data for reservations when the component initializes
        this.fetchReservations();
        // Fetch all leftovers initially
        this.fetchLeftovers();
    }

    fetchReservations() {
        // Mock data for demonstration purposes
        this.reservations = [
            { organization: 'Organization A', quantity: 5, type: 'Type 1', date: '2024-05-17', pickupTime: '10:00 AM' },
            { organization: 'Organization B', quantity: 3, type: 'Type 2', date: '2024-05-10', pickupTime: '11:00 AM' },
            // Add more mock reservation items as needed
        ];
        this.tempReservations = this.reservations;
    }

    fetchLeftovers() {
        // Mock data for demonstration purposes
        this.leftovers = [
            { organization: 'Organization A', quantity: 5, type: 'Type 1', date: '2024-05-17', pickupTime: '10:00 AM' },
            { organization: 'Organization B', quantity: 3, type: 'Type 2', date: '2024-05-10', pickupTime: '11:00 AM' },
            // Add more mock leftover items as needed
        ];
    }

    onDateSelect(event: any) {
        // Handle date selection
        // No need to filter leftovers on date selection, as they should remain constant
        this.dateString = this.datePipe.transform(this.selectedDate, "yyyy-MM-dd");
        this.filterData();
    }

    private filterData() {
        this.reservations = this.tempReservations.filter((reservation) => {
            console.log(reservation);
            console.log(this.dateString);
            return reservation.date === this.dateString;
        });

        if (this.reservations.length > 0) {
            this.showTableReservation = true;
        } else {
            this.showTableReservation = false;
        }
        console.log(this.reservations);
    }
}