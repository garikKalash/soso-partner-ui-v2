import {TranslateLoader} from '@ngx-translate/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Message} from './models/message.model';
import {environment} from '../environments/environment';
import {MessageService} from './service/message.service';
import {map} from 'rxjs/operators';

export class CustomLoader implements TranslateLoader {

  constructor(private messageService: MessageService) {

  }

  getTranslation(lang: string): Observable<any> {
      if (lang === 'eng') {
        return this.getEng();
      } else {
        return this.getHay();
      }
  }


  getHay(): Observable<any> {
  return  this.messageService.getAllMessages().pipe(map(value => {
      const obj = {};
      value.forEach(value1 => {
        obj[value1.globkey] = value1.hay;
      });
      return obj;
    }));
  }

  getEng(): Observable<any> {
    return  this.messageService.getAllMessages().pipe(map(value => {
      const obj = {};
      value.forEach(value1 => {
        obj[value1.globkey] = value1.eng;
      });
      return obj;
    }));
  }
}

