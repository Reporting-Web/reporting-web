import { Component, EventEmitter, Output, OnInit } from '@angular/core';

import { LoadingComponent } from '../../Shared/loading/loading.component';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { DatePipe } from '@angular/common';
import { CalanderTransService } from '../../Shared/CalanderService/CalanderTransService';

import { ThemeOption } from 'ngx-echarts';
import { EChartsCoreOption } from 'echarts';
import { RapportService } from '../../Shared/service/ServiceClientRapport/rapport.service';
import { Router } from '@angular/router';


interface GroupedCabinetData {
  designationArCabinet: string;
  admissionCount: number;
}


@Component({
  selector: 'app-rapport-opd',
  templateUrl: './rapport-opd.component.html',
  styleUrls: ['./rapport-opd.component.css', '.../../../src/assets/css/newStyle.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [CalanderTransService]
})
export class RapportOPDComponent implements OnInit {
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
  groupedData: GroupedCabinetData[] = [];
  dataCabinet = new Array<any>();
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

  GetColumns() {
    this.cols = [
      { field: 'designationArCabinet', header: this.i18nService.getString('Cabinet') || 'عيادة' },
      { field: 'designationLtCabinet', header: this.i18nService.getString('DesignationLt') || 'DesignationLt' },

      { field: 'count', header: this.i18nService.getString('Count') || 'عدد القبولات' } // Admission Count
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
      this.createChartOptions();
    }
  }

  dataAdmBySociete = new Array<any>();
  countPatientPerCabAndSociete374: any;
  countPatientPerCabAndSociete375: any;
  countPatientPerCabAndSociete379: any;
  countPatientPerCabAndSociete376: any;
  onRowSelect(event: any) {
    this.selectedCabinet = event.data.codeSaisieCabinet;
    this.dataAdmBySociete = new Array<any>();

    this.rapportService.GetAllAdmissionByDateAndCodeCabinet(this.dateDeb, this.dateFin, this.selectedCabinet).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;

      this.dataAdmBySociete = this.aggregateDataByCabinet(data);
      this.dataAdmBySociete.forEach((dataGrouped: any) => {
        if (dataGrouped.codeSociete == 374) {
          this.countPatientPerCabAndSociete374 = dataGrouped.count;


        } else if (dataGrouped.codeSociete == 375) {
          this.countPatientPerCabAndSociete375 = dataGrouped.count;


        } else if (dataGrouped.codeSociete == 376) {
          this.countPatientPerCabAndSociete376 = dataGrouped.count;


        } else if (dataGrouped.codeSociete == 379) {
          this.countPatientPerCabAndSociete379 = dataGrouped.count;
        }


      })
      this.createChartOptions(this.countPatientPerCabAndSociete374, this.countPatientPerCabAndSociete375, this.countPatientPerCabAndSociete376, this.countPatientPerCabAndSociete379);


    })

  }
  onRowUnselect(event: any) {
    this.createChartOptions()
    this.selectedCabinet = event.data = null;
  }


  aggregateDataByCabinet(data: any[]): any[] {
    return data.reduce((accumulator: any[], currentValue: any) => {
      const existingIndex = accumulator.findIndex(item => item.designationArSoc === currentValue.designationArSoc);

      if (existingIndex !== -1) {
        accumulator[existingIndex].count++;
      } else {
        accumulator.push({
          designationArSoc: currentValue.designationArSoc,
          designationLtSoc: currentValue.designationLtSoc,
          codeSociete: currentValue.codeSociete, //You might want to keep one, choose wisely
          count: 1,
          // Add other fields if needed from currentValue
        });
      }
      return accumulator;
    }, []);
  }

  GetAllAdmission() {
    this.rapportService.GetAllAdmissionByDate(this.dateDeb, this.dateFin).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;

      this.dataCabinet = this.aggregateData(data);
    });
  }

  aggregateData(data: any[]): any[] {
    return data.reduce((accumulator: any[], currentValue: any) => {
      const existingIndex = accumulator.findIndex(item => item.designationArCabinet === currentValue.designationArCabinet);

      if (existingIndex !== -1) {
        accumulator[existingIndex].count++;
      } else {
        accumulator.push({
          designationArCabinet: currentValue.designationArCabinet,
          designationLtCabinet: currentValue.designationLtCabinet,
          codeSaisieCabinet: currentValue.codeSaisieCabinet, //You might want to keep one, choose wisely
          count: 1,
          // Add other fields if needed from currentValue
        });
      }
      return accumulator;
    }, []);
  }


  theme: string | ThemeOption = 'dark';
  options11: EChartsCoreOption | null = null;

  createChartOptions(valeur1: any = 0, valeur2: any = 0, valeur3: any = 0, valeur4: any = 0): void {  // void return type
    this.options11 = {
      title: {
        left: '50%',
        text: ' عدد الحالات حسب الجهة و العيادة',
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
          ],
        },
      ],
    };
  }

  calculateTotal(): number {
    return this.dataCabinet.reduce((sum, item) => sum + item.count, 0);
  }

}


