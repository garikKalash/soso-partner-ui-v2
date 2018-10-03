import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AddressDialogComponent, PartnerAccountComponent} from './components/partner-account-component/partner-account.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {PartnerService} from './service/partner.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {SysMessageService} from './service/sys-message.service';
import {CustomLoader} from './custom.loader';
import {WelcomePageComponent} from './components/welcome-page-component/wlc-page.component';
import {LoginComponent} from './components/login-component/login.component';
import {ButtonModule} from 'primeng/button';
import {
  BlockUIModule, CalendarModule as primengCalendar,
  DataScrollerModule,
  DialogModule,
  DropdownModule, EditorModule,
  FileUploadModule, GMapModule, GrowlModule, InplaceModule,
  InputSwitchModule, MessageModule, MessageService, PanelModule, ProgressSpinnerModule,
  RatingModule,
  TabMenuModule
} from 'primeng/primeng';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CheckboxModule, IconsModule} from 'angular-bootstrap-md';
import {ConnectableObservable} from 'rxjs';
import {ConnectToSystemComponent} from './components/register-component/connectToSystem.component';
import {CommonDataService} from './service/common-data.service';
import {routing} from './app.routing';
import {I18nService} from './service/i18n.service';
import {
  MatButtonModule, MatButtonToggleModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatTabsModule
} from '@angular/material';
import {TableModule} from 'primeng/table';
import {AgmCoreModule} from '@agm/core';
import {AddressService} from './service/address.service';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {PartnerWorkspaceComponent} from './components/partner-workspace-component/partner-workspace.component';
import {AuthenticationService} from './service/authentication.service';
import {CommonModule} from '@angular/common';
import {FlatpickrModule} from 'angularx-flatpickr';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {NewEventDialogComponent, ScheduleComponent} from './components/schedule-component/schedule.component';
import {ClientService} from './service/client.service';

export function translateCustomLoaderFactory(messageService: SysMessageService) {
  return new CustomLoader(messageService);
}

@NgModule({
  declarations: [
    AppComponent,
    PartnerAccountComponent,
    WelcomePageComponent,
    LoginComponent,
    ConnectToSystemComponent,
    AddressDialogComponent,
    PartnerWorkspaceComponent,
    ScheduleComponent,
    NewEventDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    BrowserAnimationsModule,
    CheckboxModule,
    IconsModule,
    InputSwitchModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateCustomLoaderFactory,
        deps: [SysMessageService]
      }
    }),
    routing,
    MatTabsModule,
    DataScrollerModule,
    RatingModule,
    FileUploadModule,
    TableModule,
    DialogModule,
    MatDividerModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    MessageModule,
    BlockUIModule,
    PanelModule,
    ProgressSpinnerModule,
    InplaceModule,
    GMapModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC0S_SbHkGKZNkcxnCjdLl1U_ePadv_o7Q',
      libraries: ['places']
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CommonModule,
    FlatpickrModule.forRoot(),
    NgbModalModule,
    primengCalendar,
    GrowlModule,
    MatButtonToggleModule
  ],
  entryComponents: [AddressDialogComponent,
                    ScheduleComponent,
                    NewEventDialogComponent],
  providers: [I18nService,
              PartnerService,
              SysMessageService,
              CommonDataService,
              MessageService,
              AddressService,
              AuthenticationService,
              ClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
