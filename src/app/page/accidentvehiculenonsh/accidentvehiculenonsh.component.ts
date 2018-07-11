import { NotFoundError } from '../../common/not-found-error';
import { BadInput } from '../../common/bad-input';
import { AppError } from '../../common/app-error';
import { LastidService } from '../../services/lastid.service';
import { AccidentvehiculeService } from '../../services/accidentvehicule.service';
import { TreeNode } from 'primeng/primeng';
import { Accidentvehicule } from '../../table/table';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accidentvehiculenonsh',
  templateUrl: './accidentvehiculenonsh.component.html',
  styleUrls: ['./accidentvehiculenonsh.component.css']
})
export class AccidentvehiculenonshComponent implements OnInit {
  @Input() iddamage: number;
  @Input() idgrid: number;
  @Input() accidentdomain: number;
  @Input() classification: number;
  @Input() titlelist: string;

  accidentvehiculenonshs: any[];
  selectedAccidentvehiculenonsh: Accidentvehicule;
  selectedNode: TreeNode;

  newAccidentvehiculenonsh: Accidentvehicule = {
    id: 0,
    name: '',
    datecreate: new Date(),
    dateupdate: new Date(),
    iddamage: this.iddamage,
    idgrid: this.idgrid,
    accidentdomain: 6,
    matricule: '',
    lastuser: 'ali',
    kind: '',
    classification: '',
    identreprise: null,
    idmark: null,
    source: '',
    destination: '',
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;

  lastids: any[];
  lastid: any;

  constructor(private service: AccidentvehiculeService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getByQueryParam({ 'iddamage': this.iddamage, 'idgrid': this.idgrid, 'accidentdomain': 6, 'classification': 'N' })
      .subscribe(accidentvehiculenonshs => {
        this.accidentvehiculenonshs = accidentvehiculenonshs;
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


  createAccidentvehiculenonsh() {
    this.dialogVisible = false;
    this.accidentvehiculenonshs = [this.newAccidentvehiculenonsh, ...this.accidentvehiculenonshs];

    this.service.create(this.newAccidentvehiculenonsh)
      .subscribe(newAccidentvehiculenonsh => {
        this.loadData();
      }, (error: AppError) => {
        this.accidentvehiculenonshs.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
        }
      });
  }

  deleteAccidentvehiculenonsh(_accidentvehiculenonsh: Accidentvehicule) {
    let index = this.accidentvehiculenonshs.indexOf(_accidentvehiculenonsh);
    this.accidentvehiculenonshs.splice(index, 1);
    this.accidentvehiculenonshs = [...this.accidentvehiculenonshs];
    // this.accidentvehiculenonshs.splice(index, 1);
    //    console.log('_accidentvehiculenonsh' + _accidentvehiculenonsh.id + ', ' + JSON.stringify(_accidentvehiculenonsh));
    this.service.delete(_accidentvehiculenonsh.id)
      .subscribe(
        () => { this.loadData(); },
        (error: Response) => {
          this.accidentvehiculenonshs.splice(index, 0, _accidentvehiculenonsh);

          if (error instanceof NotFoundError) {
            alert('this post has already been deleted');
          } else {
            throw error;
          }
        }
      );
  }

  updateAccidentvehiculenonsh(_accidentvehiculenonsh, inputSamury: HTMLInputElement) {
    this.service.update(_accidentvehiculenonsh)
      .subscribe(updateaccidentvehiculenonsh => {
        this.loadData();
      });
  }

  cancelUpdate(_accidentvehiculenonsh) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAccidentvehiculenonsh = {
      id: 0,
      name: '',
      datecreate: new Date(),
      dateupdate: new Date(),
      iddamage: this.iddamage,
      idgrid: this.idgrid,
      accidentdomain: 6,
      matricule: '',
      lastuser: 'ali',
      kind: '',
      classification: '',
      identreprise: null,
      idmark: null,
      source: '',
      destination: '',
      owner: 'ali'
    };
  }

  hideNewDialoge() {
    this.dialogVisible = false;
  }

  showDialogToAdd() {
    this.newMode = true;
    // this.accidentvehiculenonsh = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let accidentvehiculenonshs = [...this.accidentvehiculenonshs];
    if (this.newMode) {
      accidentvehiculenonshs.push(this.newAccidentvehiculenonsh);
    } else {
      accidentvehiculenonshs[this.findSelectedAccidentvehiculenonshIndex()] = this.newAccidentvehiculenonsh;
    }
    this.accidentvehiculenonshs = accidentvehiculenonshs;
    this.newAccidentvehiculenonsh = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedAccidentvehiculenonshIndex();
    this.accidentvehiculenonshs = this.accidentvehiculenonshs.filter((val, i) => i !== index);
    this.newAccidentvehiculenonsh = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newAccidentvehiculenonsh = this.cloneAccidentvehiculenonsh(event.data);
    this.dialogVisible = true; */
  }

  cloneAccidentvehiculenonsh(c: Accidentvehicule): Accidentvehicule {
    let accidentvehiculenonsh: Accidentvehicule; // = new Prime();
    /* for (let prop of c) {
      accidentvehiculenonsh[prop] = c[prop];
    } */
    accidentvehiculenonsh = c;
    return accidentvehiculenonsh;
  }

  findSelectedAccidentvehiculenonshIndex(): number {
    return this.accidentvehiculenonshs.indexOf(this.selectedAccidentvehiculenonsh);
  }
}



