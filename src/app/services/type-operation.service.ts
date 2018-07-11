import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TypeOperation } from '../table/table';

const urlService = environment.urlService;

@Injectable()
export class TypeOperationService extends DataService<TypeOperation> {
    constructor(http: HttpClient) {
        super(urlService + '/typeoperation', http);
    }

}
