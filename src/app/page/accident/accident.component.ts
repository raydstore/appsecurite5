import { CalendarComponent } from './../../common/calendar/calendar.component';
import { Site, Agent, IAgent, TFunctionName, Mode, EventAccidentArgs } from './../../table/table';
import { SiteService } from './../../services/site.service';
import { VwdamageaccidentnatureService } from './../../services/vwdamageaccidentnature.service';
import { VwelementdamageService } from './../../services/vwelementdamage.service';
import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { AccidentService } from './../../services/accident.service';
import { Component, Injectable, OnInit, ViewChild, Input } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
/* import { InputTextareaModule } from 'primeng/inputtextarea'; */
import { Accident } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';
import {CheckboxModule} from 'primeng/checkbox';
import { AgentService } from '../../services/agent.service';


import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';


/**
 * Example of a Native Date adapter
 */
@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {

  fromModel(date: Date): NgbDateStruct {
    return (date && date.getFullYear) ? { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } : null;
  }

  toModel(date: NgbDateStruct): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }
}

@Component({
  selector: 'app-accident',
  templateUrl: 'accident.component.html',
  styleUrls: ['./accident.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class AccidentComponent implements OnInit {
 // @Input() displayValue;
  accidents: Accident[];
  sites: any[];
  agents: any[];
  selectedAccident: Accident;
  selectedNode: TreeNode;
  newAccident: Accident;
  dialogVisible = false;
  newMode = false;
  mInsert: Mode.insert;
  mUpdate: Mode.update;

  lastids: any[];
  lastid: any;
  titlelist = 'Accident';
  selectedNatures: string[];
  filteredAgentsSingle: IAgent[];

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(private service: AccidentService,
    public siteService: SiteService,
    public agentService: AgentService,
    private lastidService: LastidService) {
  }

  ngOnInit() {
    this.initAccident();
    this.loadData();
    this.loadSite();
    this.loadAgent();
  }

  initAccident() {
    let a: any = {
      id: 0,
      classification: 'A',
      sitedescription: '',
      event: '',
      idsiteparent: null,
      idsite: null,
      curdate: new Date(),
      tabindex: 1,
      time: new Date(),
      idagentdeclare: null,
      idagentvalidate: null,
      datecreate: new Date(),
      dateupdate: new Date(),
      lastuser: 'ali',
      owner: 'ali'
    };
    this.newAccident = <Accident> a;
  }

  loadData() {
    this.service.getAll()
      .subscribe(accidents => {
        this.accidents = accidents;
      });
  }

  displayNameAgent(item: any, args: string[]): string {
    let result = '';
    if (item !== null) {
      if (args.length > 0) {
        result = item[args[0]];
      }
      for (let i = 1; i < args.length; i++) {
        result = result + ' ' + item[args[i]];
      }
    }
    return result;
  }

  displayNameSite(item: any, args: string[]): string {
    let result = '';
    if (item !== null) {
      if (args.length > 0) {
        result = item[args[0]];
      }
    }
    return result;
  }

  searchSite = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.sites : this.sites.filter(v => (v.id + v.name).toLowerCase()
        .indexOf(term.toLowerCase()) > -1)).slice(0, 10));

  searchSiteParent = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.sites : this.sites.filter(v => (v.id + v.name).toLowerCase()
        .indexOf(term.toLowerCase()) > -1)).slice(0, 10));

  searchAgentDeclare = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.agents : this.agents.filter(v => (v.id + v.name).toLowerCase()
        .indexOf(term.toLowerCase()) > -1)).slice(0, 10));

  searchAgentValidate = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.agents : this.agents.filter(v => (v.id + v.name).toLowerCase()
        .indexOf(term.toLowerCase()) > -1)).slice(0, 10));

  formatter = (x: { name: string }) => x.name;


  loadSite() {
    this.siteService.getAll()
      .subscribe(sites => {
        this.sites = sites;
      });
  }

  loadAgent() {
    this.agentService.getAll()
      .subscribe(agents => {
        this.agents = agents;
      });
  }

  filterAgentSingle(event) {
    let query = event.query;
    this.agentService.getAll().subscribe(agents => {
      this.agents = agents;
      this.filteredAgentsSingle = this.filterAgent(query, agents);
    });
  }


  filterAgent(query, agents: Agent[]): IAgent[] {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: IAgent[] = [];
    for (let i = 0; i < agents.length; i++) {
      let agent = agents[i];
      if (agent.firstname.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        let iagent: IAgent = {
          agent: agent,
          name: agent.firstname + ' ' + agent.lastname
        }
        filtered.push(iagent);
      }
    }
    return filtered;
  }


  loadLastId() {
    this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids);
  }

  getLastid(name) {
    this.loadLastId();
      for (let lid of this.lastids) {
      if (lid.id === name) {
        return lid['count'];
      }
    }
    return 0;
  }

  get today() {
    return new Date();
  }
