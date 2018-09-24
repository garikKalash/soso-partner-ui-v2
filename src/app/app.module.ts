import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {PartnerAccountComponent} from './components/partner-account-component/partner-account.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {PartnerService} from './service/partner.service';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {MessageService} from './service/message.service';
import {CustomLoader} from './custom.loader';
import {WelcomePageComponent} from './components/welcome-page-component/wlc-page.component';
import {LoginComponent} from './components/login-component/login.component';
import {ButtonModule} from 'primeng/button';
import {DropdownModule, InputSwitchModule} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CheckboxModule, IconsModule} from 'angular-bootstrap-md';
import {ConnectableObservable} from 'rxjs';
import {ConnectToSystemComponent} from './components/register-component/connectToSystem.component';
import {CommonDataService} from './service/common-data.service';

export function translateCustomLoaderFactory(messageService: MessageService) {
  return new CustomLoader(messageService);
}

@NgModule({
  declarations: [
    AppComponent,
    PartnerAccountComponent,
    WelcomePageComponent,
    LoginComponent,
    ConnectToSystemComponent
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
        deps: [MessageService]
      }
    })
  ],
  providers: [PartnerService,
              MessageService,
              CommonDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
