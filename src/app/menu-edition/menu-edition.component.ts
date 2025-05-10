import { Component, OnInit } from '@angular/core';
import { I18nService } from '../Shared/i18n/i18n.service';  

@Component({
  selector: 'app-menu-edition',
  templateUrl: './menu-edition.component.html',
  styleUrls: ['./menu-edition.component.css', '.../../../src/assets/css/StyleMenu.css']
})
export class MenuEditionComponent implements OnInit{

  showSubmenu: boolean = false;
  encryptedValue: string = '';
  constructor(  public i18nService: I18nService) { }
  
  ngOnInit(): void {
 
   }


  IsOpened = false;
  onOpened() { 
    this.IsOpened = true;
  } 
  onClosed() { 
    this.IsOpened = false; 
  } 


  IsOpened2 = false;
  onOpened2() { 
    this.IsOpened2 = true;
  } 
  onClosed2() { 
    this.IsOpened2 = false; 
  } 

  IsOpened3 = false;
  onOpened3() { 
    this.IsOpened3 = true;
  } 
  onClosed3() { 
    this.IsOpened3 = false; 
  } 

  IsOpened4 = false;
  onOpened4() { 
    this.IsOpened4 = true;
  } 
  onClosed4() { 
    this.IsOpened4 = false; 
  } 

  IsOpened5 = false;
  onOpened5() { 
    this.IsOpened5 = true;
  } 
  onClosed5() { 
    this.IsOpened5 = false; 
  } 

  IsOpened6 = false;
  onOpened6() { 
    this.IsOpened6 = true;
  } 
  onClosed6() { 
    this.IsOpened6 = false; 
  } 

   
}

