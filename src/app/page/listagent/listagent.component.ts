import { ListagentService } from '../../services/listagent.service';
import { BadInput } from '../../common/bad-input';
import { Caseagent, Listagent } from '../../table/table';
import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/components/common/treenode';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

@Component({
  selector: 'app-listagent',
  templateUrl: './listagent.component.html',
  styleUrls: ['./listagent.component.css']
})
export class ListagentComponent implements OnInit {
  @Input() idJobposting: any;
  listagents: any[];
  selectedAgent: Caseagent;
  selectedNode: TreeNode;
  newAgent: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: 0,
    lastuser: 'ali',
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;

  lastids: any[];
  lastid: any;
  titlelist = 'List des agents';
  constructor(private service: ListagentService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getByQueryParam({ idjobposting: this.idJobposting })
      .subscribe(listagents => {
        this.listagents = listagents;
      });
  }

  nodeExpand(event) {
    this.selectedNode = event.node;
  }

  isSelected(event) {
    return this.selectedNode === event.node ? true : false;
  }

  createListagent() {
    this.dialogVisible = false;
    this.listagents = [this.newAgent, ...this.listagents];

    this.service.create(this.newAgent)
      .subscribe(newListagent => {
        this.loadData();
      }, (error: AppError) => {
        this.listagents.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteListagent(_listagent: Listagent) {
    let index = this.listagents.indexOf(_listagent);
    this.listagents.splice(index, 1);
    this.listagents = [...this.listagents];
    this.service.delete(_listagent.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.listagents.splice(index, 0, _listagent);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateListagent(_listagent, input: HTMLInputElement) {
    _listagent.name = input.value;
    this.service.update(_listagent)
      .subscribe(updatelistagent => {
        this.loadData();
        console.log(updatelistagent);
      });
  }

  cancelUpdate(_listagent) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAgent = {
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




}
