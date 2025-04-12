import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
 

import * as alertifyjs from 'alertifyjs'
import { ModalService } from '../modal/modal.service';
// import { AuthService } from '../../Authenfication/_services/auth.service';
// import { TokenStorageService } from '../../Authenfication/_services/token-storage.service';
import { I18nService } from '../i18n/i18n.service';
import { AuthService } from '../../Authenfication/JWT/_services/auth.service';
import { StorageService } from '../../Authenfication/JWT/_services/storage.service';
@Component({
  selector: 'app-modal-content',  
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.css']
})
export class ModalContentComponent implements OnInit {
  constructor(  private storageService: StorageService, private modalService: ModalService,public i18nService: I18nService,private authService: AuthService, private router: Router ,
  ){

  }
  ngOnInit(): void {
   console.log('Componens Open')
  }
  visibleModalLogin:boolean =true;
  
  form: any = {
    userName: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  countries: any; 
  selectedCountry: any;
  onSubmit(): void {
    const { userName, password } = this.form;

    this.authService.login(userName, password).subscribe(
      data => {  
        this.storageService.saveUser(data);
        sessionStorage.setItem("userName", userName);  
        this.isLoginFailed = false;
        this.isLoggedIn = true; 
        this.onClose(); 
        
      },
      // err => {
      //   if ([500].includes(err.status)) {
      //     alertifyjs.set('notifier', 'position', 'top-left');
      //     alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;font-size: 15px !important;;""></i>' + ` Service Core Not Available 503`);
      //     this.playSoundError();
      //   }else if ([401].includes(err.status)) {
      //     alertifyjs.set('notifier', 'position', 'top-left');
      //     alertifyjs.error('<i class="error fa fa-exclamation-circle" aria-hidden="true" style="margin: 5px 5px 5px;font-size: 15px !important;;""></i>' + ` Service Core Not Available 503`);
      //     this.playSoundError();
      //   }


      //   this.isLoginFailed = true;

      // }
    );
  }
  onClose() {
    // outside click
    this.modalService.close();
 
      setTimeout(() => {
        window.location.reload();
      }, 1);
   
  }
  playSoundError() {
    let audio = new Audio();
    audio.src = "../assets/son/erro.mp3";
    audio.load();
    audio.play();
  }
 
}
