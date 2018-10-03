import {FormControl} from '@angular/forms';
import {ElementRef, Injectable, NgZone} from '@angular/core';
import {Http, RequestOptions, Response, ResponseContentType} from '@angular/http';
import { Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GMap} from 'primeng/gmap';

/**
 * Created by Home on 4/20/2017.
 */

const GET_ADDRESS_OF_MARKER_URL = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=';
@Injectable()
export class AddressService {
  public latitude: number;
  public longitude: number;
  public address: string;

  public searchControl: FormControl = new FormControl();
  public zoom: number;

  public searchElementRef: ElementRef;
  public map: GMap;

  public _isNeedChangeAddress = false;


  constructor(private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private http: HttpClient) {

  }

  initMapDetails(addressMap: GMap, searchElementRef: ElementRef, longitude: number, latitude: number): void {
    this.searchElementRef = searchElementRef;

    if (longitude != null && latitude != null) {
      this.latitude = latitude;
      this.longitude = longitude;
      this.zoom = 15;
    } else {
      // set google maps defaults
      this.zoom = 4;
      this.latitude = 39.8282;
      this.longitude = -98.5795;
      // set current position
      this.setCurrentPosition();
    }

    this.map = addressMap;


    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {

      const autocomplete = new google.maps.places.Autocomplete(searchElementRef.nativeElement);

      autocomplete.addListener('place_changed', () => {

          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.address = place.formatted_address;
          this.zoom = 20;
          this.map.overlays = [];
          this.map.overlays.push(new google.maps.Marker({position : {lat: this.latitude, lng: this.longitude},
                                                              title: searchElementRef.nativeElement.value } ));
          this.map.getMap().setCenter(new google.maps.LatLng(this.latitude, this.longitude));
          this.map.getMap().setZoom(16);

        });

    });

  }

  setCurrentPosition(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  getAddressByCoordinates(lat: number, long: number): Observable<string> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const options = { headers: headers};

    return this.http.get(GET_ADDRESS_OF_MARKER_URL + lat + ',' + long + '&sensor=true', options)
                    .pipe(map((response: Response) => response.text()));
  }

}
