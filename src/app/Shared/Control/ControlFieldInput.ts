import { ElementRef, Injectable } from '@angular/core';
import * as alertifyjs from 'alertifyjs'
import { I18nService } from '../i18n/i18n.service';
import { Dropdown } from 'primeng/dropdown';
@Injectable({
  providedIn: 'root' // Make the service available application-wide
})
export class InputValidationService {
  private lastNotificationTime = 0;
  constructor(public i18nService: I18nService) { }

  validateInput(inputElement: ElementRef, errorMessageContainer: ElementRef | undefined, value: string, fieldName: string): void {
    let errorMessage = '';
    if (value === '') {
      errorMessage = `${fieldName} is required`;
      if (inputElement) {
        inputElement.nativeElement.classList.add('invalid-input');
        const currentTime = Date.now();
        if (currentTime - this.lastNotificationTime > 2000) {
          this.lastNotificationTime = currentTime;
          if (sessionStorage.getItem("lang") == "ar") {
            alertifyjs.set('notifier', 'position', 'top-left');
          } else {
            alertifyjs.set('notifier', 'position', 'top-right');
          }
          this.showRequiredNotification();
        }
      }
    } else {
      if (inputElement) {
        inputElement.nativeElement.classList.remove('invalid-input');
      }
    }
    if (errorMessageContainer) {
      errorMessageContainer.nativeElement.textContent = errorMessage; // Set the error message in the specified container (optional)
    } else {
      if (errorMessage) {
        console.warn(errorMessage)
      }
    }
  }



  validateInput2(inputElement: ElementRef, errorMessageContainer: ElementRef | undefined, value: string, fieldName: string): boolean {
    let isValid = true;
    let errorMessage = '';

    if (!value) { // Check for empty or null/undefined
      errorMessage = `${fieldName} is required`;
      inputElement.nativeElement.classList.add('invalid-input');
      if (sessionStorage.getItem("lang") == "ar") {
        alertifyjs.set('notifier', 'position', 'top-left');
      } else {
        alertifyjs.set('notifier', 'position', 'top-right');
      }
      this.showRequiredNotification();
      isValid = false;
    } else {
      inputElement.nativeElement.classList.remove('invalid-input');
    }

    if (errorMessageContainer) {
      errorMessageContainer.nativeElement.textContent = errorMessage;
    } else {
      if (errorMessage) {
        console.warn(errorMessage)
      }
    }

    return isValid; // Correctly returns a boolean
  }

  validateDropDownInput(inputElement: Dropdown, errorMessageContainer: Dropdown | undefined, value: string, fieldName: string): void {
    let errorMessage = '';

    if (value === "" || value === undefined || value === null) {
      errorMessage = `${fieldName} is required`;
      if (inputElement && inputElement.containerViewChild) {
        inputElement.containerViewChild.nativeElement.classList.add('InvalidData');
        const currentTime = Date.now();
        if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
          this.lastNotificationTime = currentTime;
          if (sessionStorage.getItem("lang") == "ar") {
            alertifyjs.set('notifier', 'position', 'top-left');
          } else {
            alertifyjs.set('notifier', 'position', 'top-right');
          }

          this.showRequiredNotification();
        }



      }
    } else {
      if (inputElement && inputElement.containerViewChild) {
        inputElement.containerViewChild.nativeElement.classList.remove('InvalidData');
      }
    }

    if (errorMessageContainer && errorMessageContainer.containerViewChild) {
      errorMessageContainer.containerViewChild.nativeElement.textContent = errorMessage; // Set the error message in the specified container (optional)
    } else {
      // Handle cases where errorMessageContainer isn't provided (e.g. console log)
      if (errorMessage) {
        console.warn(errorMessage)
      }
    }
  }


  showRequiredNotification() {
    const fieldRequiredMessage = this.i18nService.getString('fieldRequired');  // Default to English if not found

    if (sessionStorage.getItem("lang") == "ar") {
      alertifyjs.set('notifier', 'position', 'top-left');
    } else {
      alertifyjs.set('notifier', 'position', 'top-right');
    }
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;
      alertifyjs.notify(
        `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
        fieldRequiredMessage
      );
    }
  }
  showRequiredNotificationWithParam(fieldEnvoyer: string) {
    const fieldRequiredMessage = this.i18nService.getString(fieldEnvoyer);  // Default to English if not found
    if (sessionStorage.getItem("lang") == "ar") {
      alertifyjs.set('notifier', 'position', 'top-left');
    } else {
      alertifyjs.set('notifier', 'position', 'top-right');
    }
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;
      alertifyjs.notify(
        `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
        fieldRequiredMessage
      );
    }

  }


  validateInputCommun(inputElement: ElementRef, value: any): boolean {
    // this.validateInput(inputElement, value);
    if (value !== null && value !== undefined && value !== '') {
      inputElement.nativeElement.classList.remove('invalid-input'); // Remove error class
      return true;
    } else {
      inputElement.nativeElement.classList.add('invalid-input'); // Add error class
      this.showRequiredNotification();
      return false;
    }
  }


  validateDropDownCommun(inputElement: Dropdown, value: string): boolean {
    if (value === "" || value === undefined || value === null) {
      if (inputElement && inputElement.containerViewChild) {
        inputElement.containerViewChild.nativeElement.classList.add('InvalidData'); 
        
        const currentTime = Date.now();
        if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
          this.lastNotificationTime = currentTime; 
          this.showRequiredNotification();
        }
       
      }
      return false;
    } else {
      if (inputElement && inputElement.containerViewChild) {
        inputElement.containerViewChild.nativeElement.classList.remove('InvalidData');
       
      }
      return true;
    }

 

   
  }

}