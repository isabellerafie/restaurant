import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  // Variables to store profile data
  restaurantLogo: string = ''; // Get logo from signup page
  totalLeftovers: number = 0; // Get total from backend
  restaurantName: string = ''; // Get name from signup page
  email: string = ''; // Get email from signup page
  phoneCode: string = ''; // Get phone code from signup page
  phoneNumber: string = ''; // Get phone number from signup page
  country: string = ''; // Get country from signup page
  city: string = ''; // Get city from signup page
  postalCode: string = ''; // Get postal code from signup page
  address: string = ''; // Get address from signup page

  constructor(private router: Router) {}

  // Method to navigate to signup-login page for editing
  editProfile() {
  }
}
