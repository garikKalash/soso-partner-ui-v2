import {Component, Input, OnInit} from '@angular/core';
import {I18nService} from '../../service/i18n.service';
import {AuthenticationService} from '../../service/authentication.service';

@Component({
  templateUrl: './wlc-page.component.html',
  selector: 'app-wlc-page',
  styleUrls: ['wlc-page.component.css']
})
export class WelcomePageComponent implements  OnInit {

  constructor( private authService: AuthenticationService,
               public i18nService: I18nService) {

  }

  ngOnInit(): void {
    this.authService.checkLoggedInUser();
  }

  isCurrentLang(lang: string) {
    return this.i18nService.isCurrentLang(lang);
  }

  selectLanguage() {
    this.i18nService.selectLanguage();
  }



}
