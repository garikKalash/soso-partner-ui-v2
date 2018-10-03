import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Partner} from '../models/partner.model';
import { environment } from '../../environments/environment';
import {Photo} from '../models/photo.model';
import {Request} from '../models/request.model';
import {Address} from '../components/partner-account-component/partner-account.component';
import {PartnerServiceDetail} from '../models/partner-service-detail.model';
import {I18nService} from './i18n.service';


@Injectable()
export class PartnerService {

  public static headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  baseUrl = environment.partnerServiceBaseUrl;

  constructor(private http: HttpClient,
              private i18Service: I18nService) {
  }

  getPartnerById(id: string) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));

    const httpOptions = {
      headers: headers
    };
    return this.http.get<Partner>(this.baseUrl + 'partner/partners/' + id, httpOptions);
  }

  signin(partner: Partner) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept-Language', this.i18Service.selectedLang);
    const httpOptions = {
      headers: headers
    };
    return this.http.post(this.baseUrl + 'authenticate/signinpartner', partner, httpOptions);
  }

  register(partner: Partner) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept-Language', this.i18Service.selectedLang);
    const httpOptions = {
      headers: headers
    };
    return this.http.post<number>(this.baseUrl + 'authenticate/signuppartner', partner, httpOptions);
  }

  uploadImage(input: FormData) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    const httpOptions = {
      headers: headers
    };
    return this.http.post<Photo>(this.baseUrl + 'partner/addImageToPartnier', input, httpOptions);
  }

  uploadAccountImage(input: FormData) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    const httpOptions = {
      headers: headers
    };
    return this.http.post<string>(this.baseUrl + 'partner/uploadAccountImage', input, httpOptions);
  }

  deletePartnerPhoto(photoId: number) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    headers = headers.append('Content-Type', 'application/json');
    const httpOptions = {
      headers: headers
    };
    return this.http.delete(this.baseUrl + 'partner/deletephotofrompartner/' + photoId, httpOptions);
  }

  getPartnerPhotosByPartnerId(partnerId: number) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    const httpOptions = {
      headers: headers
    };
    return this.http.get<Photo[]>(this.baseUrl + 'partner/partnerPhotos/' + partnerId, httpOptions);
  }


  getPartnerServiceDetails(partnerId: number) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    const httpOptions = {
      headers: headers
    };
    return this.http.get<PartnerServiceDetail[]>(this.baseUrl + 'partner/getservicedetailsforpartner/' + partnerId, httpOptions);
  }

  savePartnerServiceDetails(partnerServiceDetail: PartnerServiceDetail) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    const httpOptions = {
      headers: headers
    };
    return this.http.post<number>(this.baseUrl + 'partner/addservicedetailtopartner', partnerServiceDetail, httpOptions);
  }

  deletePartnerServiceDetail(partnerServiceDetailId: number) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    headers = headers.append('Content-Type', 'application/json');
    const httpOptions = {
      headers: headers
    };
    return this.http.delete<boolean>(this.baseUrl + 'partner/deleteservicedetailtopartner/' + partnerServiceDetailId, httpOptions);
  }


  updatePartnerServiceDetail(partnerServiceDetail: PartnerServiceDetail) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    const httpOptions = {
      headers: headers
    };
    return this.http.put<number>(this.baseUrl + 'partner/updateservicedetailtopartner', partnerServiceDetail, httpOptions);
  }

  updateEditedAddressForPartner(address: Address) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    headers = headers.append('Accept-Languag', this.i18Service.selectedLang);
    const httpOptions = {headers: headers};
    return this.http.post<Address>(this.baseUrl + 'partner/saveEditedAddress', address, httpOptions);
  }

  // 1 requests, 2 accepted, 3 done, 4 declined
  getReservationsForPartner(partnerId: number, status: number) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    headers = headers.append('Content-Type', 'application/json');
    const httpOptions = {headers: headers};
    return this.http.get<Request[]>(this.baseUrl + 'partner/reservationsforpartner/' + partnerId + '/' + status, httpOptions);
  }

  getServiceDetialsByPartnerId(partnerId: number, serviceId: number) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    headers = headers.append('Content-Type', 'application/json');
    const httpOptions = {headers: headers};
    return this.http.get<PartnerServiceDetail>(this.baseUrl + 'partner/getservicedetails/partner/' + partnerId + '/service/' + serviceId,
                                                    httpOptions);
  }

  saveReservation(request: Request): Observable<number> {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept-Language', this.i18Service.selectedLang);
    const httpOptions = {headers: headers};
    return this.http.post<number>(this.baseUrl + 'partner/addReserve', request, httpOptions);
  }

  deleteReservation(requestId: string): Observable<boolean> {
      let headers = new HttpHeaders();
      headers = headers.append('Authorization', localStorage.getItem('soso_partner_token'));
      headers = headers.append('Content-Type', 'application/json');
      headers = headers.append('Accept-Language', this.i18Service.selectedLang);
      const httpOptions = {headers: headers};
      return this.http.delete<boolean>(this.baseUrl + 'partner/deletereserve/' + requestId, httpOptions);
  }

}
