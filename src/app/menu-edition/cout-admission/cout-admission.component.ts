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
    if (this.dateDeb == null || this.dateFin == null || this.numProfessionel == null || this.numProfessionel == "") {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('PleaseSelectedAnyDateOrNum');
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
      // { field: 'patientCode', header: this.i18nService.getString('CodePatient') || 'CodePatient', width: '10%', filter: "true", type: "text" },
      // { field: 'patientNameAr', header: this.i18nService.getString('NomFullAr') || 'NomFullAr', width: '18%', filter: "true", type: "text" },
      { field: 'codeAdmisson', header: this.i18nService.getString('codeAdmission') || 'codeAdmission', width: '15%', filter: "true", type: "text" },
      { field: 'dateCreate', header: this.i18nService.getString('DateArriver') || 'DateArriver', width: '12%', filter: "true", type: "text" },
      { field: 'sums.totalSumPrestation', header: this.i18nService.getString('sumPrestation') || 'sumPrestation', width: '10%', filter: "true", type: "text" },

      { field: 'sums.totalSumLab', header: this.i18nService.getString('sumLab') || 'sumLab', width: '10%', filter: "true", type: "text" },
      { field: 'sums.totalSumRadio', header: this.i18nService.getString('sumRadio') || 'sumRadio', width: '10%', filter: "true", type: "text" },

      { field: 'sums.totalSumPharmacie', header: this.i18nService.getString('sumPharmacie') || 'sumPharmacie', width: '10%', filter: "true", type: "text" },
      { field: 'sums.totalLigne', header: this.i18nService.getString('montantTotal') || 'montantTotal', width: '10%', filter: "true", type: "text" },
    ];
  }

  GetColumnsGroupedCoutAdmissionTable() {
    this.ColumnsGroupedCoutAdmission = [
      { field: '', header: '', width: '1%', filter: "true" },
      { field: 'patientCode', header: this.i18nService.getString('CodePatient') || 'CodePatient', width: '10%', filter: "true", type: "text" },
      { field: 'patientNameAr', header: this.i18nService.getString('NomFullAr') || 'NomFullAr', width: '18%', filter: "true", type: "text" },
      { field: 'codeAdmisson', header: this.i18nService.getString('Sifa') || 'SIFA', width: '15%', filter: "true", type: "text" },
      { field: 'dateCreate', header: this.i18nService.getString('sumPrestation') || 'sumPrestation', width: '12%', filter: "true", type: "text" },
      { field: 'sumLab', header: this.i18nService.getString('sumLab') || 'sumLab', width: '10%', filter: "true", type: "text" },
      { field: 'sumRadio', header: this.i18nService.getString('sumRadio') || 'sumRadio', width: '10%', filter: "true", type: "text" },
      { field: 'sumPharmacie', header: this.i18nService.getString('sumPharmacie') || 'sumPharmacie', width: '10%', filter: "true", type: "text" },
      { field: 'TOTAL', header: this.i18nService.getString('montantTotal') || 'montantTotal', width: '10%', filter: "true", type: "text" },

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
  loadingData = false;
  grandTotals: any = {}; // Add this line 
  GetAllAdmission() {
    this.loadingData = true;
    this.rapportService.GetAllDetailsAdmissionByDateAndNumProf(this.dateDeb, this.dateFin, this.numProfessionel).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      const result = this.groupAndSumPatientData(data);
      this.dataAdmission = result.patientData;
      this.grandTotals = result.grandTotals; // Add grandTotals to component 
      this.loadingData = false;
    });
  }

  totalPatient = 0;
  groupAndSumPatientData(data: any[]): { patientData: any[]; grandTotals: any  } {
    const groupedData: { [key: string]: any } = {};
    let grandTotalPrestation = 0;
    let granddetailsTotalPrestation = 0;
    let grandTotalLab = 0;
    let granddetailsTotalLab = 0;
    let grandTotalRadio = 0;
    let granddetailsTotalRadio = 0;
    let grandTotalPharmacie = 0;
    let granddetailsTotalPharmacie = 0;

    data.forEach((item) => {
      const patientCode = item.patientCode;
      if (!groupedData[patientCode]) {
        groupedData[patientCode] = {
          patientCode: patientCode,
          patientNameAr: item.patientNameAr,
          patientCategoryCode: item.patientCategoryCode,
          desigCategPatient: item.desigCategPatient,
          totalSumLab: 0,
          totalSumPharmacie: 0,
          totalSumRadio: 0,
          totalSumPrestation: 0,
          admissions: [],
        };

      }
      //Group and Sum Admissions by codeSaisieAdmission
      let admission = groupedData[patientCode].admissions.find((a: any) => a.codeSaisieAdmission === item.codeSaisieAdmission);
      if (!admission) {
        admission = {
          patientCode: item.patientCode,
          codeSaisieAdmission: item.codeSaisieAdmission,
          dateCreate: item.dateCreate,
          codeFamilleFacturation: {}, // Use object for multiple family codes
          montantMasterPL: 0,
          sums: {
            totalSumPrestation: 0,
            totalSumLab: 0,
            totalSumRadio: 0,
            totalSumPharmacie: 0,
          }
        };
        groupedData[patientCode].admissions.push(admission);
      }



      switch (item.codeFamilleFacturation) {
        case 52:
          groupedData[patientCode].totalSumLab += item.montantMasterPL;
          grandTotalLab += item.montantMasterPL;
          break;
        case 58:
          groupedData[patientCode].totalSumPrestation += item.montantMasterPL;
          grandTotalPrestation += item.montantMasterPL;
          break;
        case 110:
          groupedData[patientCode].totalSumPrestation += item.montantMasterPL;
          grandTotalPrestation += item.montantMasterPL;
          break;
        case 98:

          groupedData[patientCode].totalSumPharmacie += item.montantMasterPL;
          grandTotalPharmacie += item.montantMasterPL;
          break;
        case 53:
          groupedData[patientCode].totalSumRadio += item.montantMasterPL;
          grandTotalRadio += item.montantMasterPL;
          break;
      }


      admission.sums.montantMasterPL = (admission.sums.montantMasterPL || 0) + item.montantMasterPL



      switch (item.codeFamilleFacturation) {
        case 52:
          admission.sums.totalSumLab += item.montantMasterPL;
          granddetailsTotalLab += admission.sums.totalSumLab;
          break;
        case 58:
          admission.sums.totalSumPrestation += item.montantMasterPL;
          granddetailsTotalPrestation += admission.sums.totalSumPrestation;
          break;
        case 110:
          admission.sums.totalSumPrestation += item.montantMasterPL;
          granddetailsTotalPrestation += admission.sums.totalSumPrestation;
          break;
        case 98:
          admission.sums.totalSumPharmacie += item.montantMasterPL;
          granddetailsTotalPharmacie  += admission.sums.totalSumPharmacie;
          break;
        case 53:
          admission.sums.totalSumRadio += item.montantMasterPL;
          granddetailsTotalRadio += admission.sums.totalSumRadio;
          break;
      }

      admission.codeFamilleFacturation[item.codeFamilleFacturation] = (admission.codeFamilleFacturation[item.codeFamilleFacturation] || 0) + item.montantMasterPL;
 
      groupedData[patientCode].totalLigne = groupedData[patientCode].totalSumLab +
        +groupedData[patientCode].totalSumPrestation + +groupedData[patientCode].totalSumPharmacie + +groupedData[patientCode].totalSumRadio;
    
      
      });





    /// details par admission : 




    return {
      patientData: Object.values(groupedData),
      grandTotals: {
        totalSumPrestation: grandTotalPrestation,
        totalSumLab: grandTotalLab,
        totalSumRadio: grandTotalRadio,
        totalSumPharmacie: grandTotalPharmacie,
      } 
      
    }
  }
  
  calculateAdmissionSum(admissions: any[]): number {
    let totalSum = 0;
    if (admissions && admissions.length > 0) {
      totalSum = admissions.reduce((sum, admission) => {
          //Assumes your admission object has a sums property with nested properties for each type
        return sum + (admission.sums.totalSumPrestation + admission.sums.totalSumLab + admission.sums.totalSumRadio + admission.sums.totalSumPharmacie);
      }, 0);
    }
    return totalSum;
  }

  numProfessionel: any = null;


}
