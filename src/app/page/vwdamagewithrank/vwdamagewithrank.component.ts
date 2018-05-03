import { Damage } from './../../table/table';
import { VwdamagewithrankService } from './../../services/vwdamagewithrank.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AccidentnatureService } from '../../services/accidentnature.service';


@Component({
  selector: 'app-vwdamagewithrank',
  templateUrl: './vwdamagewithrank.component.html',
  styleUrls: ['./vwdamagewithrank.component.css']
})
export class VwdamagewithrankComponent implements OnInit {
  @Input() accident: any;
  @Input() accidentdomain: number;
  @Input() idaccidentnature: number;
  @Input() idrank: number;
  @Input() idgrid: string;
  @Output() change = new EventEmitter();
  vwdamagewithranks: string;
  checked: boolean = false;
  accidentnature: any;
  accidentnatures: any;
  newdamage: any = {
    id: 0,
    accidentdomain: 0,
    accidentnature: null,
    idgrid: 0,
    degree: 'A',
    description: '',
    owner: 'ali',
    lastuser: 'ali',
    datecreate: new Date(),
    dateupdate: new Date()
  } ;
  

  constructor(private service: VwdamagewithrankService, private serviceAccidentnature: AccidentnatureService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getByQueryParam({ 'idaccident': this.accident['id'] ,
                                   'accidentdomain': this.accidentdomain,
                                   'idnature': this.idaccidentnature,
                                   'idrank': this.idrank })
      .subscribe(vwdamagewithranks => {
        this.vwdamagewithranks = vwdamagewithranks;
        this.checked = +this.vwdamagewithranks !== 0;
      });

     this.serviceAccidentnature.getAll()
      .subscribe(accidentnatures => {
        this.accidentnatures = accidentnatures;
      })

    this.serviceAccidentnature.getItem(this.idaccidentnature)
      .subscribe(accidentnature => {
        this.accidentnature = accidentnature;
        console.log('this.accidentnature = ' + this.accidentnature + '  ' + this.idaccidentnature);
      })

  }

  getAccidentnatureById(accidentnature, id)  {
    return accidentnature.id === id;
  }

  getAccidentnature(id: number): any {
    let a: any;
      a = this.accidentnatures.find(item => item.accidentnaturePK.idnature === id);
    console.log('this.accidentnatures = ' + JSON.stringify(this.accidentnatures) + ',  ' + id + ', ' + a);
      return a;

  //  this.accidentnatures.find(getAccidentnatureById(accidentnature, id));
     /* this.serviceAccidentnature.getItem(id)
      .subscribe(accidentnature => {
       return accidentnature;
      })  */
  }

  getIdgrid(value): number {
    return +value.substr(0, value.indexOf('-'));
  }

  onCheckChange($event) {
     if (this.checked) {
       this.newdamage.accidentdomain = this.accidentdomain;
       this.newdamage.accidentnature = this.getAccidentnature(this.idaccidentnature);
       // this.accidentnature; // getAccidentnature(this.idaccidentnature);
       this.newdamage.idgrid         = this.getIdgrid(this.idgrid);
      // this.newdamage.idaccident     = this.accident;
       console.log('newdamage' + JSON.stringify(this.newdamage));
       this.change.emit(this.newdamage);
     }
  }

}
