import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { NotFoundError } from '../../common/not-found-error';
import { BadInput } from '../../common/bad-input';
import { AppError } from '../../common/app-error';
import { LastidService } from '../../services/lastid.service';
import { AccidentagenttpService } from '../../services/accidentagenttp.service';
import { TreeNode } from 'primeng/primeng';
import { Accidentagenttp, AccidentagenttpPK, Entreprise } from '../../table/table';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-accidentagenttp',
  templateUrl: './accidentagenttp.component.html',
  styleUrls: ['./accidentagenttp.component.css']
})
export class AccidentagenttpComponent implements OnInit {
  @Input() iddamage: number;
  @Input() idgrid: number;
  @Input() titlelist: string;
  accidentagenttps: any[];
  entreprises: any[];
  entreprise: Entreprise;
  selectedAccidentagenttp: Accidentagenttp;
  selectedNode: TreeNode;

  accidentagenttpPK: AccidentagenttpPK;
  newAccidentagenttp: Accidentagenttp = {
    datecreate: new Date(),
    dateupdate: new Date(),
    accidentagenttpPK: { iddamage: this.iddamage, id: 0 },
    accidentdomain: 3,
    name: '',
    idgrid: this.idgrid,
    function: '',
    lastuser: 'ali',
    samury: '',
    countstopwork: 0,
    typeaccident: 'L',
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;

  lastids: any[];
  lastid: any;

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<String>();
  click$ = new Subject<String>();

  constructor(private service: AccidentagenttpService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getByQueryParam({ 'iddamage': this.iddamage, 'idgrid': this.idgrid })
      .subscribe(accidentagenttps => {
        this.accidentagenttps = accidentagenttps;
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

  searchEntreprise = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.entreprises : this.entreprises.filter(v => (v.name).toLowerCase()
        .indexOf(term.toLowerCase()) > -1)).slice(0, 10));

  formatter = (x: { name: string }) => x.name;

  nodeExpand(event) {
    this.selectedNode = event.node;
  }

  isSelected(event) {
    return this.selectedNode === event.node ? true : false;
  }


  createAccidentagenttp() {
    this.dialogVisible = false;
    this.accidentagenttps = [this.newAccidentagenttp, ...this.accidentagenttps];
    this.service.create(this.newAccidentagenttp)
      .subscribe(newAccidentagenttp => {
        this.loadData();
      }, (error: AppError) => {
        this.accidentagenttps.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          console.log('5');
        }
        console.log('6');
      });
  }

  deleteAccidentagenttp(_accidentagenttp: Accidentagenttp) {
    let index = this.accidentagenttps.indexOf(_accidentagenttp);
    this.accidentagenttps.splice(index, 1);
    this.accidentagenttps = [...this.accidentagenttps];
    this.service.delete(_accidentagenttp.accidentagenttpPK)
      .subscribe(
        () => { this.loadData(); },
        (error: Response) => {
          this.accidentagenttps.splice(index, 0, _accidentagenttp);

          if (error instanceof NotFoundError) {
            alert('this post has already been deleted');
          } else {
            throw error;
          }
        }
      );
  }

  updateAccidentagenttp(_accidentagenttp, inputSamury: HTMLInputElement) {
    _accidentagenttp.samury = inputSamury.value;
    this.service.update(_accidentagenttp)
      .subscribe(updateaccidentagenttp => {
        this.loadData();
        console.log(updateaccidentagenttp);
      });
  }

  cancelUpdate(_accidentagenttp) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAccidentagenttp = {
      datecreate: new Date(),
      dateupdate: new Date(),
      accidentagenttpPK: { iddamage: this.iddamage, id: 0 },
      name: '',
      idgrid: this.idgrid,
      function: '',
      lastuser: 'ali',
      countstopwork: 0,
      accidentdomain: 3,
      samury: '',
      typeaccident: 'L',
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
    let accidentagenttps = [...this.accidentagenttps];
    if (this.newMode) {
      accidentagenttps.push(this.newAccidentagenttp);
    } else {
      accidentagenttps[this.findSelectedAccidentagenttpIndex()] = this.newAccidentagenttp;
    }
    this.accidentagenttps = accidentagenttps;
    this.newAccidentagenttp = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedAccidentagenttpIndex();
    this.accidentagenttps = this.accidentagenttps.filter((val, i) => i !== index);
    this.newAccidentagenttp = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
  }

  cloneAccidentagenttp(c: Accidentagenttp): Accidentagenttp {
    let accidentagenttp: Accidentagenttp; // = new Prime();
    accidentagenttp = c;
    return accidentagenttp;
  }

  findSelectedAccidentagenttpIndex(): number {
    return this.accidentagenttps.indexOf(this.selectedAccidentagenttp);
  }
}



