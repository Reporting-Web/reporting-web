import { Component, OnInit } from '@angular/core';
import { ThemeOption } from 'ngx-echarts';
import type { EChartsCoreOption } from 'echarts/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { DashbordService } from '../Shared/service/ServiceClientDashbord/dashbord.service';

import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingComponent } from '../Shared/loading/loading.component';
import { I18nService } from '../Shared/i18n/i18n.service';
import { ControlServiceAlertify } from '../Shared/Control/ControlRow';
import { DatePipe } from '@angular/common';
import { CalanderTransService } from '../Shared/CalanderService/CalanderTransService'; 
import { RapportService } from '../Shared/service/ServiceClientRapport/rapport.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '.../../../src/assets/css/newStyle.css'
    , '.../../../src/assets/css/StyleApplication.css'],
    providers: [ CalanderTransService]
})

export class DashboardComponent implements OnInit {
  constructor(private dashbordService: DashbordService, private loadingComponent: LoadingComponent,
    public i18nService: I18nService,private datePipe: DatePipe, private CtrlAlertify: ControlServiceAlertify
    , private calandTrans: CalanderTransService,private rapportService: RapportService)
     {  this.calandTrans.setLangAR(); }


  logoNiyebet: SafeResourceUrl | string | null = null;
  logo9othat: SafeResourceUrl | string | null = null;
  logoER: SafeResourceUrl | string | null = null;
  logoService: SafeResourceUrl | string | null = null;
  logoStoped: SafeResourceUrl | string | null = null;
  logoPatient: SafeResourceUrl | string | null = null;
  
  ngOnInit(): void {
    // this.createChartOptions(); 


    this.getLogoData(); // Combine logo fetching
 this.createChartOptions();

  }

