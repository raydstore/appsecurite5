import { UploadfileService } from '../../services/uploadfile.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { Accident } from '../../table/table';
import { TreeNode } from 'primeng/components/common/api';
import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { AccidentfileService } from '../../services/accidentfile.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Accidentfile } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';
import { environment } from '../../../environments/environment';

const urlService = environment.urlService;

@Component({
  selector: 'app-accidentfile',
  templateUrl: 'accidentfile.component.html',
  styleUrls: ['./accidentfile.component.css']
})
export class AccidentfileComponent implements OnInit {
  @Input() idaccident: Accident;
  @Input() titlelist: string;
  accidentfiles: any[];
  selectedAccidentfile: Accidentfile;
  selectedNode: TreeNode;
  // accidentfile: any;
  newAccidentfile: any = {
    datecreate: new Date(),
    dateupdate: new Date(),
    id: 0,
    idaccident: this.idaccident,
    path: '',
    lastuser: 'ali',
    name: '',
    owner: 'ali'
  };
  dialogVisible = false;
  newMode = false;
  pdfstr = 'file:///C:/Users/boutarfa/Desktop/work/budget2018.pdf';

  lastids: any[];
  lastid: any;
  // titlelist = 'Marque';

  selectedFile: File = null;
  

  constructor(private service: AccidentfileService, private lastidService: LastidService,
    private uploadfileService: UploadfileService) {

  }

  ngOnInit() {
    this.loadData();
    // this.loadLastId(); 
  }

  loadData() {
    this.service.getByQueryParam({ 'idaccident': this.idaccident.id })
      .subscribe(accidentfiles => {
        this.accidentfiles = accidentfiles;
      });
  }

  loadLastId() {
    this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids);
  }

  onFileSelected(event) {
    this.selectedFile = <File> event.target.files[0];
  }

  onUpload() {
    const fd = new FormData();
    fd.append('fileName', 'testname');
    fd.append('fileUpload', this.selectedFile);
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.uploadfileService.create(fd).subscribe(
      res => {
        console.log(res);
      }
    )
  }

  getLastid(name) {
    let lts: any[];
    this.loadLastId();
    for (let lid of this.lastids) {
      if (lid.id === name) {
        return lid['count'];
      }
    }
    return 0;
  }

  nodeExpand(event) {
    this.selectedNode = event.node;
  }

  isSelected(event) {
    return this.selectedNode === event.node ? true : false;
  }


  createAccidentfile() {
    this.newAccidentfile.idaccident = this.idaccident;
    this.dialogVisible = false;
    this.accidentfiles = [this.newAccidentfile, ...this.accidentfiles];
    this.service.create(this.newAccidentfile)
      .subscribe(newAccidentfile => {
        this.loadData();
      }, (error: AppError) => {
        this.accidentfiles.splice(0, 1);
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      });
  }

  deleteAccidentfile(_accidentfile: Accidentfile) {
    let index = this.accidentfiles.indexOf(_accidentfile);
    this.accidentfiles.splice(index, 1);
    this.accidentfiles = [...this.accidentfiles];
    this.service.delete(_accidentfile.id)
      .subscribe(
        () => { this.loadData(); },
        (error: Response) => {
          this.accidentfiles.splice(index, 0, _accidentfile);

          if (error instanceof NotFoundError) {
            alert('this post has already been deleted');
          } else {
            throw error;
          }
        }
      );
  }

  updateAccidentfile(_accidentfile, input: HTMLInputElement) {
    _accidentfile.name = input.value;
    this.service.update(_accidentfile)
      .subscribe(updateaccidentfile => {
        this.loadData();
      });
  }

  cancelUpdate(_accidentfile) {
    //
  }

  showNewDialoge() {
    this.dialogVisible = true;
    this.newMode = true;
    this.newAccidentfile = {
      datecreate: new Date(),
      dateupdate: new Date(),
      id: 0,
      idaccident: this.idaccident,
      path: '',
      lastuser: 'ali',
      name: '',
      owner: 'ali'
    };
  }

  hideNewDialoge() {
    this.dialogVisible = false;
  }

  showDialogToAdd() {
    this.newMode = true;
    this.dialogVisible = true;
  }

  save() {
    let accidentfiles = [...this.accidentfiles];
    if (this.newMode) {
      accidentfiles.push(this.newAccidentfile);
    } else {
      accidentfiles[this.findSelectedAccidentfileIndex()] = this.newAccidentfile;
    }
    this.accidentfiles = accidentfiles;
    this.newAccidentfile = null;
    this.dialogVisible = false;
  }

  delete() {
    let index = this.findSelectedAccidentfileIndex();
    this.accidentfiles = this.accidentfiles.filter((val, i) => i !== index);
    this.newAccidentfile = null;
    this.dialogVisible = false;
  }

  onRowSelect(event) {
  }

  cloneAccidentfile(c: Accidentfile): Accidentfile {
    let accidentfile: Accidentfile;
    accidentfile = c;
    return accidentfile;
  }

  findSelectedAccidentfileIndex(): number {
    return this.accidentfiles.indexOf(this.selectedAccidentfile);
  }


}



