import { PropertyService } from './../../services/property.service';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { ObjectService } from './../../services/object.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Object } from '../../table/table';
import { Property } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';
import { TypeObjectService } from '../../services/type-object.service';

@Component({
  selector: 'app-object',
  templateUrl: 'object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {
  objects: any[];
  selectedObject: Object;
  // object: any;
  newObject: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: 0,
    lastuser: 'ali',
    name: '',
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;

  /* variable pour les propertys*/

  propertys: any[];
  selectedProperty: Property;
  newProperty: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: 0,
    lastuser: 'ali',
    name: '',
    owner: 'ali'
  }; 
  dialogVisibleProperty = false;
  newModeProperty = false;

  /* */
  lastids: any[];
  lastid: any;
  titlelist = 'Objet';
  typeObjects: any[];

  constructor(private service: ObjectService, private serviceProperty: PropertyService, 
    private lastidService: LastidService, private typeObjectService: TypeObjectService) {
  }

  ngOnInit() {
    this.loadData();
    this.serviceProperty.getAll()
      .subscribe(propertys => {
        this.propertys = propertys;
      });
    this.typeObjectService.getAll()
      .subscribe(typeObjects => {
        this.typeObjects = typeObjects;
      });
    /* this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids); */
  }

  loadData() {
    this.service.getAll()
      .subscribe(objects => {
        this.objects = objects;
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



  createObject() {
    this.dialogVisible = false;
    //  console.log(JSON.stringify(this.newObject));
    // this.objects.splice(0, 0, this.newObject);
    this.objects = [this.newObject, ...this.objects];
    console.log('before objects' + JSON.stringify(this.newObject));

    this.service.create(this.newObject)
      .subscribe(newObject => {
        this.loadData();
        // this.label['id'] = newlabel.id;
        //  console.log('in side objects' + JSON.stringify(this.lastidService.getItem('object')));
      }, (error: AppError) => {
        this.objects.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after objects' + this.getLastid('object'));
  }

  deleteObject(_object: Object) {
    let index = this.objects.indexOf(_object);
    this.objects.splice(index, 1);
    this.objects = [...this.objects];
    // this.objects.splice(index, 1);
    console.log('_object' + _object.id + ', ' + JSON.stringify(_object));
    this.service.delete(_object.id)
      .subscribe(
      null,
      (error: Response) => {
        this.objects.splice(index, 0, _object);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateObject(_object, input: HTMLInputElement) {
    _object.name = input.value;
    this.service.update(_object)
      .subscribe(updateobject => {
        console.log(updateobject);
      });
    console.log('name = ' + input.value);
    console.log(_object);
  }

  cancelUpdate(_object) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newObject = {
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
    // this.object = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let objects = [...this.objects];
    if (this.newMode) {
      objects.push(this.newObject);
    } else {
      objects[this.findSelectedObjectIndex()] = this.newObject;
    }
    this.objects = objects;
    this.newObject = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedObjectIndex();
    this.objects = this.objects.filter((val, i) => i !== index);
    this.newObject = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newObject = this.cloneObject(event.data);
    this.dialogVisible = true; */
  }

  cloneObject(c: Object): Object {
    let object: Object; // = new Prime();
    /* for (let prop of c) {
      object[prop] = c[prop];
    } */
    object = c;
    return object;
  }

  findSelectedObjectIndex(): number {
    return this.objects.indexOf(this.selectedObject);
  }

  /* la gestion des property d'objet */

  createProperty() {
    this.dialogVisibleProperty = false;
    //  console.log(JSON.stringify(this.newObject));
    // this.objects.splice(0, 0, this.newObject);
    this.propertys = [this.newObject, ...this.propertys];
    // console.log('before objects' + JSON.stringify(this.lastids));

    this.service.create(this.newObject)
      .subscribe(newObject => {
        // this.label['id'] = newlabel.id;
        //  console.log('in side objects' + JSON.stringify(this.lastidService.getItem('object')));
      }, (error: AppError) => {
        this.propertys.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after objects' + this.getLastid('object'));
  }

  deleteProperty(_property: Property) {
    let index = this.objects.indexOf(_property);
    this.propertys.splice(index, 1);
    this.propertys = [...this.propertys];
    // this.objects.splice(index, 1);
    console.log('_object' + _property.propertyPK.id + ', ' + JSON.stringify(_property));
    this.service.delete(_property.propertyPK.id)
      .subscribe(
      null,
      (error: Response) => {
        this.propertys.splice(index, 0, _property);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateProperty(_property, input: HTMLInputElement) {
    _property.name = input.value;
    this.service.update(_property)
      .subscribe(updateproperty => {
        console.log(updateproperty);
      });
    console.log('name = ' + input.value);
    console.log(_property);
  }

  cancelUpdateProperty(_property) {
    //
  }

  showNewDialogeProperty() {
    this.dialogVisibleProperty = true;
    this.newModeProperty = true;
    this.newProperty = {
      datecreate: new Date(),
      dateupdate: new Date(),
      id: 0,
      lastuser: 'ali',
      name: '',
      owner: 'ali'
    };
  }

  hideNewDialogeProperty() {
    this.dialogVisibleProperty = false;
  }

  showDialogToAddProperty() {
    this.newModeProperty = true;
    // this.object = new PrimeCar();
    this.dialogVisibleProperty = true;
  }

  saveProperty() {
    let propertys = [...this.propertys];
    if (this.newMode) {
      propertys.push(this.newObject);
    } else {
      propertys[this.findSelectedPropertyIndex()] = this.newProperty;
    }
    this.propertys = propertys;
    this.newProperty = null;
    this.dialogVisible = false;
  }

  deleteP() {
    let index = this.findSelectedPropertyIndex();
    this.propertys = this.propertys.filter((val, i) => i !== index);
    this.newProperty = null;
    this.dialogVisible = false;
  }



  cloneProperty(c: Property): Property {
    let property: Property; // = new Prime();
    /* for (let prop of c) {
      object[prop] = c[prop];
    } */
    property = c;
    return property;
  }

  findSelectedPropertyIndex(): number {
    return this.propertys.indexOf(this.selectedProperty);
  }
}





