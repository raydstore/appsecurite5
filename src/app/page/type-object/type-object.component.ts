import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { TypeObjectService } from '../../services/type-object.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { TypeObject } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-type-object',
  templateUrl: './type-object.component.html',
  styleUrls: ['./type-object.component.css']
})
export class TypeObjectComponent implements OnInit {
  typeObjects: any[];
  selectedTypeObject: TypeObject;
  // typeObject: any;
  newTypeObject: any = {
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
  titlelist = 'Type Objet';

  constructor(private service: TypeObjectService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.service.getAll()
      .subscribe(typeObjects => {
        this.typeObjects = typeObjects;
      });
    /* this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids); */
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



  createTypeObject() {
    this.dialogVisible = false;
    this.typeObjects = [this.newTypeObject, ...this.typeObjects];
    this.service.create(this.newTypeObject)
      .subscribe(newTypeObject => {
      }, (error: AppError) => {
        this.typeObjects.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteTypeObject(_typeObject: TypeObject) {
    let index = this.typeObjects.indexOf(_typeObject);
    this.typeObjects.splice(index, 1);
    this.typeObjects = [...this.typeObjects];
    this.service.delete(_typeObject.id)
      .subscribe(
      null,
      (error: Response) => {
        this.typeObjects.splice(index, 0, _typeObject);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateTypeObject(_typeObject, input: HTMLInputElement) {
    _typeObject.name = input.value;
    this.service.update(_typeObject)
      .subscribe(updatetypeObject => {
        console.log(updatetypeObject);
      });
  }

  cancelUpdate(_typeObject) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newTypeObject = {
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
    let typeObjects = [...this.typeObjects];
    if (this.newMode) {
      typeObjects.push(this.newTypeObject);
    } else {
      typeObjects[this.findSelectedTypeObjectIndex()] = this.newTypeObject;
    }
    this.typeObjects = typeObjects;
    this.newTypeObject = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedTypeObjectIndex();
    this.typeObjects = this.typeObjects.filter((val, i) => i !== index);
    this.newTypeObject = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
  }

  cloneTypeObject(c: TypeObject): TypeObject {
    let typeObject: TypeObject; 
    typeObject = c;
    return typeObject;
  }

  findSelectedTypeObjectIndex(): number {
    return this.typeObjects.indexOf(this.selectedTypeObject);
  }
}



