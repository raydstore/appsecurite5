import { Rank } from '../table/table';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class RankService extends DataService<Rank> {
  constructor(http: HttpClient) {
    super(urlService + '/rank', http);
  }

}
