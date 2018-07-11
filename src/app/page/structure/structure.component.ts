import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { StructureService } from '../../services/structure.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Structure } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-structure',
  templateUrl: 'structure.component.html',
  styleUrls: ['./structure.component.css']
})
export class StructureComponent implements OnInit {
  structures: any[];
  selectedStructure: Structure;
  selectedNode: TreeNode;

  newStructure: any = {
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
  titlelist = 'Marque';

  constructor(private service: StructureService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getAll()
      .subscribe(structures => {
        this.structures = structures;
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


  createStructure() {
    this.dialogVisible = false;
    this.structures = [this.newStructure, ...this.structures];


    this.service.create(this.newStructure)
      .subscribe(newStructure => {
        this.loadData();
      }, (error: AppError) => {
        this.structures.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteStructure(_structure: Structure) {
    let index = this.structures.indexOf(_structure);
    this.structures.splice(index, 1);
    this.structures = [...this.structures];
    this.service.delete(_structure.id)
      .subscribe(
        () => { this.loadData(); },
        (error: Response) => {
          this.structures.splice(index, 0, _structure);

          if (error instanceof NotFoundError) {
            alert('this post has already been deleted');
          } else {
            throw error;
          }
        }
      );
  }

  updateStructure(_structure, input: HTMLInputElement) {
    _structure.name = input.value;
    this.service.update(_structure)
      .subscribe(updatestructure => {
        this.loadData();
      });
  }

  cancelUpdate(_structure) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newStructure = {
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
    this.dialogVisible = true;
  }

  save() {
    let structures = [...this.structures];
    if (this.newMode) {
      structures.push(this.newStructure);
    } else {
      structures[this.findSelectedStructureIndex()] = this.newStructure;
    }
    this.structures = structures;
    this.newStructure = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedStructureIndex();
    this.structures = this.structures.filter((val, i) => i !== index);
    this.newStructure = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
  }

  cloneStructure(c: Structure): Structure {
    let structure: Structure;
    structure = c;
    return structure;
  }

  findSelectedStructureIndex(): number {
    return this.structures.indexOf(this.selectedStructure);
  }
}



