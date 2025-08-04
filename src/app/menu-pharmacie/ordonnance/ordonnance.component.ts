import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { LoadingComponent } from '../../Shared/loading/loading.component';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { DatePipe } from '@angular/common';
import { CalanderTransService } from '../../Shared/CalanderService/CalanderTransService';
import { RapportService } from '../../Shared/service/ServiceClientRapport/rapport.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ordonnance',
  templateUrl: './ordonnance.component.html',
  styleUrls: ['./ordonnance.component.css',
    '.../../../src/assets/css/newStyle.css', '.../../../src/assets/css/StyleApplication.css'],
})
export class OrdonnanceComponent implements OnInit {
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

  dateDebPrint: any = null;;
  dateFinPrint: any = null;

  ngOnInit(): void {
    // this.GetColumns();
    this.GetColumnsGroupedCoutAdmissionTable();
    this.GetColumnsDetailsTable();
  }




  @Output() closed: EventEmitter<string> = new EventEmitter();
  closeThisComponent() {
    const parentUrl = this.router.url.split('/').slice(0, -1).join('/');
    this.closed.emit(parentUrl);
    this.router.navigate([parentUrl]);
  }



  // GetColumns() {
  //   this.cols = [
  //     { field: 'designationArCabinet', header: this.i18nService.getString('Cabinet') || 'عيادة', width: '25%' },
  //     { field: 'designationLtCabinet', header: this.i18nService.getString('DesignationLt') || 'DesignationLt', width: '25%' },
  //     { field: 'count', header: this.i18nService.getString('Count') || 'عدد القبولات', width: '15%' }, // Admission Count
  //     { field: 'coutFactureTotal', header: this.i18nService.getString('Cout') || 'التكلفة', width: '15%' } // Admission Count
  //   ];
  // }


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
    // this.dateDeb=null;

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
    // this.dateFin=null;

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
      // this.dateFin=null;
      this.DateTempNewFin = this.datePipe.transform(this.dateFin, 'yyyy-MM-dd')!;
    }
  };


  transformDateFormat() {
    // this.dateDeb =null;

    this.dateDeb = this.datePipe.transform(this.dateDeb, "yyyy-MM-dd")
  };



  transformDateFormatFin() {
    // this.dateFin =null;
    this.dateFin = this.datePipe.transform(this.dateFin, "yyyy-MM-dd")
  };


  // GetData() {
  //   if (this.dateDeb == null || this.dateFin == null && this.codePatient == null || this.codePatient == ""  || this.numProf == null || this.numProf =="" || this.patientNameAr == null || this.patientNameAr == "") {
  //     this.CtrlAlertify.PostionLabelNotification();
  //     this.CtrlAlertify.showNotificationِCustom('PleaseSelectedAnyDateOrNum');
  //   } else if (this.dateFin < this.dateDeb) {
  //     this.CtrlAlertify.PostionLabelNotification();
  //     this.CtrlAlertify.showNotificationِCustom('ErrorDate');
  //   } else {
  //     this.GetAllAdmission();
  //   }
  // }
  GetData() {
    // Check if all text inputs are empty. Using .trim() handles cases where the user enters only spaces.
    const isCodePatientEmpty = !this.codePatient || this.codePatient.trim() === '';
    const isNumProfEmpty = !this.numProf || this.numProf.trim() === '';
    const isPatientNameArEmpty = !this.patientNameAr || this.patientNameAr.trim() === '';
  
    // --- VALIDATION 1: Check if ALL fields are empty ---
    // If the dates are null AND all text fields are empty, then block the search.
    if (this.dateDeb == null || this.dateFin == null  && isCodePatientEmpty && isNumProfEmpty && isPatientNameArEmpty) {
      this.CtrlAlertify.PostionLabelNotification();
      // Use a more descriptive message for the user
      this.CtrlAlertify.showNotificationِCustom('PleaseRemiplreAllField'); 
      return; // Stop the function here
    }
  
    // --- VALIDATION 2: Check for a valid date range ---
    // This check should only run if both dates have been entered.
    if (this.dateDeb && this.dateFin && this.dateFin < this.dateDeb) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('ErrorDate'); // Or "End date cannot be before start date."
      return; // Stop the function here
    }
  
    // If all validations pass, proceed with the search.
    this.GetAllAdmission();
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
      { field: 'codeSaisie', header: this.i18nService.getString('codeAdmission') || 'codeAdmission', width: '15%', filter: "true", type: "text" },
      { field: 'designationArticle', header: this.i18nService.getString('designationArticle') || 'designationArticle', width: '12%', filter: "true", type: "text" },
      { field: 'designationUnite', header: this.i18nService.getString('designationUnite') || 'designationUnite', width: '10%', filter: "true", type: "text" },
      { field: 'qteDemander', header: this.i18nService.getString('QteDemade') || 'QteDemade', width: '10%', filter: "true", type: "text" },
      { field: 'quantite', header: this.i18nService.getString('quantite') || 'quantite', width: '10%', filter: "true", type: "text" },
      { field: 'qteReminder', header: this.i18nService.getString('QteReminder') || 'QteReminder', width: '10%', filter: "true", type: "text" },
      { field: 'userCreate', header: this.i18nService.getString('userCreate') || 'userCreate', width: '10%', filter: "true", type: "text" },
      { field: 'dateMvt', header: this.i18nService.getString('dateMvt') || 'dateMvt', width: '10%', filter: "true", type: "text" },

    ];
  }

  GetColumnsGroupedCoutAdmissionTable() {
    this.ColumnsGroupedCoutAdmission = [
      { field: '', header: '', width: '1%', filter: "true" },
      { field: 'patientCode', header: this.i18nService.getString('CodePatient') || 'CodePatient', width: '15%', filter: "true", type: "text" },
      { field: 'patientNameAr', header: this.i18nService.getString('NomFullAr') || 'NomFullAr', width: '18%', filter: "true", type: "text" },
      { field: 'codeAdmisson', header: this.i18nService.getString('codeAdmission') || 'codeAdmission', width: '15%', filter: "true", type: "text" },
      { field: 'dateArrivee', header: this.i18nService.getString('DateArriver') || 'DateArriver', width: '12%', filter: "true", type: "text" },

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
  // GetAllAdmission() {
  //   this.loadingData = true;
  //   this.rapportService.GetAllOrdonnance(this.dateDeb, this.dateFin, this.codePatient).subscribe((data: any) => { 
  //     this.dataAdmission = this.groupDataByAdmission(data); 
  //     this.loadingData = false;
  //   });
  // }

  GetAllAdmission(): void {
    this.loadingData = true;
    this.dataAdmission = []; // Clear previous results
    this.rapportService.GetAllOrdonnanceCodePatientAndNumProf(this.dateDeb, this.dateFin, this.codePatient, this.numProf,this.patientNameAr)
      .subscribe((data: any) => {
        this.dataAdmission = this.groupDataByAdmission(data);
        this.loadingData = false;
      });
  }


  totalPatient = 0;
  groupAndSumPatientData(data: any[]): { patientData: any[] } {
    const groupedData: { [key: string]: any } = {};

    data.forEach((item) => {
      const patientCode = item.patientCode;
      if (!groupedData[patientCode]) {
        groupedData[patientCode] = {
          patientCode: patientCode,
          patientNameAr: item.patientNameAr,
          codeAdmisson: item.codeAdmisson,
          dateArrivee: item.dateArrivee,
          admissions: [],
        };

      }
      let admission = groupedData[patientCode].admissions.find((a: any) => a.codeAdmisson === item.codeAdmisson);
      if (!admission) {
        admission = {
          patientCode: item.patientCode,
          codeAdmisson: item.codeAdmisson,
          designationArticle: item.designationArticle,
          codeSaisie: item.codeSaisie,
          designationUnite: item.designationUnite,
          userCreate: item.userCreate,
          quantite: item.quantite,
          dateMvt: item.dateMvt,
          qteReminder: item.qteReminder,
          qteDemander: item.qteDemander,


        };
        groupedData[patientCode].admissions.push(admission);
      }



    });
    return {
      patientData: Object.values(groupedData)
    }
  }
  groupDataByAdmission(data: any[]): any[] {
    const groupedAdmissions: { [key: string]: any } = {};

    data.forEach((item) => {
      const admissionCode = item.codeAdmisson;

      // If we haven't seen this admission code before, create a new group for it.
      if (!groupedAdmissions[admissionCode]) {
        groupedAdmissions[admissionCode] = {
          // These properties will be displayed in the main (parent) row
          patientCode: item.patientCode,
          patientNameAr: item.patientNameAr,
          codeAdmisson: admissionCode,
          dateArrivee: item.dateArrivee,
          // Initialize an array to hold all articles for this admission
          admissions: []
        };
      }

      // Add the current article/item to the list for this admission group.
      // We push the whole 'item' so all its properties are available in the sub-table.
      groupedAdmissions[admissionCode].admissions.push(item);
    });

    // Convert the grouping object into an array that the p-table can use.
    return Object.values(groupedAdmissions);
  }
  codePatient: any = null;

  patientNameAr: any = null;

  numProf: any = null;

  reportServer: any;
  reportPath: any;
  showParameters: any;
  parameters: any;
  language: any;
  width: any;
  height: any;
  toolbar: any;
  ssrsReportViewerOptions: any;
  visibleModalPrint = false;

  userCreate = JSON.parse(sessionStorage.getItem("auth-user") ?? '{}')?.userName;
  // PrintReporting(dateDebut: any, datefin: any) {
  //   this.reportServer = 'http://' + environment.adressIP + '/ReportServer'
  //   this.reportPath = 'Reporting/CoutAdmission';
  //   this.showParameters = "true";
  //   this.parameters = {
  //     "dateDeb": dateDebut,
  //     "dateFin": datefin,
  //     "user": this.userCreate,
  //     "NumProf": this.codePatient,
  //   };
  //   this.language = "en-us";
  //   this.width = 50;
  //   this.height = 50;
  //   this.toolbar = "true";
  //   this.visibleModalPrint = true;
  // }
  pdfData: any;
  CloseModalPrint() {
    this.visibleModalPrint = false;
    this.pdfData == null;
    this.dateDebPrint = null;
    this.dateFinPrint = null;
    // this.codePatient = null;
  }


  // onOpenModal(mode: string) {
  //   const button = document.createElement('button');
  //   button.type = 'button';
  //   button.style.display = 'none';
  //   button.setAttribute('data-toggle', 'modal');

  //   if (mode === 'Print') {
  //     if (this.dateDeb == null || this.dateFin == null || this.codePatient == null || this.codePatient == "") {
  //       this.CtrlAlertify.PostionLabelNotification();
  //       this.CtrlAlertify.showNotificationِCustom('PleaseSelectedAnyDateOrNum');
  //     } else if (this.dateFin < this.dateDeb) {
  //       this.CtrlAlertify.PostionLabelNotification();
  //       this.CtrlAlertify.showNotificationِCustom('ErrorDate');
  //     }
  //     else {
  //       button.setAttribute('data-target', '#ModalPrint');
  //       this.visibleModalPrint = true;
  //       this.dateDebPrint = this.dateDeb;
  //       this.dateFinPrint = this.dateFin;
  //       // this.PrintReporting(this.dateDebPrint, this.dateFinPrint);
  //     }

  //   }


  // }

}
