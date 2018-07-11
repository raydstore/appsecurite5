import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { ActivityService } from '../../services/activity.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Activity } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  activitys: any[];
  selectedActivity: Activity;
  // mark: any;
  newActivity: any = {
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
  titlelist = 'Activité';

  constructor(private service: ActivityService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    /* this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids); */
  }

  loadData() {
    this.service.getAll()
      .subscribe(activitys => {
        this.activitys = activitys;
      });
  }

  getLastid(name) {
    let a = '';
    this.lastidService.getAll()
      .subscribe(lastids => {
        for (let lid of lastids) {
          if (lid.name === name) { a = lid.count; }
        }
      });
    return a;
  }



  createActivity() {
    this.dialogVisible = false;
    this.activitys = [this.newActivity, ...this.activitys];

    this.service.create(this.newActivity)
      .subscribe(newActivity => {
        this.loadData();
      }, (error: AppError) => {
        this.activitys.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteActivity(_activity: Activity) {
    let index = this.activitys.indexOf(_activity);
    this.activitys.splice(index, 1);
    this.activitys = [...this.activitys];
    this.service.delete(_activity.id)
      .subscribe(
      null,
      (error: Response) => {
        this.activitys.splice(index, 0, _activity);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateActivity(_activity, input: HTMLInputElement) {
    _activity.name = input.value;
    this.service.update(_activity)
      .subscribe(updateactivity => {
        this.loadData();
        console.log(updateactivity);
      });
    console.log('name = ' + input.value);
    console.log(_activity);
  }

  cancelUpdate(_activity) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newActivity = {
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
    let activitys = [...this.activitys];
    if (this.newMode) {
      activitys.push(this.newActivity);
    } else {
      activitys[this.findSelectedActivityIndex()] = this.newActivity;
    }
    this.activitys = activitys;
    this.newActivity = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedActivityIndex();
    this.activitys = this.activitys.filter((val, i) => i !== index);
    this.newActivity = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newMark = this.cloneMark(event.data);
    this.dialogVisible = true; */
  }

  cloneActifity(c: Activity): Activity {
    let activity: Activity; // = new Prime();
    /* for (let prop of c) {
      mark[prop] = c[prop];
    } */
    activity = c;
    return activity;
  }

  findSelectedActivityIndex(): number {
    return this.activitys.indexOf(this.selectedActivity);
  }
}



