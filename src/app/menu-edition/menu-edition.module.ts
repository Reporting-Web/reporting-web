import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuEditionRoutingModule } from './menu-edition-routing.module';
import { MenuEditionComponent } from './menu-edition.component';
import { I18nPipeForMenuReception } from '../Shared/i18n/i18nForMenuReception.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TagModule } from 'primeng/tag';
  
@NgModule({
  declarations: [
    MenuEditionComponent,I18nPipeForMenuReception, 
  ],
  imports: [
    CommonModule,TagModule,MatIconModule,MatMenuModule,
    MenuEditionRoutingModule
  ]
})
export class MenuEditionModule { }
