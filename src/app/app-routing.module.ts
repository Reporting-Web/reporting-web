import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { LoginComponent } from './Authenfication/login/login.component'; 
import { I18nService } from './Shared/i18n/i18n.service';

const routes: Routes = [
 
  { path: 'home', component: DashboardComponent },
  { path: 'login', component: LoginComponent }, 
  { path: '', redirectTo: 'home', pathMatch: 'full' },

 
   { path: 'menu_edition', loadChildren: () => import('./menu-edition/menu-edition.module').then(m => m.MenuEditionModule), data:{title:'Edition',icon:'bx bxs-report'} },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
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
