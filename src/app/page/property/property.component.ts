import { UnitMeasureService } from '../../services/unit-measure.service';
import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { PropertyService } from '../../services/property.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Property } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';
import { NgClass } from '@angular/common';
import { ListboxModule } from 'primeng/listbox';
import { Subject } from 'rxjs/Subject';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

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

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

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

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.unitMeasures : this.unitMeasures.filter(v => (v.id + v.name).toLowerCase()
        .indexOf(term.toLowerCase()) > -1)).slice(0, 10));
  formatter = (x: { name: string }) => x.name;

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
    this.propertys = [this.newProperty, ...this.propertys];
    this.service.create(this.newProperty)
      .subscribe(newProperty => {
        this.loadData();
      }, (error: AppError) => {
        this.propertys.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteProperty(_property: any) {
    let index = this.propertys.indexOf(_property);
    this.propertys.splice(index, 1);
    this.propertys = [...this.propertys];
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
  }

  cloneProperty(c: Property): Property {
    let property: Property; 
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



