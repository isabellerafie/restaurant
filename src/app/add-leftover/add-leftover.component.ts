// add-leftover.component.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

interface Leftover {
  type: string;
  name: string;
  quantity: number;
  expiry_date: Date;
  leftover_image_path: string | null;
  status: number;
  restaurant_id: number;
}

@Component({
  selector: 'app-add-leftover',
  templateUrl: './add-leftover.component.html',
  styleUrls: ['./add-leftover.component.css']
})
export class AddLeftoverComponent implements OnInit {
  leftoverData: Leftover;
  leftOverForm: FormGroup;
  minExpiryDate: string; // Minimum expiry date (tomorrow's date)
  isEditing: boolean = false; // Flag to indicate whether editing an existing leftover

  // Define regex pattern for input validation
  namePattern = /^[A-Za-z\s]+$/; // Allows letters and spaces only
  quantityPattern = /^[1-9][0-9]*$/; // Allows positive integers only

  images: string[] = [
    "\assets\d585e22830dd15fa7074f5529ebfc9d9.jpg",
    "\assets\cef9a808acfb2d7260fdfb25c4e4298c.jpg",
    "\assets\cc523fe8c0ee13451623d43f88688b40.jpg"
  ];
  currentIndex = 0;

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router // Inject Router service
  ) {}

  ngOnInit(): void {
    // Retrieve the leftover data passed as a parameter
    this.route.params.subscribe(params => {
      const leftoverParam = params['leftover'];
      if (leftoverParam) {
        this.leftoverData = JSON.parse(leftoverParam);
        this.isEditing = true; // Set flag to true if editing an existing leftover
      } else {
        this.leftoverData = this.initializeLeftover(); // Initialize new leftover
      }
    });

    // Initialize form and set up validation
    this.leftOverForm = this.fb.group({
      type: [this.leftoverData.type, Validators.required],
      name: [this.leftoverData.name, [Validators.required, Validators.pattern(this.namePattern)]],
      quantity: [this.leftoverData.quantity, [Validators.required, Validators.pattern(this.quantityPattern)]],
      expiryDate: [this.leftoverData.expiry_date, Validators.required],
      image: [this.leftoverData.leftover_image_path, Validators.required]
    });

    // Set minimum expiry date to tomorrow's date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minExpiryDate = tomorrow.toISOString().split('T')[0];
  }
// Initialize a new leftover object
initializeLeftover(): Leftover {
  return {
    type: '',
    name: '',
    quantity: 0,
    expiry_date: new Date(),
    leftover_image_path: null,
    status: 1,
    restaurant_id: 1
  };
}
  // Getter for easy access to form controls
  get formControls() {
    return this.leftOverForm.controls;
  }

  // Handle form submission
  onSubmit() {
    // Implement logic to handle leftover creation or update
    if (this.isEditing) {
      // Handle editing an existing leftover
      console.log('Editing leftover:', this.leftoverData);
      // Implement update logic here

      // Navigate back to the view leftovers page after editing
      this.navigateToViewLeftovers();
    } else {
      // Handle adding a new leftover
      console.log('Adding new leftover:', this.leftoverData);
      // Implement creation logic here
    }
  }

  // Method to navigate back to the view leftovers page
  navigateToViewLeftovers() {
    this.router.navigate(['/view-leftovers']);
  }

  onFileChange(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // Convert the file content to a base64 string
      this.leftoverData.leftover_image_path = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}


  // Method to cancel editing and navigate back to view leftovers page
  cancelEdit() {
    this.navigateToViewLeftovers();
  }
}