/* 
  getDate(date): Date {
     return new Date(date);
  } */

  nodeExpand(event) {
    this.selectedNode = event.node;
  }

  isSelected(event) {
    return this.selectedNode === event.node ? true : false;
  }

  performAction(eventArgs: EventAccidentArgs) {
    console.log('enter perform acion');
    console.log(JSON.stringify(eventArgs));
    switch (eventArgs.mode) {
      case this.mInsert: this.dialogVisible = eventArgs.dialogVisible;
        console.log(this.mInsert);
                        this.createAccident();
        break;
      case this.mUpdate: this.updateAccident(<Accident>eventArgs.item);
        console.log(this.mUpdate);
        break;
    }
    console.log('end performAction eventArgs.mode = ' + eventArgs.mode);
  }

  createAccident() {
    this.dialogVisible = false;
    this.accidents = [this.newAccident, ...this.accidents];
    console.log(JSON.stringify(this.newAccident));
    this.service.create(this.newAccident)
      .subscribe(newAccident => {
        this.loadData();
      }, (error: AppError) => {
        this.accidents.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteAccident(_accident: Accident) {
    console.log('1');
    console.log(JSON.stringify(_accident));
    const index = this.accidents.indexOf(_accident);
    this.accidents.splice(index, 1);
    this.accidents = [...this.accidents];
    this.service.delete(_accident.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.accidents.splice(index, 0, _accident);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateAccident(_accident) {
   // _accident.name = input.value;
   console.log(_accident);
    this.service.update(_accident)
      .subscribe(updateaccident => {
        this.loadData();
      });
  }

  cancelUpdate(_accident) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.initAccident();
    /* this.newAccident = {
      id: 0,
      classification: 'A',
      sitedescription: '',
      event: '',
      idsiteparent: null,
      idsite: null,
      tabindex: 1,
      curdate: new Date(),
      time: new Date(),
      idagentdeclare: null,
      idagentvalidate: null,
      datecreate: new Date(),
      dateupdate: new Date(),
      lastuser: 'ali',
      owner: 'ali'
    }; */
  }

  hideNewDialoge() {
    this.dialogVisible = false;
  }

  showDialogToAdd() {
    this.newMode = true;
    this.dialogVisible = true;
  }

  save() {
    const accidents = [...this.accidents];
    if (this.newMode) {
      accidents.push(this.newAccident);
    } else {
      accidents[this.findSelectedAccidentIndex()] = this.newAccident;
    }
    this.accidents = accidents;
    this.newAccident = null;
    this.dialogVisible = false;
  }

  delete() {
    const index = this.findSelectedAccidentIndex();
    this.accidents = this.accidents.filter((val, i) => i !== index);
    this.newAccident = null;
    this.dialogVisible = false;
  }

  onChangeDate(item: Accident, event) {
    item.curdate = event;
  }

  onChangeItem(item: Accident, field: string, event) {
    item[field] = <Agent> event.item;
  }

  onSelect(event) {
    console.log(event);
  }

  onRowSelect(event) {
  }

  cloneAccident(c: Accident): Accident {
    let accident: Accident; 
    return accident;
  }

  findSelectedAccidentIndex(): number {
    return this.accidents.indexOf(this.selectedAccident);
  }
}



