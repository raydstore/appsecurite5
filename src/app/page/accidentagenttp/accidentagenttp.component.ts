import { NotFoundError } from './../../common/not-found-error';
import { BadInput } from './../../common/bad-input';
import { AppError } from './../../common/app-error';
import { LastidService } from './../../services/lastid.service';
import { AccidentagenttpService } from './../../services/accidentagenttp.service';
import { TreeNode } from 'primeng/primeng';
import { Accidentagenttp, AccidentagenttpPK } from './../../table/table';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accidentagenttp',
  templateUrl: './accidentagenttp.component.html',
  styleUrls: ['./accidentagenttp.component.css']
})
export class AccidentagenttpComponent implements OnInit {
  @Input() iddamage: number;
  @Input() titlelist: string;
  /* @Input() accidentdomain: number; */
  accidentagenttps: any[];
  selectedAccidentagenttp: Accidentagenttp;
  selectedNode: TreeNode;
  // accidentagenttp: any;
  accidentagenttpPK: AccidentagenttpPK;
  newAccidentagenttp: Accidentagenttp = {
    datecreate: new Date(),
    dateupdate: new Date(),
    accidentagenttpPK: { iddamage: this.iddamage, id: 0 },
    accidentdomain: 1,
    name: '',
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
  // titlelist = 'Marque';

  constructor(private service: AccidentagenttpService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getByQueryParam({ 'iddamage': this.iddamage })
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


  createAccidentagenttp() {
    this.dialogVisible = false;

    /* console.log('date = ' + JSON.stringify(this.newAccidentagenttp.hiredate));
    this.newAccidentagenttp.hiredate = new Date('2017-02-02T00:00:00+01:00');
    console.log('datetime = ' + JSON.stringify(this.newAccidentagenttp.hiredate.getDate));
    console.log(JSON.stringify(this.newAccidentagenttp)); */

    console.log(JSON.stringify(this.newAccidentagenttp));
    // this.accidentagenttps.splice(0, 0, this.newAccidentagenttp);
    this.accidentagenttps = [this.newAccidentagenttp, ...this.accidentagenttps];
    // console.log('before accidentagenttps' + JSON.stringify(this.lastids));

    this.service.create(this.newAccidentagenttp)
      .subscribe(newAccidentagenttp => {
        this.loadData();
        /*       console.log('newAccidentagenttp' + JSON.stringify(newAccidentagenttp));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('accidentagenttp');
              console.log('last id accidentagenttp = ' + lid);
              console.log('last id accidentagenttp = ' + JSON.stringify(lid));
              this.accidentagenttps[0].id = lid + 1 ;
              console.log('fnito '); */
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
    // this.accidentagenttps.splice(index, 1);
    //    console.log('_accidentagenttp' + _accidentagenttp.id + ', ' + JSON.stringify(_accidentagenttp));
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
    /*   console.log('name = ' + input.value);
      console.log(_accidentagenttp); */
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
      function: '',
      lastuser: 'ali',
      countstopwork: 0,
      accidentdomain: 1,
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
    // this.accidentagenttp = new PrimeCar();
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
    /* this.newMode = false;
    this.newAccidentagenttp = this.cloneAccidentagenttp(event.data);
    this.dialogVisible = true; */
  }

  cloneAccidentagenttp(c: Accidentagenttp): Accidentagenttp {
    let accidentagenttp: Accidentagenttp; // = new Prime();
    /* for (let prop of c) {
      accidentagenttp[prop] = c[prop];
    } */
    accidentagenttp = c;
    return accidentagenttp;
  }

  findSelectedAccidentagenttpIndex(): number {
    return this.accidentagenttps.indexOf(this.selectedAccidentagenttp);
  }
}



