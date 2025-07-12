import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPharmacieComponent } from './menu-pharmacie.component';
import { I18nService } from '../Shared/i18n/i18n.service'; 
import { OrdonnanceComponent } from './ordonnance/ordonnance.component';

const routes: Routes = [
  { path: '', component: MenuPharmacieComponent }
, {
      path: 'ordonnance',
      component: OrdonnanceComponent ,
      data:{title:'Ordonnance' , icon :'fas fa-book-medical'}
    } 
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuPharmacieRoutingModule {
   constructor(private i18nService: I18nService) {
      this.translateRouteTitles();
    }
    translateRouteTitles() {
      routes.forEach(route => {
        if (route.data && route.data['title']) {
          route.data['title'] = this.i18nService.getString(route.data['title']);
        }
      });
    }

 }
