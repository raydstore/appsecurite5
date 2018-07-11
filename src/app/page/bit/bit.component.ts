import { BadInput } from '../../common/bad-input';
import { BitService } from '../../services/bit.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TreeTableModule, TreeNode, SharedModule } from 'primeng/primeng';
import { Bit } from '../../table/table';
import { AppError } from '../../common/app-error';
import { NotFoundError } from '../../common/not-found-error';

@Component({
  selector: 'app-bit',
  templateUrl: './bit.component.html',
  styleUrls: ['./bit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BitComponent implements OnInit {
  bits: Bit[] = [];
  data: TreeNode[] = [];
  templateNewBit: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: '',
    kind: 'C',
    lastuser: 'ali',
    name: '',
    owner: 'ali'
  };
  selectedKind = 'C';
  kinds = [
    { id: 'C', name: 'Classification' },
    { id: 'G', name: 'Group' },
    { id: 'I', name: 'Item' }
  ];
  titlenew = 'Classification';
  newBit: any = this.templateNewBit;

  dialogVisible = false;
  newMode = false;
  newWorkSheet = false;
  titlelist = 'BIT';

  constructor(private service: BitService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getAll()
      .subscribe(bits => {
        this.bits = bits;
        this.buildBit();
      });
  }


  getChilds(bitParent: Bit): TreeNode[] {
    let result: TreeNode[] = [];
    let childs: TreeNode[];
    let value: any;
    for (let bit of this.bits) {
      if (bit.idparent !== undefined) {
        if ('idparent' in bit) {
          if ((bit.idparent === bitParent['id']) &&
            (bit.kindparent === bitParent['kind'])) {
            childs = this.getChilds(bit);
            if (childs.length !== 0) {
              value = {
                name: bit.name,
                type: 'branch',
                data: bit,
                children: childs,
                expanded: true,
                styleClass: 'clbranch'
              };
            } else {
              value = {
                name: bit.name,
                type: 'sheet',
                data: bit,
                styleClass: 'clstatment'
              };
            }
            result.push(value);
          }
        }
      }
    }
    return result;
  }

  buildBit() {
    let value: any;
    let childs: TreeNode[];
    this.data = [];
    for (let bit of this.bits) {
      if (!('idparent' in bit)) {
        childs = this.getChilds(bit);
        if (childs.length !== 0) {
          value = {
            name: bit.name,
            type: 'branch',
            data: bit,
            children: childs,
            expanded: true,
            styleClass: 'clworksheet'
          };
        } else {
          value = {
            name: bit.name,
            type: 'branch',
            data: bit,
            styleClass: 'clworksheet'
          }
        }
        this.data.push(value);
      }
    }
  }

  addBit(node) {
    this.newBit = this.templateNewBit;
    this.newBit.kindparent = node.data.kind;
    this.newBit.idparent = node.data.id;
    //     this.newBit.kind = this.selectedKind;
    this.selectedKind = 'I';
    this.newWorkSheet = false;
    this.titlenew = 'item';
    this.newBit.kind = this.selectedKind;
    this.showNewDialoge();
    this.newBit.id   = '';
    this.newBit.name = '';
    // this.selectedKind = 'w';
  }

  addWorkSheet() {
    this.newBit = this.templateNewBit;
    this.newWorkSheet = true;
    this.titlenew = 'Classification';
    this.selectedKind = 'C';
    this.newBit.kind = this.selectedKind;
    this.showNewDialoge();
    // this.newBit.kind = this.selectedKind;
    this.newBit.id   = '';
    this.newBit.name = '';
    // this.selectedKind = 'w';
  }

  onChangeRadio(event: any) {
    this.newBit.kind = event.target.value;
  }

  createBit() {
    this.dialogVisible = false;
    this.bits = [this.newBit, ...this.bits];
    this.service.create(this.newBit)
      .subscribe(newtt => {
        this.bits = [];
        this.loadData();
      }, (error: AppError) => {
        this.bits.splice(0, 1);
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      });
  }

  deleteBit(node) {
    this.service.delete(node.data.id)
      .subscribe(
      () => {
        this.loadData()
      },
      (error: Response) => {
        if (error instanceof NotFoundError) {
          alert('this post has already been deleted');
        } else {
          throw error;
        }
      }
      );
  }

  updateBit(node) {
    this.service.update(node.data)
      .subscribe(updatebit => {
        this.loadData();
      });
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
  }

  hideNewDialoge() {
    this.dialogVisible = false;
    this.newMode = false;
  }

  setFocusColor(input: HTMLInputElement) {
    input.style.backgroundColor = 'blue';
    input.style.color = 'white';

  }

  setDefaultColor(input: HTMLInputElement) {
    input.style.backgroundColor = 'beige';
    input.style.color = 'black';
  }

}
