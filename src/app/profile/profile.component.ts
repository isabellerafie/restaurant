import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CountryServiceService } from '../service/country-service.service';

type ProfileDataKey = 'user_name' | 'email' | 'phone' | 'country' | 'city' | 'postal_code' | 'address';

type ProfileData = {
  [key in ProfileDataKey]: string;
};


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing: boolean = false;
  restaurantLogo!: string;
  totalLeftovers!: number;
  sessionData: any;
  selectedFile: File | null = null;
  public countries: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private countryService: CountryServiceService
  ) { }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  
    this.profileForm = this.formBuilder.group({
      restaurant_username: ['', Validators.required],
      restaurant_email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', Validators.required],
      address: ['', Validators.required]
    });


    this.loadProfile(); // Load the profile data when component initializes
  }

  loadProfile(): void {
    // Retrieve session data from sessionStorage
    new BehaviorSubject(sessionStorage.getItem("sessionData") ?? '{}').subscribe(
      (data) => {
        this.sessionData = JSON.parse(data);
        const userId = this.sessionData.session.user.account_id; // Extract the user ID from session data
        this.fetchProfileData(userId); // Fetch profile data using the user ID
        this.fetchTotalLeftovers(userId);
      }
    );
  }

  fetchProfileData(userId: string): void {
    this.http.get<any[]>(`http://localhost:3000/leftovers/restaurant/profile/${userId}`).subscribe({
      next: (response: any[]) => {
        if (response.length > 0) {
          const profileData = response[0];
          this.populateFormWithProfileData(profileData);
        } else {
          console.error('No profile data found for user ID:', userId);
        }
      },
      error: (error) => {
        console.error('Error loading profile', error);
      }
    });
  }
  fetchTotalLeftovers(userId: string): void {
    this.http.get<{ totalReservedQuantity: number }>(`http://localhost:3000/count/${userId}`).subscribe({
      next: (response) => {
        this.totalLeftovers = response.totalReservedQuantity;
      },
      error: (error) => {
        console.error('Error fetching total leftovers', error);
      }
    });
  }

  populateFormWithProfileData(profileData: any): void {
    this.profileForm.patchValue({
      restaurant_username: profileData.restaurant_username,
      restaurant_email: profileData.restaurant_email,
      phone: profileData.phone,
      country: profileData.country,
      city: profileData.city,
      postal_code: profileData.postal_code,
      address: profileData.address,
      
    });
    this.restaurantLogo = profileData.logo_path;
    console.log(this.restaurantLogo)
    // Assuming totalLeftovers is part of profile data
    this.totalLeftovers = profileData.totalLeftovers || 0;
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log("this . selected file",this.selectedFile)
  }
  enableEditing(): void {
    this.isEditing = true;
  }
  saveProfile(): void {
    if (this.profileForm.valid) {
      const formData = new FormData();
      
      // Append form data to FormData object
      formData.append('restaurant_username', this.profileForm.get('restaurant_username')!.value);
      formData.append('restaurant_email', this.profileForm.get('restaurant_email')!.value);
      formData.append('phone', this.profileForm.get('phone')!.value);
      formData.append('country', this.profileForm.get('country')!.value);
      formData.append('city', this.profileForm.get('city')!.value);
      formData.append('postal_code', this.profileForm.get('postal_code')!.value);
      formData.append('address', this.profileForm.get('address')!.value);
      
      // Append file if selected
      if (this.selectedFile) {
        formData.append('logo_path', this.selectedFile);
      }
      
      // Define headers if needed
      const headers = new HttpHeaders();
      // Make the HTTP request to update the profile
      this.http.put<any>(`http://localhost:3000/editrestaurant/${this.sessionData.session.user.account_id}`, formData,  { headers }).subscribe(
        response => {
          console.log('Restaurant profile updated successfully:', response);
          // Optionally, reload the profile data or handle success
          this.fetchProfileData;
          // Exit editing mode
          this.isEditing = false;
        },
        error => {
          console.error('Error updating restaurant profile:', error);
          // Optionally, display an error message to the user
        }
      );
    }
  }
  cancelEditing(): void {
    this.isEditing = false;
  }
}