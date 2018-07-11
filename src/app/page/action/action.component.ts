import { Accident } from '../../table/table';
import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { ActionService } from '../../services/action.service';
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
  @Input() titlelist: string;
  actions: any[];
  selectedAction: Action;
  selectedNode: TreeNode;
  // action: any;
  newAction: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: 0,
    idparent: this.idaccident,
    kind: 'R',
    state: 'C',
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
    this.service.getByQueryParam({ 'idaccident': this.idaccident.id })
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


  createAction() {
    this.newAction.idaccident = this.idaccident;
    this.dialogVisible = false;
    this.actions = [this.newAction, ...this.actions];
    this.service.create(this.newAction)
      .subscribe(newAction => {
        this.loadData();
      }, (error: AppError) => {
        this.actions.splice(0, 1);
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      });
  }

  deleteAction(_action: Action) {
    let index = this.actions.indexOf(_action);
    this.actions.splice(index, 1);
    this.actions = [...this.actions];
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
      });
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
      idparent: this.idaccident,
      kind: 'R',
      state: 'C',
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
  }

  cloneAction(c: Action): Action {
    let action: Action;
    action = c;
    return action;
  }

  findSelectedActionIndex(): number {
    return this.actions.indexOf(this.selectedAction);
  }
}



