import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import form-related modules

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup; // Declare form group
  isEditing: boolean = false; // Flag to track if editing mode is active
  restaurantLogo: string; // Define restaurantLogo property
  totalLeftovers: number; // Define totalLeftovers property
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // Initialize form with default values (you can populate it with existing data if needed)
    this.profileForm = this.formBuilder.group({
      restaurantName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Add more form controls for other fields
    });
  }

  // Method to enable editing mode
  enableEditing(): void {
    this.isEditing = true;
  }

  // Method to save edited profile
  saveProfile(): void {
    // If form is valid, save the profile data and exit editing mode
    if (this.profileForm.valid) {
      // Call API to save updated profile data
      // You can access the updated data using this.profileForm.value
      // After successful save, exit editing mode
      this.isEditing = false;
    }
    this.isEditing = false;

  }

  // Method to cancel editing and revert changes
  cancelEditing(): void {
    // Reset form to original values (if needed)
    // Exit editing mode
    this.isEditing = false;
  }
}
