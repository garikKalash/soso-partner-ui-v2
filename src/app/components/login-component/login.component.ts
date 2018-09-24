import {Component, OnInit} from '@angular/core';
import {PartnerService} from '../../service/partner.service';
import {Partner} from '../../models/partner.model';

@Component({
  templateUrl: './login.component.html',
  selector: 'app-login',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  partner: Partner = <Partner>{};
  wrongWrotenData = false;

  constructor(private partnerService: PartnerService) {

  }

  ngOnInit(): void {

  }


  signin() {
    this.partnerService.signin(this.partner).subscribe(value => {
      if (value === null) {
          this.wrongWrotenData = true;
      } else {

      }
    });
  }
}
