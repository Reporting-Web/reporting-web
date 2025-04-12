import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashbordService {

  constructor(private http: HttpClient) { }



  GetAllListPatient(){
    return this.http.get(`${environment.API_DASHBORD}patient_grouped/all` )
  }

  GetAllListPatientByCodeSociete(codeSociet: number){
    return this.http.get(`${environment.API_DASHBORD}patient_grouped/findByCode?code=`+codeSociet )
  }
  GetAllListPatientByCodeSocieteAndBloquer(codeSociet: number,bloquer : boolean){
    return this.http.get(`${environment.API_DASHBORD}patient_grouped/findByCodeAndBloquer?code=`+codeSociet  + `&bloquer=`+bloquer)
  }

  GetAllListPatientByDateAndCodeSociete(dateDebut : any , dateFin : any ,codeSociet: number){
    return this.http.get(`${environment.API_DASHBORD}patient_grouped/findByDateAndSociete?dateDebut=`+ dateDebut + `&dateFin=`+dateFin +  `&codeSociete=`+ codeSociet  )
  }
  GetAllListPatientByDate(dateDebut : any , dateFin : any ){
    return this.http.get(`${environment.API_DASHBORD}patient_grouped/findByDate?dateDebut=`+ dateDebut + `&dateFin=`+dateFin )
  }


  GetAllListPatientByDateAndCodeSocieteAndBloquer(dateDebut : any , dateFin : any ,codeSociet: number,bloquer : boolean){
    return this.http.get(`${environment.API_DASHBORD}patient_grouped/findByDateAndSocieteAndBloquer?dateDebut=`+ dateDebut + `&dateFin=`+dateFin +  `&codeSociete=`+ codeSociet  +  `&bloquer=`+ bloquer  )
  }

  //// paramtrage
  GetAllListExercice(){
    return this.http.get(`${environment.API_Parametrage}exercice/all` )
  }
  GetAllListMois(){
    return this.http.get(`${environment.API_Parametrage}mois/all` )
  }
}
