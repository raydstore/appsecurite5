import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  grids: any[] = [
    { rank: 1, ssh: 'Décés', see: 'Décés', tp: 'Décés', icd: '> 1 Milliard DZ', pp: '> 1 Milliard DZ', vh: 'Détruit', eh: '> 25 m2'},
    { rank: 2, ssh: 'Décés', see: 'Décés', tp: 'Décés', icd: '> 1 Milliard DZ', pp: '> 1 Milliard DZ', vh: 'Détruit', eh: '> 25 m2' },
    { rank: 3, ssh: 'Décés', see: 'Décés', tp: 'Décés', icd: '> 1 Milliard DZ', pp: '> 1 Milliard DZ', vh: 'Détruit', eh: '> 25 m2' },
    { rank: 4, ssh: 'Décés', see: 'Décés', tp: 'Décés', icd: '> 1 Milliard DZ', pp: '> 1 Milliard DZ', vh: 'Détruit', eh: '> 25 m2' }
  ];
  constructor() { }

  ngOnInit() {
  }

}
