import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from './service/message.service';
import {PartnerService} from './service/partner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public supportedLanguages: any[];
  public selectedLang: string;


  constructor(private translateService: TranslateService) {
    this.translateService.addLangs(Array.of('hay', 'eng'));
    this.translateService.setDefaultLang('hay');
    PartnerService.headers.set('Accept-Language', 'hay');
  }

  ngOnInit(): void {
      // standing datad
      this.supportedLanguages = [
        { display: 'Հայերեն', value: 'hay', flagpath: 'http://flagpedia.net/data/flags/mini/am.png', label: 'Հայ' },
        { display: 'English', value: 'eng', flagpath: 'http://flagpedia.net/data/flags/mini/gb.png', label: 'Eng' },
      ];


      this.selectedLang = this.supportedLanguages[0].value;
      this.selectLang(this.selectedLang);

    }

    isCurrentLang(lang: string) {
      return lang === this.translateService.currentLang;
    }

    selectLanguage() {
      this.selectLang(this.selectedLang);
    }

    selectLang(lang: string) {
      // set default;
      this.translateService.use(lang);
      PartnerService.headers.set('Accept-Language', lang);

    }


}
