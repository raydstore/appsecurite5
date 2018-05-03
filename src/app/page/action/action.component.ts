import { Accident } from './../../table/table';
import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { ActionService } from './../../services/action.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Action } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-action',
  templateUrl: 'action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements OnInit {
  @Input() idaccident: Accident;
  @Input() titlelist:  string;
  actions: any[];
  selectedAction: Action;
  selectedNode: TreeNode;
  // action: any;
  newAction: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: 0,
    idparent: null,
    tabindex: 1,
    lastuser: 'ali',
    name: '',
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;

  lastids: any[];
  lastid: any;
  // titlelist = 'Marque';

  constructor(private service: ActionService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getByQueryParam({ 'idparent': this.idaccident.id })
      .subscribe(actions => {
        this.actions = actions;
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


  createAction() {
    this.newAction.idparent = this.idaccident.id;
    this.dialogVisible = false;
    console.log(JSON.stringify('action = ' + this.newAction));
    // this.actions.splice(0, 0, this.newAction);
    this.actions = [this.newAction, ...this.actions];
    // console.log('before actions' + JSON.stringify(this.lastids));

    this.service.create(this.newAction)
      .subscribe(newAction => {
        this.loadData();
        /*       console.log('newAction' + JSON.stringify(newAction));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('action');
              console.log('last id action = ' + lid);
              console.log('last id action = ' + JSON.stringify(lid));
              this.actions[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        this.actions.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after actions' + this.getLastid('action'));
  }

  deleteAction(_action: Action) {
    let index = this.actions.indexOf(_action);
    this.actions.splice(index, 1);
    this.actions = [...this.actions];
    // this.actions.splice(index, 1);
    console.log('_action' + _action.id + ', ' + JSON.stringify(_action));
    this.service.delete(_action.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.actions.splice(index, 0, _action);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateAction(_action, input: HTMLInputElement) {
    _action.name = input.value;
    this.service.update(_action)
      .subscribe(updateaction => {
        this.loadData();
        console.log(updateaction);
      });
    console.log('name = ' + input.value);
    console.log(_action);
  }

  cancelUpdate(_action) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAction = {
      datecreate: new Date(),
      dateupdate: new Date(),
      id: 0,
      tabindex: 1,
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
    // this.action = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let actions = [...this.actions];
    if (this.newMode) {
      actions.push(this.newAction);
    } else {
      actions[this.findSelectedActionIndex()] = this.newAction;
    }
    this.actions = actions;
    this.newAction = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedActionIndex();
    this.actions = this.actions.filter((val, i) => i !== index);
    this.newAction = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newAction = this.cloneAction(event.data);
    this.dialogVisible = true; */
  }

  cloneAction(c: Action): Action {
    let action: Action; // = new Prime();
    /* for (let prop of c) {
      action[prop] = c[prop];
    } */
    action = c;
    return action;
  }

  findSelectedActionIndex(): number {
    return this.actions.indexOf(this.selectedAction);
  }
}



