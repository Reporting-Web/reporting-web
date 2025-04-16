import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../../Shared/i18n/i18n.service';

@Component({
  selector: 'app-rapport-pharmacie-chronique',
  templateUrl: './rapport-pharmacie-chronique.component.html',
  styleUrl: './rapport-pharmacie-chronique.component.css'
})
export class RapportPharmacieChroniqueComponent implements OnInit{

  IsLoading = false;
  constructor( public i18nService: I18nService,private router: Router,){

  }
  ngOnInit(): void {
      
  }
      @Output() closed: EventEmitter<string> = new EventEmitter();
      closeThisComponent() {
        const parentUrl = this.router.url.split('/').slice(0, -1).join('/');
        this.closed.emit(parentUrl);
        this.router.navigate([parentUrl]);
      }

}
