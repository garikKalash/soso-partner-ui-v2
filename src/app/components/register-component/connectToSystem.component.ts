import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SelectItem} from 'primeng/components/common/api';
import {Partner} from '../../models/partner.model';
import {Service} from '../../models/service.model';
import {PartnerService} from '../../service/partner.service';
import {CommonDataService} from '../../service/common-data.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
  templateUrl: './connectToSystem.component.html',
  selector: 'app-register-component',
  styleUrls: ['connectToSystem.component.css']
})
export class ConnectToSystemComponent implements OnInit {
  public _newPartner: Partner = <Partner>{};
  loading = false;

  public services: Service[] = [];
  public servicesAsSelectItems: SelectItem[] = [];
  public selectedService: Service;

  public _isShortTelephone = false;
  public _isDoubleUsername = false;
  public _isInvalidPassword = false;
  public _isInvalidUsername = false;
  public _isDoubleTelephone = false;
  public _isInvalidName = false;
  public _isInvalidServiceId = false;

  constructor(public partnerService: PartnerService,
              public commonDataService: CommonDataService,
              private translateService: TranslateService) {
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
    this.partnerService.register(this._newPartner).subscribe(
      data => {
        this._newPartner.id = +data;
      });

  }
}

