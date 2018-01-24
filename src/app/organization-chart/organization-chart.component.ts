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

/* 
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Message, TreeNode } from 'primeng/components/common/api';
@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.css']

})
export class OrganizationChartComponent implements OnInit {
  data1: TreeNode[];
  data2: TreeNode[];
  selectedNode: TreeNode;
  messages: Message[];
  ngOnInit() {
    this.data1 = [{
      label: 'CEO',
      type: 'person',
      styleClass: 'ui-person',
      expanded: true,
      data: { name: 'Walter White', 'avatar': 'walter.jpg' },
      children: [
        {
          label: 'CFO',
          type: 'person',
          styleClass: 'ui-person',
          expanded: true,
          data: { name: 'Saul Goodman', 'avatar': 'saul.jpg' },
          children: [{
            label: 'Tax',
            styleClass: 'department-cfo'
          },
          {
            label: 'Legal',
            styleClass: 'department-cfo'
          }],
        },
        {
          label: 'COO',
          type: 'person',
          styleClass: 'ui-person',
          expanded: true,
          data: { name: 'Mike E.', 'avatar': 'mike.jpg' },
          children: [{
            label: 'Operations',
            styleClass: 'department-coo'
          }]
        },
        {
          label: 'CTO',
          type: 'person',
          styleClass: 'ui-person',
          expanded: true,
          data: { name: 'Jesse Pinkman', 'avatar': 'jesse.jpg' },
          children: [{
            label: 'Development',
            styleClass: 'department-cto',
            expanded: true,
            children: [{
              label: 'Analysis',
              styleClass: 'department-cto'
            },
            {
              label: 'Front End',
              styleClass: 'department-cto'
            },
            {
              label: 'Back End',
              styleClass: 'department-cto'
            }]
          },
          {
            label: 'QA',
            styleClass: 'department-cto'
          },
          {
            label: 'R&D',
            styleClass: 'department-cto'
          }]
        }
      ]
    }];
    this.data2 = [{
      label: 'F.C Barcelona',
      expanded: true,
      children: [
        {
          label: 'F.C Barcelona',
          expanded: true,
          children: [
            {
              label: 'Chelsea FC'
            },
            {
              label: 'F.C. Barcelona'
            }
          ]
        },
        {
          label: 'Real Madrid',
          expanded: true,
          children: [
            {
              label: 'Bayern Munich'
            },
            {
              label: 'Real Madrid'
            }
          ]
        }
      ]
    }];
  }
  onNodeSelect(event) {
    this.messages = [{ severity: 'success', summary: 'Node Selected', detail: event.node.label }];
  }
}

 */