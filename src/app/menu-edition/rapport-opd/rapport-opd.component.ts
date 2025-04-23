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
  dataAdmission = new Array<any>();
  ngOnInit(): void {

    this.createChartOptions();
    this.GetColumns();
    this.GetChartRoundParFamilleFacturation();


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
      this.createChartOptions();
    }
  }

  dataAdmBySociete = new Array<any>();
  countPatientPerCabAndSociete374hayet: any=0;
  countPatientPerCabAndSociete375niyebt: any=0;
  countPatientPerCabAndSociete379ER: any=0;
  countPatientPerCabAndSociete376khadamet: any=0;
  countPatientPerCabAndSocieteOther: any=0;
  onRowSelect(event: any) {
    this.selectedCabinet = event.data.codeSaisieCabinet;
    this.dataAdmBySociete = new Array<any>();

    this.rapportService.GetAllAdmissionByDateAndCodeCabinet(this.dateDeb, this.dateFin, this.selectedCabinet).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;

      this.dataAdmBySociete = this.aggregateDataByCabinet(data);
      this.dataAdmBySociete.forEach((dataGrouped: any) => {
        if (dataGrouped.codeSociete == 374) {
          this.countPatientPerCabAndSociete374hayet = dataGrouped.count;


        } else if (dataGrouped.codeSociete == 375) {
          this.countPatientPerCabAndSociete375niyebt = dataGrouped.count;


        } else if (dataGrouped.codeSociete == 376) {
          this.countPatientPerCabAndSociete376khadamet = dataGrouped.count;


       
        } else if (dataGrouped.codeSociete == 379 &&dataGrouped.codeSociete == 377  ) {
          this.countPatientPerCabAndSociete379ER = dataGrouped.count;
        } else if (dataGrouped.codeSociete ==99) 
          { this.countPatientPerCabAndSocieteOther = dataGrouped.count }

      


      })
      this.createChartOptions(this.countPatientPerCabAndSociete375niyebt , this.countPatientPerCabAndSociete374hayet,
         this.countPatientPerCabAndSociete376khadamet, this.countPatientPerCabAndSociete379ER,this.countPatientPerCabAndSocieteOther);


      
        // { value: valeur1, name: "النيابات ", },
        // { value: valeur2, name: "الهيئات القضائية", },
        // { value: valeur3, name: 'الخدمات ', },
        // { value: valeur4, name: 'الطوارئ', },
        // { value: valeur5, name: 'آخرى', },


      // console.log("event ", event.data);
      this.GetAllDetailsAdmissionParCabinet(this.selectedCabinet, event.data.count, event.data.designationArCabinet);
    })

    this.dateDeb, this.dateFin, this.selectedCabinet

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

      this.dataAdmission = this.aggregateData(data);
      this.dataAdmBySociete = new Array<any>();
      this.dataAdmBySociete = this.aggregateDataParSociete(data);
      this.dataAdmBySociete.forEach((dataGrouped: any) => {
        if (dataGrouped.codeSociete == 374) {
          this.countPatientPerCabAndSociete374hayet = dataGrouped.count;


        } else if (dataGrouped.codeSociete == 375) {
          this.countPatientPerCabAndSociete375niyebt = dataGrouped.count;


        } else if (dataGrouped.codeSociete == 376) {
          this.countPatientPerCabAndSociete376khadamet = dataGrouped.count;


        } else if (dataGrouped.codeSociete == 379 &&dataGrouped.codeSociete == 377  ) {
          this.countPatientPerCabAndSociete379ER = dataGrouped.count;
        } else if (dataGrouped.codeSociete != 374 && dataGrouped.codeSociete != 375 && dataGrouped.codeSociete != 376 
          && dataGrouped.codeSociete != 379) 
          { this.countPatientPerCabAndSocieteOther = dataGrouped.count }

      })
      this.createChartOptions(this.countPatientPerCabAndSociete375niyebt , this.countPatientPerCabAndSociete374hayet, 
        this.countPatientPerCabAndSociete376khadamet, this.countPatientPerCabAndSociete379ER,this.countPatientPerCabAndSocieteOther);


    });
  }

  aggregateData(data: any[]): any[] {
    return data.reduce((accumulator: any[], currentValue: any) => {
      const existingIndex = accumulator.findIndex(item => item.designationArCabinet === currentValue.designationArCabinet);

      if (existingIndex !== -1) {
        accumulator[existingIndex].count++;
        accumulator[existingIndex].coutFactureTotal = parseFloat((accumulator[existingIndex].coutFactureTotal + currentValue.coutFacture).toFixed(3));
      } else {
        accumulator.push({
          designationArCabinet: currentValue.designationArCabinet,
          designationLtCabinet: currentValue.designationLtCabinet,
          codeSaisieCabinet: currentValue.codeSaisieCabinet, //You might want to keep one, choose wisely
          count: 1,
          coutFactureTotal: parseFloat((currentValue.coutFacture).toFixed(3)),
          // Add other fields if needed from currentValue
        });
      }
      return accumulator;
    }, []);
  }



  aggregateDataParSociete(data: any[]): any[] {
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
  theme: string | ThemeOption = 'dark';
  options11: EChartsCoreOption | null = null;

  createChartOptions(valeur1: any = 0, valeur2: any = 0, valeur3: any = 0, valeur4: any = 0, valeur5: any = 0): void {  // void return type
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
            { value: valeur5, name: 'آخرى', },
          ],
        },
      ],
    };
  }

  calculateTotal(): number {
    return this.dataAdmission.reduce((sum, item) => sum + item.count, 0);
  }

  dataDetailsAdmissionTemp: any[] = [];
  GetAllDetailsAdmissionParCabinet(codeCabinet: number, nbrePatient: any, designationCabinet: any) {
    this.rapportService.GetAllDetailsAdmissionByDateAndCodeCabinet(this.dateDeb, this.dateFin, codeCabinet).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataDetailsAdmissionTemp = this.GroupedDetailsAdmission(data); // Assign the raw data here



      this.GetChartRoundParFamilleFacturation(nbrePatient, designationCabinet); // Call the chart function separately

      // this.dataDetailsAdmissionTemp = this.GetChartRoundParFamilleFacturation(data);


    });
  }

  GroupedDetailsAdmission(data: any[]): any[] {
    return data.reduce((accumulator: any[], currentValue: any) => {
      const existingIndex = accumulator.findIndex(item => item.codeSaisieAdmission === currentValue.codeSaisieAdmission);

      if (existingIndex !== -1) {
        accumulator[existingIndex].count++;
        accumulator[existingIndex].montantMasterPL = parseFloat((accumulator[existingIndex].montantMasterPL + currentValue.montantMasterPL).toFixed(3));
      } else {
        accumulator.push({
          codeSaisieAdmission: currentValue.codeSaisieAdmission,
          count: 1,
          codeFamilleFacturation: currentValue.codeFamilleFacturation,
          designationArFamFact: currentValue.designationArFamFact,
          designationLtFamFact: currentValue.designationLtFamFact,
          montantMasterPL: currentValue.montantMasterPL,


        });
      }
      return accumulator;
    }, []);


  }


  option33: EChartsCoreOption | null = null;



  GetChartRoundParFamilleFacturation(nbrePatient: any = " ", designationCabinet: any = " "): void {  // void return type
    const SousfamilyCounts: { [Sousfamily: string]: number } = {};
    this.dataDetailsAdmissionTemp.forEach(item => {
      const Sousfamily = item.designationArFamFact;


      SousfamilyCounts[Sousfamily] = parseFloat(((SousfamilyCounts[Sousfamily] || 0) + (item.montantMasterPL)).toFixed(3));
    });


    // Aggregate family counts, grouping those under 20 into "Other"
    const aggregatedSousFamilyCounts: { [Sousfamily: string]: number } = {};
    let otherCount = 0;
    for (const Sousfamily in SousfamilyCounts) {
      if (SousfamilyCounts[Sousfamily] >= 1) {
        aggregatedSousFamilyCounts[Sousfamily] = SousfamilyCounts[Sousfamily];
      } else {
        otherCount += SousfamilyCounts[Sousfamily];
      }
    }
    if (otherCount > 0) {
      aggregatedSousFamilyCounts["Other"] = otherCount;
    }


    // Find the most frequent family (from aggregated data)
    let mostFrequentSousFamily = '';
    let maxSousFamilyCount = 0;
    for (const Sousfamily in aggregatedSousFamilyCounts) {
      if (aggregatedSousFamilyCounts[Sousfamily] > maxSousFamilyCount) {
        maxSousFamilyCount = aggregatedSousFamilyCounts[Sousfamily];
        mostFrequentSousFamily = Sousfamily;
      }
    }

    //prepare data for the inner ring
    const detailsCounts: { [prestation: string]: number } = {};
    this.dataDetailsAdmissionTemp.forEach(item => {
      if (item.designationArFamFact === mostFrequentSousFamily) {
        detailsCounts[item.designationArFamFact] = (detailsCounts[item.designationArFamFact] || 0) + parseFloat((item.montantMasterPL).toFixed(3));
      }
    });

    //Limit details to top 10, or all if fewer than 10 exist, and then add "Other"
    const sortedDetails = Object.entries(detailsCounts).sort(([, a], [, b]) => b - a);
    let topDetails = sortedDetails.slice(0, Math.min(1, sortedDetails.length)); //Take top 10 or all available
    let otherDetailsCount = 0;
    if (sortedDetails.length > 1) { //Only add "other" if there are more than 10 items.
      for (let i = 1; i < sortedDetails.length; i++) {
        otherDetailsCount += sortedDetails[i][1];
      }
    }

    let detailsData = topDetails.map(([name, value]) => ({ name, value }));
    if (otherDetailsCount > 0) {
      detailsData.push({ name: "Other", value: otherDetailsCount });
    }


    // Prepare data for outer ring
    const SousfamilyData = Object.entries(aggregatedSousFamilyCounts).map(([name, value]) => ({ name, value }));


    this.option33 = {

      title: {
        text: ' تصنيف ' + nbrePatient + ' ملف دخول لعيادة ' + designationCabinet + '  حسب نوع الخدمة',   // تصنيف 45 ملف دخول للعيادة رقم 1 حسب نوع الخدمة
        // subtext: '纯属虚构',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        //removed hardcoded legend data.
        type: 'scroll',  //Add scroll for longer lists
        orient: 'vertical',
        right: 10,
        top: 20,
        data: Object.keys(aggregatedSousFamilyCounts) //Dynamic legend from data
      },
      series: [
        {
          name: 'التصنيف', //More descriptive name
          type: 'pie',
          radius: ['45%', '60%'],
          labelLine: {
            length: 20
          },
          // width: '20',
          fontSize: 12,
          label: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}}  {c} :  {per|{d}%}  ',
            backgroundColor: '#F6F8FC',
            borderColor: '#8C8D8E',
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: '#6E7079',
                lineHeight: 22,
                align: 'center'
              },
              c: {
                color: '#000000',
                align: 'center'
              },
              hr: {
                borderColor: '#8C8D8E',
                width: '100%',
                borderWidth: 1,
                height: 0
              },
              b: {
                color: '#000000',
                fontSize: 16,
                fontWeight: 'bold',
                lineHeight: 33
              },
              per: {
                color: '#00ff00',
                backgroundColor: '#4C5058',
                padding: [3, 4],
                borderRadius: 4
              }
            }
          },
          data: SousfamilyData //Use dynamic data here
        }
      ]
    };
  }



}


