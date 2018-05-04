import { AgentService } from './../../services/agent.service';
import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { AccidentagentshService } from './../../services/accidentagentsh.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Accidentagentsh, AccidentagentshPK, Agent } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';
import { isUndefined, isNullOrUndefined } from 'util';

@Component({
  selector: 'app-accidentagentsh',
  templateUrl: 'accidentagentsh.component.html',
  styleUrls: ['./accidentagentsh.component.css']
})
export class AccidentagentshComponent implements OnInit {
  @Input() iddamage: number;
  @Input() idgrid: number;
  @Input() titlelist: string;
  /* @Input() accidentdomain: number; */
  accidentagentshs: any[];
  agents: any[];
  selectedAccidentagentsh: Accidentagentsh;
  selectedNode: TreeNode;
  // accidentagentsh: any;
  accidentagentshPK: AccidentagentshPK;
  newAccidentagentsh: Accidentagentsh = {
    datecreate: new Date(),
    dateupdate: new Date(),
    accidentagentshPK: {iddamage : this.iddamage, idagent: ''},
    accidentdomain: 1,
    idgrid: 0,
    idagent: '',
    lastuser: 'ali',
    samury: '',
    countstopwork: 0,
    typeaccident: 'L',
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;

  lastids: any[];
  lastid: any;
  // titlelist = 'Marque';

  constructor(private service: AccidentagentshService, private serviceAgent: AgentService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getByQueryParam({ 'iddamage': this.iddamage, 'idgrid': this.idgrid })
      .subscribe(accidentagentshs => {
        this.accidentagentshs = accidentagentshs;
      });
    this.serviceAgent.getAll()
    .subscribe(agents => {
      this.agents = agents;
    })
  }

  getAgent(id?): Agent {
    if (!isNullOrUndefined(id) && !isNullOrUndefined(this.agents) {
     return this.agents.find(item => item.id === id);
    }
  }

  getName(agent?: Agent): string {
    if (!isNullOrUndefined(agent)) {
       return agent.firstname + ' ' + agent.lastname;
    }
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


  createAccidentagentsh() {
    this.dialogVisible = false;

    /* console.log('date = ' + JSON.stringify(this.newAccidentagentsh.hiredate));
    this.newAccidentagentsh.hiredate = new Date('2017-02-02T00:00:00+01:00');
    console.log('datetime = ' + JSON.stringify(this.newAccidentagentsh.hiredate.getDate));
    console.log(JSON.stringify(this.newAccidentagentsh)); */

    console.log(JSON.stringify(this.newAccidentagentsh));
    // this.accidentagentshs.splice(0, 0, this.newAccidentagentsh);
    this.accidentagentshs = [this.newAccidentagentsh, ...this.accidentagentshs];
    // console.log('before accidentagentshs' + JSON.stringify(this.lastids));

    this.service.create(this.newAccidentagentsh)
      .subscribe(newAccidentagentsh => {
        this.loadData();
        /*       console.log('newAccidentagentsh' + JSON.stringify(newAccidentagentsh));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('accidentagentsh');
              console.log('last id accidentagentsh = ' + lid);
              console.log('last id accidentagentsh = ' + JSON.stringify(lid));
              this.accidentagentshs[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        this.accidentagentshs.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          console.log('5');
        }
        console.log('6');
      });
  }

  deleteAccidentagentsh(_accidentagentsh: Accidentagentsh) {
    let index = this.accidentagentshs.indexOf(_accidentagentsh);
    this.accidentagentshs.splice(index, 1);
    this.accidentagentshs = [...this.accidentagentshs];
    // this.accidentagentshs.splice(index, 1);
//    console.log('_accidentagentsh' + _accidentagentsh.id + ', ' + JSON.stringify(_accidentagentsh));
    this.service.delete(_accidentagentsh.accidentagentshPK)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.accidentagentshs.splice(index, 0, _accidentagentsh);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateAccidentagentsh(_accidentagentsh, inputSamury: HTMLInputElement) {
    _accidentagentsh.samury = inputSamury.value;
    this.service.update(_accidentagentsh)
      .subscribe(updateaccidentagentsh => {
        this.loadData();
        console.log(updateaccidentagentsh);
      });
    /*   console.log('name = ' + input.value);
      console.log(_accidentagentsh); */
  }

  cancelUpdate(_accidentagentsh) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAccidentagentsh = {
      datecreate: new Date(),
      dateupdate: new Date(),
      accidentagentshPK: {iddamage: this.iddamage, idagent: ''} ,
      lastuser: 'ali',
      idgrid: 1,
      countstopwork: 0,
      accidentdomain: 1,
      samury: '',
      typeaccident: 'L',
      owner: 'ali'
    };
  }

  hideNewDialoge() {
    this.dialogVisible = false;
  }

  showDialogToAdd() {
    this.newMode = true;
    // this.accidentagentsh = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let accidentagentshs = [...this.accidentagentshs];
    if (this.newMode) {
      accidentagentshs.push(this.newAccidentagentsh);
    } else {
      accidentagentshs[this.findSelectedAccidentagentshIndex()] = this.newAccidentagentsh;
    }
    this.accidentagentshs = accidentagentshs;
    this.newAccidentagentsh = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedAccidentagentshIndex();
    this.accidentagentshs = this.accidentagentshs.filter((val, i) => i !== index);
    this.newAccidentagentsh = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newAccidentagentsh = this.cloneAccidentagentsh(event.data);
    this.dialogVisible = true; */
  }

  cloneAccidentagentsh(c: Accidentagentsh): Accidentagentsh {
    let accidentagentsh: Accidentagentsh; // = new Prime();
    /* for (let prop of c) {
      accidentagentsh[prop] = c[prop];
    } */
    accidentagentsh = c;
    return accidentagentsh;
  }

  findSelectedAccidentagentshIndex(): number {
    return this.accidentagentshs.indexOf(this.selectedAccidentagentsh);
  }
}



