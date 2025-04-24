import { Component, EventEmitter, Output, OnInit } from '@angular/core';

import { LoadingComponent } from '../../Shared/loading/loading.component';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { DatePipe } from '@angular/common';
import { CalanderTransService } from '../../Shared/CalanderService/CalanderTransService';
import { RapportService } from '../../Shared/service/ServiceClientRapport/rapport.service';
import { Router } from '@angular/router'; 
import { sum } from 'lodash';

@Component({
  selector: 'app-cout-admission',
  templateUrl: './cout-admission.component.html',
  styleUrls: ['./cout-admission.component.css', 
    '.../../../src/assets/css/newStyle.css', '.../../../src/assets/css/StyleApplication.css'],

})
export class CoutAdmissionComponent implements OnInit {
  constructor(private router: Router, private rapportService: RapportService, private loadingComponent: LoadingComponent,
    public i18nService: I18nService, private datePipe: DatePipe, private CtrlAlertify: ControlServiceAlertify
    , private calandTrans: CalanderTransService) { this.calandTrans.setLangAR(); }



  IsLoading = false;
  Blocked: any = false;
  cols!: any[];
  dateDeb: any = null;;
  dateFin: any = null;
  first = 0;
  code!: number | null;
  codeCabinet!: number | null;
  selectedCabinet!: any;
  select!: any; 



  ngOnInit(): void {

    this.GetColumns();
    this.GetColumnsGroupedCoutAdmissionTable(); 
    this.GetColumnsDetailsTable();

  }




  @Output() closed: EventEmitter<string> = new EventEmitter();
  closeThisComponent() {
    const parentUrl = this.router.url.split('/').slice(0, -1).join('/');
    this.closed.emit(parentUrl);
    this.router.navigate([parentUrl]);
  }



