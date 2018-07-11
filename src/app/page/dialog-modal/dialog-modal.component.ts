import { LabelService } from '../../services/label.service';
import { TreeNode } from 'primeng/primeng';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Label } from '../../table/table';

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.css'],
  encapsulation: ViewEncapsulation.None
  /* ,
  inputs: ['inode'] */
})
export class DialogModalComponent implements OnInit {
  @Input() inode: TreeNode;
  @Output() okClicked = new EventEmitter<InfoSite>();

  name: string;
  label: any;
  labels: any[] = [{ label: 'Select Label', value: null }];
  ltLabels: Label[] = [];
  selectedLabel: Label;
  display = false;

  constructor(private lbService: LabelService) { }

  ngOnInit() {
    this.lbService.getAll().
      subscribe(ltLabels => {
        this.ltLabels = ltLabels;
        this.bulidLabels();
      })
  }

  bulidLabels() {
    for (let label of this.ltLabels) {
      this.labels.push({ label: label.name, value: label });
    }
  }

  okClick() {
    this.okClicked.emit({ node: this.inode, name: this.name, label: this.selectedLabel});
    this.display = false;
  }

  showDialog() {
    this.display = true;
  }

  // input: HTMLInputElement, inputSelect: HTMLSelectElement

  cancelCreate() {
    this.name = '';
    // inputSelect.selectedIndex = 0;
    this.selectedLabel = { name: 'Select Label' };
    this.display = false;
  }

}

export interface InfoSite {
   node: TreeNode;
   name?: string;
   label: Label;
}
