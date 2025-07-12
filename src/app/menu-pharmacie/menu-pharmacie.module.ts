import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuPharmacieRoutingModule } from './menu-pharmacie-routing.module';
import { MenuPharmacieComponent } from './menu-pharmacie.component';  
import { I18nPipeForOrdonnance } from '../Shared/i18n/i18nForOrdonnance.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TagModule } from 'primeng/tag';


@NgModule({
  declarations: [
    MenuPharmacieComponent,
   I18nPipeForOrdonnance
    
  ],
  imports: [
     CommonModule,TagModule,MatIconModule,MatMenuModule,
    MenuPharmacieRoutingModule
  ]
})
export class MenuPharmacieModule { }
