import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { environment } from '../../environments/environment';
import { Property } from '../table/table';

const urlService = environment.urlService;

@Injectable()
export class VwpropertyService extends DataService<Property> {
  constructor(http: HttpClient) {
    super(urlService + '/vwproperty', http);
  }

}
