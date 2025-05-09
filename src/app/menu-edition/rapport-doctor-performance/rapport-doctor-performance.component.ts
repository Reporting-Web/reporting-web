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
  selector: 'app-rapport-doctor-performance',
  templateUrl: './rapport-doctor-performance.component.html',
  styleUrls: ['./rapport-doctor-performance.component.css',
    '.../../../src/assets/css/newStyle.css', '.../../../src/assets/css/StyleApplication.css'],

})
export class RapportDoctorPerformanceComponent implements OnInit {
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
  select!: any;
  selectedDoctor:any = null;
  dateDebPrint: any = null;;
  dateFinPrint: any = null;

  ngOnInit(): void {
    this.GetColumns();
    this.GetColumnsGroupedCoutAdmissionTable();
    this.GetColumnsDetailsTable();

    this.GetColumnsDetailsTableDMI();
    this.GetColumnsGroupedCoutAdmissionTableDMI()
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


  GetData() {
    if (this.dateDeb == null || this.dateFin == null   ) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('PleaseSelectedAnyDate');
    } else if (this.dateFin < this.dateDeb) {
      this.CtrlAlertify.PostionLabelNotification();
      this.CtrlAlertify.showNotificationِCustom('ErrorDate');
    } else {
      this.GetAllDoctorPerformance();
    }
  }


  dataAdmBySociete = new Array<any>();
  countPatientPerCabAndSociete374hayet: any = 0;
  countPatientPerCabAndSociete375niyebt: any = 0;
  countPatientPerCabAndSociete379ER: any = 0;
  countPatientPerCabAndSociete376khadamet: any = 0;
  countPatientPerCabAndSocieteOther: any = 0;
  onRowSelect(event: any) {
    this.selectedDoctor = event.data.codeSaisieCabinet;
    this.dataAdmBySociete = new Array<any>();



  }
  onRowUnselect(event: any) {
    this.selectedDoctor = event.data = null;
  }


  ///// new compoenent cout admission : 

  expandedRows: any = {};
  ColumnsDetAdmission!: any[];
  LabelGroupedByFamilleFacturation !: string;
  LabelPrestation !: string;
  ColumnsGroupedCoutAdmission!: any[];
  GetColumnsDetailsTable() {
    this.ColumnsDetAdmission = [
      { field: 'codePatient', header: this.i18nService.getString('CodePatient') || 'CodePatient', width: '3%', filter: "true", type: "text" },
      { field: 'codeAdmisson', header: this.i18nService.getString('codeAdmission') || 'codeAdmission', width: '3%', filter: "true", type: "text" },
      { field: 'nomCompeleteAr', header: this.i18nService.getString('NomLt') || 'NomLt', width: '12%', filter: "true", type: "text" },
      { field: 'dateCreate', header: this.i18nService.getString('DateArriver') || 'DateArriver', width: '9%', filter: "true", type: "text" },
      { field: 'sums.nbreReqPresLabo', header: this.i18nService.getString('nbreReqLabo') || 'nbreReqLabo', width: '9%', filter: "true", type: "text" },

      { field: 'sums.nbreReqPresRadio', header: this.i18nService.getString('nbreReqRadio') || 'nbreReqRadio', width: '8%', filter: "true", type: "text" },
      { field: 'sums.nbrePrescriptionChronique', header: this.i18nService.getString('nbreReqPrescriptionChronique') || 'nbreReqPrescriptionChronique', width: '12%', filter: "true", type: "text" },

      { field: 'sums.nbrePrescriptionNormal', header: this.i18nService.getString('nbreReqPrescriptionNormal') || 'nbreReqPrescriptionNormal', width: '12%', filter: "true", type: "text" },
     ];
  }

