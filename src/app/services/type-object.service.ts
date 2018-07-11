import { TypeObject } from '../table/table';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const urlService = environment.urlService;

@Injectable()
export class TypeObjectService extends DataService<TypeObject> {
    constructor(http: HttpClient) {
        super(urlService + '/typeobject', http);
    }

}
