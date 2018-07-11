import { PropertyService } from '../../services/property.service';
import { Component, OnInit } from '@angular/core';
import { ObjectService } from '../../services/object.service';

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.css']
})
export class InstanceComponent implements OnInit {
  objects: any[];
  selectedObject: any;
  propertys: any[];
  selectedId = 1;

  constructor(private service: ObjectService, private serviceProperty: PropertyService) { }

  ngOnInit() {
    this.service.getAll()
      .subscribe(objects => {
        this.objects = objects;
      });
    this.serviceProperty.getAll()
      .subscribe(propertys => {
        this.propertys = propertys;
      });
  }

  showNewDialoge() {

  }

  updateProperty(item) {

  }

  isEqual(a, b) {
    return a === b ? true : false;
  }

  selectObject(object) {
    this.selectedObject = object;
    this.selectedId = object.id;
  }

  isSelectedObject(object) {
    return this.selectedId === object.id  ? true : false;
  }

}
