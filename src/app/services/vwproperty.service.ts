import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { environment } from './../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class VwpropertyService extends DataService {
  constructor(http: HttpClient) {
    super(urlService + '/vwproperty', http);
  }

}
