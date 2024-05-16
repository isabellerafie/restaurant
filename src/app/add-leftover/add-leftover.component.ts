// add-leftover.component.ts

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
interface Leftover {
  type: string;
  name: string;
  quantity: number;
  expiry_date: Date;
  leftover_image_path: string | null;
  status: number;
  leftover_id: number;
}

@Component({
  selector: 'app-add-leftover',
  templateUrl: './add-leftover.component.html',
  styleUrls: ['./add-leftover.component.css']
})
export class AddLeftoverComponent implements OnInit {
  sessionData: any;
  leftoverData!: Leftover;
  leftOverForm!: FormGroup;
  minExpiryDate!: string; // Minimum expiry date (tomorrow's date)
  isEditing: boolean = false; // Flag to indicate whether editing an existing leftover
  selectedFile: File | null = null;
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
    private router: Router, // Inject Router service
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.leftOverForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      quantity: [0, [Validators.required, Validators.pattern(this.quantityPattern)]],
      expiryDate: [null, Validators.required],
      leftover_image_path: ['', Validators.required]
    });
  
    // Retrieve the leftover data passed as a parameter
    this.route.params.subscribe(params => {
      const leftoverParam = params['leftover'];
      console.log(leftoverParam)
      if (leftoverParam) {
        this.leftoverData = JSON.parse(leftoverParam);
        this.isEditing = true; // Set flag to true if editing an existing leftover
  
        // Patch the form values when leftoverData is available
        this.leftOverForm.patchValue({
          type: this.leftoverData.type,
          name: this.leftoverData.name,
          quantity: this.leftoverData.quantity,
          expiryDate: this.leftoverData.expiry_date,
          leftover_image_path: this.leftoverData.leftover_image_path
        });
      } else {
        this.leftoverData = this.initializeLeftover(); // Initialize new leftover
      }
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
    leftover_id:0
  };
}
  // Getter for easy access to form controls
  get formControls() {
    return this.leftOverForm.controls;
  }

// Handle form submission
  onSubmit() {
    const expiryDate = this.leftoverData.expiry_date;
  console.log(expiryDate);  
    new BehaviorSubject(sessionStorage.getItem("sessionData") ?? '{}').subscribe(
      (data) => {
        this.sessionData = JSON.parse(data);
      }
    );
    
    // Get user ID from session data
    const userId = this.sessionData.session.user.account_id;
    // Implement logic to handle leftover creation or update
    if (this.isEditing) {
      const formData = new FormData();
      formData.append('type', this.leftoverData.type);
      formData.append('name', this.leftoverData.name);
      formData.append('quantity', this.leftoverData.quantity.toString());
      formData.append('status', this.leftoverData.status.toString());
      formData.append('userId', this.sessionData.session.user.account_id);
      if (expiryDate) {
        formData.append('expiry_date', expiryDate.toString());
      }
      // Add expiry_date to formData only if it's valid and has changed
      //const expiryDate = this.leftOverForm.value.expiryDate;
      console.log("leftover data:",this.leftoverData.expiry_date)
      if (expiryDate && expiryDate !== this.leftoverData.expiry_date) {
        // Format date as YYYY-MM-DD
        const formattedExpiryDate = new Date(expiryDate).toISOString().split('T')[0];
        formData.append('expiry_date', formattedExpiryDate);
        console.log("Formatted Expiry Date:", formattedExpiryDate);
      }
    
      // Add leftover_image_path to formData only if it's changed
      if (this.selectedFile) {
        formData.append('leftover_image_path', this.selectedFile, this.selectedFile.name);
      }
    console.log("edit form:",formData)
      // Send PUT request to update the leftover
      const leftoverId = this.leftoverData.leftover_id;
      this.http.put<any>(`http://localhost:3000/editleftover/${leftoverId}`, formData)
        .subscribe(
          response => {
            console.log(response); // Handle success response
            this.navigateToViewLeftovers(); // Optionally, navigate to view leftovers page
          },
          error => {
            console.error(error); // Handle error response
            // Optionally, show an error message to the user
          }
        );
    }else {
      console.log('lo data',this.leftoverData)
      // Handle adding new leftover
      const formData = new FormData();
      formData.append('type', this.leftoverData.type);
      formData.append('name', this.leftoverData.name);
      formData.append('quantity', this.leftoverData.quantity.toString());
      formData.append('expiry_date', this.leftoverData.expiry_date.toString());
      formData.append('status', this.leftoverData.status.toString());
      if (this.selectedFile) {
        console.log('File to be appended:', this.selectedFile);
        formData.append('leftover_image_path', this.selectedFile, this.selectedFile.name);
      }
      // Fetch session data
      new BehaviorSubject(sessionStorage.getItem("sessionData") ?? '{}').subscribe(
        (data) => {
          this.sessionData = JSON.parse(data);
        }
      );
      
      // Get user ID from session data
      const userId = this.sessionData.session.user.account_id;
  console.log("from data:",formData);
  console.log(userId);

      // Send POST request with FormData
      this.http.post<any>(`http://localhost:3000/addleftover/${userId}`, formData)
        .subscribe(
          response => {
            console.log(response); // Handle success response
            // Optionally, navigate to view leftovers page
            this.navigateToViewLeftovers();
          },
          error => {
            console.error(error); // Handle error response
            // Optionally, show an error message to the user
          }
        );
    }
  }

  // Method to navigate back to the view leftovers page
  navigateToViewLeftovers() {
    this.router.navigate(['/view-leftovers']);
  }

onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
      console.log('Selected file:', this.selectedFile);
    }
  }


  // Method to cancel editing and navigate back to view leftovers page
  cancelEdit() {
    this.navigateToViewLeftovers();
  }
}