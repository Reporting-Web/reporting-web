

import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { DatePipe } from '@angular/common';
import { CalanderTransService } from '../../Shared/CalanderService/CalanderTransService';
import { RapportService } from '../../Shared/service/ServiceClientRapport/rapport.service';
import { ThemeOption } from 'ngx-echarts';
import { EChartsCoreOption } from 'echarts';
import { Router } from '@angular/router';

 
@Component({
  selector: 'app-rapport-pharmacie-normal',
  templateUrl: './rapport-pharmacie-normal.component.html',
  styleUrls: ['./rapport-pharmacie-normal.component.css', '.../../../src/assets/css/newStyle.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [CalanderTransService]
})
export class RapportPharmacieNormalComponent implements OnInit {
  constructor(private router: Router, private rapportService: RapportService, private loadingComponent: LoadingComponent,
    public i18nService: I18nService, private datePipe: DatePipe, private CtrlAlertify: ControlServiceAlertify
    , private calandTrans: CalanderTransService) { this.calandTrans.setLangAR(); }


  IsLoading = false;
  Blocked: any = false;
  cols!: any[];
  colsMedecin!: any[];
  dateDeb: any = null;;
  dateFin: any = null;
  first = 0;
  valeurUnderTestLabo = 100;
  dataPharmacieNormal = new Array<any>();
  selectedAdmission=null
  ngOnInit(): void {
    this.createChartOptions();
    this.GetColumns();
  }

  @Output() closed: EventEmitter<string> = new EventEmitter();
  closeThisComponent() {
    const parentUrl = this.router.url.split('/').slice(0, -1).join('/');
    this.closed.emit(parentUrl);
    this.router.navigate([parentUrl]);
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

  GetData() {
    if (this.dateDeb == null || this.dateFin == null) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('PleaseSelectedAnyDate');
    } else if (this.dateFin < this.dateDeb) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('ErrorDate');
    } else {
      this.GetAllPrescriNormal();
    }
  }
   
  GetColumns() {
    this.cols = [
      { field: 'codeSaisieAdmission', header: this.i18nService.getString('codeAdmission') || 'codeAdmission', width: '20%' },
      { field: 'nomCompeleteAr', header: this.i18nService.getString('NomLt') || 'NomLt', width: '29%' },
      { field: 'dateCreate', header: this.i18nService.getString('DateArriver') || 'DateArriver', width: '18%' },

      { field: 'designationArSpecialite', header: this.i18nService.getString('SpecialiteCabinet') || 'SpecialiteCabinet', width: '20%' }, // Admission Count
      { field: 'coutFactureTotal', header: this.i18nService.getString('Cout') || 'التكلفة', width: '15%' } // Admission Count
    ];
  }

  theme: string | ThemeOption = 'dark';
  options11: EChartsCoreOption | null = null;

  createChartOptions(valeur1: any = 0, valeur2: any = 0, valeur3: any = 0, valeur4: any = 0, valeur5: any = 0, totalReq : number = 0 ): void {  // void return type
    this.options11 = {
      title: {
        left: '50%',
        text: ' عدد الحالات حسب الجهة و العيادة',
        subtext: 'المجموع : ' + totalReq ,
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
        data: ["النيابات ", "الهيئات القضائية", 'الخدمات ', 'الطوارئ'],
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
            { value: valeur1, name: "النيابات ", },
            { value: valeur2, name: "الهيئات القضائية", },
            { value: valeur3, name: 'الخدمات ', },
            { value: valeur4, name: 'الطوارئ', },
            { value: valeur5, name: 'آخرى', },
          ],
        },
      ],
    };
  }


  
  // calculateTotal(): number { 
  //   return  this.dataPharmacieNormal.reduce((sum, item) => sum + item.codeSaisieAdmission, 0) ;
  
  // }


  calculateTotal(): number {
    return   +this.countPatientPerCabAndSociete375niyebt + +this.countPatientPerCabAndSociete374hayet+
    +this.countPatientPerCabAndSociete376khadamet + +this.countPatientPerCabAndSociete379ER + +this.countPatientPerCabAndSocieteOther;
  }

  calculateTotalCout(): number {
    return (this.dataPharmacieNormal.reduce((sum, item) => sum + item.coutFactureTotal, 0)).toFixed(3);
  }



  onRowSelect(event: any) {

  }


  onRowUnselect(event: any) {
    // this.createChartOptions()
    this.selectedAdmission = event.data = null;
  }


  dataAdmBySociete = new Array<any>();
  countPatientPerCabAndSociete374hayet: any = 0;
  countPatientPerCabAndSociete375niyebt: any = 0;
  countPatientPerCabAndSociete379ER: any = 0;
  countPatientPerCabAndSociete376khadamet: any = 0;
  countPatientPerCabAndSocieteOther: any = 0;


  GetAllPrescriNormal(){
    this.IsLoading = true;
    this.rapportService.GetAllPrescritpionByDateAndChronique(this.dateDeb, this.dateFin , false).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;

      this.dataPharmacieNormal = this.aggregateData(data);
      this.dataAdmBySociete = new Array<any>();
      this.dataAdmBySociete = this.aggregateDataParSociete(data);

   
     

      this.dataAdmBySociete.forEach((dataGrouped: any) => {
        switch (dataGrouped.codeSociete) {
          case 374:
            this.countPatientPerCabAndSociete374hayet = dataGrouped.count;
            break;
          case 375:
            this.countPatientPerCabAndSociete375niyebt = dataGrouped.count;
            break;
          case 376:
            this.countPatientPerCabAndSociete376khadamet = dataGrouped.count;
            break;
          case 377:
            this.countPatientPerCabAndSociete379ER = dataGrouped.count; //Corrected to 377
            break;
          case 379:
            this.countPatientPerCabAndSociete379ER = dataGrouped.count; //Added this case
            break;
          case 99:
            this.countPatientPerCabAndSocieteOther = dataGrouped.count;
            break;
        }
      });


      this.createChartOptions(this.countPatientPerCabAndSociete375niyebt, this.countPatientPerCabAndSociete374hayet,
        this.countPatientPerCabAndSociete376khadamet, this.countPatientPerCabAndSociete379ER, this.countPatientPerCabAndSocieteOther
        ,+this.countPatientPerCabAndSociete375niyebt + +this.countPatientPerCabAndSociete374hayet+
        +this.countPatientPerCabAndSociete376khadamet + +this.countPatientPerCabAndSociete379ER + +this.countPatientPerCabAndSocieteOther);




      
    this.countPatient = +this.countPatientPerCabAndSociete375niyebt + +this.countPatientPerCabAndSociete374hayet+
      +this.countPatientPerCabAndSociete376khadamet + +this.countPatientPerCabAndSociete379ER + +this.countPatientPerCabAndSocieteOther;
    this.coutTotal= (this.dataPharmacieNormal.reduce((sum, item) => sum + item.coutFactureTotal, 0)).toFixed(3);

    });


    

   
  }



  

  aggregateData(data: any[]): any[] {
    return data.reduce((accumulator: any[], currentValue: any) => {
      const existingIndex = accumulator.findIndex(item => item.codeSaisieAdmission === currentValue.codeSaisieAdmission);

      if (existingIndex !== -1) {
        accumulator[existingIndex].count++;
        accumulator[existingIndex].coutFactureTotal = parseFloat((accumulator[existingIndex].coutFactureTotal + currentValue.coutFacture).toFixed(3));
      } else {
        accumulator.push({
          codeSaisieAdmission: currentValue.codeSaisieAdmission,
          nomCompeleteAr: currentValue.nomCompeleteAr,
          designationArSpecialite: currentValue.designationArSpecialite, 
          dateCreate: currentValue.dateCreate, 
          count: 1,
          coutFactureTotal: parseFloat((currentValue.coutFacture).toFixed(3)),
          // Add other fields if needed from currentValue
        });
      }
      return accumulator;
    }, []);
  }



  // aggregateDataParSociete(data: any[]): any[] {
  //   return data.reduce((accumulator: any[], currentValue: any) => {
  //     // const existingIndex = accumulator.findIndex(item => item.designationArSoc === currentValue.designationArSoc);
  //     const existingIndex = accumulator.findIndex(item => item.designationArSoc === currentValue.designationArSoc);

  //     if (existingIndex !== -1) {
  //       accumulator[existingIndex].count++;
  //     } else {
  //       accumulator.push({
  //         designationArSoc: currentValue.designationArSoc,
  //         designationLtSoc: currentValue.designationLtSoc,
  //         codeSociete: currentValue.codeSociete, //You might want to keep one, choose wisely
  //         count: 1,
  //         // Add other fields if needed from currentValue
  //       });
  //     }
  //     return accumulator;
  //   }, []);
  // }


  aggregateDataParSociete(data: any[]): any[] {
    const societyCounts: { [key: number]: Set<number> } = {}; // Use a map to store unique patient IDs per society

    data.forEach(currentValue => {
      const codeSociete = currentValue.codeSociete;
      const codeSaisieAdmission = currentValue.codeSaisieAdmission;

      if (!societyCounts[codeSociete]) {
        societyCounts[codeSociete] = new Set();
      }

      if (!societyCounts[codeSociete].has(codeSaisieAdmission)) {
        societyCounts[codeSociete].add(codeSaisieAdmission);
      }
    });


    return Object.entries(societyCounts).map(([codeSociete, patientIds]) => ({
      codeSociete: parseInt(codeSociete, 10), //Parse to number
      count: patientIds.size,
    }));
  }
 

  countPatient = 0 ;

  coutTotal=0;
}


