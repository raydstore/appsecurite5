import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http } from '@angular/http';

const urlService = environment.urlService;

@Injectable()
export class OperationService extends DataService{

  constructor(http: Http) {
    super(urlService + '/operation', http);
  }

}
