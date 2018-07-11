import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Grid } from '../table/table';

const urlService = environment.urlService;

@Injectable()
export class VwgridService extends DataService<Grid> {
  constructor(http: HttpClient) {
    super(urlService + '/vwgrid', http);
  }

}
