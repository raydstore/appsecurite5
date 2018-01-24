import { TypeOperationService } from './../../services/type-operation.service';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { OperationService } from './../../services/operation.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Operation } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.css']
})
export class OperationComponent implements OnInit {
  operations: any[];
  selectedOperation: Operation;
  // operation: any;
  newOperation: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: 0,
    lastuser: 'ali',
    name: '',
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;

  lastids: any[];
  lastid: any;
  titlelist = 'Opération';
  typeOperations: any[];

  constructor(private service: OperationService, private lastidService: LastidService,
              private typeOperationService: TypeOperationService) {
  }

  ngOnInit() {
    this.loadData();
    this.typeOperationService.getAll()
      .subscribe(typeOperations => {
        this.typeOperations = typeOperations;
      });
          /* this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids); */
  }

  loadData() {
    this.service.getAll()
      .subscribe(operations => {
        this.operations = operations;
      });
  }

  getLastid(name) {
    let a = '';
    this.lastidService.getAll()
      .subscribe(lastids => {
        for (let lid of lastids) {
          if (lid.name === name) { a = lid.count; }
        }
      });
    return a;
  }



  createOperation() {
    this.dialogVisible = false;
    //  console.log(JSON.stringify(this.newoperation));
    // this.operations.splice(0, 0, this.newoperation);
    this.operations = [this.newOperation, ...this.operations];
    console.log('before newOperation' + JSON.stringify(this.newOperation));

    this.service.create(this.newOperation)
      .subscribe(newOperation => {
        this.loadData();
        // this.label['id'] = newlabel.id;
        //  console.log('in side operations' + JSON.stringify(this.lastidService.getItem('operation')));
      }, (error: AppError) => {
        this.operations.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after operations' + this.getLastid('operation'));
  }

  deleteOperation(_operation: Operation) {
    let index = this.operations.indexOf(_operation);
    this.operations.splice(index, 1);
    this.operations = [...this.operations];
    // this.operations.splice(index, 1);
    console.log('_operation' + _operation.id + ', ' + JSON.stringify(_operation));
    this.service.delete(_operation.id)
      .subscribe(
      null,
      (error: Response) => {
        this.operations.splice(index, 0, _operation);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateOperation(_operation, input: HTMLInputElement) {
    _operation.name = input.value;
    this.service.update(_operation)
      .subscribe(updateoperation => {
        console.log(updateoperation);
      });
    console.log('name = ' + input.value);
    console.log(_operation);
  }

  cancelUpdate(_operation) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newOperation = {
      datecreate: new Date(),
      dateupdate: new Date(),
      id: 0,
      lastuser: 'ali',
      name: '',
      owner: 'ali'
    };
  }

  hideNewDialoge() {
    this.dialogVisible = false;
  }

  showDialogToAdd() {
    this.newMode = true;
    // this.operation = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let operations = [...this.operations];
    if (this.newMode) {
      operations.push(this.newOperation);
    } else {
      operations[this.findSelectedoperationIndex()] = this.newOperation;
    }
    this.operations = operations;
    this.newOperation = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedoperationIndex();
    this.operations = this.operations.filter((val, i) => i !== index);
    this.newOperation = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newoperation = this.cloneoperation(event.data);
    this.dialogVisible = true; */
  }

  cloneoperation(c: Operation): Operation {
    let operation: Operation; // = new Prime();
    /* for (let prop of c) {
      operation[prop] = c[prop];
    } */
    operation = c;
    return operation;
  }

  findSelectedoperationIndex(): number {
    return this.operations.indexOf(this.selectedOperation);
  }
}



