import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Accidentnature } from '../table/table';

const urlService = environment.urlService;

@Injectable()
export class VwaccidentnatureService extends DataService<Accidentnature> {
  constructor(http: HttpClient) {
    super(urlService + '/vwaccidentnature', http);
  }

}
