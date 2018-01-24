import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { MarkService } from './../../services/mark.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Mark } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-mark',
  templateUrl: 'mark.component.html',
  styleUrls: ['./mark.component.css']
})
export class MarkComponent implements OnInit {
  marks: any[];
  selectedMark: Mark;
  selectedNode: TreeNode;
  // mark: any;
  newMark: any = {
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

  constructor(private service: MarkService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getAll()
      .subscribe(marks => {
        this.marks = marks;
      });
  }

  loadLastId() {
    this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids);
  }

  getLastid(name) {
    let lts: any[] ;
    this.loadLastId(); 
    console.log('before lts' + JSON.stringify(this.lastids));
    for (let lid of this.lastids)  {
        if (lid.id === name) {
           return lid['count'] ;
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


  createMark() {
    this.dialogVisible = false;
  //  console.log(JSON.stringify(this.newMark));
    // this.marks.splice(0, 0, this.newMark);
    this.marks = [this.newMark, ...this.marks];
    // console.log('before marks' + JSON.stringify(this.lastids));

    this.service.create(this.newMark)
      .subscribe(newMark => {
        this.loadData();
  /*       console.log('newMark' + JSON.stringify(newMark));
        console.log('first lastids' + JSON.stringify(this.lastids));
        let lid = this.getLastid('mark');
        console.log('last id mark = ' + lid);
        console.log('last id mark = ' + JSON.stringify(lid));
        this.marks[0].id = lid + 1 ;
        console.log('fnito '); */
      }, (error: AppError) => {
        this.marks.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after marks' + this.getLastid('mark'));
  }

  deleteMark(_mark: Mark) {
    let index = this.marks.indexOf(_mark);
    this.marks.splice(index, 1);
    this.marks = [...this.marks] ;
    // this.marks.splice(index, 1);
    console.log('_mark' + _mark.id + ', ' + JSON.stringify(_mark));
    this.service.delete(_mark.id)
      .subscribe(
      () => { this.loadData(); } ,
      (error: Response) => {
        this.marks.splice(index, 0, _mark);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateMark(_mark, input: HTMLInputElement) {
    _mark.name = input.value;
    this.service.update(_mark)
      .subscribe(updatemark => {
        this.loadData();
        console.log(updatemark);
      });
    console.log('name = ' + input.value);
    console.log(_mark);
  }

  cancelUpdate(_mark) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newMark = {
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
   // this.mark = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let marks = [...this.marks];
    if (this.newMode) {
      marks.push(this.newMark);
    } else {
      marks[this.findSelectedMarkIndex()] = this.newMark;
    }
    this.marks = marks;
    this.newMark = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedMarkIndex();
    this.marks = this.marks.filter((val, i) => i !== index);
    this.newMark = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newMark = this.cloneMark(event.data);
    this.dialogVisible = true; */
  }

  cloneMark(c: Mark): Mark {
    let mark: Mark; // = new Prime();
    /* for (let prop of c) {
      mark[prop] = c[prop];
    } */
    mark = c;
    return mark;
  }

  findSelectedMarkIndex(): number {
    return this.marks.indexOf(this.selectedMark);
  }
}



