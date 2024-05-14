// view-leftovers.component.ts

import { Component, OnInit } from '@angular/core';
import { StatusLabels, StatusColors } from '../status';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-leftovers',
  templateUrl: './view-leftovers.component.html',
  styleUrls: ['./view-leftovers.component.css']
})
export class ViewLeftoversComponent implements OnInit {
  leftovers: any[] = []; // Mock array of leftover items
  sortOrder: string = 'asc'; // Property to track sorting order

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Fetch leftover data from backend
    this.fetchLeftovers();
  }

  fetchLeftovers() {
    // Mock data for demonstration purposes
    this.leftovers = [
      { image: 'path/to/image1.jpg', type: 'Pasta', name: 'Leftover a', quantity: 5, date: new Date('2024-05-15'), status: 1 },
      { image: 'path/to/image2.jpg', type: 'Pizza', name: 'Leftover b', quantity: 3, date: new Date('2024-04-20'), status: 3 },
      { image: 'path/to/image3.jpg', type: 'Chicken Meal', name: 'Leftover c', quantity: 2, date: new Date('2024-06-10'), status: 3 },
      { image: 'path/to/image4.jpg', type: 'Dessert', name: 'Leftover d', quantity: 5, date: new Date('2024-04-25'), status: 1 },
      { image: 'path/to/image5.jpg', type: 'Sandwiches', name: 'Leftover e', quantity: 3, date: new Date('2024-05-01'), status: 1 },
      { image: 'path/to/image6.jpg', type: 'Dessert', name: 'Leftover f', quantity: 2, date: new Date('2024-06-15'), status: 3 },
      { image: 'path/to/image7.jpg', type: 'Sandwiches', name: 'Leftover g', quantity: 5, date: new Date('2024-05-20'), status: 1 },
      { image: 'path/to/image8.jpg', type: 'Pizza', name: 'Leftover h', quantity: 3, date: new Date('2024-04-30'), status: 1 },
      { image: 'path/to/image9.jpg', type: 'Beef Meal', name: 'Leftover i', quantity: 2, date: new Date('2024-05-05'), status: 3 },
      { image: 'path/to/image10.jpg', type: 'Beef Meal', name: 'Leftover j', quantity: 5, date: new Date('2024-06-01'), status: 1 }
    ];

    // Sort leftovers by default (ascending order of expiry date)
  this.sortLeftovers('asc');
}
navigateToAddLeftover() {
  this.router.navigate(['/add-leftover']);
}
getStatusLabel(status: number): string {
  return StatusLabels[status as keyof typeof StatusLabels]; // Add type assertion
}

getStatusColor(status: number): string {
  return StatusColors[status as keyof typeof StatusColors]; // Add type assertion
}

  editLeftover(leftover: any) {
    // Navigate to the add leftover component with the leftover data as a parameter
    this.router.navigate(['/add-leftover', { leftover: JSON.stringify(leftover) }]);
  }

  deleteLeftover(leftover: any) {
    // Implement delete leftover functionality
    console.log('Delete leftover:', leftover);
  }

  sortLeftovers(order: string) {
    // Sort leftovers by expiry date
    if (order === 'asc') {
      this.leftovers.sort((a, b) => a.date.getTime() - b.date.getTime());
    } else if (order === 'desc') {
      this.leftovers.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
  }

  toggleSortOrder() {
    // Toggle sorting order between ascending and descending
    if (this.sortOrder === 'asc') {
      this.sortLeftovers('desc');
      this.sortOrder = 'desc';
    } else {
      this.sortLeftovers('asc');
      this.sortOrder = 'asc';
    }
  }
}