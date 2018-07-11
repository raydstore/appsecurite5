import { MarkService } from '../../services/mark.service';
import { EntrepriseService } from '../../services/entreprise.service';
import { Observable } from 'rxjs/Observable';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { NotFoundError } from '../../common/not-found-error';
import { BadInput } from '../../common/bad-input';
import { AppError } from '../../common/app-error';
import { LastidService } from '../../services/lastid.service';
import { AccidentvehiculeService } from '../../services/accidentvehicule.service';
import { TreeNode } from 'primeng/primeng';
import { Accidentvehicule } from '../../table/table';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

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

  marks: any[];
  entreprises: any[];
  // titlelist = 'Marque';

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<String>();
  click$ = new Subject<String>();

  constructor(private service: AccidentvehiculeService, private lastidService: LastidService,
              private markService: MarkService, private entrepriseService: EntrepriseService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getAll()
    //.getByQueryParam({ 'iddamage': this.iddamage, 'idgrid': this.idgrid, 'accidentdomain': 6, 'classification': 'S' })
      .subscribe(accidentvehiculeshs => {
        this.accidentvehiculeshs = accidentvehiculeshs;
      });
    this.markService.getAll()
      .subscribe(marks => {
        this.marks = marks;
      });
    this.entrepriseService.getAll()
      .subscribe(entreprises => {
        this.entreprises = entreprises;
      });
  }

  searchMark = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.marks : this.marks.filter(v => v.name.toLowerCase()
        .indexOf(term.toLowerCase()) > -1)).slice(0, 10));

  searchEntreprise = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.entreprises : this.entreprises.filter(v => v.name.toLowerCase()
        .indexOf(term.toLowerCase()) > -1)).slice(0, 10));
 
  formatter = (x: { name: string }) => x.name;


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


  createAccidentvehiculesh() {
    this.dialogVisible = false;
    this.accidentvehiculeshs = [this.newAccidentvehiculesh, ...this.accidentvehiculeshs];

    this.service.create(this.newAccidentvehiculesh)
      .subscribe(newAccidentvehiculesh => {
        this.loadData();
      }, (error: AppError) => {
        this.accidentvehiculeshs.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
        }
      });
  }

  deleteAccidentvehiculesh(_accidentvehiculesh: Accidentvehicule) {
    let index = this.accidentvehiculeshs.indexOf(_accidentvehiculesh);
    this.accidentvehiculeshs.splice(index, 1);
    this.accidentvehiculeshs = [...this.accidentvehiculeshs];
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

  updateAccidentvehiculesh(_accidentvehiculesh) {
    // _accidentvehiculesh.samury = inputSamury.value;
    this.service.update(_accidentvehiculesh)
      .subscribe(updateaccidentvehiculesh => {
        this.loadData();
      });
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
      kind: 'UT',
      classification: 'S',
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

  getClassification(value) {
    console.log(value);
    return value === 'S' ? 'Vehicule SH' : 'Vehicule non SH';
  }
}



