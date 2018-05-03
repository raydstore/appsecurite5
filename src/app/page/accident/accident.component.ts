import { Site } from './../../table/table';
import { SiteService } from './../../services/site.service';
import { VwdamageaccidentnatureService } from './../../services/vwdamageaccidentnature.service';
import { VwelementdamageService } from './../../services/vwelementdamage.service';
import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { AccidentService } from './../../services/accident.service';
import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
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
  accidents: any[];
  sites: any[];
  agents: any[];
 // vwelementdamages: any[];
  selectedAccident: Accident;
  selectedNode: TreeNode;
  // accident: any;
  newAccident: any = {
    id: 0,
    classification: 'A',
    sitedescription: '',
    event: '',
    idsiteparent: null,
    idsite: null,
    curdate: new Date(),
    time: new Date(),
    idagentdeclare: null,
    idagentvalidate: null,
    datecreate: new Date(),
    dateupdate: new Date(),
    lastuser: 'ali',
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;

  lastids: any[];
  lastid: any;
  titlelist = 'Accident';
  selectedNatures: string[];

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(private service: AccidentService,
    private siteService: SiteService,
    private agentService: AgentService,
    private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    this.loadSite();
    this.loadAgent();
  }

  loadData() {
    this.service.getAll()
      .subscribe(accidents => {
        this.accidents = accidents;
      });
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

  loadLastId() {
    this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids);
  }

  getLastid(name) {
   // let lts: any[];
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

  get today() {
    return new Date();
  }

  nodeExpand(event) {
    this.selectedNode = event.node;
    console.log('selected node ' + JSON.stringify(this.selectedNode));
  }

  isSelected(event) {
    return this.selectedNode === event.node ? true : false;
  }


  createAccident() {
    this.dialogVisible = false;
    //  console.log(JSON.stringify(this.newAccident));
    // this.accidents.splice(0, 0, this.newAccident);
    this.accidents = [this.newAccident, ...this.accidents];
    // console.log('before accidents' + JSON.stringify(this.lastids));

    this.service.create(this.newAccident)
      .subscribe(newAccident => {
        this.loadData();
        /*       console.log('newAccident' + JSON.stringify(newAccident));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('accident');
              console.log('last id accident = ' + lid);
              console.log('last id accident = ' + JSON.stringify(lid));
              this.accidents[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        this.accidents.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after accidents' + this.getLastid('accident'));
  }

  deleteAccident(_accident: Accident) {
    const index = this.accidents.indexOf(_accident);
    this.accidents.splice(index, 1);
    this.accidents = [...this.accidents];
    // this.accidents.splice(index, 1);
    console.log('_accident' + _accident.id + ', ' + JSON.stringify(_accident));
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

  updateAccident(_accident, input: HTMLInputElement) {
    _accident.name = input.value;
    this.service.update(_accident)
      .subscribe(updateaccident => {
        this.loadData();
        console.log(updateaccident);
      });
    console.log('name = ' + input.value);
    console.log(_accident);
  }

  cancelUpdate(_accident) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAccident = {
      id: 0,
      classification: 'A',
      sitedescription: '',
      event: '',
      idsiteparent: null,
      idsite: null,
      curdate: new Date(),
      time: new Date(),
      idagentdeclare: null,
      idagentvalidate: null,
      datecreate: new Date(),
      dateupdate: new Date(),
      lastuser: 'ali',
      owner: 'ali'
    };
  }

  hideNewDialoge() {
    this.dialogVisible = false;
  }

  showDialogToAdd() {
    this.newMode = true;
    // this.accident = new PrimeCar();
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

  onRowSelect(event) {
    /* this.newMode = false;
    this.newAccident = this.cloneAccident(event.data);
    this.dialogVisible = true; */
  }

  cloneAccident(c: Accident): Accident {
    let accident: Accident; // = new Prime();
    /* for (let prop of c) {
      accident[prop] = c[prop];
    } */
    accident = c;
    return accident;
  }

  findSelectedAccidentIndex(): number {
    return this.accidents.indexOf(this.selectedAccident);
  }
}



