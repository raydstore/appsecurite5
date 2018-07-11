import { BadInput } from '../../common/bad-input';
import { Caseagent } from '../../table/table';
import { CaseagentService } from '../../services/caseagent.service';
import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/components/common/treenode';
import { AppError } from '../../common/app-error';
import { NotFoundError } from '../../common/not-found-error';

@Component({
  selector: 'app-caseagent',
  templateUrl: './caseagent.component.html',
  styleUrls: ['./caseagent.component.css']
})
export class CaseagentComponent implements OnInit {
  @Input() idJobposting: any;
  @Input() case: any;
  @Input() clname: string;
  caseagents: any[];
  selectedCaseagent: Caseagent;
  selectedNode: TreeNode;
  newCaseagent: any = {
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
  titlelist = 'Feuille de poste';

  constructor(private service: CaseagentService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getByQueryParam({ idjobposting: this.idJobposting, case1: this.case })
      .subscribe(caseagents => {
        this.caseagents = caseagents;
      });
  }

  createCaseagent() {
    this.dialogVisible = false;
    this.caseagents = [this.newCaseagent, ...this.caseagents];

    this.service.create(this.newCaseagent)
      .subscribe(newCaseagent => {
        this.loadData();
      }, (error: AppError) => {
        this.caseagents.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteCaseagent(_caseagent: Caseagent) {
    let index = this.caseagents.indexOf(_caseagent);
    this.caseagents.splice(index, 1);
    this.caseagents = [...this.caseagents];
    this.service.delete(_caseagent.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.caseagents.splice(index, 0, _caseagent);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateCaseagent(_caseagent, input: HTMLInputElement) {
    _caseagent.name = input.value;
    this.service.update(_caseagent)
      .subscribe(updatecaseagent => {
        this.loadData();
      });
  }

  cancelUpdate(_caseagent) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newCaseagent = {
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
