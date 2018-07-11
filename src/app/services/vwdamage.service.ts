import { Damage } from '../table/table';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class VwdamageService extends DataService<Damage> {
  constructor(http: HttpClient) {
    super(urlService + '/vwdamage', http);
  }

}
