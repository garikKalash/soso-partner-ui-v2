import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SysMessageService} from './service/sys-message.service';
import {PartnerService} from './service/partner.service';
import {HttpHeaders} from '@angular/common/http';
import {UtilMethods} from './util/UtilMethods';
import {I18nService} from './service/i18n.service';
import {AuthenticationService} from './service/authentication.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  partnerId: number;

  constructor(public i18nService: I18nService,
              public authService: AuthenticationService,
              public router: Router) {
  }

   ngOnInit(): void {
     this.isLoggedIn$ = this.authService.isLoggedIn;
     this.authService.getLoggedPartnerId.subscribe(value => {
       this.partnerId = value;
     });
     this.authService.checkLoggedInUser();
   }

    isCurrentLang(lang: string) {
      return this.i18nService.isCurrentLang(lang);
    }

    selectLanguage() {
      this.i18nService.selectLanguage();
    }




}
