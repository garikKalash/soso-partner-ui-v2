import {HttpHeaders} from '@angular/common/http';

export class UtilMethods {

  /**
   * we are making clone every time because of HttpHeaders is immutable class
   */
  public static cloneHeaders(headers: HttpHeaders): HttpHeaders {
    const httpHeaders = new HttpHeaders();
    headers.keys().forEach(value => {
      httpHeaders.append(value, headers.get(value));
    });
    return httpHeaders;
  }
}
