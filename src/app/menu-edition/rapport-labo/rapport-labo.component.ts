
import { Component, OnInit } from '@angular/core';

import { LoadingComponent } from '../../Shared/loading/loading.component';
import { ControlServiceAlertify } from '../../Shared/Control/ControlRow';
import { I18nService } from '../../Shared/i18n/i18n.service';
import { DatePipe } from '@angular/common';
import { CalanderTransService } from '../../Shared/CalanderService/CalanderTransService';
import { RapportService } from '../../Shared/service/ServiceClientRapport/rapport.service';
import { ThemeOption } from 'ngx-echarts';
import { color, EChartsCoreOption, EChartsOption } from 'echarts';
import * as echarts from 'echarts';




interface DataItem {
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
}
@Component({
  selector: 'app-rapport-labo',
  templateUrl: './rapport-labo.component.html',
  styleUrls: ['./rapport-labo.component.css', '.../../../src/assets/css/newStyle.css', '.../../../src/assets/css/StyleApplication.css'],
  providers: [CalanderTransService]
})
export class RapportLaboComponent implements OnInit {
  constructor(private rapportService: RapportService, private loadingComponent: LoadingComponent,
    public i18nService: I18nService, private datePipe: DatePipe, private CtrlAlertify: ControlServiceAlertify
    , private calandTrans: CalanderTransService) { this.calandTrans.setLangAR(); }


  IsLoading = false;
  Blocked: any = false;
  cols!: any[];
  dateDeb: any = null;;
  dateFin: any = null;
  first = 0;
  ngOnInit(): void {

    this.createChartOptions();
    this.GetColumns();



  }

  GetColumns() {
    this.cols = [
      { field: 'designationArPres', header: this.i18nService.getString('Cabinet') || 'عيادة', type: 'text', width: '16%' },
      { field: 'designationLtPres', header: this.i18nService.getString('DesignationLt') || 'DesignationLt', type: 'text', width: '16%' },
      { field: 'countPatient', header: this.i18nService.getString('countPatient') || ' عدد المرضى', type: 'text', width: '16%' },// patient Count

      { field: 'count', header: this.i18nService.getString('Count') || 'عدد التحاليل', type: 'text', width: '16%' }, // exam Count
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
      // this.createChartOptions();

    }
  }


  theme: string | ThemeOption = 'dark';
  options11: EChartsCoreOption | null = null;

