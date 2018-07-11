import { VwnotnatureofaccidentService } from '../../services/vwnotnatureofaccident.service';
import { AccidentnatureService } from '../../services/accidentnature.service';
import { NotFoundError } from '../../common/not-found-error';
import { BadInput } from '../../common/bad-input';
import { AppError } from '../../common/app-error';
import { Damage, AccidentnaturePK, Accidentnature } from '../../table/table';
import { VwgridService } from '../../services/vwgrid.service';
import { Component, OnInit, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DamageService } from '../../services/damage.service';


@Component({
  selector: 'app-vwgrid',
  templateUrl: './vwgrid.component.html',
  styleUrls: ['./vwgrid.component.css']
})
export class VwgridComponent implements OnInit {
  @Input() accident: any;
  // @Input() idnature: number;
  vwgrids: any[];
  damages: any[];
  vwnotnatureofaccidents: any[];
  accidentnatures: any;
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



  constructor(private service: VwgridService, private damageService: DamageService,
    private vwnotnatureofaccidentService: VwnotnatureofaccidentService, private accidentnatureService: AccidentnatureService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getAll()
      .subscribe(grids => {
        this.vwgrids = grids;
      });
  }

  loadAccidentNature() {
    this.accidentnatureService.getAll()
      .subscribe(accidentnatures => {
        this.accidentnatures = accidentnatures;
      });
    this.vwnotnatureofaccidentService.getByQueryParam({ 'idaccident': this.accident['id'] })
      .subscribe(vwnotnatureofaccidents => {
        this.vwnotnatureofaccidents = vwnotnatureofaccidents;
      });
  }

  getAccidentnature(id: number): any {
    let item: Accidentnature;
    this.accidentnatureService.getItem('id;idaccident=' + this.accident.id + ';idnature=' + id)
    .subscribe(
      accidentnature => {
      return accidentnature;
    });

  }

  newAccidentNature(accidentnature: Accidentnature) {
    this.accidentnatureService.create(accidentnature)
      .subscribe(newaccidentnature => { 
      }
      , (error: AppError) => {
        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  createdamage(damage) {
    this.damages = [damage, ...this.damages];
    this.damageService.create(damage)
      .subscribe(newdamage => {
        this.loadData();
      }, (error: AppError) => {
        this.damages.splice(0, 1);
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      });
  }

  deleteDamage(damage: Damage) {
    let index = this.damages.indexOf(damage);
    this.damages.splice(index, 1);
    this.damages = [...this.damages];
    this.service.delete(damage.id)
      .subscribe(
        () => {
          this.loadData();
        },
        (error: Response) => {
          this.damages.splice(index, 0, damage);

          if (error instanceof NotFoundError) {
            alert('this damage has already been deleted');
          } else {
            throw error;
          }
        }
      );
  }

  onChangeDamageWithRank(eventargs: Damage) {
    let nAccidentnature: Accidentnature;
    let idnature = eventargs.accidentdomain <= 3 ? 1 : eventargs.accidentdomain <= 6 ? 2 : 3;
    let _accidentnature: any;
    this.accidentnatureService.getItem('id;idaccident=' + this.accident.id + ';idnature=' + idnature)
      .subscribe(accidentnature => {
        _accidentnature = accidentnature;
      }, (error: AppError) => {  
        this.damages.splice(0, 1);
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }, () => {
        if (_accidentnature == null) {
          nAccidentnature = this.newaccidentnature;
          nAccidentnature.accident = this.accident;
          nAccidentnature.accidentnaturePK.idaccident = this.accident.id;
          nAccidentnature.accidentnaturePK.idnature = idnature;
          _accidentnature = nAccidentnature;
          this.newAccidentNature(_accidentnature);
        }

        eventargs.accidentnature = _accidentnature;
        this.createdamage(eventargs);
      });
  }

}
