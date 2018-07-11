import { UnitMeasure } from '../table/table';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class UnitMeasureService extends DataService<UnitMeasure> {
    constructor(http: HttpClient) {
        super(urlService + '/unitmeasure', http);
    }

}
