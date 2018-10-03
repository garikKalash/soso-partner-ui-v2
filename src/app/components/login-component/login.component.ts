import {Component, OnInit} from '@angular/core';
import {PartnerService} from '../../service/partner.service';
import {Partner} from '../../models/partner.model';
import {Router} from '@angular/router';
import {UtilMethods} from '../../util/UtilMethods';
import {AuthenticationService} from '../../service/authentication.service';
import {of} from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  selector: 'app-login',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  msgs: any[];
  partner: Partner = <Partner>{};

  constructor(private  router: Router,
              private partnerService: PartnerService,
              private authService: AuthenticationService) {

  }

  ngOnInit(): void {
      this.authService.checkLoggedInUser();
  }


  signin() {
    this.partnerService.signin(this.partner).subscribe( (value: Partner) => {
      if (value !== null) {
         this.authService.login(value.id + '', 'Basic ' + btoa(value.username + ':' + this.partner.password));
      }
      },
      errorDetails => {
        this.msgs = [];
        if (errorDetails.error.shorttelephone !== undefined) {
           this.msgs.push({severity: 'error', summary: '', detail: errorDetails.error.shorttelephone});
        }
        if (errorDetails.error.invalidpassword !== undefined) {
           this.msgs.push({severity: 'error', summary: '', detail: errorDetails.error.invalidpassword});
        }
        if (errorDetails.error.invalidpasswordorphone !== undefined || errorDetails.status === 401) {
          this.msgs.push({severity: 'error', summary: '', detail: errorDetails.error.invalidpasswordorphone});
        }
      });
  }
}
