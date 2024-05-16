import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { compareValidator } from '../compare.validator';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from '../auth.service';
import { CountryServiceService } from '../service/country-service.service';

@Component({
  selector: 'app-signup-login',
  templateUrl: './signup-login.component.html',
  styleUrls: ['./signup-login.component.css']
})
export class SignupLoginComponent {
  isSignUpVisible: boolean = true;
  isForgotPasswordVisible: boolean = false; 
  isRestaurantSelected: boolean = false;
  isOrganizationSelected: boolean = false;
  isResetPasswordVisible: boolean = false;
  overlayLeft: string = '77%';
  signUpForm: FormGroup; 
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup; 
  resetPasswordForm: FormGroup;
  licenseImageSrc: string | ArrayBuffer | null = null; 
  logoSrc: string | ArrayBuffer | null = null; 
  licenseFile: File | null = null;
  logoFile: File | null = null;
  public countries: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private countryService: CountryServiceService
  ) {    
    this.signUpForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, compareValidator('password')]]
    });
    this.loginForm = this.formBuilder.group({
      user_name: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^.+@.+\..+$')]]
    });
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required] }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      user_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^.+@.+\..+$')]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]], 
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, compareValidator('password')]],
      license_path: ['', Validators.required],
      logo_path: ['', Validators.required],
      role: ['',Validators.required]
    });
    this.route.queryParams.subscribe(params => {
      if (params['reset']) {
        this.showResetPasswordForm();
      }});
      this.countryService.getCountries().subscribe(countries => {
        this.countries = countries;
      });
    }


  showLoginForm() {
    this.isSignUpVisible = false;
    this.isForgotPasswordVisible = false;
    this.overlayLeft = '20%';
  }

  showSignUpForm() {
    this.isSignUpVisible = true;
    this.isForgotPasswordVisible = false;
    this.overlayLeft = '77%';

    if (!this.isRestaurantSelected && !this.isOrganizationSelected) {
      console.log("Please select an account type (Restaurant/Organization).");
      return;
    }
  }
  showForgotPasswordForm() {
    this.isSignUpVisible = false;
    this.isForgotPasswordVisible = true;
    this.overlayLeft = '20%';
  }

  showResetPasswordForm() {
    this.isSignUpVisible = false;
    this.isForgotPasswordVisible = false;
    this.isResetPasswordVisible = true;
    this.overlayLeft = '20%';
  }

  onRadioChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    console.log('Selected value:', value); // Check the selected value
    if (value === "2") {
      this.isRestaurantSelected = true;
      this.isOrganizationSelected = false;
      this.signUpForm.get('role')?.setValue('2');
    } else if (value === "3") {
      this.isRestaurantSelected = false;
      this.isOrganizationSelected = true;
      this.signUpForm.get('role')?.setValue('3');
    }
    console.log('isRestaurantSelected:', this.isRestaurantSelected); // Verify the updated value
    console.log('isOrganizationSelected:', this.isOrganizationSelected); // Verify the updated value
  }
  submitForgotPasswordForm() {
    if (this.forgotPasswordForm.valid) {

      console.log('Forgot password form submitted'); // Add this line

    }
  }

  submitResetPasswordForm() {
  if (this.resetPasswordForm.valid) {
    const newPassword = this.resetPasswordForm.get('newPassword')!.value;
    // Logic to reset the password on the server
  }
}


  submitSignUpForm() {
    console.log('submitSignUpForm() called');
    if (this.signUpForm.valid) {
      console.log('Form is valid');
      const formData = new FormData();
      formData.append('user_name', this.signUpForm.get('user_name')!.value);
      formData.append('email', this.signUpForm.get('email')!.value);
      formData.append('country', this.signUpForm.get('country')!.value);
      formData.append('city', this.signUpForm.get('city')!.value);
      formData.append('postal_code', this.signUpForm.get('postal_code')!.value);
      formData.append('address', this.signUpForm.get('address')!.value);
      formData.append('phone', this.signUpForm.get('phone')!.value);
      formData.append('password', this.signUpForm.get('password')!.value);
      formData.append('role', this.signUpForm.get('role')!.value);
// Append the File objects to the FormData object
if (this.licenseFile){
  formData.append('license_path', this.licenseFile);
}
// Append logo file if selected
if (this.logoFile) {
  formData.append('logo_path', this.logoFile);
}
console.log('FormData:', formData);
      this.http.post<any>('http://localhost:3000/register', formData)
        .subscribe(
          response => {
            console.log('Registration successful:', response);
            // Handle successful registration response (e.g., show success message)
            alert('Registration successful. We will send you an email after reviewing your request!');
            //show login
            this.showLoginForm();
          },
          error => {
            console.error('Registration error:', error);
            // Handle registration error (e.g., show error message)
            alert('Registration failed. Please try again.');
          }
        );
    } else {
      console.log('Form is invalid');
      // Log invalid fields
      Object.keys(this.signUpForm.controls).forEach(field => {
        const control = this.signUpForm.get(field);
        if (control && control.invalid) { // Check if control is not null
          console.log(`Invalid field: ${field}`);
        }
      });     
      // Form is invalid, mark all form controls as touched to trigger validation messages
      this.markFormGroupTouched(this.signUpForm);
    }
  } 
  submitLoginForm() {
    if (this.loginForm.valid) {
      console.log('Login form submitted');
      console.log(this.loginForm.value);
      const user_name: string = this.loginForm.get('user_name')!.value;
      const password: string = this.loginForm.get('password')!.value; 
      const postData = {
        user_name: user_name,
        password: password
      };
      // const requestOptions = {
      //   withCredentials: true
      // };
      this.http.post<any>('http://localhost:3000/login',postData,{withCredentials:true})
        .subscribe(
          response =>{    
            sessionStorage.setItem('sessionData',JSON.stringify(response));
            console.log('Session data:', response);
            // console.log('Login successful:', response);   
            // console.log('Session data:', response.session);   
            // Handle successful login response (e.g., redirect to dashboard)     
            alert('Login successful'); 
   
            const role=response.session.user.role
            console.log(role)
            if (role === 2) {
              console.log("inside 2")
              this.router.navigate(['/add-leftover']); // Navigate to add-leftover component
            } else if (role === 3) {
              this.router.navigate(['/basket']);    
            }
          },     
          error =>{     
            console.error('Login error:', error);     
            // Handle login error (e.g., show error message)    
            alert('Login failed. Please try again.');     
          }     
        );      
      //const formData = new FormData();
      // formData.append('user_name', this.loginForm.get('user_name')!.value);
      // formData.append('password', this.loginForm.get('password')!.value);
  
      /*this.authService.login(formData).subscribe(
        loggedIn => {
          if (loggedIn) {
            console.log('Login successful');
            // Redirect or perform any other action upon successful login
          } else {
            console.log('Login failed');
            // Handle login failure
            alert('Login failed. Please try again.');
          }
        }
      );*/
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  } 
  // Helper method to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  compareValidator(controlName: string) {
    return (control: any) => {
      if (!control.parent || !control) return null;
      const matchingControl = control.parent.get(controlName);
      if (matchingControl.value !== control.value) {
        return { notMatching: true };
      }
      return null;
    };
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('newPassword')!.value;
    const confirmPassword = group.get('confirmPassword')!.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }


  previewImage(event: any, imageId: string) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            (this as any)[imageId + 'Src'] = reader.result;
        };
        reader.readAsDataURL(file);
        this.licenseFile = file;
    }
}
previewLogo(event: any) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = () => {
          this.logoSrc = reader.result;
      };
      reader.readAsDataURL(file);
      this.logoFile = file;
  }
}
}
