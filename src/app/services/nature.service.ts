import { Nature } from '../table/table';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class NatureService extends DataService<Nature> {

  constructor (http: HttpClient) {
      super(urlService + '/nature', http);
  }

}
