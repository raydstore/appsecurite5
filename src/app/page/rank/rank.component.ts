import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { RankService } from '../../services/rank.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Rank } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-rank',
  templateUrl: 'rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent implements OnInit {
  ranks: any[];
  selectedRank: Rank;
  selectedNode: TreeNode;
  // rank: any;
  newRank: any = {
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
  titlelist = 'Marque';

  constructor(private service: RankService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getAll()
      .subscribe(ranks => {
        this.ranks = ranks;
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


  createRank() {
    this.dialogVisible = false;
    this.ranks = [this.newRank, ...this.ranks];
    this.service.create(this.newRank)
      .subscribe(newRank => {
        this.loadData();
      }, (error: AppError) => {
        this.ranks.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteRank(_rank: Rank) {
    let index = this.ranks.indexOf(_rank);
    this.ranks.splice(index, 1);
    this.ranks = [...this.ranks];
    this.service.delete(_rank.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.ranks.splice(index, 0, _rank);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateRank(_rank, input: HTMLInputElement) {
    _rank.name = input.value;
    this.service.update(_rank)
      .subscribe(updaterank => {
        this.loadData();
        console.log(updaterank);
      });
  }

  cancelUpdate(_rank) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newRank = {
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
    let ranks = [...this.ranks];
    if (this.newMode) {
      ranks.push(this.newRank);
    } else {
      ranks[this.findSelectedRankIndex()] = this.newRank;
    }
    this.ranks = ranks;
    this.newRank = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedRankIndex();
    this.ranks = this.ranks.filter((val, i) => i !== index);
    this.newRank = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
  }

  cloneRank(c: Rank): Rank {
    let rank: Rank; 
    rank = c;
    return rank;
  }

  findSelectedRankIndex(): number {
    return this.ranks.indexOf(this.selectedRank);
  }
}



