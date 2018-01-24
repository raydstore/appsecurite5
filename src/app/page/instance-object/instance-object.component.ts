import { MarkService } from './../../services/mark.service';
import { SiteService } from './../../services/site.service';
import { PropertyService } from './../../services/property.service';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { ObjectService } from './../../services/object.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Object, Instance } from './../../table/table';
import { Property } from './../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';
import { InstanceService } from '../../services/instance.service';

@Component({
  selector: 'app-instance-object',
  templateUrl: 'instance-object.component.html',
  styleUrls: ['./instance-object.component.css']
})
export class InstanceObjectComponent implements OnInit {
  @Input() idObject: Object;
  instances: any[];
  selectedInstance: Instance;
  // instance: any;
  newInstance: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: 0,
    lastuser: 'ali',
    idsite: '',
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
  titlelist = 'Répartition objet';
  sites: any[];
  marks: any[];

  constructor(private service: InstanceService, private serviceProperty: PropertyService, private lastidService: LastidService,
              private siteService: SiteService, private markService: MarkService) {
  }

  ngOnInit() {
   /*  console.log('enter object = ' + JSON.stringify(this.idObject));
    console.log('enter object 2 = ' + this.idObject); */
    
    /* this.serviceProperty.getAll()
      .subscribe(propertys => {
        this.propertys = propertys;
      }); */
    this.loadData();

    this.siteService.getAll()
      .subscribe(sites => {
        this.sites = sites;
      });
    this.markService.getAll()
      .subscribe(marks => {
        this.marks = marks;
      });
    /* this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids); */
  }

  loadData() {
    this.service.getByQueryParam({ 'idobject': this.idObject.id })
      .subscribe(instances => {
        this.instances = instances;
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



  createInstance() {
    this.dialogVisible = false;
    //  console.log(JSON.stringify(this.newInstance));
    // this.instances.splice(0, 0, this.newInstance);
    this.newInstance.idobject = this.idObject;
    this.instances = [this.newInstance, ...this.instances];
    console.log('before instances' + JSON.stringify(this.newInstance));

    this.service.create(this.newInstance)
      .subscribe(newInstance => {
        this.loadData();
        // this.label['id'] = newlabel.id;
        //  console.log('in side instances' + JSON.stringify(this.lastidService.getItem('instance')));
      }, (error: AppError) => {
        this.instances.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after instances' + this.getLastid('instance'));
  }

  deleteInstance(_instance: Instance) {
    let index = this.instances.indexOf(_instance);
    this.instances.splice(index, 1);
    this.instances = [...this.instances];
    // this.instances.splice(index, 1);
    console.log('_instance' + _instance.id + ', ' + JSON.stringify(_instance));
    this.service.delete(_instance.id)
      .subscribe(
      null,
      (error: Response) => {
        this.instances.splice(index, 0, _instance);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateInstance(_instance, input: HTMLInputElement) {
    // _instance.name = input.value;
    this.service.update(_instance)
      .subscribe(updateinstance => {
        console.log(updateinstance);
      });
    console.log('name = ' + input.value);
    console.log(_instance);
  }

  cancelUpdate(_instance) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newInstance = {
      datecreate: new Date(),
      dateupdate: new Date(),
      id: 0,
      lastuser: 'ali',
      idsite: 0,
     // name: '',
      owner: 'ali'
    };
  }

  hideNewDialoge() {
    this.dialogVisible = false;
  }

  showDialogToAdd() {
    this.newMode = true;
    // this.instance = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let instances = [...this.instances];
    if (this.newMode) {
      instances.push(this.newInstance);
    } else {
      instances[this.findSelectedInstanceIndex()] = this.newInstance;
    }
    this.instances = instances;
    this.newInstance = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedInstanceIndex();
    this.instances = this.instances.filter((val, i) => i !== index);
    this.newInstance = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newInstance = this.cloneInstance(event.data);
    this.dialogVisible = true; */
  }

  cloneInstance(c: Instance): Instance {
    let instance: Instance; // = new Prime();
    /* for (let prop of c) {
      instance[prop] = c[prop];
    } */
    instance = c;
    return instance;
  }

  findSelectedInstanceIndex(): number {
    return this.instances.indexOf(this.selectedInstance);
  }

  /* la gestion des property d'objet */

  createProperty() {
    this.dialogVisibleProperty = false;
    //  console.log(JSON.stringify(this.newInstance));
    // this.instances.splice(0, 0, this.newInstance);
    this.propertys = [this.newInstance, ...this.propertys];
    // console.log('before instances' + JSON.stringify(this.lastids));

    this.service.create(this.newInstance)
      .subscribe(newInstance => {
        // this.label['id'] = newlabel.id;
        //  console.log('in side instances' + JSON.stringify(this.lastidService.getItem('instance')));
      }, (error: AppError) => {
        this.propertys.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after instances' + this.getLastid('instance'));
  }

  deleteProperty(_property: Property) {
    let index = this.instances.indexOf(_property);
    this.propertys.splice(index, 1);
    this.propertys = [...this.propertys];
    // this.instances.splice(index, 1);
    console.log('_instance' + _property.propertyPK.id + ', ' + JSON.stringify(_property));
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
    // this.instance = new PrimeCar();
    this.dialogVisibleProperty = true;
  }

  saveProperty() {
    let propertys = [...this.propertys];
    if (this.newMode) {
      propertys.push(this.newInstance);
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
      instance[prop] = c[prop];
    } */
    property = c;
    return property;
  }

  findSelectedPropertyIndex(): number {
    return this.propertys.indexOf(this.selectedProperty);
  }
}
