import { Component, OnInit, Input } from '@angular/core';

import { VPropertyService } from '../../services/vproperty.service';
import { NPropertyService } from '../../services/nproperty.service';
import { DPropertyService } from '../../services/dproperty.service';
import { DataService } from '../../services/data.service';
import { VwpropertyService } from '../../services/vwproperty.service';
import { IPropertyService } from '../../services/iproperty.service';




@Component({
  selector: 'app-vwproperty',
  templateUrl: './vwproperty.component.html',
  styleUrls: ['./vwproperty.component.css']
})
export class VwpropertyComponent implements OnInit {
  @Input() idInstance: any;
  propertys: any[];
  
  constructor(private service: VwpropertyService, private dPropertyService: DPropertyService,
              private iPropertyService: IPropertyService, private nPropertyService: NPropertyService, 
    private vPropertyService: VPropertyService) { }

  ngOnInit() {
    this.loadData();
  }

 
  loadData() {
     this.service.getByQueryParam({ 'idinstance': this.idInstance.id, 'idobject': this.idInstance.idobject.id })
      .subscribe(propertys => {
        this.propertys = propertys;
     });
   }

  getService(type) {
    switch (type) {
      case 'D': return this.dPropertyService;
      case 'I': return this.iPropertyService;
      case 'N': return this.nPropertyService;
      case 'V': return this.vPropertyService;
      default : return null;
    }
  }

  getPKName(type) {
    switch (type) {
      case 'D': return 'dpropertyPK';
      case 'I': return 'ipropertyPK';
      case 'N': return 'npropertyPK';
      case 'V': return 'vpropertyPK';
      default: return null;
    }
  }

  updateProperty(property: any, input: HTMLInputElement) {
    property.value = input.value;
    property[this.getPKName(property.type)] = property.vwPropertyPK;
    delete property.vwPropertyPK;
    console.log('property = ' + JSON.stringify(property));
    let myService = this.getService(property.type);
    if (myService instanceof DataService) {
      myService.update(property)
      .subscribe(updateproperty => {
        this.loadData();
      });
    }
  }

  isEqual(a, b) {
    return a === b ? true : false;
  }

}
