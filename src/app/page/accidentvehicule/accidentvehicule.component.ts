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
import { RadioButtonModule } from 'primeng/radiobutton';
import { isUndefined, isNullOrUndefined } from 'util';

@Component({
  selector: 'app-accidentvehicule',
  templateUrl: './accidentvehicule.component.html',
  styleUrls: ['./accidentvehicule.component.css']
})
export class AccidentvehiculeComponent implements OnInit {
  @Input() iddamage: number;
  @Input() idgrid: number;
  @Input() accidentdomain: number;
  @Input() classification: number;
  @Input() titlelist: string;
  /* @Input() accidentdomain: number; */
  accidentvehicules: any[];
  selectedAccidentvehicule: Accidentvehicule;
  selectedNode: TreeNode;
  // accidentvehicule: any;
  newAccidentvehicule: Accidentvehicule = {
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
    this.service.getByQueryParam({ 'iddamage': this.iddamage, 'idgrid': this.idgrid, 'accidentdomain': 6 })
      .subscribe(accidentvehicules => {
        this.accidentvehicules = accidentvehicules;
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

  getName(item): string {
    if (!isNullOrUndefined(item)) {
      return item.name;
    }
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


  createAccidentvehicule() {
    this.dialogVisible = false;
    this.accidentvehicules = [this.newAccidentvehicule, ...this.accidentvehicules];

    this.service.create(this.newAccidentvehicule)
      .subscribe(newAccidentvehicule => {
        this.loadData();
      }, (error: AppError) => {
        this.accidentvehicules.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
        }
      });
  }

  deleteAccidentvehicule(_accidentvehicule: Accidentvehicule) {
    let index = this.accidentvehicules.indexOf(_accidentvehicule);
    this.accidentvehicules.splice(index, 1);
    this.accidentvehicules = [...this.accidentvehicules];
    this.service.delete(_accidentvehicule.id)
      .subscribe(
        () => { this.loadData(); },
        (error: Response) => {
          this.accidentvehicules.splice(index, 0, _accidentvehicule);

          if (error instanceof NotFoundError) {
            alert('this post has already been deleted');
          } else {
            throw error;
          }
        }
      );
  }

  updateAccidentvehicule(_accidentvehicule) {
    // _accidentvehicule.samury = inputSamury.value;
    this.service.update(_accidentvehicule)
      .subscribe(updateaccidentvehicule => {
        this.loadData();
      });
  }

  cancelUpdate(_accidentvehicule) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAccidentvehicule = {
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
    // this.accidentvehicule = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let accidentvehicules = [...this.accidentvehicules];
    if (this.newMode) {
      accidentvehicules.push(this.newAccidentvehicule);
    } else {
      accidentvehicules[this.findSelectedAccidentvehiculeIndex()] = this.newAccidentvehicule;
    }
    this.accidentvehicules = accidentvehicules;
    this.newAccidentvehicule = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedAccidentvehiculeIndex();
    this.accidentvehicules = this.accidentvehicules.filter((val, i) => i !== index);
    this.newAccidentvehicule = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newAccidentvehicule = this.cloneAccidentvehicule(event.data);
    this.dialogVisible = true; */
  }

  cloneAccidentvehicule(c: Accidentvehicule): Accidentvehicule {
    let accidentvehicule: Accidentvehicule; // = new Prime();
    /* for (let prop of c) {
      accidentvehicule[prop] = c[prop];
    } */
    accidentvehicule = c;
    return accidentvehicule;
  }

  findSelectedAccidentvehiculeIndex(): number {
    return this.accidentvehicules.indexOf(this.selectedAccidentvehicule);
  }

  getClassification(value) {
    // display name for classification vehicule (sh or non sh)
    if (!isNullOrUndefined(value)) {
      return value === 'S' ? 'Vehicule SH' : 'Vehicule non SH';
    }
  }
}



