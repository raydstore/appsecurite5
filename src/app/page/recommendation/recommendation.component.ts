import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { RecommendationService } from './../../services/recommendation.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Recommendation } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-recommendation',
  templateUrl: 'recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {
  recommendations: any[];
  selectedRecommendation: Recommendation;
  selectedNode: TreeNode;
  // recommendation: any;
  newRecommendation: any = {
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

  constructor(private service: RecommendationService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getAll()
      .subscribe(recommendations => {
        this.recommendations = recommendations;
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


  createRecommendation() {
    this.dialogVisible = false;
    //  console.log(JSON.stringify(this.newRecommendation));
    // this.recommendations.splice(0, 0, this.newRecommendation);
    this.recommendations = [this.newRecommendation, ...this.recommendations];
    // console.log('before recommendations' + JSON.stringify(this.lastids));

    this.service.create(this.newRecommendation)
      .subscribe(newRecommendation => {
        this.loadData();
        /*       console.log('newRecommendation' + JSON.stringify(newRecommendation));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('recommendation');
              console.log('last id recommendation = ' + lid);
              console.log('last id recommendation = ' + JSON.stringify(lid));
              this.recommendations[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        this.recommendations.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after recommendations' + this.getLastid('recommendation'));
  }

  deleteRecommendation(_recommendation: Recommendation) {
    let index = this.recommendations.indexOf(_recommendation);
    this.recommendations.splice(index, 1);
    this.recommendations = [...this.recommendations];
    // this.recommendations.splice(index, 1);
    console.log('_recommendation' + _recommendation.id + ', ' + JSON.stringify(_recommendation));
    this.service.delete(_recommendation.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.recommendations.splice(index, 0, _recommendation);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateRecommendation(_recommendation, input: HTMLInputElement) {
    _recommendation.name = input.value;
    this.service.update(_recommendation)
      .subscribe(updaterecommendation => {
        this.loadData();
        console.log(updaterecommendation);
      });
    console.log('name = ' + input.value);
    console.log(_recommendation);
  }

  cancelUpdate(_recommendation) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newRecommendation = {
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
    // this.recommendation = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let recommendations = [...this.recommendations];
    if (this.newMode) {
      recommendations.push(this.newRecommendation);
    } else {
      recommendations[this.findSelectedRecommendationIndex()] = this.newRecommendation;
    }
    this.recommendations = recommendations;
    this.newRecommendation = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedRecommendationIndex();
    this.recommendations = this.recommendations.filter((val, i) => i !== index);
    this.newRecommendation = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newRecommendation = this.cloneRecommendation(event.data);
    this.dialogVisible = true; */
  }

  cloneRecommendation(c: Recommendation): Recommendation {
    let recommendation: Recommendation; // = new Prime();
    /* for (let prop of c) {
      recommendation[prop] = c[prop];
    } */
    recommendation = c;
    return recommendation;
  }

  findSelectedRecommendationIndex(): number {
    return this.recommendations.indexOf(this.selectedRecommendation);
  }
}