  GetColumnsGroupedCoutAdmissionTable() {
    this.ColumnsGroupedCoutAdmission = [
      { field: '', header: '', width: '1%', filter: "true" },
      { field: 'nomIntervAr', header: this.i18nService.getString('nomIntervAr') || 'nomIntervAr', width: '10%', filter: "true", type: "text" },

      { field: 'nomInterv', header: this.i18nService.getString('nomInterv') || 'nomInterv', width: '10%', filter: "true", type: "text" },
      { field: 'designationArSpec', header: this.i18nService.getString('Specialite') || 'Specialite', width: '10%', filter: "true", type: "text" },
      { field: 'countPatientMedecin', header: this.i18nService.getString('countPatient') || 'countPatient', width: '10%', filter: "true", type: "text" },
      { field: 'nbreReqPresLabo', header: this.i18nService.getString('nbreReqPresLabo') || 'nbreReqPresLabo', width: '10%', filter: "true", type: "text" },
      { field: 'nbreReqPresRadio', header: this.i18nService.getString('nbreReqPresRadio') || 'nbreReqPresRadio', width: '10%', filter: "true", type: "text" },
      { field: 'nbrePrescriptionChronique', header: this.i18nService.getString('nbrePrescriptionChronique') || 'nbrePrescriptionChronique', width: '10%', filter: "true", type: "text" },
      { field: 'nbrePrescriptionNormal', header: this.i18nService.getString('nbrePrescriptionNormal') || 'nbrePrescriptionNormal', width: '10%', filter: "true", type: "text" },
 
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


  dataDoctorPerformance: any[] = [];
  groupedData = new Array<any>();
  loadingData = false;
  grandTotals: any = {}; // Add this line 
  GetAllDoctorPerformance() {
    this.loadingData = true;
    this.rapportService.GetAllDoctorPerformanceByDate(this.dateDeb, this.dateFin,false).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataDoctorPerformance = this.groupData(data);
      this.dataDoctorPerformanceDMI = this.groupDataDMI(data);
       
      this.loadingData = false;
      
      
     
        this.GetSpecialiteMedecin();
  
      
    });
  }

  groupData(data: any[]): any[] {
    const groupedData: { [key: number]: any } = {};
  
    data.forEach(item => {
      const intervenantCode = item.codeIntervenant;
      if (!groupedData[intervenantCode]) {
        groupedData[intervenantCode] = {
          codeIntervenant: intervenantCode,
          nomIntervAr: item.nomIntervAr,
          nomInterv: item.nomInterv,
          designationArSpec: item.designationArSpec,
          designationLtSpec: item.designationLtSpec, 
          nbreReqPresLabo: 0,
          nbreReqPresRadio: 0,
          nbrePrescriptionChronique: 0,
          nbrePrescriptionNormal: 0,
          countPatientMedecin: 0,
          admissions: [],
          laboSet: new Set(), //Sets to track unique prescriptions
          radioSet: new Set(),
          chroniqueSet: new Set(),
          normalSet: new Set(),
          countPatient: new Set(),
        };
      }
 
    
     // Find or create the admission
     let admission = groupedData[intervenantCode].admissions.find(
      (a: any) => a.codeSaisieAdmission === item.codeSaisieAdmission
    );

    if (!admission) {
      admission = {
        codePatient: item.codePatient,
        codeSaisieAdmission: item.codeSaisieAdmission,
        nomCompeleteAr: item.nomCompeleteAr,
        dateCreate: item.dateCreate,
        sums: {
          nbreReqPresLabo: item.nbreReqPresLabo || 0,
          nbreReqPresRadio: item.nbreReqPresRadio || 0,
          nbrePrescriptionChronique: item.nbrePrescriptionChronique || 0,
          nbrePrescriptionNormal: item.nbrePrescriptionNormal || 0,
        },
      };
      groupedData[intervenantCode].admissions.push(admission);
    } else {
      // Update existing admission sums (this was the main error)
      admission.sums.nbreReqPresLabo = (admission.sums.nbreReqPresLabo || 0) + (item.nbreReqPresLabo || 0);
      admission.sums.nbreReqPresRadio = (admission.sums.nbreReqPresRadio || 0) + (item.nbreReqPresRadio || 0);
      admission.sums.nbrePrescriptionChronique = (admission.sums.nbrePrescriptionChronique || 0) + (item.nbrePrescriptionChronique || 0);
      admission.sums.nbrePrescriptionNormal = (admission.sums.nbrePrescriptionNormal || 0) + (item.nbrePrescriptionNormal || 0);
    }

    // Update the totals for the intervenant

    if (item.nbreReqPresLabo > 0) groupedData[intervenantCode].laboSet.add(item.codeSaisieAdmission);  //add admission code only once per doctor.
    if (item.nbreReqPresRadio > 0) groupedData[intervenantCode].radioSet.add(item.codeSaisieAdmission);
    if (item.nbrePrescriptionChronique > 0) groupedData[intervenantCode].chroniqueSet.add(item.codeSaisieAdmission);
    if (item.nbrePrescriptionNormal > 0) groupedData[intervenantCode].normalSet.add(item.codeSaisieAdmission);

    groupedData[intervenantCode].countPatient.add(item.codePatient);

    

    groupedData[intervenantCode].nbreReqPresLabo = groupedData[intervenantCode].laboSet.size;
    groupedData[intervenantCode].nbreReqPresRadio = groupedData[intervenantCode].radioSet.size;
    groupedData[intervenantCode].nbrePrescriptionChronique = groupedData[intervenantCode].chroniqueSet.size;
    groupedData[intervenantCode].nbrePrescriptionNormal = groupedData[intervenantCode].normalSet.size;
      groupedData[intervenantCode].countPatientMedecin = groupedData[intervenantCode].countPatient.size;
  
  });

  return Object.values(groupedData);
  }

