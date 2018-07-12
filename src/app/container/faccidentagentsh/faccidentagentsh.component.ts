import { BadInput } from './../../common/bad-input';
import { AppError } from './../../common/app-error';
import { AgentService } from '../../services/agent.service';
import { Accidentagentsh, Mode, Agent, EventArgs } from '../../table/table';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-faccidentagentsh',
  templateUrl: './faccidentagentsh.component.html',
  styleUrls: ['./faccidentagentsh.component.css']
})
export class FaccidentagentshComponent implements OnInit {

  @Input() item: Accidentagentsh;
  @Input() mode: Mode;
  @Output() operation = new EventEmitter();

  sites: Site[];
  agents: Agent[];

  constructor(public agentService: AgentService) { }

  ngOnInit() {
    this.loadAgent();
  }


  loadAgent() {
    this.agentService.getAll()
      .subscribe(agents => {
        this.agents = agents;
      });
  }

  onChangeItem(item: Accidentagentsh, field: string, event) {
    /* passe choise agent to field item on accidentagent */
    item[field] = <Agent>event.item;
  }


  perform(event) {
    /* build event message */
    let eventargs: EventArgs;
    /* build event argument to send to parent call component */
    eventargs = this.mode === Mode.insert ? { item: this.item, mode: Mode.insert, dialogVisible: false }
                                         : { item: this.item, mode: Mode.update, dialogVisible: false };
    /* send event argument  */                                     
    this.operation.emit(eventargs);
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


  getAgent(id?: string): Agent {
    let res: Agent  = null;
    this.agentService.getItem('id;id=' + id )
  .subscribe(result => {
    res = result;
  }, (error: AppError) => {  
    if (error instanceof BadInput) {
    } else {
      throw error;
    }
  }, () => {
    if (res == null) {
    }
  }
  );
  return res;
}

}