  GetColumns() {
    this.cols = [
      { field: 'designationArCabinet', header: this.i18nService.getString('Cabinet') || 'عيادة', width: '25%' },
      { field: 'designationLtCabinet', header: this.i18nService.getString('DesignationLt') || 'DesignationLt', width: '25%' },

      { field: 'count', header: this.i18nService.getString('Count') || 'عدد القبولات', width: '15%' }, // Admission Count
      { field: 'coutFactureTotal', header: this.i18nService.getString('Cout') || 'التكلفة', width: '15%' } // Admission Count
    ];
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
      this.GetAllAdmission();
    }
  }


  dataAdmBySociete = new Array<any>();
  countPatientPerCabAndSociete374hayet: any = 0;
  countPatientPerCabAndSociete375niyebt: any = 0;
  countPatientPerCabAndSociete379ER: any = 0;
  countPatientPerCabAndSociete376khadamet: any = 0;
  countPatientPerCabAndSocieteOther: any = 0;
  onRowSelect(event: any) {
    this.selectedCabinet = event.data.codeSaisieCabinet;
    this.dataAdmBySociete = new Array<any>();



  }
  onRowUnselect(event: any) {
    this.selectedCabinet = event.data = null;
  }
 

  ///// new compoenent cout admission : 

  expandedRows: any = {};
  ColumnsDetAdmission!: any[];
  LabelGroupedByFamilleFacturation !: string;
  LabelPrestation !: string;
  ColumnsGroupedCoutAdmission!: any[];
  GetColumnsDetailsTable() {
    this.ColumnsDetAdmission = [
      { field: 'patientCode', header: this.i18nService.getString('CodePatient') || 'CodePatient', width: '19%', filter: "true" },
      { field: 'patientNameAr', header: this.i18nService.getString('NomFullAr') || 'NomFullAr', width: '20%', filter: "true" },
      { field: 'codeAdmisson', header: this.i18nService.getString('codeAdmission') || 'codeAdmission', width: '20%', filter: "true" },
     
      { field: 'sumLab', header: this.i18nService.getString('sumLab') || 'sumLab', width: '15%', filter: "true" },
      { field: 'sumPharmacie', header: this.i18nService.getString('sumPharmacie') || 'sumPharmacie', width: '15%', filter: "true" },
      { field: 'sumPrestation', header: this.i18nService.getString('sumPrestation') || 'sumPrestation', width: '15%', filter: "true" },
      { field: 'sumRadio', header: this.i18nService.getString('sumRadio') || 'sumRadio', width: '15%', filter: "true" },
     ];
  }

  GetColumnsGroupedCoutAdmissionTable() {
    this.ColumnsGroupedCoutAdmission = [
      { field: '', header: '', width: '1%', filter: "true" },
      { field: 'patientCode', header: this.i18nService.getString('CodePatient') || 'CodePatient', width: '19%', filter: "true" },
      { field: 'patientNameAr', header: this.i18nService.getString('NomFullAr') || 'Designation', width: '20%', filter: "true" },
      { field: 'codeAdmisson', header: this.i18nService.getString('codeAdmission') || 'codeAdmission', width: '20%', filter: "true" },
      { field: 'sumLab', header: this.i18nService.getString('sumLab') || 'sumLab', width: '15%', filter: "true" },
      { field: 'sumPharmacie', header: this.i18nService.getString('sumPharmacie') || 'sumPharmacie', width: '15%', filter: "true" },
      { field: 'sumPrestation', header: this.i18nService.getString('sumPrestation') || 'sumPrestation', width: '15%', filter: "true" },
      { field: 'sumRadio', header: this.i18nService.getString('sumRadio') || 'sumRadio', width: '15%', filter: "true" },

    ];


  }

  expandAll() {
    this.expandedRows = {};
    this.groupedData.forEach(group => {
      this.expandedRows[group.patientCategoryCode] = true; // Expand based on familleCode
    });
  }

  collapseAll() {
    this.expandedRows = {};
  }


  dataAdmission: any[] = [];
  groupedData = new Array<any>();
  GetAllAdmission() {
    this.IsLoading = true;
    this.rapportService.GetAllCoutAdmissionByDate(this.dateDeb, this.dateFin).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataAdmission = data;
      this.groupedData = this.groupPrestationsByFamille(data);

    });
  }

  groupAdmissionByNumProfessional(data: any[]): any[] {
    const grouped: { [key: number]: any[] } = {};

    data.forEach((item) => {
      const numprofession = item.code; // Assuming 'code' field represents numprofession
      if (!grouped[numprofession]) {
        grouped[numprofession] = [];
      }
      grouped[numprofession].push(item);
      // console.log("itemss ", item);
      
    });

    // Convert the grouped object back into an array of objects
    return Object.entries(grouped).map(([numprofession, items]) =>
       ( 
        {
      numprofession: parseInt(numprofession, 10), //Convert string key to integer
      admissions: items,
      patientCategoryCode :items.reduce((patientCategoryCode) => patientCategoryCode),
      patientCode:items.reduce((patientCode) => patientCode),
      totalSumLab: items.reduce((sum, item) => sum + item.sumLab, 0),
      totalSumPrestation: items.reduce((sum, item) => sum + item.sumPrestation, 0),
      totalSumRadio: items.reduce((sum, item) => sum + item.sumRadio, 0),
      totalSumPharmacie: items.reduce((sum, item) => sum + item.sumPharmacie, 0),
    }));
  }

  // aggregateDataByCabinet(data: any[]): any[] {
  //   return data.reduce((accumulator: any[], currentValue: any) => {
  //     const existingIndex = accumulator.findIndex(item => item.patientCategoryCode === currentValue.patientCategoryCode);

  //     if (existingIndex !== -1) {
  //       accumulator[existingIndex].count++;
  //     } else {
  //       accumulator.push({
  //         designationArSoc: currentValue.designationArSoc,
  //         designationLtSoc: currentValue.designationLtSoc,
  //         codeSociete: currentValue.codeSociete, //You might want to keep one, choose wisely
  //         patientCode: currentValue.patientCode,
  //         patientCategoryCode: currentValue.patientCategoryCode,
  //         sumLab: currentValue.sumLab,
  //         sumPharmacie: currentValue.sumPharmacie,
  //         sumRadio: currentValue.sumRadio,
  //         sumPrestation: currentValue.sumPrestation,
  //       });
  //     }
  //     return accumulator;
  //   }, []);
  // }

  groupPrestationsByFamille(data: any[]): any[] {
    const grouped: { [key: string]: any } = {};
    data.forEach(prestation => {
      const familleCode = prestation.familleCodePatient; // Correct way to access code
      if (!grouped[familleCode]) {
        grouped[familleCode] = {
          familleCode,
          patientNameAr:prestation.patientNameAr,
          codeAdmisson:prestation.codeAdmisson,
          sumLab:prestation.sumLab,
          sumPharmacie:prestation.sumPharmacie,
          sumPrestation:prestation.sumPrestation,
          sumRadio:prestation.sumRadio,
         
          
          patientCode:prestation.patientCode,
          familleCodePatient: prestation.familleCodePatient,
          details: []
        };
      }
      grouped[familleCode].details.push(prestation);
    });
    console.log("grouped", grouped);
    return Object.values(grouped);
  }

   


}
