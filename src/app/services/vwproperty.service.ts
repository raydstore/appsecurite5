import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from './data.service';
import { environment } from './../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class VwpropertyService extends DataService {
  constructor(http: Http) {
    super(urlService + '/vwproperty', http);
  }

}