  groupDataDMI(data: any[]): any[] {
    const groupedDataDMI: { [key: number]: any } = {};
  
    data.forEach(item => {
      const intervenantCode = item.codeIntervenant;
      if (!groupedDataDMI[intervenantCode]) {
        groupedDataDMI[intervenantCode] = {
          codeIntervenant: intervenantCode,
          nomIntervAr: item.nomIntervAr,
          nomInterv: item.nomInterv,
          dmiAdmissions: [],
        };
      }
  
      // Find existing admission or create a new one.
      let admission = groupedDataDMI[intervenantCode].dmiAdmissions.find(
        (a: any) => a.codeSaisieAdmission === item.codeSaisieAdmission
      );
  
      // If admission doesn't exist, create it.
      if (!admission) {
        admission = {
          codePatient: item.codePatient,
          codeSaisieAdmission: item.codeSaisieAdmission,
          nomCompeleteAr: item.nomCompeleteAr,
          dateCreate: item.dateCreate,
          diganosis: item.diganosis,
          cheifComplaint: item.cheifComplaint,
          prestations: item.nbrePresDent,
        };
        groupedDataDMI[intervenantCode].dmiAdmissions.push(admission);
      } else {
        //Admission already exists;  No action needed here since you only want 
        // one row per admission.  The existing data is correct.
      }
  
    });
  
    return Object.values(groupedDataDMI);
  }

 
  calculateSumPresLab(): number {
    let totalSum = 0;
    if (this.dataDoctorPerformance && this.dataDoctorPerformance.length > 0) {
      totalSum = this.dataDoctorPerformance.reduce((sum, domaine) => {
         return sum + (domaine.nbreReqPresLabo  );
      }, 0);
    }
    return totalSum;
  }

  calculateSumPatient(): number {
    let totalSum = 0;
    if (this.dataDoctorPerformance && this.dataDoctorPerformance.length > 0) {
      totalSum = this.dataDoctorPerformance.reduce((sum, domaine) => {
         return sum + (domaine.countPatientMedecin  );
      }, 0);
    }
    return totalSum;
  }

  calculateSumPresRadio(): number {
    let totalSum = 0;
    if (this.dataDoctorPerformance && this.dataDoctorPerformance.length > 0) {
      totalSum = this.dataDoctorPerformance.reduce((sum, domaine) => {
         return sum + (domaine.nbreReqPresRadio  );
      }, 0);
    }
    return totalSum;
  }

  calculateSumPrescriptionChronique(): number {
    let totalSum = 0;
    if (this.dataDoctorPerformance && this.dataDoctorPerformance.length > 0) {
      totalSum = this.dataDoctorPerformance.reduce((sum, domaine) => {
         return sum + (domaine.nbrePrescriptionChronique  );
      }, 0);
    }
    return totalSum;
  }

  calculateSumPrescriptionNormal(): number {
    let totalSum = 0;
    if (this.dataDoctorPerformance && this.dataDoctorPerformance.length > 0) {
      totalSum = this.dataDoctorPerformance.reduce((sum, domaine) => {
         return sum + (domaine.nbrePrescriptionNormal  );
      }, 0);
    }
    return totalSum;
  }



 
  numProfessionel: any = null;



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
  PrintReporting(dateDebut: any, datefin: any) {
    this.reportServer = 'http://' + environment.adressIP + '/ReportServer'
    this.reportPath = 'Reporting/CoutAdmission';
    this.showParameters = "true";
    this.parameters = {
      "dateDeb": dateDebut,
      "dateFin": datefin,
      "user": this.userCreate,
      "NumProf": this.numProfessionel,
    };
    this.language = "en-us";
    this.width = 50;
    this.height = 50;
    this.toolbar = "true";
    this.visibleModalPrint = true;
  }
  pdfData: any;
  CloseModalPrint() {
    this.visibleModalPrint = false;
    this.pdfData == null;
    this.dateDebPrint = null;
    this.dateFinPrint = null;
    // this.numProfessionel = null;
  }


