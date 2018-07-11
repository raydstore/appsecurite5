import { VwaccidentnatureService } from '../../services/vwaccidentnature.service';
import { Component, OnInit, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-accidentnature',
  templateUrl: './accidentnature.component.html',
  styleUrls: ['./accidentnature.component.css']
})
export class AccidentnatureComponent implements OnInit {
  @Input() idaccident: number;
  accidentnatures: any[];
  constructor(private service: VwaccidentnatureService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getByQueryParam({ 'idaccident': this.idaccident })
      .subscribe(accidentnatures => {
        this.accidentnatures = accidentnatures;
      });
  }
}
