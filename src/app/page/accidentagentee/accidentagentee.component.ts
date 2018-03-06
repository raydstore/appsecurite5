import { NotFoundError } from './../../common/not-found-error';
import { BadInput } from './../../common/bad-input';
import { AppError } from './../../common/app-error';
import { LastidService } from './../../services/lastid.service';
import { AccidentagenteeService } from './../../services/accidentagentee.service';
import { TreeNode } from 'primeng/primeng';
import { Accidentagentee, AccidentagenteePK } from './../../table/table';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-accidentagentee',
  templateUrl: './accidentagentee.component.html',
  styleUrls: ['./accidentagentee.component.css']
})
export class AccidentagenteeComponent implements OnInit {
  @Input() iddamage: number;
  @Input() titlelist: string;
  /* @Input() accidentdomain: number; */
  accidentagentees: any[];
  selectedAccidentagentee: Accidentagentee;
  selectedNode: TreeNode;
  // accidentagentee: any;
  accidentagenteePK: AccidentagenteePK;
  newAccidentagentee: Accidentagentee = {
    datecreate: new Date(),
    dateupdate: new Date(),
    accidentagenteePK: {iddamage : this.iddamage, id: 0},
    accidentdomain: 1,
    name: '',
    function: '',
    identreprise: null,
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

  constructor(private service: AccidentagenteeService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getByQueryParam({ 'iddamage': this.iddamage })
      .subscribe(accidentagentees => {
        this.accidentagentees = accidentagentees;
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


  createAccidentagentee() {
    this.dialogVisible = false;

    /* console.log('date = ' + JSON.stringify(this.newAccidentagentee.hiredate));
    this.newAccidentagentee.hiredate = new Date('2017-02-02T00:00:00+01:00');
    console.log('datetime = ' + JSON.stringify(this.newAccidentagentee.hiredate.getDate));
    console.log(JSON.stringify(this.newAccidentagentee)); */

    console.log(JSON.stringify(this.newAccidentagentee));
    // this.accidentagentees.splice(0, 0, this.newAccidentagentee);
    this.accidentagentees = [this.newAccidentagentee, ...this.accidentagentees];
    // console.log('before accidentagentees' + JSON.stringify(this.lastids));

    this.service.create(this.newAccidentagentee)
      .subscribe(newAccidentagentee => {
        this.loadData();
        /*       console.log('newAccidentagentee' + JSON.stringify(newAccidentagentee));
              console.log('first lastids' + JSON.stringify(this.lastids));
              let lid = this.getLastid('accidentagentee');
              console.log('last id accidentagentee = ' + lid);
              console.log('last id accidentagentee = ' + JSON.stringify(lid));
              this.accidentagentees[0].id = lid + 1 ;
              console.log('fnito '); */
      }, (error: AppError) => {
        this.accidentagentees.splice(0, 1);
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          console.log('5');
        }
        console.log('6');
      });
  }

  deleteAccidentagentee(_accidentagentee: Accidentagentee) {
    let index = this.accidentagentees.indexOf(_accidentagentee);
    this.accidentagentees.splice(index, 1);
    this.accidentagentees = [...this.accidentagentees];
    // this.accidentagentees.splice(index, 1);
//    console.log('_accidentagentee' + _accidentagentee.id + ', ' + JSON.stringify(_accidentagentee));
    this.service.delete(_accidentagentee.accidentagenteePK)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.accidentagentees.splice(index, 0, _accidentagentee);

        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateAccidentagentee(_accidentagentee, inputSamury: HTMLInputElement) {
    _accidentagentee.samury = inputSamury.value;
    this.service.update(_accidentagentee)
      .subscribe(updateaccidentagentee => {
        this.loadData();
        console.log(updateaccidentagentee);
      });
    /*   console.log('name = ' + input.value);
      console.log(_accidentagentee); */
  }

  cancelUpdate(_accidentagentee) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAccidentagentee = {
      datecreate: new Date(),
      dateupdate: new Date(),
      accidentagenteePK: {iddamage: this.iddamage, id: 0} ,
      name: '',
      function: '',
      identreprise: null,
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
    // this.accidentagentee = new PrimeCar();
    this.dialogVisible = true;
  }

  save() {
    let accidentagentees = [...this.accidentagentees];
    if (this.newMode) {
      accidentagentees.push(this.newAccidentagentee);
    } else {
      accidentagentees[this.findSelectedAccidentagenteeIndex()] = this.newAccidentagentee;
    }
    this.accidentagentees = accidentagentees;
    this.newAccidentagentee = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedAccidentagenteeIndex();
    this.accidentagentees = this.accidentagentees.filter((val, i) => i !== index);
    this.newAccidentagentee = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
    /* this.newMode = false;
    this.newAccidentagentee = this.cloneAccidentagentee(event.data);
    this.dialogVisible = true; */
  }

  cloneAccidentagentee(c: Accidentagentee): Accidentagentee {
    let accidentagentee: Accidentagentee; // = new Prime();
    /* for (let prop of c) {
      accidentagentee[prop] = c[prop];
    } */
    accidentagentee = c;
    return accidentagentee;
  }

  findSelectedAccidentagenteeIndex(): number {
    return this.accidentagentees.indexOf(this.selectedAccidentagentee);
  }
}



