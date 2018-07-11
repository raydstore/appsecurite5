import { Accidentvehicule } from '../table/table';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class AccidentvehiculeService extends DataService<Accidentvehicule> {
  constructor(http: HttpClient) {
    super(urlService + '/accidentvehicule', http);
  }


}
