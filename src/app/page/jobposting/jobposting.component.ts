import { BadInput } from '../../common/bad-input';
import { TreeNode } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';
import { JobpostingService } from '../../services/jobposting.service';
import { Jobposting } from '../../table/table';
import { AppError } from '../../common/app-error';
import { NotFoundError } from '../../common/not-found-error';


@Component({
  selector: 'app-jobposting',
  templateUrl: './jobposting.component.html',
  styleUrls: ['./jobposting.component.css']
})
export class JobpostingComponent implements OnInit {
  jobpostings: any[];
  caseagent = {mobile: 'M', fixe: 'F', excuse: 'E'};
  clname = { info: 'info', light: 'light', dark: 'dark', success: 'success', secondary: 'secondary' };
  selectedJobposting: Jobposting;
  selectedNode: TreeNode;
  newJobposting: any = {
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

  constructor(private service: JobpostingService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getAll()
      .subscribe(jobpostings => {
        this.jobpostings = jobpostings;
      });
  }

  nodeExpand(event) {
    this.selectedNode = event.node;
  }

  isSelected(event) {
    return this.selectedNode === event.node ? true : false;
  }


  createJobposting() {
    this.dialogVisible = false;
    this.jobpostings = [this.newJobposting, ...this.jobpostings];

    this.service.create(this.newJobposting)
      .subscribe(newJobposting => {
        this.loadData();
      }, (error: AppError) => {
        this.jobpostings.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteJobposting(_jobposting: Jobposting) {
    let index = this.jobpostings.indexOf(_jobposting);
    this.jobpostings.splice(index, 1);
    this.jobpostings = [...this.jobpostings];
    this.service.delete(_jobposting.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.jobpostings.splice(index, 0, _jobposting);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateJobposting(_jobposting, input: HTMLInputElement) {
    _jobposting.name = input.value;
    this.service.update(_jobposting)
      .subscribe(updatejobposting => {
        this.loadData();
      });
  }

  cancelUpdate(_jobposting) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newJobposting = {
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
