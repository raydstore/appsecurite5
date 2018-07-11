import { BadInput } from '../../common/bad-input';
import { NatureService } from '../../services/nature.service';
import { Nature } from '../../table/table';
import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/components/common/treenode';
import { LastidService } from '../../services/lastid.service';
import { AppError } from '../../common/app-error';
import { NotFoundError } from '../../common/not-found-error';

@Component({
  selector: 'app-nature',
  templateUrl: './nature.component.html',
  styleUrls: ['./nature.component.css']
})
export class NatureComponent implements OnInit {
  natures: any[];
  selectedNature: Nature;
  selectedNode: TreeNode;
  // nature: any;
  newNature: any = {
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
  titlelist = 'Nature dommage';
  constructor(private service: NatureService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getAll()
      .subscribe(natures => {
        this.natures = natures;
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


  createNature() {
    this.dialogVisible = false;
    this.natures = [this.newNature, ...this.natures];

    this.service.create(this.newNature)
      .subscribe(newNature => {
        this.loadData();
      }, (error: AppError) => {
        this.natures.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteNature(_nature: Nature) {
    let index = this.natures.indexOf(_nature);
    this.natures.splice(index, 1);
    this.natures = [...this.natures];
    this.service.delete(_nature.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.natures.splice(index, 0, _nature);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateNature(_nature, input: HTMLInputElement) {
    _nature.name = input.value;
    this.service.update(_nature)
      .subscribe(updatenature => {
        this.loadData();
        console.log(updatenature);
      });
  }

  cancelUpdate(_nature) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newNature = {
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
    let natures = [...this.natures];
    if (this.newMode) {
      natures.push(this.newNature);
    } else {
      natures[this.findSelectedNatureIndex()] = this.newNature;
    }
    this.natures = natures;
    this.newNature = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedNatureIndex();
    this.natures = this.natures.filter((val, i) => i !== index);
    this.newNature = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
  }

  cloneNature(c: Nature): Nature {
    let nature: Nature; 
    nature = c;
    return nature;
  }

  findSelectedNatureIndex(): number {
    return this.natures.indexOf(this.selectedNature);
  }
}



