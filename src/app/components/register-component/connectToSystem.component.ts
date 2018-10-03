import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SelectItem} from 'primeng/components/common/api';
import {Partner} from '../../models/partner.model';
import {Service} from '../../models/service.model';
import {PartnerService} from '../../service/partner.service';
import {CommonDataService} from '../../service/common-data.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpHeaders} from '@angular/common/http';
import {UtilMethods} from '../../util/UtilMethods';
import {AuthenticationService} from '../../service/authentication.service';


@Component({
  templateUrl: './connectToSystem.component.html',
  selector: 'app-register-component',
  styleUrls: ['connectToSystem.component.css']
})
export class ConnectToSystemComponent implements OnInit {
  public _newPartner: Partner = <Partner>{};
  public services: Service[] = [];
  public servicesAsSelectItems: SelectItem[] = [];
  public selectedService: Service;

  msgs: any[];


  constructor(public partnerService: PartnerService,
              public commonDataService: CommonDataService,
              private translateService: TranslateService,
              private router: Router, private authService: AuthenticationService) {
    this.translateService.onLangChange.subscribe(() => this.initServices( this.translateService.currentLang === 'hay'));
  }

  ngOnInit(): void {

  }

  initServices(isHay: boolean): void {
    this.servicesAsSelectItems = [];
    this.commonDataService.getGeneralServices().subscribe(
      data => {
        this.services = data;
        for (const service of this.services) {
          this.servicesAsSelectItems.push({label: isHay ? service.hay : service.eng, value: service});
        }
      }
    );
  }

  register() {
    if (this.selectedService) {
      this._newPartner.serviceId = this.selectedService.id;
    }
    this._newPartner.imgId = 39; // the id of the default image
    this.partnerService.register(this._newPartner).subscribe(
      data => {
        this.authService.login(data + '', 'Basic ' + btoa(this._newPartner.username + ':' + this._newPartner.password));
         },
        errorDetails => {
              this.msgs = [];
              if (errorDetails.error.invalidphone !== undefined) {
                this.msgs.push({severity: 'error', summary: '', detail: errorDetails.error.invalidphone});
              }
              if (errorDetails.error.invalidusername !== undefined) {
                this.msgs.push({severity: 'error', summary: '', detail: errorDetails.error.invalidusername});
              }
              if (errorDetails.error.invalidpartnername !== undefined) {
                this.msgs.push({severity: 'error', summary: '', detail: errorDetails.error.invalidpartnername});
              }
              if (errorDetails.error.invalidserviceforpartner !== undefined) {
                this.msgs.push({severity: 'error', summary: '', detail: errorDetails.error.invalidserviceforpartner});
              }
              if (errorDetails.error.invalidpassword !== undefined) {
                this.msgs.push({severity: 'error', summary: '', detail: errorDetails.error.invalidpassword});
              }
              if (errorDetails.error.doubletelephonenumber !== undefined) {
                this.msgs.push({severity: 'error', summary: '', detail: errorDetails.error.doubletelephonenumber});
              }

              if (errorDetails.error.doubleusernameerror !== undefined) {
                this.msgs.push({severity: 'error', summary: '', detail: errorDetails.error.doubleusernameerror});
              }
         });

  }
}

