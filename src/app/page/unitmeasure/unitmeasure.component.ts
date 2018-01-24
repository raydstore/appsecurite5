import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { UnitMeasureService } from './../../services/unit-measure.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { UnitMeasure } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-unitmeasure',
  templateUrl: 'unitmeasure.component.html',
  styleUrls: ['./unitmeasure.component.css']
})
export class UnitmeasureComponent implements OnInit {
  unitMeasures: any[];
  selectedUnitmeasure: UnitMeasure;
  // unitmeasure: any;
  newUnitMeasure: any = {
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
  titlelist = 'Unité de Mesure';

  constructor(private service: UnitMeasureService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    /* this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids); */
  }

  loadData() {
    this.service.getAll()
      .subscribe(unitmeasures => {
        this.unitMeasures = unitmeasures;
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



  createUnitmeasure() {
    this.dialogVisible = false;
    //  console.log(JSON.stringify(this.newUnitmeasure));
    // this.unitmeasures.splice(0, 0, this.newUnitmeasure);
    this.unitMeasures = [this.newUnitMeasure, ...this.unitMeasures];
    // console.log('before unitmeasures' + JSON.stringify(this.lastids));

    this.service.create(this.newUnitMeasure)
      .subscribe(newUnitmeasure => {
        this.loadData();
        // this.label['id'] = newlabel.id;
        //  console.log('in side unitmeasures' + JSON.stringify(this.lastidService.getItem('unitmeasure')));
      }, (error: AppError) => {
        this.unitMeasures.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after unitmeasures' + this.getLastid('unitmeasure'));
  }

  deleteUnitmeasure(_unitmeasure: UnitMeasure) {
    let index = this.unitMeasures.indexOf(_unitmeasure);
    this.unitMeasures.splice(index, 1);
    this.unitMeasures = [...this.unitMeasures];
    // this.unitmeasures.splice(index, 1);
    console.log('_unitmeasure' + _unitmeasure.id + ', ' + JSON.stringify(_unitmeasure));
    this.service.delete(_unitmeasure.id)
      .subscribe(
      () => {
        this.loadData();
      },
      (error: Response) => {
        this.unitMeasures.splice(index, 0, _unitmeasure);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateUnitmeasure(_unitmeasure, input: HTMLInputElement) {
    _unitmeasure.name = input.value;
    this.service.update(_unitmeasure)
      .subscribe(updateunitmeasure => {
        // console.log(updateunitmeasure);
        this.loadData();
      });
    console.log('name = ' + input.value);
    console.log(_unitmeasure);
  }

  cancelUpdate(_unitmeasure) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newUnitMeasure = {
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
    // this.unitmeasure = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let unitMeasures = [...this.unitMeasures];
    if (this.newMode) {
      unitMeasures.push(this.newUnitMeasure);
    } else {
      unitMeasures[this.findSelectedUnitmeasureIndex()] = this.newUnitMeasure;
    }
    this.unitMeasures = unitMeasures;
    this.newUnitMeasure = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedUnitmeasureIndex();
    this.unitMeasures = this.unitMeasures.filter((val, i) => i !== index);
    this.newUnitMeasure = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newUnitmeasure = this.cloneUnitmeasure(event.data);
    this.dialogVisible = true; */
  }

  cloneUnitmeasure(c: UnitMeasure): UnitMeasure {
    let unitmeasure: UnitMeasure; // = new Prime();
    /* for (let prop of c) {
      unitmeasure[prop] = c[prop];
    } */
    unitmeasure = c;
    return unitmeasure;
  }

  findSelectedUnitmeasureIndex(): number {
    return this.unitMeasures.indexOf(this.selectedUnitmeasure);
  }
}



