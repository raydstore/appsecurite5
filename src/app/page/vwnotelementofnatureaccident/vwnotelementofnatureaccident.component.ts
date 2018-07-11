import { Accidentnature, AccidentnaturePK } from '../../table/table';
import { BadInput } from '../../common/bad-input';
import { AppError } from '../../common/app-error';
import { AccidentnatureService } from '../../services/accidentnature.service';
import { VwnotelementofnatureaccidentService } from '../../services/vwnotelementofnatureaccident.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vwnotelementofnatureaccident',
  templateUrl: './vwnotelementofnatureaccident.component.html',
  styleUrls: ['./vwnotelementofnatureaccident.component.css']
})
export class VwnotelementofnatureaccidentComponent implements OnInit {
  @Input() accident: any;
  vwnotelementofnatureaccidents: any[];
  newaccidentnaturePK: AccidentnaturePK = {
    idaccident: 0,
    idnature: 0
  };
  newaccidentnature: Accidentnature = {
    accident: null,
    accidentnaturePK: this.newaccidentnaturePK,
    datecreate: new Date(),
    dateupdate: new Date(),
    owner: 'ali'
  }

  constructor(private service: VwnotelementofnatureaccidentService, private serviceAccidentnature: AccidentnatureService) { }

  ngOnInit() {
    this.loadData();

  }

  loadData() {
    this.service.getByQueryParam({ 'idaccident': this.accident['id'] })
      .subscribe(vwnotelementofnatureaccidents => {
        this.vwnotelementofnatureaccidents = vwnotelementofnatureaccidents;
      });
  }

  newAccidentNature(idnature: number) {
    this.newaccidentnature.accidentnaturePK.idaccident = this.accident['id'];
    this.newaccidentnature.accidentnaturePK.idnature = idnature;
    this.newaccidentnature.accident = this.accident;
    this.serviceAccidentnature.create(this.newaccidentnature).subscribe(
      newaccidentnature => { this.loadData(); }
      , (error: AppError) => {
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
    this.newaccidentnature.accidentnaturePK.idnature = 0;
  }
}
