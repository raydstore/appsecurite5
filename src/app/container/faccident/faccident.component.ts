import { AgentService } from './../../services/agent.service';
import { SiteService } from './../../services/site.service';
import { Agent, Site, EventAccidentArgs } from './../../table/table';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Accident, Mode } from '../../table/table';

@Component({
  selector: 'app-faccident',
  templateUrl: './faccident.component.html',
  styleUrls: ['./faccident.component.css']
})
export class FaccidentComponent implements OnInit {
  @Input() item: Accident;
  @Input() mode: Mode;
  @Output() operation = new EventEmitter();

  sites: Site[];
  agents: Agent[];

  constructor(public siteService: SiteService, public agentService: AgentService) { }

  ngOnInit() {
    this.loadSite();
    this.loadAgent();
  }

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

  onChangeDate(item: Accident, event) {
    item.curdate = event;
  }

  onChangeItem(item: Accident, field: string, event) {
    item[field] = <Agent>event.item;
  }


  perform(event) {
    console.log('what happed!' + event);
    // let mode = this.mode === Mode.insert ? mInsert : mUpdate; 
    let eventargs: EventAccidentArgs;
    eventargs = this.mode === Mode.insert ? { item: this.item, mode: Mode.insert, dialogVisible: false }
                                         : { item: this.item, mode: Mode.update, dialogVisible: false };
    this.operation.emit(eventargs);
    console.log('end perform');
    /* switch (mode) {
      case Mode.insert: this.action.emit({item: item, mode: mode});
                        return 1;
        break;
      case Mode.update: return 1;
        break;
      default: return 0;
    } */
  }

  cancel(item) {

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

}


