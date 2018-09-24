import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Partner} from '../models/partner.model';
import { environment } from '../../environments/environment';


@Injectable()
export class PartnerService {

  public static headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  baseUrl = environment.partnerServiceBaseUrl;

   constructor(private http: HttpClient) {
   }

   getPartnerById(id: string) {
     let headers = new HttpHeaders();
     headers = headers.append('Authorization', 'Basic ' + btoa('garikkalash:Garik1!'));
     headers = headers.append('Content-Type', 'application/json');
     headers = headers.append('Accept-Language', 'hay');

     const httpOptions = {
       headers: headers
     };
     return this.http.get<Partner>(this.baseUrl + 'partner/partners/' + id, httpOptions);
   }

   signin(partner: Partner) {
     const  httpOptions = {
       headers: PartnerService.headers
     };
     return this.http.post(this.baseUrl + 'authenticate/signinpartner', partner, httpOptions);
   }

   register(partner: Partner) {
      const  httpOptions = {
        headers: PartnerService.headers
      };
      return this.http.post(this.baseUrl + 'authenticate/signuppartner', partner);
   }
}