  createChartOptions(valeur1: any = 0, valeur2: any = 0, valeur3: any = 0, valeur4: any = 0,totalAdmission:any=0): void {  // void return type
    this.options11 = {
      title: {
        left: '50%',
        text: ' عدد الحالات حسب الجهة ',
        subtext: 'مجموع الحالات : ' +  totalAdmission,
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


  // newEcharts() {

  //   this.option33 = {
  //     title: [
  //       {
  //         text: 'Tangential Polar Bar Label Position (middle)'
  //       }
  //     ],
  //     polar: {
  //       radius: [30, '80%']
  //     },
  //     angleAxis: {
  //       max: 4,
  //       startAngle: 75
  //     },
  //     radiusAxis: {
  //       type: 'category',
  //       data: ['a', 'b', 'c', 'd']
  //     },
  //     tooltip: {},
  //     series: {
  //       type: 'bar',
  //       data: [2, 1.2, 2.4, 3.6],
  //       coordinateSystem: 'polar',
  //       label: {
  //         show: true,
  //         position: 'middle', // or 'start', 'insideStart', 'end', 'insideEnd'
  //         formatter: '{b}: {c}'
  //       }
  //     }
  //   };

  //   // this.option33 && myChart.setOption(this.option33);
  // }

  dataDdeExamenLab = new Array<any>();
  dataGroupedBySociete = new Array<any>();
  countPatientPerCabAndSociete374: any;
  countPatientPerCabAndSociete375: any;
  countPatientPerCabAndSociete379: any;
  countPatientPerCabAndSociete376: any;
  PatientCounted: any;

  GetAllDdeExamenLab() {
    this.rapportService.GetAllDdeExamenLabByDate(this.dateDeb, this.dateFin).subscribe((data: any) => {
      this.loadingComponent.IsLoading = false;
      this.IsLoading = false;

      this.dataDdeExamenLab = this.aggregateData(data);
      this.dataGroupedBySociete = this.GroupedDataBySociete(data);

      const patientCountMap = this.createPatientCountMap(this.aggregateDataPatient(data));

      this.dataDdeExamenLab.forEach(group => {
        group.countPatient = patientCountMap[group.designationArPres] || 0; // Handle cases where a prestation might not have patients


      });


      this.dataGroupedBySociete.forEach((dataGrouped: any) => {
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
      this.createChartOptions(this.countPatientPerCabAndSociete374, this.countPatientPerCabAndSociete375, this.countPatientPerCabAndSociete376, this.countPatientPerCabAndSociete379,

        (this.countPatientPerCabAndSociete374 + +this.countPatientPerCabAndSociete375 + +this.countPatientPerCabAndSociete376 + +this.countPatientPerCabAndSociete379)
      );
      // this.GetChartRoundParFamille();
      this.GetChartRoundParSousFamille();
      this.GetDataComplex(data);
    });
  }

  aggregateData(data: any[]): any[] {
    return data.reduce((accumulator: any[], currentValue: any) => {
      const existingIndex = accumulator.findIndex(item => item.designationArPres === currentValue.designationArPres);

      if (existingIndex !== -1) {
        accumulator[existingIndex].count++;
      } else {
        accumulator.push({
          designationArPres: currentValue.designationArPres,
          designationLtPres: currentValue.designationLtPres,
          // codeSaisieCabinet: currentValue.codeSaisieCabinet,  
          count: 1,
          // Add other fields if needed from currentValue

          codeSociete: currentValue.codeSociete,
          codeFamPres: currentValue.codeFamPres,
          desigtionArFam: currentValue.desigtionArFam,
          designationArSousFam: currentValue.designationArSousFam,
          codePrestation: currentValue.codePrestation,


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
    return this.dataDdeExamenLab.reduce((sum, item) => sum + item.count, 0);
  }

  selectedExamen!: any;

  onRowSelect(event: any) { }

  onRowUnselect(event: any) {
    // this.createChartOptions()
    this.selectedExamen = event.data = null;
  }


  option33: EChartsCoreOption | null = null; 


  GetChartRoundParFamille() {
    const familyCounts: { [family: string]: number } = {};
    this.dataDdeExamenLab.forEach(item => {
      const family = item.desigtionArFam; 
      familyCounts[family] = (familyCounts[family] || 0) + item.count;
    });

    // Aggregate family counts, grouping those under 20 into "Other"
    const aggregatedFamilyCounts: { [family: string]: number } = {};
    let otherCount = 0;
    for (const family in familyCounts) {
      if (familyCounts[family] >= 1) {
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
    this.dataDdeExamenLab.forEach(item => {
      if (item.desigtionArFam === mostFrequentFamily) {
        detailsCounts[item.designationArPres] = (detailsCounts[item.designationArPres] || 0) + item.count;
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
    const familyData = Object.entries(aggregatedFamilyCounts).map(([name, value]) => ({ name, value }));


    this.option33 = {
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
        data: Object.keys(aggregatedFamilyCounts) //Dynamic legend from data
      },
      series: [
        {
          name: 'Family of Tests', // More descriptive name
          type: 'pie',
          selectedMode: 'single',
          radius: [0, '40%'],
          label: {
            position: 'inner',
            fontSize: 12,
            borderColor: '#ffffff',
            color: '#000000',
            fontWeight: 'bold'
          },
          labelLine: {
            show: false
          },
          data: familyData //Use dynamic data here
        },
        {
          name: 'Individual Tests', //More descriptive name
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
          data: detailsData //Use dynamic data here
        }
      ]
    };
  }


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


    this.option33 = {

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

  optionsChartComplex: EChartsCoreOption | null = null;
  // GetDataComplex() {
  //   const data = genData(50);

  //   this.optionsChartComplex = {
  //     title: {
  //       text: 'List Examen',
  //       subtext: '纯属虚构',
  //       left: 'center'
  //     },
  //     tooltip: {
  //       trigger: 'item',
  //       formatter: '{a} <br/>{b} : {c} ({d}%)'
  //     },
  //     legend: {
  //       type: 'scroll',
  //       orient: 'vertical',
  //       right: 10,
  //       top: 20,
  //       bottom: 20,
  //       data: data.legendData
  //     },
  //     series: [
  //       {
  //         name: '姓名',
  //         type: 'pie',
  //         radius: '55%',
  //         center: ['40%', '50%'],
  //         data: data.seriesData,
  //         emphasis: {
  //           itemStyle: {
  //             shadowBlur: 10,
  //             shadowOffsetX: 0,
  //             shadowColor: 'rgba(0, 0, 0, 0.5)'
  //           }
  //         }
  //       }
  //     ]
  //   };

  //   function genData(count: number) {
  //     // prettier-ignore
  //     const nameList = [
  //       '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
  //     ];
  //     const legendData = [];
  //     const seriesData = [];
  //     for (var i = 0; i < count; i++) {
  //       var name =
  //         Math.random() > 0.65
  //           ? makeWord(4, 1) + '·' + makeWord(3, 0)
  //           : makeWord(2, 1);
  //       legendData.push(name);
  //       seriesData.push({
  //         name: name,
  //         value: Math.round(Math.random() * 100000)
  //       });
  //     }

  //     return {
  //       legendData: legendData,
  //       seriesData: seriesData
  //     };

  //     function makeWord(max: number, min: number) {
  //       const nameLen = Math.ceil(Math.random() * max + min);
  //       const name = [];
  //       for (var i = 0; i < nameLen; i++) {
  //         name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
  //       }
  //       return name.join('');
  //     }
  //   }

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
          if(prestationCounts.has(codePrestation)){
              prestationCounts.get(codePrestation)!.count++;
          } else {
              prestationCounts.set(codePrestation, { designation: designation, count: 1 });
          }

          nameList.push(designation); // Add to nameList

      } else {
          console.warn("Missing or invalid data item or 'designationArPres' or 'codePrestation':", item);
      }
  });
    
    //   if (item && typeof item.designationArPres === 'string') {  //Check if item exists
    //     const designation = item.designationArPres;
    //     // const codePrestation = item.codePrestation;
    //     nameList.push(designation);
    //     // prestationCounts[codePrestation] = (prestationCounts[codePrestation] || 0) + 1;
    // } else {
    //     console.warn("Missing or invalid data item or 'designationArPres':", item);
    // }

 
    const uniqueCodePrest = [...prestationCounts.keys()];
    uniqueCodePrest.forEach(code => {
      const { designation, count } = prestationCounts.get(code)!;
      seriesData.push({ name: designation, value: count });
    });
    //Remove duplicates from nameList
    const uniqueNameList = [...new Set(nameList)];


    // Create seriesData from the counts
    // uniqueNameList.forEach(designation => {
    //   seriesData.push({
    //     name: designation,
    //     value: prestationCounts[designation]
    //   });
    // });


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


 


}


