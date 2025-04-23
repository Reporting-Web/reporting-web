

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


interface LabDataItem {
  code: number;
  codePrestation: number;
  designationArPres: string;
  designationLtPres: string;
  codePatient: string;
  codeInterv: number;
  nomIntervAr: string;
  codeSociete: number;
  designationLtSoc: string;
  designationArSoc: string;
  dateCreate: string;
  codeSousFamille: number;
  designationArSousFam: string;
  designationLtSousFam: string;
  codeFamPres: number;
  desigtionArFam: string;
  designationLtFam: string;
  codeAdmission: string;
  coutFacture: number;
  count: any;
  coutFactureTotal: any;
}

@Component({
  selector: 'app-rapport-labo',
  templateUrl: './rapport-labo.component.html',
  styleUrls: ['./rapport-labo.component.css', '.../../../src/assets/css/newStyle.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [CalanderTransService]
})
export class RapportLaboComponent implements OnInit {
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
  valeurUnderTestLabo = "";

  ngOnInit(): void {
    this.createChartOptions11();
    this.createChartOptions12(this.dataMedecin);
    this.GetColumns();
    this.GetColumnsMedecin();
    this.valeurUnderTestLabo = sessionStorage.getItem("underLab") ?? "100";

  }

  @Output() closed: EventEmitter<string> = new EventEmitter();
  closeThisComponent() {
    const parentUrl = this.router.url.split('/').slice(0, -1).join('/');
    this.closed.emit(parentUrl);
    this.router.navigate([parentUrl]);
  }

  GetColumns() {
    this.cols = [
      { field: 'designationArPres', header: this.i18nService.getString('DesignationAr') || 'DesignationAr', type: 'text', width: '22%' },
      { field: 'designationLtPres', header: this.i18nService.getString('DesignationLt') || 'DesignationLt', type: 'text', width: '16%' },
      { field: 'countPatient', header: this.i18nService.getString('countPatient') || ' countPatient', type: 'text', width: '10%' },// patient Count
      { field: 'count', header: this.i18nService.getString('CountLab') || 'CountLab', type: 'text', width: '10%' }, // exam Count
      { field: 'coutFactureTotal', header: this.i18nService.getString('Cout') || 'التكلفة', type: 'text', width: '10%' } // Admission Count

    ];
  }


  GetColumnsMedecin() {
    this.colsMedecin = [
      { field: 'nomIntervAr', header: this.i18nService.getString('NomMedecin') || 'NomMedecin', type: 'text', width: '70%' },
      { field: 'count', header: this.i18nService.getString('CountLab') || 'CountLab', type: 'text', width: '30%' }, // exam Count
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
      this.GetAllDdeExamenLab();
    }
  }
  theme: string | ThemeOption = 'light';
  options11: EChartsCoreOption | null = null;

  createChartOptions11(valeur1: any = 0, valeur2: any = 0, valeur3: any = 0, valeur4: any = 0, totalAdmission: any = 0, valeur5: any = 0): void {  // void return type
    this.options11 = {
      title: {
        left: '50%',
        text: ' عدد التحاليل حسب الجهة ',
        subtext: 'مجموع الحالات : ' + totalAdmission,
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
  GroupedParMedecin: EChartsCoreOption | null = null;
  createChartOptions12(data: Array<any>): void {  // void return type
    let varUnderTest = parseInt(localStorage.getItem("underLab") ?? "100");
    const familyCounts: { [family: string]: number } = {};
    data.forEach(item => {
      const family = item.nomIntervAr;
      familyCounts[family] = (familyCounts[family] || 0) + item.count;
    });
    // Aggregate family counts, grouping those under 20 into "Other"
    const aggregatedFamilyCounts: { [family: string]: number } = {};
    let otherCount = 0;
    for (const family in familyCounts) {
      if (familyCounts[family] >= varUnderTest) {
        aggregatedFamilyCounts[family] = familyCounts[family];
      } else {
        otherCount += familyCounts[family];
      }
    }
    if (otherCount > 0) {
      aggregatedFamilyCounts["Other"] = otherCount;
    }
    // Find the most frequent family (from aggregated data)
    let mostFrequentFamily = '';
    let maxFamilyCount = 0;
    for (const family in aggregatedFamilyCounts) {
      if (aggregatedFamilyCounts[family] > maxFamilyCount) {
        maxFamilyCount = aggregatedFamilyCounts[family];
        mostFrequentFamily = family;
      }
    }
    //prepare data for the inner ring
    const detailsCounts: { [prestation: string]: number } = {};
    data.forEach(item => {
      if (item.nomIntervAr === mostFrequentFamily) {
        detailsCounts[item.designationArPres] = (detailsCounts[item.designationArPres] || 0) + item.count;
      }
    });
    //Limit details to top 10, or all if fewer than 10 exist, and then add "Other"
    const sortedDetails = Object.entries(detailsCounts).sort(([, a], [, b]) => b - a);
    let topDetails = sortedDetails.slice(0, Math.min(varUnderTest, sortedDetails.length)); //Take top 10 or all available
    let otherDetailsCount = 0;
    if (sortedDetails.length > varUnderTest) { //Only add "other" if there are more than 10 items.
      for (let i = varUnderTest; i < sortedDetails.length; i++) {
        otherDetailsCount += sortedDetails[i][1];
      }
    }
    let detailsData = topDetails.map(([name, value]) => ({ name, value }));
    if (otherDetailsCount > 0) {
      detailsData.push({ name: "Other", value: otherDetailsCount });
    }
    // Prepare data for outer ring
    const familyData = Object.entries(aggregatedFamilyCounts).map(([name, value]) => ({ name, value }));
    this.GroupedParMedecin = {
      title: {
        left: '50%',
        text: ' مجموع الحالات حسب الطبيب ',
        // subtext: 'مجموع الحالات : ' ,
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
        alignItems: 'center',
        bottom: 10,
        data: Object.keys(aggregatedFamilyCounts), // ["النيابات ", "الهيئات القضائية", 'الخدمات ', 'الطوارئ'],
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
          data: familyData
        },
      ],
    };
  }

  dataDdeExamenLab = new Array<any>();
  dataGroupedBySociete = new Array<any>();
  countPatientPerCabAndSociete374hayet: any = 0;
  countPatientPerCabAndSociete375niyebet: any = 0;
  countPatientPerCabAndSociete379er: any = 0;
  countPatientPerCabAndSociete376khadamet: any = 0;
  countPatientPerCabAndSocieteOther: any = 0;

  PatientCounted: any;
  dataGroupedByMedecin = new Array<any>();

  GetAllDdeExamenLab() {
    this.rapportService.GetAllDdeExamenLabByDate(this.dateDeb, this.dateFin).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;
      this.dataDdeExamenLab = this.aggregateData(data);
      // this.ChartBarCout(this.dataDdeExamenLab);
      this.ChartBarCout(data);
      this.dataGroupedBySociete = this.GroupedDataBySociete(data);
      this.dataGroupedByMedecin = this.GroupedDataByMedecin(data);
      const patientCountMap = this.createPatientCountMap(this.aggregateDataPatient(data));
      this.dataDdeExamenLab.forEach(group => {
        group.countPatient = patientCountMap[group.designationArPres] || 0; // Handle cases where a prestation might not have patients
      });

      this.dataGroupedBySociete.forEach((dataGrouped: any) => {
        switch (dataGrouped.codeSociete) {
          case 374:
            this.countPatientPerCabAndSociete374hayet = dataGrouped.count;
            break;
          case 375:
            this.countPatientPerCabAndSociete375niyebet = dataGrouped.count;
            break;
          case 376:
            this.countPatientPerCabAndSociete376khadamet = dataGrouped.count;
            break;
          case 377:
            this.countPatientPerCabAndSociete379er = dataGrouped.count; //Corrected to 377
            break;
          case 379:
            this.countPatientPerCabAndSociete379er = dataGrouped.count; //Added this case
            break;
          case 99:
            this.countPatientPerCabAndSocieteOther = dataGrouped.count;
            break;
        }
      });


      this.createChartOptions11(this.countPatientPerCabAndSociete374hayet, this.countPatientPerCabAndSociete375niyebet,
        this.countPatientPerCabAndSociete376khadamet, this.countPatientPerCabAndSociete379er,
        (this.countPatientPerCabAndSociete374hayet +
          this.countPatientPerCabAndSociete375niyebet +
          this.countPatientPerCabAndSociete376khadamet +
          this.countPatientPerCabAndSociete379er +
          this.countPatientPerCabAndSocieteOther)
        , this.countPatientPerCabAndSocieteOther
      );

      this.createChartOptions12(this.dataGroupedByMedecin);
      this.GetChartRoundParSousFamille();
      this.GetDataComplex(data);

    });
  }

  aggregateData(data: any[]): any[] {
    return data.reduce((accumulator: any[], currentValue: any) => {
      const existingIndex = accumulator.findIndex(item => item.designationArPres === currentValue.designationArPres);
      if (existingIndex !== -1) {
        accumulator[existingIndex].count++;
        accumulator[existingIndex].coutFactureTotal = parseFloat((accumulator[existingIndex].coutFactureTotal + currentValue.coutFacture).toFixed(3));

      } else {
        accumulator.push({
          designationArPres: currentValue.designationArPres,
          designationLtPres: currentValue.designationLtPres,
          count: 1,
          codeSociete: currentValue.codeSociete,
          codeFamPres: currentValue.codeFamPres,
          desigtionArFam: currentValue.desigtionArFam,
          designationArSousFam: currentValue.designationArSousFam,
          codePrestation: currentValue.codePrestation,
          designationArSoc: currentValue.designationArSoc,
          designationLtSoc: currentValue.designationLtSoc,
          coutFactureTotal: parseFloat((currentValue.coutFacture).toFixed(3)),
        });
      }
      return accumulator;
    }, []);
  }

  GroupedDataBySociete(data: any[]): any[] {
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
        });
      }
      return accumulator;
    }, []);
  }



  createPatientCountMap(patientData: any[]): { [key: string]: number } {
    const patientCountMap: { [key: string]: number } = {};
    patientData.forEach(item => {
      patientCountMap[item.designationArPres] = item.count;
    });
    return patientCountMap;
  }
  aggregateDataPatient(data: any[]): any[] {
    const patientsPerPres: { [key: string]: Set<string> } = {}; // Use a dictionary of Sets
    //First pass: Build the dictionary of patients per prestation
    data.forEach(item => {
      const presKey = item.designationArPres;
      if (!patientsPerPres[presKey]) {
        patientsPerPres[presKey] = new Set();
      }
      patientsPerPres[presKey].add(item.codePatient);
    });
    //Second pass: Create the resulting array
    const result: any[] = [];
    for (const presKey in patientsPerPres) {
      if (patientsPerPres.hasOwnProperty(presKey)) {
        result.push({
          designationArPres: presKey,
          // designationLtPres:  //Add other properties as needed from your original data.
          count: patientsPerPres[presKey].size, // count of unique patients
        });
      }
    }
    return result;
  }
  calculateTotal(): number {
    return this.dataDdeExamenLab.reduce((sum, item) => sum + item.countPatient, 0);
  }
  calculateTotalExam(): number {
    return this.dataDdeExamenLab.reduce((sum, item) => sum + item.count, 0);
  }
  calculateTotalCout(): number {
    return this.dataDdeExamenLab.reduce((sum, item) => sum + item.coutFactureTotal, 0);
  }


  calculateTotalMedecin(): number {
    return this.dataMedecin.reduce((sum, item) => sum + item.count, 0);
  }
  selectedExamen!: any;
  selectedMedecin!: any;

  onRowSelect(event: any) {
    this.designationArExam = event.data.designationArPres;
    this.GetAllDdeForMedecin(event.data.codePrestation);
  }

  onRowUnselect(event: any) {
    this.selectedExamen = event.data = null;
    this.designationArExam = "";
    this.dataMedecin = new Array<any>();
  }

  onRowSelectMedecin(event: any) { }

  onRowUnselectMedecin(event: any) {
    this.selectedMedecin = event.data = null;
  }


  ChartParFamille: EChartsCoreOption | null = null;


  // GetChartRoundParFamille() {
  //   const familyCounts: { [family: string]: number } = {};
  //   this.dataDdeExamenLab.forEach(item => {
  //     const family = item.desigtionArFam;
  //     familyCounts[family] = (familyCounts[family] || 0) + item.count;
  //   });
  //   // Aggregate family counts, grouping those under 20 into "Other"
  //   const aggregatedFamilyCounts: { [family: string]: number } = {};
  //   let otherCount = 0;
  //   for (const family in familyCounts) {
  //     if (familyCounts[family] >= 1) {
  //       aggregatedFamilyCounts[family] = familyCounts[family];
  //     } else {
  //       otherCount += familyCounts[family];
  //     }
  //   }
  //   if (otherCount > 0) {
  //     aggregatedFamilyCounts["Other"] = otherCount;
  //   }
  //   // Find the most frequent family (from aggregated data)
  //   let mostFrequentFamily = '';
  //   let maxFamilyCount = 0;
  //   for (const family in aggregatedFamilyCounts) {
  //     if (aggregatedFamilyCounts[family] > maxFamilyCount) {
  //       maxFamilyCount = aggregatedFamilyCounts[family];
  //       mostFrequentFamily = family;
  //     }
  //   }
  //   //prepare data for the inner ring
  //   const detailsCounts: { [prestation: string]: number } = {};
  //   this.dataDdeExamenLab.forEach(item => {
  //     if (item.desigtionArFam === mostFrequentFamily) {
  //       detailsCounts[item.designationArPres] = (detailsCounts[item.designationArPres] || 0) + item.count;
  //     }
  //   });
  //   //Limit details to top 10, or all if fewer than 10 exist, and then add "Other"
  //   const sortedDetails = Object.entries(detailsCounts).sort(([, a], [, b]) => b - a);
  //   let topDetails = sortedDetails.slice(0, Math.min(7, sortedDetails.length)); //Take top 10 or all available
  //   let otherDetailsCount = 0;
  //   if (sortedDetails.length > 7) { //Only add "other" if there are more than 10 items.
  //     for (let i = 7; i < sortedDetails.length; i++) {
  //       otherDetailsCount += sortedDetails[i][1];
  //     }
  //   }
  //   let detailsData = topDetails.map(([name, value]) => ({ name, value }));
  //   if (otherDetailsCount > 0) {
  //     detailsData.push({ name: "Other", value: otherDetailsCount });
  //   }
  //   // Prepare data for outer ring
  //   const familyData = Object.entries(aggregatedFamilyCounts).map(([name, value]) => ({ name, value }));
  //   this.ChartParFamille = {
  //     tooltip: {
  //       trigger: 'item',
  //       formatter: '{a} <br/>{b}: {c} ({d}%)'
  //     },
  //     legend: {
  //       // name: 'Family List',
  //       // type: 'scroll',
  //       // orient: 'horizontal',  
  //       // bottom: 10,       
  //       // left: 'center', 
  //       align: 'auto',
  //       bottom: 10,
  //       data: Object.keys(aggregatedFamilyCounts) //Dynamic legend from data
  //     },
  //     series: [
  //       {
  //         name: 'Family of Tests', // More descriptive name
  //         type: 'pie',
  //         selectedMode: 'single',
  //         radius: [0, '40%'],
  //         label: {
  //           position: 'inner',
  //           fontSize: 12,
  //           borderColor: '#ffffff',
  //           color: '#000000',
  //           fontWeight: 'bold'
  //         },
  //         labelLine: {
  //           show: false
  //         },
  //         data: familyData //Use dynamic data here
  //       },
  //       {
  //         name: 'Individual Tests', //More descriptive name
  //         type: 'pie',
  //         radius: ['45%', '60%'],
  //         labelLine: {
  //           length: 20
  //         },
  //         width: '20',
  //         fontSize: 12,
  //         label: {
  //           formatter: '   {a|{a}}{abg|}\n{hr|}\n   {per|{d}%} : {c} {b|{b}}  ',
  //           backgroundColor: '#F6F8FC',
  //           borderColor: '#8C8D8E',
  //           borderWidth: 1,
  //           borderRadius: 4,
  //           fontSize: 13,
  //           rich: {
  //             a: {
  //               color: '#6E7079',
  //               lineHeight: 22,
  //               align: 'center'
  //             },
  //             c: {
  //               color: '#000000',
  //               align: 'center'
  //             },
  //             hr: {
  //               borderColor: '#8C8D8E',
  //               width: '100%',
  //               borderWidth: 1,
  //               height: 0
  //             },
  //             b: {
  //               color: '#000000',
  //               fontSize: 16,
  //               fontWeight: 'bold',
  //               lineHeight: 33
  //             },
  //             per: {
  //               color: '#00ff00',
  //               backgroundColor: '#4C5058',
  //               padding: [3, 4],
  //               borderRadius: 4
  //             }
  //           }
  //         },
  //         data: detailsData //Use dynamic data here
  //       }
  //     ]
  //   };
  // }


  GetChartRoundParSousFamille() {
    const SousfamilyCounts: { [Sousfamily: string]: number } = {};
    this.dataDdeExamenLab.forEach(item => {
      const Sousfamily = item.designationArSousFam;
      SousfamilyCounts[Sousfamily] = (SousfamilyCounts[Sousfamily] || 0) + item.count;
    });
    // Aggregate family counts, grouping those under 20 into "Other"
    const aggregatedSousFamilyCounts: { [Sousfamily: string]: number } = {};
    let otherCount = 0;
    for (const Sousfamily in SousfamilyCounts) {
      if (SousfamilyCounts[Sousfamily] >= 5) {
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
    this.dataDdeExamenLab.forEach(item => {
      if (item.designationArSousFam === mostFrequentSousFamily) {
        detailsCounts[item.designationArSousFam] = (detailsCounts[item.designationArSousFam] || 0) + item.count;
      }
    });
    //Limit details to top 10, or all if fewer than 10 exist, and then add "Other"
    const sortedDetails = Object.entries(detailsCounts).sort(([, a], [, b]) => b - a);
    let topDetails = sortedDetails.slice(0, Math.min(7, sortedDetails.length)); //Take top 10 or all available
    let otherDetailsCount = 0;
    if (sortedDetails.length > 7) { //Only add "other" if there are more than 10 items.
      for (let i = 7; i < sortedDetails.length; i++) {
        otherDetailsCount += sortedDetails[i][1];
      }
    }
    let detailsData = topDetails.map(([name, value]) => ({ name, value }));
    if (otherDetailsCount > 0) {
      detailsData.push({ name: "Other", value: otherDetailsCount });
    }
    // Prepare data for outer ring
    const SousfamilyData = Object.entries(aggregatedSousFamilyCounts).map(([name, value]) => ({ name, value }));
    this.ChartParFamille = {
      title: {
        text: 'حسب الفئة',
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
          name: 'فئة الاختبارات', //More descriptive name
          type: 'pie',
          radius: ['45%', '60%'],
          labelLine: {
            length: 20
          },
          // width: '20',
          fontSize: 12,
          label: {
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {per|{d}%} :  {c} {b|{b}}   ',
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

  optionsChartComplex: EChartsCoreOption | null = null;
  GetDataComplex(data: any[]) {
    const nameList: string[] = [];
    const seriesData: { name: string; value: number }[] = [];
    // const prestationCounts: { [key: string]: number } = {};
    const prestationCounts = new Map<number, { designation: string; count: number }>();
    // Extract unique designations and counts
    data.forEach(item => {
      if (item && typeof item.designationArPres === 'string' && typeof item.codePrestation === 'number') {
        const designation = item.designationArPres;
        const codePrestation = item.codePrestation;
        //Check if codePrestation already exists in the map
        if (prestationCounts.has(codePrestation)) {
          prestationCounts.get(codePrestation)!.count++;
        } else {
          prestationCounts.set(codePrestation, { designation: designation, count: 1 });
        }
        nameList.push(designation); // Add to nameList
      } else {
        console.warn("Missing or invalid data item or 'designationArPres' or 'codePrestation':", item);
      }
    });
    const uniqueCodePrest = [...prestationCounts.keys()];
    uniqueCodePrest.forEach(code => {
      const { designation, count } = prestationCounts.get(code)!;
      seriesData.push({ name: designation, value: count });
    });
    //Remove duplicates from nameList
    const uniqueNameList = [...new Set(nameList)];
    this.optionsChartComplex = {
      title: {
        text: 'List Examen',
        subtext: 'Based on provided data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: uniqueNameList
      },
      series: [
        {
          name: 'عدد الفحوصات', // Changed name to be more descriptive
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }


  dataMedecin = new Array<any>();
  GroupedDataByMedecin(data: any[]): any[] {
    return data.reduce((accumulator: any[], currentValue: any) => {
      const existingIndex = accumulator.findIndex(item => item.nomIntervAr === currentValue.nomIntervAr);
      if (existingIndex !== -1) {
        accumulator[existingIndex].count++;
      } else {
        accumulator.push({
          nomIntervAr: currentValue.nomIntervAr,
          count: 1,
        });
      }
      return accumulator;
    }, []);
  }

  GetAllDdeForMedecin(codePrestation: number) {
    this.loadingData = true;
    this.rapportService.GetAllDdeExamenLabByDateAndCodePrestation(this.dateDeb, this.dateFin, codePrestation).subscribe((data: any) => {
      this.dataMedecin = this.GroupedDataByMedecin(data);
      this.loadingData = false;
    }
    )
  }

  designationArExam = "";
  loadingData = false;


  PostLocalSotrageValeur() {
    localStorage.setItem("underLab", this.valeurUnderTestLabo.toString());
    this.CtrlAlertify.PostionLabelNotification();
    this.CtrlAlertify.showNotificationِCustomOK("ReloadPage");
  }

  chartBar: EChartsCoreOption | null = null; 
  ChartBarCout(data: any) { 
    const groupedData: { [society: string]: { [subfamily: string]: number } } = {};
    data.forEach((item: any) => {
      const society = item.designationArSoc;
      const subfamily = item.designationArSousFam;
      const cost = item.coutFacture;

      if (!groupedData[society]) {
        groupedData[society] = {};
      }
      if (!groupedData[society][subfamily]) {
        groupedData[society][subfamily] = 0;
      }
      groupedData[society][subfamily] += cost;
    });
    // 2. Prepare data for ECharts
    const legendData = Object.keys(groupedData); // Society names
    let xAxisData: string[] = []; // Explicit type declaration!
    const seriesData: any[] = []; // Added explicit type for seriesData

    for (const society in groupedData) {
      const subfamilyCosts = groupedData[society];
      const seriesItem: any = {
        name: society, // Society name
        type: 'bar',
        data: []
      };


      for (const subfamily in subfamilyCosts) {
        if (!xAxisData.includes(subfamily)) {
          xAxisData.push(subfamily);
        }
        const cost = subfamilyCosts[subfamily] || 0;
        seriesItem.data.push(cost);
      }
      seriesData.push(seriesItem);
    }


    type BarLabelOption = NonNullable<echarts.BarSeriesOption['label']>;
    const labelOption: BarLabelOption = {
      show: true,
      position: 'insideBottom',
      distance: 15,
      align: 'left',
      verticalAlign: 'middle',
      rotate: 90,
      formatter: '{c}  {name|{a}}',
      fontSize: 12,
      rich: {
        name: {}
      }
    };

    this.chartBar = {
      title: {
        text: 'التكلفة حسب الجهة وفئة التحليل',
        subtext: 'Based on Provided Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: legendData // Society names
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: xAxisData, // Subfamily names
          scrollMarginRight: 20, // Adjust as needed
          axisLabel: {
            interval: 0, // Show all labels (might need adjustment for very long labels)
            // rotate: 45 // Rotate labels to save space
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: seriesData // Data for each society
    };

  }


}


