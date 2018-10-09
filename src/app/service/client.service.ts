import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Client} from '../models/client.model';

@Injectable()
export class ClientService {
  baseUrl = environment.sosoServiceUrl;

  constructor(private http: HttpClient) {


  }

  getClientById(id: number) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));

    const httpOptions = {
      headers: headers
    };
    return this.http.get<Client>(this.baseUrl + 'client/clientaccount/' + id, httpOptions);
  }

}
