import { DataService } from './data.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class UnitMeasureService extends DataService {
    constructor(http: Http) {
        super(urlService + '/unitmeasure', http);
    }

}