  onOpenModal(mode: string) {
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === 'Print') {
      if (this.dateDeb == null || this.dateFin == null ) {
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.showNotificationِCustom('PleaseSelectedAnyDate');
      } else if (this.dateFin < this.dateDeb) {
        this.CtrlAlertify.PostionLabelNotification();
        this.CtrlAlertify.showNotificationِCustom('ErrorDate');
      }
      else {
        button.setAttribute('data-target', '#ModalPrint');
        this.visibleModalPrint = true;
        this.dateDebPrint = this.dateDeb;
        this.dateFinPrint = this.dateFin;
        this.PrintReporting(this.dateDebPrint, this.dateFinPrint);
      }

    }


  }




   ///////  details dmi 

   ColumnsDetAdmissionDmi!: any[];
   GetColumnsDetailsTableDMI() {
    this.ColumnsDetAdmissionDmi = [
      { field: 'codePatient', header: this.i18nService.getString('CodePatient') || 'CodePatient', width: '3%', filter: "true", type: "text" },
      { field: 'codeAdmisson', header: this.i18nService.getString('codeAdmission') || 'codeAdmission', width: '3%', filter: "true", type: "text" },
      { field: 'nomCompeleteAr', header: this.i18nService.getString('NomLt') || 'NomLt', width: '12%', filter: "true", type: "text" },
      { field: 'dateCreate', header: this.i18nService.getString('DateArriver') || 'DateArriver', width: '9%', filter: "true", type: "text" },
      { field: 'diganosis', header: this.i18nService.getString('diganosis') || 'diganosis', width: '9%', filter: "true", type: "text" },

      { field: 'cheifComplaint', header: this.i18nService.getString('cheifComplaint') || 'cheifComplaint', width: '8%', filter: "true", type: "text" },
      { field: 'prestations', header: this.i18nService.getString('prestations') || 'prestations', width: '12%', filter: "true", type: "text" },

      ];
  }
  ColumnsGroupedCoutAdmissionDmi!: any[];
  
  GetColumnsGroupedCoutAdmissionTableDMI() {
    this.ColumnsGroupedCoutAdmissionDmi = [
      { field: '', header: '', width: '1%', filter: "true" },
      { field: 'nomIntervAr', header: this.i18nService.getString('nomIntervAr') || 'nomIntervAr', width: '10%', filter: "true", type: "text" },

      { field: 'nomInterv', header: this.i18nService.getString('nomInterv') || 'nomInterv', width: '10%', filter: "true", type: "text" },
  
    ];


  }

  dataDoctorPerformanceDMI: any[] = [];
 
 

  
  expandedRowsDMI: any = {};


  ListSpecialiteMedecin = new Array<any>();
  dataSpecialiteMedecin = new Array<any>();
  listSpecialitePushed = new Array<any>();
  selectedSpecialiteMedecin:any=null;
  GetSpecialiteMedecin() {
    this.rapportService.GetAllSpecialiteMedecin().subscribe((data: any) => {
      this.dataSpecialiteMedecin = data;
      this.listSpecialitePushed = [];
      for (let i = 0; i < this.dataSpecialiteMedecin.length; i++) {
        this.listSpecialitePushed.push({ label: this.dataSpecialiteMedecin[i].designationAr, value: this.dataSpecialiteMedecin[i].code })
      }
      this.ListSpecialiteMedecin = this.listSpecialitePushed;
    })
  }



  GetAllDoctorPerformanceBySpecialite(codeSpecialite:number) {

    if(this.selectedSpecialiteMedecin !=null){
      this.loadingData = true;
      this.rapportService.findAllByDateAndSpecialiteAndPresDent(this.dateDeb, this.dateFin,codeSpecialite,true).subscribe((data: any) => {
        this.loadingComponent.IsLoading = false;
        this.IsLoading = false; 
        this.dataDoctorPerformanceDMI = this.groupDataDMI(data);
         
        this.loadingData = false; 
      });

    }
    
  }



  GetAllDoctorPerformanceDent() {
    this.loadingData = true;
    this.rapportService.GetAllDoctorPerformanceByDate(this.dateDeb, this.dateFin,true).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false; 
      this.dataDoctorPerformanceDMI = this.groupDataDMI(data); 
      this.loadingData = false;   
    });
  }


}

