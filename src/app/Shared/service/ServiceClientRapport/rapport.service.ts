import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapportService {

  constructor(private http: HttpClient) { }
  
    // GetAllListPatient(){
    //   return this.http.get(`${environment.API_DASHBORD}patient_grouped/all` )
    // }
  
    // GetAllListPatientByCodeSociete(codeSociet: number){
    //   return this.http.get(`${environment.API_DASHBORD}patient_grouped/findByCode?code=`+codeSociet )
    // }
    // GetAllListPatientByCodeSocieteAndBloquer(codeSociet: number,bloquer : boolean){
    //   return this.http.get(`${environment.API_DASHBORD}patient_grouped/findByCodeAndBloquer?code=`+codeSociet  + `&bloquer=`+bloquer)
    // }

    GetAllAdmission(  ){
      return this.http.get(`${environment.API_RECEPTION}admission/all`  )
    }
 
    GetAllAdmissionBySpecialite(codeSpecialite : number ){
      return this.http.get(`${environment.API_RECEPTION}admission/findBySpecialite?codeSpecialite=`+ codeSpecialite  )
    }

    GetAllAdmissionByCabinet(codeCabinet : number ){
      return this.http.get(`${environment.API_RECEPTION}admission/findByCabinet?codeCabinet=`+ codeCabinet  )
    }
}

