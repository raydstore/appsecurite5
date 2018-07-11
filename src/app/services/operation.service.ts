import { Operation } from '../table/table';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

const urlService = environment.urlService;

@Injectable()
export class OperationService extends DataService<Operation> {
  constructor(http: HttpClient) {
    super(urlService + '/operation', http);
  }

}
