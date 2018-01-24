import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { AccidentService } from './../../services/accident.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Accident } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-accident',
  templateUrl: 'accident.component.html',
  styleUrls: ['./accident.component.css']
})
export class AccidentComponent implements OnInit {
  accidents: any[];
  selectedAccident: Accident;
  selectedNode: TreeNode;
  // accident: any;
  newAccident: any = {
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
  titlelist = 'Accident';

  constructor(private service: AccidentService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getAll()
      .subscribe(accidents => {
        this.accidents = accidents;
      });
  }

  loadLastId() {
    this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids);
  }

  getLastid(name) {
    let lts: any[];
    this.loadLastId();
    console.log('before lts' + JSON.stringify(this.lastids));
    for (let lid of this.lastids) {
      if (lid.id === name) {
        return lid['count'];
      }
    }
    return 0;
    //  console.log('before lid.count' + JSON.stringify(lid));
    //  return lid.count;
  }

  nodeExpand(event) {
    this.selectedNode = event.node;
    console.log('selected node ' + JSON.stringify(this.selectedNode));
  }

  isSelected(event) {
    return this.selectedNode === event.node ? true : false;
  }


  createAccident() {
    this.dialogVisible = false;
    //  console.log(JSON.stringify(this.newAccident));
    // this.accidents.splice(0, 0, this.newAccident);
    this.accidents = [this.newAccident, ...this.accidents];
    // console.log('before accidents' + JSON.stringify(this.lastids));

    this.service.create(this.newAccident)
      .subscribe(newAccident => {
        this.loadData();
        /*       console.log('newAccident' + JSON.stringify(newAccident));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('accident');
              console.log('last id accident = ' + lid);
              console.log('last id accident = ' + JSON.stringify(lid));
              this.accidents[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        this.accidents.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after accidents' + this.getLastid('accident'));
  }

  deleteAccident(_accident: Accident) {
    let index = this.accidents.indexOf(_accident);
    this.accidents.splice(index, 1);
    this.accidents = [...this.accidents];
    // this.accidents.splice(index, 1);
    console.log('_accident' + _accident.id + ', ' + JSON.stringify(_accident));
    this.service.delete(_accident.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.accidents.splice(index, 0, _accident);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateAccident(_accident, input: HTMLInputElement) {
    _accident.name = input.value;
    this.service.update(_accident)
      .subscribe(updateaccident => {
        this.loadData();
        console.log(updateaccident);
      });
    console.log('name = ' + input.value);
    console.log(_accident);
  }

  cancelUpdate(_accident) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAccident = {
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
    // this.accident = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let accidents = [...this.accidents];
    if (this.newMode) {
      accidents.push(this.newAccident);
    } else {
      accidents[this.findSelectedAccidentIndex()] = this.newAccident;
    }
    this.accidents = accidents;
    this.newAccident = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedAccidentIndex();
    this.accidents = this.accidents.filter((val, i) => i !== index);
    this.newAccident = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newAccident = this.cloneAccident(event.data);
    this.dialogVisible = true; */
  }

  cloneAccident(c: Accident): Accident {
    let accident: Accident; // = new Prime();
    /* for (let prop of c) {
      accident[prop] = c[prop];
    } */
    accident = c;
    return accident;
  }

  findSelectedAccidentIndex(): number {
    return this.accidents.indexOf(this.selectedAccident);
  }
}



