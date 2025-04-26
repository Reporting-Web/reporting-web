import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
 



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 
  constructor(private http: HttpClient ) { 
   
  }

  // login(userName: string, password: string): Observable<any> {
  //   return this.http.post(
  //     `${environment.API_AUTH}` + 'login', { userName, password, },
  //     httpOptions
  //   );
  // }

  login(userName: string, password: string): Observable<any> {
    return this.http.post(
      `${environment.API_AUTH}` + 'login', { userName, password, },
      httpOptions
    ) 
  }


  logout(): Observable<any> {
    return this.http.post(`${environment.API_AUTH}` + 'signout', {}, httpOptions);
  }



  GetImageProfil() {

    const username = JSON.parse(sessionStorage.getItem("auth-user") ?? '{}')?.userName?.toLowerCase();
    return this.http.get(`${environment.API_AUTH}` + 'accessUser/imageProfil?userName=' + username);

  }



//   GetImageProfil(): Observable<Blob> {
//     const username = JSON.parse(sessionStorage.getItem("auth-user") ?? '{}')?.userName?.toLowerCase();
//     const apiUrl = environment.production 
//         ? `http://localhost:5051/api/auth/accessUser/imageProfil?userName=${username}`
//         : `${environment.API_AUTH}accessUser/imageProfil?userName=${username}`; // Use environment variables

//     return this.http.get(apiUrl, { responseType: 'blob' });
// }

}
