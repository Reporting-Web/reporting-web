import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuEditionComponent } from './menu-edition.component';
 import { RapportEmployeeComponent } from './rapport-employee/rapport-employee.component';
import { RapportLaboComponent } from './rapport-labo/rapport-labo.component';
import { RapportOPDComponent } from './rapport-opd/rapport-opd.component';
import { RapportPharmacieChroniqueComponent } from './rapport-pharmacie-chronique/rapport-pharmacie-chronique.component';
import { RapportPharmacieNormalComponent } from './rapport-pharmacie-normal/rapport-pharmacie-normal.component';
import { RapportRadioComponent } from './rapport-radio/rapport-radio.component';
import { RapportDoctorPerformanceComponent } from './rapport-doctor-performance/rapport-doctor-performance.component';
import { I18nService } from '../Shared/i18n/i18n.service';
import { CoutAdmissionComponent } from './cout-admission/cout-admission.component';

const routes: Routes = [ 
    { path: '', component: MenuEditionComponent }
    ,{
      path: 'rapport_doctor_performance',
      component: RapportDoctorPerformanceComponent ,
      data:{title:'DoctorPerformance' , icon :'fas fa-user-doctor'}
    }
    ,{
      path: 'rapport_employee',
      component: RapportEmployeeComponent ,
      data:{title:'Employee' , icon :'fas fa-users'}
    }
    ,{
      path: 'rapport_labo',
      component: RapportLaboComponent ,
      data:{title:'Laboratoire' , icon :'fas fa-flask-vial'}
    },{
      path: 'rapport_opd',
      component: RapportOPDComponent ,
      data:{title:'OutPatient' , icon :'fas fa-user'}
    },{
      path: 'rapport_pharmacie_chronique',
      component: RapportPharmacieChroniqueComponent ,
      data:{title:'PrescriptionChronique' , icon :'fas fa-book-medical'}
    },{
      path: 'rapport_pharmacie_normal',
      component: RapportPharmacieNormalComponent,
      data:{title:'PrescriptionNormal' , icon :'fas fa-briefcase-medical'}
    }, {
      path: 'rapport_radio',
      component: RapportRadioComponent ,
      data:{title:'Radiologie' , icon :'fas  fa-lungs'}
    } 
    , {
      path: 'cout_admission',
      component: CoutAdmissionComponent ,
      data:{title:'CoutAdmission' , icon :'fas  fa-money-bill-1'}
    } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuEditionRoutingModule {

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
