import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { TypeOperationService } from './../../services/type-operation.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { TypeOperation } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-type-operation',
  templateUrl: './type-operation.component.html',
  styleUrls: ['./type-operation.component.css']
})
export class TypeOperationComponent implements OnInit {
  typeOperations: any[];
  selectedTypeOperation: TypeOperation;
  // typeOperation: any;
  newTypeOperation: any = {
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
  titlelist = 'Type Opération';

  constructor(private service: TypeOperationService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    /* this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids); */
  }

  loadData() {
    this.service.getAll()
      .subscribe(typeOperations => {
        this.typeOperations = typeOperations;
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



  createTypeOperation() {
    this.dialogVisible = false;
    //  console.log(JSON.stringify(this.newTypeOperation));
    // this.typeOperations.splice(0, 0, this.newTypeOperation);
    this.typeOperations = [this.newTypeOperation, ...this.typeOperations];
    // console.log('before typeOperations' + JSON.stringify(this.lastids));

    this.service.create(this.newTypeOperation)
      .subscribe(newTypeOperation => {
        this.loadData();
        // this.label['id'] = newlabel.id;
        //  console.log('in side typeOperations' + JSON.stringify(this.lastidService.getItem('typeOperation')));
      }, (error: AppError) => {
        this.typeOperations.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after typeOperations' + this.getLastid('typeOperation'));
  }

  deleteTypeOperation(_typeOperation: TypeOperation) {
    let index = this.typeOperations.indexOf(_typeOperation);
    this.typeOperations.splice(index, 1);
    this.typeOperations = [...this.typeOperations];
    // this.typeOperations.splice(index, 1);
    console.log('_typeOperation' + _typeOperation.id + ', ' + JSON.stringify(_typeOperation));
    this.service.delete(_typeOperation.id)
      .subscribe(
      null,
      (error: Response) => {
        this.typeOperations.splice(index, 0, _typeOperation);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateTypeOperation(_typeOperation, input: HTMLInputElement) {
    _typeOperation.name = input.value;
    this.service.update(_typeOperation)
      .subscribe(updatetypeOperation => {
        this.loadData();
        console.log(updatetypeOperation);
      });
    console.log('name = ' + input.value);
    console.log(_typeOperation);
  }

  cancelUpdate(_typeOperation) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newTypeOperation = {
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
    // this.typeOperation = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let typeOperations = [...this.typeOperations];
    if (this.newMode) {
      typeOperations.push(this.newTypeOperation);
    } else {
      typeOperations[this.findSelectedTypeOperationIndex()] = this.newTypeOperation;
    }
    this.typeOperations = typeOperations;
    this.newTypeOperation = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedTypeOperationIndex();
    this.typeOperations = this.typeOperations.filter((val, i) => i !== index);
    this.newTypeOperation = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newTypeOperation = this.cloneTypeOperation(event.data);
    this.dialogVisible = true; */
  }

  cloneTypeOperation(c: TypeOperation): TypeOperation {
    let typeOperation: TypeOperation; // = new Prime();
    /* for (let prop of c) {
      typeOperation[prop] = c[prop];
    } */
    typeOperation = c;
    return typeOperation;
  }

  findSelectedTypeOperationIndex(): number {
    return this.typeOperations.indexOf(this.selectedTypeOperation);
  }
}



