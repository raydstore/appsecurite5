import { NotFoundError } from './../../common/not-found-error';
import { BadInput } from './../../common/bad-input';
import { AppError } from './../../common/app-error';
import { Damage } from './../../table/table';
import { VwgridService } from './../../services/vwgrid.service';
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
  

  constructor(private service: VwgridService, private damageService: DamageService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getAll()
      .subscribe(grids => {
        this.vwgrids = grids;
      });
    this.damageService.getAll()
        .subscribe(damages => {
          this.damages = damages;
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

  deleteUnitmeasure(damage: Damage) {
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
    console.log('frm grid = , ', JSON.stringify(eventargs));
    this.createdamage(eventargs);
  }

}
