import {Component, OnInit} from '@angular/core';
import {PartnerService} from '../../service/partner.service';
import {Partner} from '../../models/partner.model';


@Component({
  templateUrl: './partner-account.component.html',
  selector: 'app-partner-account',
  styleUrls: ['partner-account.component.css']
})
export class PartnerAccountComponent implements OnInit {

  public partner: Partner = <Partner>{};

  constructor(private partnerService: PartnerService) {
  }

  ngOnInit(): void {
    this.partnerService.getPartnerById('10').subscribe(value => {
      this.partner = value;
    });
  }


}
