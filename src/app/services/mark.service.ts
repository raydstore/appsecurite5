import { Mark } from '../table/table';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class MarkService extends DataService<Mark> {
    constructor(http: HttpClient) {
        super(urlService + '/mark', http);
    }

}