  GetData() {
    if (this.dateDeb == null || this.dateFin == null  ) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('PleaseSelectedAnyDate');
    } else if (this.dateFin < this.dateDeb) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('ErrorDate');
    } else   {
      this.getTotalPatients(); // Get total patient counts
      this.getTotalPatientsBloquer(); // Get total patient counts
      this.GetTotalAdmissionByDate();

    }


  }
  IsLoading = false;
  IsLoadingTotalAdmission = false;


  GetLogoPatient() {
    this.logoPatient = `${window.location.origin}/assets/images/patient.png`;
  }

  GetLogoNiyebet() {
    this.logoNiyebet = `${window.location.origin}/assets/images/ccagp_pec_image/niyebet.png`;
  }

  GetLogo9othat() {
    this.logo9othat =  `${window.location.origin}/assets/images/ccagp_pec_image/9othat.png`;
  }

  GetLogoER() {
 
    this.logoER =  `${window.location.origin}/assets/images/ccagp_pec_image/emergency.png`;
  }
  GetLogoFreeze() {
    this.logoStoped =  `${window.location.origin}/assets/images/ccagp_pec_image/freeze.png`;
  }

  GetLogoService() {
    this.logoService = `${window.location.origin}/assets/images/ccagp_pec_image/ccagp.png`;
  }





  theme: string | ThemeOption = 'dark';
  options11: EChartsCoreOption | null = null;


  createChartOptions(valeur1 : any =0, valeur2 : any =0, valeur3:any=0 , valeur4 : any=0): void {  // void return type
    this.options11 = {
      title: {
        left: '50%',
        text: 'عدد المرضى المسجلة حسب الجهة',
        // subtext: 'Data',
        textAlign: 'center',
        textStyle: { // Use textStyle for title font settings
          fontSize: 16, // Adjust as needed
          fontWeight: 'bold', // Optional
          // fontStyle: 'italic' // Optional
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        align: 'auto',
        bottom: 10,
        data: ['النيابات ', 'الهيئات القضائية', 'الخدمات ', 'الطوارئ'],
        textStyle: { //Use textStyle for legend font settings
          fontSize: 14, // Adjust as needed
          fontWeight: 'bold',
        },
      },
      calculable: true,
      series: [
        {
          name: 'عدد الحالات بالنسبة',
          type: 'pie',
          radius: [30, 110],
          roseType: 'عدد الحالات بالنسبة',
          label: { // Style labels here
            fontSize: 12, // Adjust as needed
            fontWeight: 'bold',
            formatter: '{b}: {c} ({d}%)' //Customize the label text
          },
          data: [
            { value: valeur1, name: 'النيابات ' },
            { value: valeur2, name: 'الهيئات القضائية' },
            { value: valeur3, name: 'الخدمات ' },
            { value: valeur4, name: 'الطوارئ' },
          ],
        },
      ],
    };
  }




  dataPatientCollected: any;
  totalNiyebet: number = 0; // Initialize to 0
  total9othat: number = 0; // Initialize to 0
  total5adamet: number = 0; // Initialize to 0
  totalEr: number = 0; // Initialize to 0
  totalPatient: number = 0; // Initialize to 0



  totalNiyebetBloquer: number = 0; // Initialize to 0
  total9othatBloquer: number = 0; // Initialize to 0
  total5adametBloquer: number = 0; // Initialize to 0
  totalErBloquer: number = 0; // Initialize to 0
  totalPatientBloquer: number = 0; // Initialize to 0

  getLogoData() {
    this.GetLogoNiyebet();
    this.GetLogo9othat();
    this.GetLogoER();
    this.GetLogoService();
    this.GetLogoFreeze();
    this.GetLogoPatient();
  }

  getTotalPatients(): void {
    this.IsLoading = true; // Set loading state

    const observables: Observable<any>[] = [ 
      this.dashbordService.GetAllListPatientByDateAndCodeSociete(this.dateDeb,this.dateFin ,374),
      this.dashbordService.GetAllListPatientByDateAndCodeSociete(this.dateDeb,this.dateFin ,375),
      this.dashbordService.GetAllListPatientByDateAndCodeSociete(this.dateDeb,this.dateFin ,376),
      this.dashbordService.GetAllListPatientByDateAndCodeSociete(this.dateDeb,this.dateFin ,377),
    ];

    forkJoin(observables).pipe(
      map(([data9othat, dataNiyebet, data5adamet, dataEr]) => {
        this.total9othat = this.sumPatients(data9othat);
        this.totalNiyebet = this.sumPatients(dataNiyebet);
        this.total5adamet = this.sumPatients(data5adamet);
        this.totalEr = this.sumPatients(dataEr);
        this.totalPatient = this.total9othat + this.totalNiyebet + this.total5adamet ;
        this.createChartOptions(this.totalNiyebet,this.total9othat,this.total5adamet,this.totalEr);
        
       
      })
    ).subscribe({
      complete: () => (this.IsLoading = false, this.loadingComponent.IsLoading = false), // Reset loading state

      error: (error) => {
        console.error("Error fetching patient data:", error);
        this.IsLoading = false; // Reset loading state even on error
        this.loadingComponent.IsLoading = false;
      }
    });

  }


  private sumPatients(data: any[]): number {
    let sum = 0;
    for (const item of data) {
      sum += +item.countPatients;
    }
    return sum;
  }

  totalAdmission:any = 0 ;
  GetTotalAdmissionByDate(){
    this.IsLoadingTotalAdmission = true;
    this.rapportService.GetAllAdmissionByDate(this.dateDeb, this.dateFin).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoadingTotalAdmission = false;
      this.totalAdmission = data.length;
    
    });
  }


 
  /////  patient bloquer
  Blocked: any = false;
  getTotalPatientsBloquer(): void {

    this.IsLoading=true;
    const observables: Observable<any>[] = [
      this.dashbordService.GetAllListPatientByDateAndCodeSocieteAndBloquer(this.dateDeb,this.dateFin ,374, true),
      this.dashbordService.GetAllListPatientByDateAndCodeSocieteAndBloquer(this.dateDeb,this.dateFin ,375, true),
      this.dashbordService.GetAllListPatientByDateAndCodeSocieteAndBloquer(this.dateDeb,this.dateFin ,376, true),
      this.dashbordService.GetAllListPatientByDateAndCodeSocieteAndBloquer(this.dateDeb,this.dateFin ,377, true),
    ];

    forkJoin(observables).pipe(
      map(([data9othatBloquer, dataNiyebetBloquer, data5adametBloquer, dataErBloquer]) => {

        this.total9othatBloquer = this.sumPatientsBloquer(data9othatBloquer);
        this.totalNiyebetBloquer = this.sumPatientsBloquer(dataNiyebetBloquer);
        this.total5adametBloquer = this.sumPatientsBloquer(data5adametBloquer);
        this.totalErBloquer = this.sumPatientsBloquer(dataErBloquer);
        this.totalPatientBloquer = this.total9othatBloquer + this.totalNiyebetBloquer + this.total5adametBloquer + this.totalErBloquer;
      })
    ).subscribe({
      complete: () => (this.Blocked = false ,this.IsLoading=false), // Reset loading state
      error: (error) => {
        console.error("Error fetching patient data:", error);

      }
    });

  }


  private sumPatientsBloquer(data: any[]): number {
    let sum = 0;
    for (const item of data) {
      sum += +item.countPatients;
    }
    return sum;
  }
 
  DateTempNew: any;
  formatInputNew(event: any) {  // Use any because of p-calendar event type
    let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    event.target.value = inputValue;
    this.DateTempNew = inputValue;
    this.tryParseAndSetDateNew(inputValue);
  }

  tryParseAndSetDateNew(inputValue: string) {
    let parts = inputValue.split('/');
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        let dateObject = new Date(year, month, day); // Create Date object
        this.dateDeb = dateObject; // Assign to your dateDeb property (might be a different type, handle accordingly)
        this.DateTempNew = this.datePipe.transform(dateObject, 'yyyy-MM-dd')!; // Format here
      }
    }
  } 
  dateDeb: any = '2023-08-01';;
  dateFin: any = null;

  DateTempNewFin: any;
  formatInputNewFin(event: any) {  // Use any because of p-calendar event type
    let inputValue = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (inputValue.length > 0) {
      inputValue = inputValue.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    }
    event.target.value = inputValue;
    this.DateTempNewFin = inputValue;
    this.tryParseAndSetDateNewFin(inputValue);
  }

  tryParseAndSetDateNewFin(inputValue: string) {
    let parts = inputValue.split('/');
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let year = parseInt(parts[2], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        let dateObject = new Date(year, month, day); // Create Date object
        this.dateFin = dateObject; // Assign to your dateDeb property (might be a different type, handle accordingly)
        this.DateTempNew = this.datePipe.transform(dateObject, 'yyyy-MM-dd')!; // Format here
      }
    }
  }
  transformDateFormatNewFin() {
    if (this.dateFin) {
      this.DateTempNewFin = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd')!;
    }
  };


  transformDateFormat() {
    this.dateDeb = this.datePipe.transform(this.dateDeb, "yyyy-MM-dd")
  };



  transformDateFormatFin() {
    this.dateFin = this.datePipe.transform(this.dateFin, "yyyy-MM-dd")
  };


}


