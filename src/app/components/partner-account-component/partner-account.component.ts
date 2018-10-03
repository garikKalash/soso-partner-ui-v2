import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {PartnerService} from '../../service/partner.service';
import {Partner} from '../../models/partner.model';
import {ActivatedRoute, Router} from '@angular/router';
import {I18nService} from '../../service/i18n.service';
import {Photo} from '../../models/photo.model';
import {CommonDataService} from '../../service/common-data.service';
import {PartnerServiceDetail} from '../../models/partner-service-detail.model';
import {SelectItem} from 'primeng/api';
import {Service} from '../../models/service.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AddressService} from '../../service/address.service';
import {GMap} from 'primeng/gmap';
import {AuthenticationService} from '../../service/authentication.service';


@Component({
  templateUrl: './partner-account.component.html',
  selector: 'app-partner-account',
  styleUrls: ['partner-account.component.css']
})
export class PartnerAccountComponent implements OnInit {
  logedIn = false;

  public partner: Partner = <Partner>{};


  newServiceForm: FormGroup;
  public newServiceToPartner: PartnerServiceDetail = <PartnerServiceDetail>{};
  public selectItemsForNewService: SelectItem[] = [];

  fileUploadBLocked = false;

  constructor(private authService: AuthenticationService,
              public partnerService: PartnerService,
              private activatedRoute: ActivatedRoute,
              public i18nService: I18nService,
              private commonDataService: CommonDataService,
              private fb: FormBuilder,
              public addressDialog: MatDialog,
              private  router: Router) {
  }



  ngOnInit(): void {
    this.authService.checkLoggedInUser();
    this.logedIn = localStorage.getItem('soso_partner_token') !== null;
    this.initPartner();
    this.newServiceForm = this.fb.group({
      'service': new FormControl('', Validators.required),
      'price': new FormControl('', Validators.required),
      'defaultduration': new FormControl('', Validators.required)
    });

  }

  openDialog(): void {
    const dialogRef = this.addressDialog.open(AddressDialogComponent, {
      width: '40%',
      data: {longitude: this.partner.longitude, latitude: this.partner.latitude, address: this.partner.address, partnerId: this.partner.id}
    });

    dialogRef.afterClosed().subscribe(( result: Address) => {
     if (result !== undefined) {
        this.partner.latitude = result.latitude;
        this.partner.longitude = result.latitude;
        this.partner.address = result.address;
     }
    });
  }

  private initPartner(): void {
    this.activatedRoute.params.subscribe(value => {
       const partnerId = value['partnerId'];
       this.partnerService.getPartnerById(partnerId).subscribe(loadedPartner => {
         this.partner = loadedPartner;
         this.initPartnerServices(this.partner);
         this.resolvePartnerMainServiceName(this.partner);
         this.initSelectItemsForNewService(this.i18nService.isCurrentLang('hay'));
         this.i18nService.translateService.onLangChange.subscribe(() => {
           this.resolveTranslatedNamesOfServices();
           this.resolveTranslatedNamesOfNewServices();
           this.resolvePartnerMainServiceName(this.partner);
         });
       });
    });
  }

  isCurrentLang(lang: string) {
    return this.i18nService.isCurrentLang(lang);
  }

  selectLanguage() {
    this.i18nService.selectLanguage();
  }

  onBeforeSend(event) {
    event.xhr.setRequestHeader('Authorization', localStorage.getItem('soso_partner_token'));
  }

  imageUploader(event, form): void {
    console.log('My File upload', event);
    if (event.files.length === 0) {
      console.log('No file selected.');
      return;
    }

    this.fileUploadBLocked = true;
    const fileToUpload = event.files[0];
    const input = new FormData();
    input.append('file', fileToUpload);
    input.append('id', this.partner.id + '');
    this.partnerService.uploadImage(input).subscribe(photo => {
      this.partner.photoDtos.push(photo);
      form.clear();
      this.fileUploadBLocked = false;
    });
  }

  accountImageUploader(event, form): void {
    console.log('My File upload', event);
    if (event.files.length === 0) {
      console.log('No file selected.');
      return;
    }

    const fileToUpload = event.files[0];
    const input = new FormData();
    input.append('file', fileToUpload);
    input.append('id', this.partner.id + '');
    this.partnerService.uploadAccountImage(input).subscribe(photoUrl => {
      this.partner.imgpath = photoUrl;
      form.clear();
    });
  }





  deletePartnerPhoto(photoId: number) {
    this.fileUploadBLocked = true;
    this.partnerService.deletePartnerPhoto(photoId).subscribe((isDeleted: boolean) => {
        if (isDeleted) {
           this.partner.photoDtos.forEach(photo => {
             if (photo.id === photoId) {
                const indexOfPhoto = this.partner.photoDtos.indexOf(photo);
                this.partner.photoDtos.splice( indexOfPhoto, 1 );
             }
           });
        }
        this.fileUploadBLocked = false;
    });
  }


  initPartnerServices(partner: Partner) {
     partner.services.forEach(serviceDetail => {
       this.commonDataService.getServiceById(serviceDetail.serviceId).subscribe(value => {
         serviceDetail.service = value;
         if (this.i18nService.selectedLang === 'hay') {
           serviceDetail.translatedName = value.hay;
         } else {
           serviceDetail.translatedName = value.eng;
         }
       });
     });
  }

