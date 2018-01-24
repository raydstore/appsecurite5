import { UnitMeasureService } from './../../services/unit-measure.service';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { PropertyService } from './../../services/property.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Property } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-property',
  templateUrl: 'property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {
  @Input() idObject: any;
  propertys: any[];
  unitMeasures: any[];
  selectedProperty: Property;
  // property: any;
  newProperty: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    idunitmeasure: '',
    lastuser: 'ali',
    name: '',
    object1: '',
    owner: 'ali',
    propertyPK: '',
    type: 'V'
  };
  typeObjects = [
    { id: 'I', name: 'Entier' },
    { id: 'N', name: 'Numeric' },
    { id: 'V', name: 'Charactère' },
    { id: 'D', name: 'Date' }
  ];
  dialogVisible = false;
  newMode = false;

  lastids: any[];
  lastid: any;

  constructor(private service: PropertyService, private unitMeasureService: UnitMeasureService, private lastidService: LastidService) {
  }

  ngOnInit() {
  //  this.service.getAll()
    this.loadData();
    /*  */
    this.unitMeasureService.getAll()
      .subscribe(unitMeasures => {
        this.unitMeasures = unitMeasures;
      });
    /*  */
    /* this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids); */
  }

  loadData() {
    this.service.getByQueryParam({ 'idobject': this.idObject.id })
      .subscribe(propertys => {
        this.propertys = propertys;
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



  createProperty() {
    this.dialogVisible = false;
    console.log(JSON.stringify(this.newProperty));
    // this.propertys.splice(0, 0, this.newProperty);
   // this.newProperty.
    this.propertys = [this.newProperty, ...this.propertys];
    // console.log('before propertys' + JSON.stringify(this.lastids));

    this.service.create(this.newProperty)
      .subscribe(newProperty => {
        this.loadData();
        // this.label['id'] = newlabel.id;
        //  console.log('in side propertys' + JSON.stringify(this.lastidService.getItem('property')));
      }, (error: AppError) => {
        this.propertys.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after propertys' + this.getLastid('property'));
  }

  deleteProperty(_property: any) {
    let index = this.propertys.indexOf(_property);
    this.propertys.splice(index, 1);
    this.propertys = [...this.propertys];
    // this.propertys.splice(index, 1);
    console.log('_property' + _property.propertyPK.id + ', ' + JSON.stringify(_property));
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
        this.loadData();
        console.log(updateproperty);
      });
    console.log('name = ' + input.value);
    console.log(_property);
  }

  cancelUpdate(_property) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newProperty.name = '';
    this.newProperty.type = 'V';
  }

  hideNewDialoge() {
    this.dialogVisible = false;
  }

  showDialogToAdd() {
    this.newMode = true;
    // this.property = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let propertys = [...this.propertys];
    if (this.newMode) {
      propertys.push(this.newProperty);
    } else {
      propertys[this.findSelectedPropertyIndex()] = this.newProperty;
    }
    this.propertys = propertys;
    this.newProperty = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedPropertyIndex();
    this.propertys = this.propertys.filter((val, i) => i !== index);
    this.newProperty = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newProperty = this.cloneProperty(event.data);
    this.dialogVisible = true; */
  }

  cloneProperty(c: Property): Property {
    let property: Property; // = new Prime();
    /* for (let prop of c) {
      property[prop] = c[prop];
    } */
    property = c;
    return property;
  }

  findSelectedPropertyIndex(): number {
    return this.propertys.indexOf(this.selectedProperty);
  }

  isEqual(a, b) {
    return a === b ? true : false;
  }
}



