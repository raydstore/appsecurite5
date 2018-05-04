import { NotFoundError } from './../../common/not-found-error';
import { BadInput } from './../../common/bad-input';
import { AppError } from './../../common/app-error';
import { LastidService } from './../../services/lastid.service';
import { AccidentvehiculeService } from './../../services/accidentvehicule.service';
import { TreeNode } from 'primeng/primeng';
import { Accidentvehicule } from './../../table/table';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accidentvehiculesh',
  templateUrl: './accidentvehiculesh.component.html',
  styleUrls: ['./accidentvehiculesh.component.css']
})
export class AccidentvehiculeshComponent implements OnInit {
  @Input() iddamage: number;
  @Input() idgrid: number;
  @Input() accidentdomain: number;
  @Input() classification: number;
  @Input() titlelist: string;
  /* @Input() accidentdomain: number; */
  accidentvehiculeshs: any[];
  selectedAccidentvehiculesh: Accidentvehicule;
  selectedNode: TreeNode;
  // accidentvehiculesh: any;
  newAccidentvehiculesh: Accidentvehicule = {
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
  // titlelist = 'Marque';

  constructor(private service: AccidentvehiculeService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getByQueryParam({ 'iddamage': this.iddamage, 'idgrid': this.idgrid, 'accidentdomain': 6, 'classification': 'S' })
      .subscribe(accidentvehiculeshs => {
        this.accidentvehiculeshs = accidentvehiculeshs;
        console.log('avsh = ' + JSON.stringify(this.accidentvehiculeshs));
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


  createAccidentvehiculesh() {
    this.dialogVisible = false;

    /* console.log('date = ' + JSON.stringify(this.newAccidentvehiculesh.hiredate));
    this.newAccidentvehiculesh.hiredate = new Date('2017-02-02T00:00:00+01:00');
    console.log('datetime = ' + JSON.stringify(this.newAccidentvehiculesh.hiredate.getDate));
    console.log(JSON.stringify(this.newAccidentvehiculesh)); */

    console.log(JSON.stringify(this.newAccidentvehiculesh));
    // this.accidentvehiculeshs.splice(0, 0, this.newAccidentvehiculesh);
    this.accidentvehiculeshs = [this.newAccidentvehiculesh, ...this.accidentvehiculeshs];
    // console.log('before accidentvehiculeshs' + JSON.stringify(this.lastids));

    this.service.create(this.newAccidentvehiculesh)
      .subscribe(newAccidentvehiculesh => {
        this.loadData();
        /*       console.log('newAccidentvehiculesh' + JSON.stringify(newAccidentvehiculesh));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('accidentvehiculesh');
              console.log('last id accidentvehiculesh = ' + lid);
              console.log('last id accidentvehiculesh = ' + JSON.stringify(lid));
              this.accidentvehiculeshs[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        this.accidentvehiculeshs.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          console.log('5');
        }
        console.log('6');
      });
  }

  deleteAccidentvehiculesh(_accidentvehiculesh: Accidentvehicule) {
    let index = this.accidentvehiculeshs.indexOf(_accidentvehiculesh);
    this.accidentvehiculeshs.splice(index, 1);
    this.accidentvehiculeshs = [...this.accidentvehiculeshs];
    // this.accidentvehiculeshs.splice(index, 1);
//    console.log('_accidentvehiculesh' + _accidentvehiculesh.id + ', ' + JSON.stringify(_accidentvehiculesh));
    this.service.delete(_accidentvehiculesh.id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.accidentvehiculeshs.splice(index, 0, _accidentvehiculesh);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateAccidentvehiculesh(_accidentvehiculesh, inputSamury: HTMLInputElement) {
    _accidentvehiculesh.samury = inputSamury.value;
    this.service.update(_accidentvehiculesh)
      .subscribe(updateaccidentvehiculesh => {
        this.loadData();
        console.log(updateaccidentvehiculesh);
      });
    /*   console.log('name = ' + input.value);
      console.log(_accidentvehiculesh); */
  }

  cancelUpdate(_accidentvehiculesh) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAccidentvehiculesh = {
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
    // this.accidentvehiculesh = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let accidentvehiculeshs = [...this.accidentvehiculeshs];
    if (this.newMode) {
      accidentvehiculeshs.push(this.newAccidentvehiculesh);
    } else {
      accidentvehiculeshs[this.findSelectedAccidentvehiculeshIndex()] = this.newAccidentvehiculesh;
    }
    this.accidentvehiculeshs = accidentvehiculeshs;
    this.newAccidentvehiculesh = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedAccidentvehiculeshIndex();
    this.accidentvehiculeshs = this.accidentvehiculeshs.filter((val, i) => i !== index);
    this.newAccidentvehiculesh = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newAccidentvehiculesh = this.cloneAccidentvehiculesh(event.data);
    this.dialogVisible = true; */
  }

  cloneAccidentvehiculesh(c: Accidentvehicule): Accidentvehicule {
    let accidentvehiculesh: Accidentvehicule; // = new Prime();
    /* for (let prop of c) {
      accidentvehiculesh[prop] = c[prop];
    } */
    accidentvehiculesh = c;
    return accidentvehiculesh;
  }

  findSelectedAccidentvehiculeshIndex(): number {
    return this.accidentvehiculeshs.indexOf(this.selectedAccidentvehiculesh);
  }
}



