 
import { Component, OnInit } from '@angular/core';

import { LoadingComponent } from '../../Shared/loading/loading.component';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { DatePipe } from '@angular/common';
import { CalanderTransService } from '../../Shared/CalanderService/CalanderTransService';
import { RapportService } from '../../Shared/service/ServiceClientRapport/rapport.service';
 

interface GroupedCabinetData {
  designationArCabinet: string;
  admissionCount: number;
}
interface CabinetData {
  code: number;
  codeSaisieAdmission: string;
  codeSaisieCabinet: string;
  designationArCabinet: string;
  designationLtCabinet: string;
  designationLtSpec: string;
  designationArSpec: string;
  codeCabinet: number;
  codeSpecialite: number;
}

@Component({
  selector: 'app-rapport-opd',
  templateUrl: './rapport-opd.component.html',
  styleUrls: ['./rapport-opd.component.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [ CalanderTransService]
})
export class RapportOPDComponent implements OnInit {
  constructor( private rapportService : RapportService, private loadingComponent: LoadingComponent,
      public i18nService: I18nService,private datePipe: DatePipe, private CtrlAlertify: ControlServiceAlertify
      , private calandTrans: CalanderTransService)
       {  this.calandTrans.setLangAR(); }


    IsLoading = false;
    Blocked: any = false;
    cols!: any[];
    dateDeb: any = null;;
  dateFin: any = null;
  first = 0;
  code!: number | null;
  selectedCabinet!: any;
  groupedData: GroupedCabinetData[] = [];
  dataCabinet = new Array<any>(); 
  ngOnInit(): void {
    // this.createChartOptions(); 

this. GetColumns();
   

  }

  GetColumns() {
    this.cols = [
      { field: 'codeSaisie', header: this.i18nService.getString('CodeSaisie') || 'CodeSaisie', width: '20%', filter: "true" },
      { field: 'designationAr', header: this.i18nService.getString('Designation') || 'Designation', width: '20%', filter: "true" },
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
    this.GetAllAdmission();
    this.groupedData = this.groupByAndCount(this.dataCabinet);
    this.dataCabinet = this.filterByDate(this.dataCabinet);
}

  
  onRowSelect(event: any) {
    this.code = event.data.code;
 
    console.log('vtData : ', event);
  }
  onRowUnselect(event: any) {
    console.log('row unselect : ', event);
    this.selectedCabinet = '';
    this.code = event.data = null;
  }

  GetAllAdmission() {
    this.rapportService.GetAllAdmissionBySpecialite(64).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataCabinet = data;
      this.onRowUnselect(event);
    })
  }

  groupByAndCount(data: CabinetData[]): GroupedCabinetData[] {
    const grouped = data.reduce((acc: any, curr) => {
      const key = curr.designationArCabinet;
      if (!acc[key]) {
        acc[key] = { designationArCabinet: key, admissionCount: 0 };
      }
      acc[key].admissionCount++;
      return acc;
    }, {});

    return Object.values(grouped);
  }

   filterByDate(data: CabinetData[]): CabinetData[] {
    if (!this.dateDeb || !this.dateFin) return data;

    const start = new Date(this.dateDeb);
    const end = new Date(this.dateFin);
    end.setDate(end.getDate() +1); //Include the end date

    return data.filter(item => {
      const admissionDate = new Date(item.codeSaisieAdmission.substring(2,10)); //Extract date, adjust substring if needed
      return admissionDate >= start && admissionDate <= end;
    });
  }
   
}


