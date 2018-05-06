import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from './../../services/lastid.service';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { BadInput } from './../../common/bad-input';
import { EntrepriseService } from './../../services/entreprise.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Entreprise } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-entreprise',
  templateUrl: 'entreprise.component.html',
  styleUrls: ['./entreprise.component.css']
})
export class EntrepriseComponent implements OnInit {
  entreprises: any[];
  selectedEntreprise: Entreprise;
  selectedNode: TreeNode;
  // entreprise: any;
  newEntreprise: any = {
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

  constructor(private service: EntrepriseService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getAll()
      .subscribe(entreprises => {
        this.entreprises = entreprises;
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


  createEntreprise() {
    this.dialogVisible = false;
    //  console.log(JSON.stringify(this.newEntreprise));
    // this.entreprises.splice(0, 0, this.newEntreprise);
    this.entreprises = [this.newEntreprise, ...this.entreprises];
    // console.log('before entreprises' + JSON.stringify(this.lastids));

    this.service.create(this.newEntreprise)
      .subscribe(newEntreprise => {
        this.loadData();
        /*       console.log('newEntreprise' + JSON.stringify(newEntreprise));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('entreprise');
              console.log('last id entreprise = ' + lid);
              console.log('last id entreprise = ' + JSON.stringify(lid));
              this.entreprises[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        this.entreprises.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    // console.log('after entreprises' + this.getLastid('entreprise'));
  }

  deleteEntreprise(_entreprise: Entreprise) {
    let index = this.entreprises.indexOf(_entreprise);
    this.entreprises.splice(index, 1);
    this.entreprises = [...this.entreprises];
    // this.entreprises.splice(index, 1);
    console.log('_entreprise' + _entreprise.id + ', ' + JSON.stringify(_entreprise));
    this.service.delete(_entreprise.id)
      .subscribe(
        () => { this.loadData(); },
        (error: Response) => {
          this.entreprises.splice(index, 0, _entreprise);

          if (error instanceof NotFoundError) {
            alert('this post has already been deleted');
          } else {
            throw error;
          }
        }
      );
  }

  updateEntreprise(_entreprise, input: HTMLInputElement) {
    _entreprise.name = input.value;
    this.service.update(_entreprise)
      .subscribe(updateentreprise => {
        this.loadData();
        console.log(updateentreprise);
      });
    console.log('name = ' + input.value);
    console.log(_entreprise);
  }

  cancelUpdate(_entreprise) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newEntreprise = {
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
    // this.entreprise = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let entreprises = [...this.entreprises];
    if (this.newMode) {
      entreprises.push(this.newEntreprise);
    } else {
      entreprises[this.findSelectedEntrepriseIndex()] = this.newEntreprise;
    }
    this.entreprises = entreprises;
    this.newEntreprise = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedEntrepriseIndex();
    this.entreprises = this.entreprises.filter((val, i) => i !== index);
    this.newEntreprise = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newEntreprise = this.cloneEntreprise(event.data);
    this.dialogVisible = true; */
  }

  cloneEntreprise(c: Entreprise): Entreprise {
    let entreprise: Entreprise; // = new Prime();
    /* for (let prop of c) {
      entreprise[prop] = c[prop];
    } */
    entreprise = c;
    return entreprise;
  }

  findSelectedEntrepriseIndex(): number {
    return this.entreprises.indexOf(this.selectedEntreprise);
  }
}



