import {RouterModule, Routes} from '@angular/router';
import {WelcomePageComponent} from './components/welcome-page-component/wlc-page.component';
import {PartnerAccountComponent} from './components/partner-account-component/partner-account.component';
import {AppComponent} from './app.component';
import {PartnerWorkspaceComponent} from './components/partner-workspace-component/partner-workspace.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: WelcomePageComponent,
  },
  {
    path: 'partneraccount/:partnerId',
    component: PartnerAccountComponent,
  },
  {
    path: 'partneraccount/:partnerId/workspace',
    component: PartnerWorkspaceComponent,
  },

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
