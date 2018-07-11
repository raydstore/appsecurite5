import { TypeOperationService } from '../../services/type-operation.service';
import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { OperationService } from '../../services/operation.service';
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
    this.operations = [this.newOperation, ...this.operations];
    this.service.create(this.newOperation)
      .subscribe(newOperation => {
        this.loadData();
      }, (error: AppError) => {
        this.operations.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteOperation(_operation: Operation) {
    let index = this.operations.indexOf(_operation);
    this.operations.splice(index, 1);
    this.operations = [...this.operations];
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
  }

  cloneoperation(c: Operation): Operation {
    let operation: Operation; 
    operation = c;
    return operation;
  }

  findSelectedoperationIndex(): number {
    return this.operations.indexOf(this.selectedOperation);
  }
}



