import {Component, OnInit} from '@angular/core';
import {Request} from '../../models/request.model';
import {ActivatedRoute, Router} from '@angular/router';
import {PartnerService} from '../../service/partner.service';
import {CommonDataService} from '../../service/common-data.service';
import {AuthenticationService} from '../../service/authentication.service';

@Component({
  templateUrl: './partner-workspace.component.html',
  selector: 'app-partner-workspace',
  styleUrls: ['partner-workspace.component.css']
})
export class PartnerWorkspaceComponent implements OnInit {

  constructor(public partnerService: PartnerService,
              public commonDataService: CommonDataService,
              public router: Router,
              private authService: AuthenticationService,
              public activatedRoute: ActivatedRoute) {

  }


  ngOnInit(): void {
  }


}
