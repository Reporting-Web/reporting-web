import { ElementRef, Injectable } from '@angular/core';
import * as alertifyjs from 'alertifyjs'
import { I18nService } from '../i18n/i18n.service';
@Injectable({
  providedIn: 'root' // Make the service available application-wide
})
export class ControlServiceAlertify {
  private lastNotificationTime = 0;
  constructor(public i18nService: I18nService) { }

   


  showRequiredNotification() {
    const fieldRequiredMessage = this.i18nService.getString('fieldRequired');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }


  
  showNotificationِCustom(LabelMessage:string) {
    const fieldRequiredMessage = this.i18nService.getString(LabelMessage);  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }
  PostionLabelNotification(){
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;
      if (sessionStorage.getItem("lang") == "ar") {
        alertifyjs.set('notifier', 'position', 'top-left');
      } else {
        alertifyjs.set('notifier', 'position', 'top-right');
      }
    }
  }

  PostionLabelNotificationDMI(){
    const currentTime = Date.now();
    if (currentTime - this.lastNotificationTime > 2000) { // Only notify every 2 seconds
      this.lastNotificationTime = currentTime;
      
        alertifyjs.set('notifier', 'position', 'top-right');
      
    }
  }

  showChoseAnyRowNotification() {
    const fieldRequiredMessage = this.i18nService.getString('SelctAnyRow');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }

  showChoseAnyRowNotificationDMI() {
    const fieldRequiredMessage = this.i18nService.getString('SelctAnyRowDMI');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }
  showChoseAnyPatientNotification() {
    const fieldRequiredMessage = this.i18nService.getString('SelectAnyPatient');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }

  ShowSavedOK(){
    const fieldSavedMessage = this.i18nService.getString('SuccessSaved');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/OkSaved.gif" alt="image" >` +
      fieldSavedMessage
    ); 
  }
  ShowSavedOKDMI(){
    const fieldSavedMessage = this.i18nService.getString('SuccessSavedDMI');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/OkSaved.gif" alt="image" >` +
      fieldSavedMessage
    ); 
  }
  ShowUpdatedOK(){
    const fieldUpdatedMessage = this.i18nService.getString('UpdatedOK');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/OkSaved.gif" alt="image" >` +
      fieldUpdatedMessage
    ); 
  }


  ShowDeletedOK(){
    const fieldUpdatedMessage = this.i18nService.getString('DeletedOK');  
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/OkSaved.gif" alt="image" >` +
      fieldUpdatedMessage
    ); 
  }
  ShowDeletedOKDMI(){
    const fieldUpdatedMessage = this.i18nService.getString('DeletedOKDMI');  
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/OkSaved.gif" alt="image" >` +
      fieldUpdatedMessage
    ); 
  }

  showItemUsed() {
    const fieldRequiredMessage = this.i18nService.getString('ItemUsed');  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      fieldRequiredMessage
    );
  }


  ErrorFetchDataDMI(LabelMessage:string) {
    // const fieldRequiredMessage = this.i18nService.getString(LabelMessage);  // Default to English if not found
    alertifyjs.notify(
      `<img  style="width: 30px; height: 30px; margin: 0px 0px 0px 15px" src="/assets/images/images/required.gif" alt="image" >` +
      LabelMessage
    );
  }
}