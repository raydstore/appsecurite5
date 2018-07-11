import { DamageDefinition } from '../../table/table';
import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { DamagedefinitionService } from '../../services/damagedefinition.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-damagedefinition',
  templateUrl: 'damagedefinition.component.html',
  styleUrls: ['./damagedefinition.component.css']
})
export class DamagedefinitionComponent implements OnInit {
  @Input() iddamage: number;
  @Input() idgrid: number;
  @Input() accidentdomain: number;
  @Input() titlelist: string;

  damagedefinitions: any[];
  selectedDamagedefinition: DamageDefinition;
  selectedNode: TreeNode;

  newDamagedefinition: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: 0,
    iddamage: this.iddamage,
    idgrid: this.idgrid,
    accidentdomain: this.accidentdomain,
    lastuser: 'ali',
    name: '',
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;

  lastids: any[];
  lastid: any;
  

  constructor(private service: DamagedefinitionService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getByQueryParam({ 'iddamage': this.iddamage, 'idgrid': this.idgrid, 'accidentdomain': this.accidentdomain })
      .subscribe(damagedefinitions => {
        this.damagedefinitions = damagedefinitions;
      });
  }

  loadLastId() {
    this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids);
  }

  getLastid(name) {
    let lts: any[];
    this.loadLastId();
    for (let lid of this.lastids) {
      if (lid.id === name) {
        return lid['count'];
      }
    }
    return 0;
  }

  nodeExpand(event) {
    this.selectedNode = event.node;
  }

  isSelected(event) {
    return this.selectedNode === event.node ? true : false;
  }


  createDamagedefinition() {
    this.dialogVisible = false;
    this.damagedefinitions = [this.newDamagedefinition, ...this.damagedefinitions];

    this.service.create(this.newDamagedefinition)
      .subscribe(newDamagedefinition => {
        this.loadData();
      }, (error: AppError) => {
        this.damagedefinitions.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteDamagedefinition(_damagedefinition: DamageDefinition) {
    let index = this.damagedefinitions.indexOf(_damagedefinition);
    this.damagedefinitions.splice(index, 1);
    this.damagedefinitions = [...this.damagedefinitions];
    this.service.delete(_damagedefinition.id)
      .subscribe(
        () => { this.loadData(); },
        (error: Response) => {
          this.damagedefinitions.splice(index, 0, _damagedefinition);

          if (error instanceof NotFoundError) {
            alert('this post has already been deleted');
          } else {
            throw error;
          }
        }
      );
  }

  updateDamagedefinition(_damagedefinition) {
    this.service.update(_damagedefinition)
      .subscribe(updatedamagedefinition => {
        this.loadData();
      });
  }

  cancelUpdate(_damagedefinition) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newDamagedefinition = {
      datecreate: new Date(),
      dateupdate: new Date(),
      id: 0,
      lastuser: 'ali',
      name: '',
      iddamage: this.iddamage,
      idgrid: this.idgrid,
      accidentdomain: this.accidentdomain,
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
    let damagedefinitions = [...this.damagedefinitions];
    if (this.newMode) {
      damagedefinitions.push(this.newDamagedefinition);
    } else {
      damagedefinitions[this.findSelectedDamagedefinitionIndex()] = this.newDamagedefinition;
    }
    this.damagedefinitions = damagedefinitions;
    this.newDamagedefinition = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedDamagedefinitionIndex();
    this.damagedefinitions = this.damagedefinitions.filter((val, i) => i !== index);
    this.newDamagedefinition = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
  }

  cloneDamagedefinition(c: DamageDefinition): DamageDefinition {
    let damagedefinition: DamageDefinition;
    damagedefinition = c;
    return damagedefinition;
  }

  findSelectedDamagedefinitionIndex(): number {
    return this.damagedefinitions.indexOf(this.selectedDamagedefinition);
  }
}



