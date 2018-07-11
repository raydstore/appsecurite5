import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { EntrepriseService } from '../../services/entreprise.service';
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


  createEntreprise() {
    this.dialogVisible = false;
    this.entreprises = [this.newEntreprise, ...this.entreprises];
    this.service.create(this.newEntreprise)
      .subscribe(newEntreprise => {
        this.loadData();
      }, (error: AppError) => {
        this.entreprises.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteEntreprise(_entreprise: Entreprise) {
    let index = this.entreprises.indexOf(_entreprise);
    this.entreprises.splice(index, 1);
    this.entreprises = [...this.entreprises];
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
      });
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
  }

  cloneEntreprise(c: Entreprise): Entreprise {
    let entreprise: Entreprise; 
    entreprise = c;
    return entreprise;
  }

  findSelectedEntrepriseIndex(): number {
    return this.entreprises.indexOf(this.selectedEntreprise);
  }
}



