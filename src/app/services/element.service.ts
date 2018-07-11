import { Element } from '../table/table';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class ElementService extends DataService<Element> {
  constructor(http: HttpClient) {
    super(urlService + '/element', http);
  }

}
