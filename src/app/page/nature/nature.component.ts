import { BadInput } from './../../common/bad-input';
import { NatureService } from './../../services/nature.service';
import { Nature } from './../../table/table';
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


  createNature() {
    this.dialogVisible = false;
    //  console.log(JSON.stringify(this.newNature));
    // this.natures.splice(0, 0, this.newNature);
    this.natures = [this.newNature, ...this.natures];
    // console.log('before natures' + JSON.stringify(this.lastids));

    this.service.create(this.newNature)
      .subscribe(newNature => {
        this.loadData();
        /*       console.log('newNature' + JSON.stringify(newNature));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('nature');
              console.log('last id nature = ' + lid);
              console.log('last id nature = ' + JSON.stringify(lid));
              this.natures[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        this.natures.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after natures' + this.getLastid('nature'));
  }

  deleteNature(_nature: Nature) {
    let index = this.natures.indexOf(_nature);
    this.natures.splice(index, 1);
    this.natures = [...this.natures];
    // this.natures.splice(index, 1);
    console.log('_nature' + _nature.id + ', ' + JSON.stringify(_nature));
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
    console.log('name = ' + input.value);
    console.log(_nature);
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
    // this.nature = new PrimeCar();
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
    /* this.newMode = false;
    this.newNature = this.cloneNature(event.data);
    this.dialogVisible = true; */
  }

  cloneNature(c: Nature): Nature {
    let nature: Nature; // = new Prime();
    /* for (let prop of c) {
      nature[prop] = c[prop];
    } */
    nature = c;
    return nature;
  }

  findSelectedNatureIndex(): number {
    return this.natures.indexOf(this.selectedNature);
  }
}



