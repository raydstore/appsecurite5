import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { AccidentmaterialService } from '../../services/accidentmaterial.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Accidentmaterial } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-accidentmaterial',
  templateUrl: 'accidentmaterial.component.html',
  styleUrls: ['./accidentmaterial.component.css']
})
export class AccidentmaterialComponent implements OnInit {
  @Input() iddamage: number;
  @Input() idgrid: number;
  @Input() accidentdomain: number;
  @Input() titlelist: string;

  accidentmaterials: any[];
  selectedAccidentmaterial: Accidentmaterial;
  selectedNode: TreeNode;

  newAccidentmaterial: any = {
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
  

  constructor(private service: AccidentmaterialService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getByQueryParam({ 'iddamage': this.iddamage, 'idgrid': this.idgrid, 'accidentdomain': this.accidentdomain })
      .subscribe(accidentmaterials => {
        this.accidentmaterials = accidentmaterials;
      });
  }

  loadLastId() {
    this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids);
  }

  getLastid(name) {
    let lts: any[] ;
    this.loadLastId(); 
    for (let lid of this.lastids)  {
        if (lid.id === name) {
           return lid['count'] ;
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


  createAccidentmaterial() {
    this.dialogVisible = false;
    this.accidentmaterials = [this.newAccidentmaterial, ...this.accidentmaterials];


    this.service.create(this.newAccidentmaterial)
      .subscribe(newAccidentmaterial => {
        this.loadData();
      }, (error: AppError) => {
        this.accidentmaterials.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteAccidentmaterial(_accidentmaterial: Accidentmaterial) {
    let index = this.accidentmaterials.indexOf(_accidentmaterial);
    this.accidentmaterials.splice(index, 1);
    this.accidentmaterials = [...this.accidentmaterials] ;
    this.service.delete(_accidentmaterial.id)
      .subscribe(
      () => { this.loadData(); } ,
      (error: Response) => {
        this.accidentmaterials.splice(index, 0, _accidentmaterial);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateAccidentmaterial(_accidentmaterial) {
    this.service.update(_accidentmaterial)
      .subscribe(updateaccidentmaterial => {
        this.loadData();
      });
  }

  cancelUpdate(_accidentmaterial) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAccidentmaterial = {
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
  }

  hideNewDialoge() {
    this.dialogVisible = false;
  }

  showDialogToAdd() {
    this.newMode = true;
    this.dialogVisible = true;
  }

  save() {
    let accidentmaterials = [...this.accidentmaterials];
    if (this.newMode) {
      accidentmaterials.push(this.newAccidentmaterial);
    } else {
      accidentmaterials[this.findSelectedAccidentmaterialIndex()] = this.newAccidentmaterial;
    }
    this.accidentmaterials = accidentmaterials;
    this.newAccidentmaterial = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedAccidentmaterialIndex();
    this.accidentmaterials = this.accidentmaterials.filter((val, i) => i !== index);
    this.newAccidentmaterial = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
  }

  cloneAccidentmaterial(c: Accidentmaterial): Accidentmaterial {
    let accidentmaterial: Accidentmaterial;
    accidentmaterial = c;
    return accidentmaterial;
  }

  findSelectedAccidentmaterialIndex(): number {
    return this.accidentmaterials.indexOf(this.selectedAccidentmaterial);
  }
}



