import { BadInput } from '../../common/bad-input';
import { TitletaskService } from '../../services/titletask.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TreeTableModule, TreeNode, SharedModule } from 'primeng/primeng';
import { Titletask } from '../../table/table';
import { AppError } from '../../common/app-error';
import { NotFoundError } from '../../common/not-found-error';

@Component({
  selector: 'app-titletask',
  templateUrl: './titletask.component.html',
  styleUrls: ['./titletask.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TitletaskComponent implements OnInit {
  titletasks: Titletask[] = [];
  data: TreeNode[] = [];
  templateNewTitleTask: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: 0,
    kind: 'W',
    lastuser: 'ali',
    name: '',
    owner: 'ali'
  };
  selectedKind = 'W';
  kinds = [
    { id: 'W', name: 'WorkSheet' },
    { id: 'B', name: 'Branch' },
    { id: 'S', name: 'Sheet' }
  ];
  titlenew = 'Worksheet';
  newTitleTask: any = this.templateNewTitleTask;

  dialogVisible = false;
  newMode = false;
  newWorkSheet = false;
  titlelist = 'WorkSheet';

  constructor(private service: TitletaskService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getAll()
      .subscribe(titletasks => {
        this.titletasks = titletasks;
        this.buildTitletask();
      });
  }


  getChilds(titletaskParent: Titletask): TreeNode[] {
    let result: TreeNode[] = [];
    let childs: TreeNode[];
    let value: any;
    for (let titletask of this.titletasks) {
      if (titletask.idparent !== undefined) {
        if ('idparent' in titletask) {
          if ((titletask.idparent === titletaskParent['id']) && 
              (titletask.kindparent === titletaskParent['kind'])) {
          childs = this.getChilds(titletask);
          if (childs.length !== 0) {
            value = {
              name: titletask.name,
              type: 'branch',
              data: titletask,
              children: childs,
              expanded: true,
              styleClass: 'clbranch'
            };
          } else {
            value = {
              name: titletask.name,
              type: 'sheet',
              data: titletask,
              styleClass: 'clstatment'
            };
          }
          result.push(value);
        }
        }
      }
    }
    return result;
  }

  buildTitletask() {
    let value: any;
    let childs: TreeNode[];
    this.data = [];
    for (let titletask of this.titletasks) {
       if (!('idparent' in titletask)) {
         childs = this.getChilds(titletask);
         if (childs.length !== 0) {
           value = {
             name: titletask.name,
             type: 'branch',
             data: titletask,
             children: childs,
             expanded: true,
             styleClass: 'clworksheet'
           };
         } else {
           value = {
             name: titletask.name,
             type: 'branch',
             data: titletask,
             styleClass: 'clworksheet'
           }
         }
        this.data.push(value);
       }
    }
  }

  addTitleTask(node) {
    this.newTitleTask = this.templateNewTitleTask;
    this.newTitleTask.kindparent = node.data.kind;
    this.newTitleTask.idparent   = node.data.id;
//     this.newTitleTask.kind = this.selectedKind;
    this.selectedKind = 'S';
    this.newWorkSheet = false;
    this.titlenew     = 'item de verification';
    this.newTitleTask.kind = this.selectedKind;
    this.showNewDialoge();
    this.newTitleTask.name = '';
   // this.selectedKind = 'w';
  }

  addWorkSheet() {
    this.newTitleTask = this.templateNewTitleTask;
    this.newWorkSheet = true;
    this.titlenew = 'Worksheet';
    this.selectedKind = 'W';
    this.newTitleTask.kind = this.selectedKind;
    this.showNewDialoge();
    this.newTitleTask.name = '';
  } 

  onChangeRadio(event: any) {
    this.newTitleTask.kind = event.target.value; 
  }

  createTitleTask() {
    this.dialogVisible = false;
    this.titletasks = [this.newTitleTask, ...this.titletasks];
    this.service.create(this.newTitleTask)
      .subscribe(newtt => {
        this.titletasks = [];
        this.loadData();
      }, (error: AppError) => {
        this.titletasks.splice(0, 1);
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      });
  }

  deleteTitleTask(node) {
    this.service.delete(node.data.id)
      .subscribe(
      () => {
        this.loadData()
      },
      (error: Response) => {
        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateTitleTask(node) {
    this.service.update(node.data)
      .subscribe(updatetitletask => {
        this.loadData();
      });
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
  }

  hideNewDialoge() {
    this.dialogVisible = false;
    this.newMode = false;
  }

  setFocusColor(input: HTMLInputElement) {
    input.style.backgroundColor = 'blue';
    input.style.color = 'white';

  }

  setDefaultColor(input: HTMLInputElement) {
    input.style.backgroundColor = 'beige';
    input.style.color = 'black';
  }

}
