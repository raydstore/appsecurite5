import { Accident } from './../../table/table';
import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { CauseService } from './../../services/cause.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Cause } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-cause',
  templateUrl: 'cause.component.html',
  styleUrls: ['./cause.component.css']
})
export class CauseComponent implements OnInit {
  @Input() idaccident: Accident;
  @Input() titlelist: string;
  causes: any[];
  selectedCause: Cause;
  selectedNode: TreeNode;
  // cause: any;
  newCause: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: 0,
    idaccident: null,
    lastuser: 'ali',
    name: '',
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;

  lastids: any[];
  lastid: any;
  // titlelist = 'Cause';

  constructor(private service: CauseService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getByQueryParam({'idaccident': this.idaccident.id})
      .subscribe(causes => {
        this.causes = causes;
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


  createCause() {
    this.dialogVisible = false;
    this.newCause.idaccident = this.idaccident;
    //  console.log(JSON.stringify(this.newCause));
    // this.causes.splice(0, 0, this.newCause);
    this.causes = [this.newCause, ...this.causes];
    // console.log('before causes' + JSON.stringify(this.lastids));

    this.service.create(this.newCause)
      .subscribe(newCause => {
        this.loadData();
        /*       console.log('newCause' + JSON.stringify(newCause));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('cause');
              console.log('last id cause = ' + lid);
              console.log('last id cause = ' + JSON.stringify(lid));
              this.causes[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        this.causes.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after causes' + this.getLastid('cause'));
  }

  deleteCause(_cause: Cause) {
    let index = this.causes.indexOf(_cause);
    this.causes.splice(index, 1);
    this.causes = [...this.causes];
    // this.causes.splice(index, 1);
    console.log('_cause' + _cause.id + ', ' + JSON.stringify(_cause));
    this.service.delete(_cause.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.causes.splice(index, 0, _cause);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateCause(_cause, input: HTMLInputElement) {
    _cause.name = input.value;
    this.service.update(_cause)
      .subscribe(updatecause => {
        this.loadData();
        console.log(updatecause);
      });
    console.log('name = ' + input.value);
    console.log(_cause);
  }

  cancelUpdate(_cause) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newCause = {
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
    // this.cause = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let causes = [...this.causes];
    if (this.newMode) {
      causes.push(this.newCause);
    } else {
      causes[this.findSelectedCauseIndex()] = this.newCause;
    }
    this.causes = causes;
    this.newCause = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedCauseIndex();
    this.causes = this.causes.filter((val, i) => i !== index);
    this.newCause = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newCause = this.cloneCause(event.data);
    this.dialogVisible = true; */
  }

  cloneCause(c: Cause): Cause {
    let cause: Cause; // = new Prime();
    /* for (let prop of c) {
      cause[prop] = c[prop];
    } */
    cause = c;
    return cause;
  }

  findSelectedCauseIndex(): number {
    return this.causes.indexOf(this.selectedCause);
  }
}



