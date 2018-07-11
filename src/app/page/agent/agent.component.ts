import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { AgentService } from '../../services/agent.service';
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


  createAgent() {
    this.dialogVisible = false;
    this.agents = [this.newAgent, ...this.agents];
    this.service.create(this.newAgent)
      .subscribe(newAgent => {
        this.loadData();
      }, (error: AppError) => {
        this.agents.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteAgent(_agent: Agent) {
    let index = this.agents.indexOf(_agent);
    this.agents.splice(index, 1);
    this.agents = [...this.agents];
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
      });
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
  }

  cloneAgent(c: Agent): Agent {
    let agent: Agent; 
    agent = c;
    return agent;
  }

  findSelectedAgentIndex(): number {
    return this.agents.indexOf(this.selectedAgent);
  }
}



