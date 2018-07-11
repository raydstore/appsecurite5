import { Accidentcause } from '../table/table';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class AccidentcauseService extends DataService<Accidentcause> {
  constructor(http: HttpClient) {
    super(urlService + '/accidentcause', http);
  }

}
