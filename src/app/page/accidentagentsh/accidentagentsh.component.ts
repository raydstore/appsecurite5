import { EventArgs, Mode } from './../../table/table';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { AgentService } from '../../services/agent.service';
import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { AccidentagentshService } from '../../services/accidentagentsh.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
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

  
  accidentagentshs: any[];
  agents: any[];
  selectedAccidentagentsh: Accidentagentsh;
  selectedNode: TreeNode;
  agent: Agent;
  filteredAgents: any[];

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

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<String>();
  click$ = new Subject<String>();


  constructor(private service: AccidentagentshService, private serviceAgent: AgentService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
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
    if (!isNullOrUndefined(id) && !isNullOrUndefined(this.agents)) {
     return this.agents.find(item => item.id === id);
    }
  }

  getName(agent?: Agent): string {
    if (!isNullOrUndefined(agent)) {
       return agent.firstname + ' ' + agent.lastname;
    }
  }

  searchAgent = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.agents : this.agents.filter(v => (v.firstname + ' ' + v.lastname).toLowerCase()
        .indexOf(term.toLowerCase()) > -1)).slice(0, 10));

  formatter = (x: { firstname: string; lastname: string }) => this.getName(x);

  isAccptedGrid(value: number) {
    return value >= 2 && value <= 4;
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

  performAction(eventArgs: EventArgs) {
    switch (eventArgs.mode) {
      case Mode.insert: this.dialogVisible = eventArgs.dialogVisible;
                         this.createAccidentagentsh();
        break;
      case Mode.update: this.updateAccidentagentsh(<Accidentagentsh>eventArgs.item);
        break;
    }
  }


  createAccidentagentsh() {
    this.dialogVisible = false;
    this.newAccidentagentsh.accidentagentshPK.idagent = this.agent.id;
    this.accidentagentshs = [this.newAccidentagentsh, ...this.accidentagentshs];
    this.service.create(this.newAccidentagentsh)
      .subscribe(newAccidentagentsh => {
        this.loadData();
      }, (error: AppError) => {
        this.accidentagentshs.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
        }
      });
  }

  deleteAccidentagentsh(_accidentagentsh: Accidentagentsh) {
    let index = this.accidentagentshs.indexOf(_accidentagentsh);
    this.accidentagentshs.splice(index, 1);
    this.accidentagentshs = [...this.accidentagentshs];
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

  updateAccidentagentsh(_accidentagentsh) {
    this.service.update(_accidentagentsh)
      .subscribe(updateaccidentagentsh => {
        this.loadData();
      });
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
  }

  cloneAccidentagentsh(c: Accidentagentsh): Accidentagentsh {
    let accidentagentsh: Accidentagentsh; 
    accidentagentsh = c;
    return accidentagentsh;
  }

  findSelectedAccidentagentshIndex(): number {
    return this.accidentagentshs.indexOf(this.selectedAccidentagentsh);
  }

  filterAgents(event) {
    this.filteredAgents = [];
    for (let i = 0; i < this.agents.length; i++) {
      let agent = this.agents[i];
      if (agent.firstname.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredAgents.push(agent);
      }
    }
  }
}



