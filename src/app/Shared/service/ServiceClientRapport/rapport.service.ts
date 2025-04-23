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

    GetAllAdmissionByDate(dateDebut : any , dateFin : any ,  ){
      return this.http.get(`${environment.API_RECEPTION}admission/findAllByDate?dateDebut=`+ dateDebut + `&dateFin=`+dateFin  )
    }
 
    GetAllAdmissionByDateAndCodeCabinet(dateDebut : any , dateFin : any , codeCabinet : any ){
      return this.http.get(`${environment.API_RECEPTION}admission/findAllByDateAndCabinet?dateDebut=`+ dateDebut + `&dateFin=`+dateFin +`&codeCabinet=`+codeCabinet  )
    }
    GetAllAdmissionBySpecialite(codeSpecialite : number ){
      return this.http.get(`${environment.API_RECEPTION}admission/findBySpecialite?codeSpecialite=`+ codeSpecialite  )
    }

    GetAllAdmissionByCabinet(codeCabinet : number ){
      return this.http.get(`${environment.API_RECEPTION}admission/findByCabinet?codeCabinet=`+ codeCabinet  )
    }

    //// examen Lab 

    GetAllDdeExamenLab(  ){
      return this.http.get(`${environment.API_RECEPTION}dde_examen_lab/all`  )
    }

    GetAllDdeExamenLabByDate(dateDebut : any , dateFin : any ,  ){
      return this.http.get(`${environment.API_RECEPTION}dde_examen_lab/findAllByDate?dateDebut=`+ dateDebut + `&dateFin=`+dateFin  )
    }
 
    GetAllDdeExamenLabByDateAndCodeSociete(dateDebut : any , dateFin : any , codeSociete : any ){
      return this.http.get(`${environment.API_RECEPTION}dde_examen_lab/findAllByDateAndSociete?dateDebut=`+ dateDebut + `&dateFin=`+dateFin +`&codeSociete=`+codeSociete  )
    }

    GetAllDdeExamenLabByDateAndCodePrestation(dateDebut : any , dateFin : any , codePrestation : any ){
      return this.http.get(`${environment.API_RECEPTION}dde_examen_lab/findAllByDateAndPrestation?dateDebut=`+ dateDebut + `&dateFin=`+dateFin +`&codePrestation=`+codePrestation  )
    }


    GetAllDdeExamenLabByDateAndCodeInterv(dateDebut : any , dateFin : any , codeInterv : any ){
      return this.http.get(`${environment.API_RECEPTION}dde_examen_lab/findAllByDateAndIntervenant?dateDebut=`+ dateDebut + `&dateFin=`+dateFin +`&codeInterv=`+codeInterv  )
    }


    /// detailsAdmission

    GetAllDetailsAdmission(  ){
      return this.http.get(`${environment.API_RECEPTION}details_adm/all`  )
    }

    GetAllDetailsAdmissionByDate(dateDebut : any , dateFin : any ,  ){
      return this.http.get(`${environment.API_RECEPTION}details_adm/findAllByDate?dateDebut=`+ dateDebut + `&dateFin=`+dateFin  )
    }
 
    GetAllDetailsAdmissionByDateAndCodeCabinet(dateDebut : any , dateFin : any , codeCabinet : any ){
      return this.http.get(`${environment.API_RECEPTION}details_adm/findAllByDateAndCabinet?dateDebut=`+ dateDebut + `&dateFin=`+dateFin +`&codeCabinet=`+codeCabinet  )
    }
  
    GetAllDetailsAdmissionByCabinet(codeCabinet : number ){
      return this.http.get(`${environment.API_RECEPTION}details_adm/findByCabinet?codeCabinet=`+ codeCabinet  )
    }




    
    //// examen Radio 

    GetAllDdeExamenRadio(  ){
      return this.http.get(`${environment.API_RECEPTION}dde_examen_radio/all`  )
    }

    GetAllDdeExamenRadioByDate(dateDebut : any , dateFin : any ,  ){
      return this.http.get(`${environment.API_RECEPTION}dde_examen_radio/findAllByDate?dateDebut=`+ dateDebut + `&dateFin=`+dateFin  )
    }
 
    GetAllDdeExamenRadioByDateAndCodeSociete(dateDebut : any , dateFin : any , codeSociete : any ){
      return this.http.get(`${environment.API_RECEPTION}dde_examen_radio/findAllByDateAndSociete?dateDebut=`+ dateDebut + `&dateFin=`+dateFin +`&codeSociete=`+codeSociete  )
    }

    GetAllDdeExamenRadioByDateAndCodePrestation(dateDebut : any , dateFin : any , codePrestation : any ){
      return this.http.get(`${environment.API_RECEPTION}dde_examen_radio/findAllByDateAndPrestation?dateDebut=`+ dateDebut + `&dateFin=`+dateFin +`&codePrestation=`+codePrestation  )
    }


    GetAllDdeExamenRadioByDateAndCodeInterv(dateDebut : any , dateFin : any , codeInterv : any ){
      return this.http.get(`${environment.API_RECEPTION}dde_examen_radio/findAllByDateAndIntervenant?dateDebut=`+ dateDebut + `&dateFin=`+dateFin +`&codeInterv=`+codeInterv  )
    }

   
}

