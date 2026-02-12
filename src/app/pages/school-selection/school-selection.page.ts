import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { schoolOutline, alertCircleOutline } from 'ionicons/icons';
import { SchoolContextService } from '../../services/school-context.service';

@Component({
  selector: 'app-school-selection',
  templateUrl: 'school-selection.page.html',
  styleUrls: ['school-selection.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner
  ],
})
export class SchoolSelectionPage implements OnInit {
  serviceProviderId: string = '';
  schoolId: string = '';
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private schoolContextService: SchoolContextService
  ) {
    addIcons({ schoolOutline, alertCircleOutline });
  }

  ngOnInit() {
    // Check if user explicitly wants to edit (coming from "Change School" button)
    const navigation = this.router.getCurrentNavigation();
    const allowEdit = navigation?.extras?.state?.['allowEdit'] || false;

    // Check for existing context and auto-navigate only if not explicitly editing
    const context = this.schoolContextService.getContext();
    if (context && !allowEdit) {
      this.serviceProviderId = context.serviceProviderId.toString();
      this.schoolId = context.schoolId.toString();
      // Auto-navigate after 500ms
      setTimeout(() => {
        this.navigateToHome();
      }, 500);
    } else if (context) {
      // Pre-populate fields but don't auto-navigate
      this.serviceProviderId = context.serviceProviderId.toString();
      this.schoolId = context.schoolId.toString();
    }
  }

  ionViewWillEnter() {
    // Reset loading state every time the page becomes active
    this.isSubmitting = false;
    this.errorMessage = '';
  }

  validateInputs(): boolean {
    // Clear error message when validating
    this.errorMessage = '';

    // Trim whitespace from inputs
    const trimmedServiceProviderId = this.serviceProviderId.trim();
    const trimmedSchoolId = this.schoolId.trim();

    // Check if both fields are non-empty
    if (!trimmedServiceProviderId || !trimmedSchoolId) {
      return false;
    }

    // Validate Service Provider ID is numeric
    if (!/^\d+$/.test(trimmedServiceProviderId)) {
      this.errorMessage = 'Service Provider ID must be a number';
      return false;
    }

    // Validate School ID is numeric
    if (!/^\d+$/.test(trimmedSchoolId)) {
      this.errorMessage = 'School ID must be a number';
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateInputs()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    try {
      // Trim and convert to numbers
      const serviceProviderId = parseInt(this.serviceProviderId.trim(), 10);
      const schoolId = parseInt(this.schoolId.trim(), 10);

      // Save context
      this.schoolContextService.setContext(serviceProviderId, schoolId);

      // Navigate to home and reset loading state after navigation
      this.navigateToHome();
      
      // Reset immediately after navigation starts
      setTimeout(() => {
        this.isSubmitting = false;
      }, 100);
    } catch (error) {
      this.errorMessage = 'An error occurred. Please try again.';
      this.isSubmitting = false;
    }
  }

  onInputChange(): void {
    // Clear error message when user changes input
    this.errorMessage = '';
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
