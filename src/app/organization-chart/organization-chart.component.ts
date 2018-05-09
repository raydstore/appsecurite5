import { Component, OnInit } from '@angular/core';
import { OrganizationChartModule } from 'primeng/primeng';
import { TreeNode } from 'primeng/primeng';

@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.css']
})
export class OrganizationChartComponent implements OnInit {
  data: TreeNode[];
  constructor() { }

  ngOnInit() {
    this.data = [{
      label: 'Root a',
      children: [
        {
          label: 'Child 1',
          children: [
            {
              label: 'child 1.1',
              children: [
                 {
                    label: 'child 1.1.1'
                 }
              ]
            },
            {
              label: 'child 1.2'
            }
          ]
        },
        {
          label: 'Child 2',
          children: [
            {
              label: 'Child 2.1'
            },
            {
              label: 'Child 2.2'
            }
          ]
        }
      ]
    }];

  }
}

