import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { AgentService } from './../../services/agent.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Agent } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-agent',
  templateUrl: 'agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {
  agents: any[];
  selectedAgent: Agent;
  selectedNode: TreeNode;
  // agent: any;
  newAgent: Agent = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: '',
    lastuser: 'ali',
    firstname: '',
    lastname: '',
    hiredate: new Date(),
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;

  lastids: any[];
  lastid: any;
  titlelist = 'Marque';

  constructor(private service: AgentService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getAll()
      .subscribe(agents => {
        this.agents = agents;
      });
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


  createAgent() {
    this.dialogVisible = false;

    /* console.log('date = ' + JSON.stringify(this.newAgent.hiredate));
    this.newAgent.hiredate = new Date('2017-02-02T00:00:00+01:00');
    console.log('datetime = ' + JSON.stringify(this.newAgent.hiredate.getDate));
    console.log(JSON.stringify(this.newAgent)); */


    // this.agents.splice(0, 0, this.newAgent);
    this.agents = [this.newAgent, ...this.agents];
    // console.log('before agents' + JSON.stringify(this.lastids));

    this.service.create(this.newAgent)
      .subscribe(newAgent => {
        this.loadData();
        /*       console.log('newAgent' + JSON.stringify(newAgent));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('agent');
              console.log('last id agent = ' + lid);
              console.log('last id agent = ' + JSON.stringify(lid));
              this.agents[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        console.log('3');
        this.agents.splice(0, 1);
        if (error instanceof BadInput) {
          console.log('4');
          // this.form.setErrors(originalError);
        } else {
          console.log('5');
          throw error;
        }
        console.log('6');
      });
    // console.log('after agents' + this.getLastid('agent'));
  }

  deleteAgent(_agent: Agent) {
    let index = this.agents.indexOf(_agent);
    this.agents.splice(index, 1);
    this.agents = [...this.agents];
    // this.agents.splice(index, 1);
    console.log('_agent' + _agent.id + ', ' + JSON.stringify(_agent));
    this.service.delete(_agent.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.agents.splice(index, 0, _agent);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateAgent(_agent, inputFirstname: HTMLInputElement, inputLastname: HTMLInputElement, inputHiredate: HTMLInputElement) {
    _agent.firstname = inputFirstname.value;
    _agent.lastname  = inputLastname.value;
    _agent.hiredate = inputHiredate.value;
    this.service.update(_agent)
      .subscribe(updateagent => {
        this.loadData();
        console.log(updateagent);
      });
  /*   console.log('name = ' + input.value);
    console.log(_agent); */
  }

  cancelUpdate(_agent) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAgent = {
      datecreate: new Date(),
      dateupdate: new Date(),
      id: '',
      lastuser: 'ali',
      firstname: '',
      lastname: '',
      hiredate: new Date(),
      owner: 'ali'
    };
  }

  hideNewDialoge() {
    this.dialogVisible = false;
  }

  showDialogToAdd() {
    this.newMode = true;
    // this.agent = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let agents = [...this.agents];
    if (this.newMode) {
      agents.push(this.newAgent);
    } else {
      agents[this.findSelectedAgentIndex()] = this.newAgent;
    }
    this.agents = agents;
    this.newAgent = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedAgentIndex();
    this.agents = this.agents.filter((val, i) => i !== index);
    this.newAgent = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newAgent = this.cloneAgent(event.data);
    this.dialogVisible = true; */
  }

  cloneAgent(c: Agent): Agent {
    let agent: Agent; // = new Prime();
    /* for (let prop of c) {
      agent[prop] = c[prop];
    } */
    agent = c;
    return agent;
  }

  findSelectedAgentIndex(): number {
    return this.agents.indexOf(this.selectedAgent);
  }
}



