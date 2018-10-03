import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class AuthenticationService {
  private readonly SOSO_PARTNER_TOKEN = 'soso_partner_token';
  private readonly SOSO_PARTNER_ID = 'soso_partner_id';

  private loggedIn = new BehaviorSubject<boolean>(localStorage.getItem(this.SOSO_PARTNER_TOKEN) !== null);
  private loggedPartnerId = new BehaviorSubject<number>(+localStorage.getItem(this.SOSO_PARTNER_ID));
  constructor(private route: Router) {

  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get getLoggedPartnerId() {
      return this.loggedPartnerId.asObservable();
  }

  checkLoggedInUser() {
    if (localStorage.getItem(this.SOSO_PARTNER_TOKEN) !== null && localStorage.getItem(this.SOSO_PARTNER_ID) !== null) {
      this.route.navigate(['/partneraccount/' + localStorage.getItem('soso_partner_id')]);
    } else {
       this.logout();
    }
  }

  login(partnerId: string, token: string) {
    localStorage.setItem(this.SOSO_PARTNER_TOKEN, token);
    localStorage.setItem(this.SOSO_PARTNER_ID, partnerId);
    this.loggedIn.next(true);
    this.loggedPartnerId.next(+partnerId);
    this.route.navigate(['/partneraccount/' + partnerId]);
  }

  logout() {
    localStorage.removeItem(this.SOSO_PARTNER_TOKEN);
    localStorage.removeItem(this.SOSO_PARTNER_ID);
    this.loggedIn.next(false)
    this.loggedPartnerId.next(-1);
    this.route.navigate(['/home']);
  }
}
