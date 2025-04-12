import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapportService {

  constructor(private http: HttpClient) { }


    GetAllCabinetActif(actif : boolean ){
      return this.http.get(`${environment.API_Parametrage}cabinet/findByActif?actif=`+ actif  )
    }
}