  resolvePartnerMainServiceName(partner: Partner) {
    this.commonDataService.getServiceById(partner.serviceId).subscribe(value => {
      if (this.i18nService.selectedLang === 'hay') {
        partner.serviceName = value.hay;
      } else {
        partner.serviceName = value.eng;
      }
    });
  }

  initSelectItemsForNewService(isHay: boolean) {
     this.commonDataService.getServicesByParent(this.partner.serviceId).subscribe((services: Service[]) => {
       services.forEach((service: Service)  => {

         const isServiceExist = this.partner.services.find(value => value.serviceId === service.id) !== undefined;
         if (!isServiceExist) {
           const serviceDetail = <PartnerServiceDetail>{};
           serviceDetail.service = service;
           serviceDetail.serviceId = service.id;
           serviceDetail.partnerId = this.partner.id;
           serviceDetail.translatedName = isHay ? service.hay : service.eng;
           this.selectItemsForNewService.push({label: serviceDetail.translatedName, value: serviceDetail});
         }
       });
     });
  }

  addNewServiceToPartner() {
     this.partnerService.savePartnerServiceDetails(this.newServiceToPartner).subscribe(newServiceDetailId => {
       const indexOfNewService = this.selectItemsForNewService.indexOf({label: this.newServiceToPartner.translatedName,
                                                                        value: this.newServiceToPartner});
       this.selectItemsForNewService.splice(indexOfNewService, 1);
       this.newServiceToPartner.id = newServiceDetailId;
       this.partner.services.push(this.newServiceToPartner);
       this.newServiceToPartner = <PartnerServiceDetail>{};
       this.newServiceForm.clearValidators();
     });
  }

  deletePartnerServiceDetail(partnerServiceDetail: PartnerServiceDetail) {
    this.partnerService.deletePartnerServiceDetail(partnerServiceDetail.id).subscribe(isDeleted => {
       if (isDeleted) {
         this.partner.services.forEach(value => {
           if (partnerServiceDetail.id === value.id) {
             const indexOfValue = this.partner.services.indexOf(value);
             this.partner.services.splice(indexOfValue, 1);
           }
         });
         partnerServiceDetail.id = null;
         partnerServiceDetail.defaultduration = null;
         partnerServiceDetail.partnerId = null;
         partnerServiceDetail.price = null;
         this.selectItemsForNewService.push({label: partnerServiceDetail.translatedName, value: partnerServiceDetail});
       }
    });
  }

  updatePartnerServiceDetail(partnerServiceDetail: PartnerServiceDetail) {
    this.partnerService.updatePartnerServiceDetail(partnerServiceDetail).subscribe( (value: number) => {
      if (value === 1) {
        alert('Your data is updated');
      }
    });
  }



  resolveTranslatedNamesOfServices() {
    if (this.i18nService.selectedLang === 'hay') {
      this.partner.services.forEach(value => {
        value.translatedName = value.service.hay;
      });
    } else {
      this.partner.services.forEach(value => {
        value.translatedName = value.service.eng;
      });
    }
  }

  resolveTranslatedNamesOfNewServices() {
    if (this.i18nService.isCurrentLang('hay')) {
      this.selectItemsForNewService.forEach(value => {
        value.label = value.value.service.hay;
      });
    } else {
      this.selectItemsForNewService.forEach(value => {
        value.label = value.value.service.eng;
      });
    }
  }

}

export interface Address {
  partnerId: number;
  longitude: number;
  latitude: number;
  address: string;
}


@Component({
  selector: 'app-address-dialog',
  templateUrl: './map-dialog-component/gmap-address-dialog.html',
  styleUrls: ['./map-dialog-component/gmap-address-dialog.css']
})
export class AddressDialogComponent implements OnInit {

  options: any = {};

  @ViewChild('search')
  public _searchElementRef: ElementRef;

  @ViewChild('map')
  public addressMap: GMap;

  constructor( private addressService: AddressService,
               private partnerService: PartnerService,
               public dialogRef: MatDialogRef<AddressDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public address: Address) {
    this.options = {
      center: {lat: address.latitude, lng: address.longitude},
      zoom: 12
    };
  }

  saveAddress(): void {
    this.address.address = this.addressService.address;
    this.address.longitude = this.addressService.longitude;
    this.address.latitude = this.addressService.latitude;
    this.partnerService.updateEditedAddressForPartner(this.address).subscribe(value => {
      if (value === null) {
         this.address = null;
      }
    });

  }

  onNoClick(): void {
    this.address = null;
    this.dialogRef.close();
  }


  showAddress(): void {
    this.addressService.initMapDetails(this.addressMap, this._searchElementRef, this.address.longitude, this.address.latitude);

  }

  mapLongitude(): number {
    return this.addressService.longitude;
  }

  mapLatitude(): number {
    return this.addressService.latitude;
  }


  mapZoom(): number {
    return this.addressService.zoom;
  }

  mapSearchControl(): FormControl {
    return this.addressService.searchControl;
  }

  changeAddress() {
    this.addressService._isNeedChangeAddress = true;
  }

  putMyLocation(): void {
    this.addressService.setCurrentPosition();
    this.addressService.getAddressByCoordinates(this.addressService.latitude, this.addressService.longitude)
      .subscribe(
        data => {
          for (const node of JSON.parse(data)['results']) {
            this.address.address = node.formatted_address;
            break;
          }

        }
      );

  }

  ngOnInit(): void {
    this.showAddress();
  }


}
