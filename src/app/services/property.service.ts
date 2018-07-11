import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Property } from '../table/table';

const urlService = environment.urlService;

@Injectable()
export class PropertyService extends DataService<Property> {
    constructor(http: HttpClient) {
        super(urlService + '/property', http);
    }

}
