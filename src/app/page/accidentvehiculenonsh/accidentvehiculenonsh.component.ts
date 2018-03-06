import { NotFoundError } from './../../common/not-found-error';
import { BadInput } from './../../common/bad-input';
import { AppError } from './../../common/app-error';
import { LastidService } from './../../services/lastid.service';
import { AccidentvehiculeService } from './../../services/accidentvehicule.service';
import { TreeNode } from 'primeng/primeng';
import { Accidentvehicule } from './../../table/table';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accidentvehiculenonsh',
  templateUrl: './accidentvehiculenonsh.component.html',
  styleUrls: ['./accidentvehiculenonsh.component.css']
})
export class AccidentvehiculenonshComponent implements OnInit {
  @Input() iddamage: number;
  @Input() accidentdomain: number;
  @Input() classification: number;
  @Input() titlelist: string;
  /* @Input() accidentdomain: number; */
  accidentvehiculenonshs: any[];
  selectedAccidentvehiculenonsh: Accidentvehicule;
  selectedNode: TreeNode;
  // accidentvehiculenonsh: any;
  newAccidentvehiculenonsh: Accidentvehicule = {
    id: 0,
    name: '',
    datecreate: new Date(),
    dateupdate: new Date(),
    iddamage: this.iddamage,
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
  // titlelist = 'Marque';

  constructor(private service: AccidentvehiculeService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getByQueryParam({ 'iddamage': this.iddamage, 'accidentdomain': 6, 'classification': 'N' })
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


  createAccidentvehiculenonsh() {
    this.dialogVisible = false;

    /* console.log('date = ' + JSON.stringify(this.newAccidentvehiculenonsh.hiredate));
    this.newAccidentvehiculenonsh.hiredate = new Date('2017-02-02T00:00:00+01:00');
    console.log('datetime = ' + JSON.stringify(this.newAccidentvehiculenonsh.hiredate.getDate));
    console.log(JSON.stringify(this.newAccidentvehiculenonsh)); */

    console.log(JSON.stringify(this.newAccidentvehiculenonsh));
    // this.accidentvehiculenonshs.splice(0, 0, this.newAccidentvehiculenonsh);
    this.accidentvehiculenonshs = [this.newAccidentvehiculenonsh, ...this.accidentvehiculenonshs];
    // console.log('before accidentvehiculenonshs' + JSON.stringify(this.lastids));

    this.service.create(this.newAccidentvehiculenonsh)
      .subscribe(newAccidentvehiculenonsh => {
        this.loadData();
        /*       console.log('newAccidentvehiculenonsh' + JSON.stringify(newAccidentvehiculenonsh));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('accidentvehiculenonsh');
              console.log('last id accidentvehiculenonsh = ' + lid);
              console.log('last id accidentvehiculenonsh = ' + JSON.stringify(lid));
              this.accidentvehiculenonshs[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        this.accidentvehiculenonshs.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          console.log('5');
        }
        console.log('6');
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
   // _accidentvehiculenonsh.samury = inputSamury.value;
    this.service.update(_accidentvehiculenonsh)
      .subscribe(updateaccidentvehiculenonsh => {
        this.loadData();
        console.log(updateaccidentvehiculenonsh);
      });
    /*   console.log('name = ' + input.value);
      console.log(_accidentvehiculenonsh); */
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



