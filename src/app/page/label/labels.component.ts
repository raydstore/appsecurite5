import { LastidService } from '../../services/lastid.service';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
import { LabelService } from '../../services/label.service';
import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { Label } from '../../table/table';
import { PanelModule } from 'primeng/primeng';
import { Http, Response } from '@angular/http';

@Component({
    selector: 'app-labels',
    templateUrl: 'labels.component.html',
    styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
    labels: any[];
    selectedLabel: Label;
    // label: any;
    newLabel: any = {
        datecreate: new Date(),
        dateupdate: new Date(),
        id: 0,
        lastuser: 'ali',
        name: '',
        owner: 'ali'
    };
    dialogVisible = false;
    newMode = false;

    lastids: any[];
    lastid: any;
    titlelist = 'Label site';

    constructor(private service: LabelService, private lastidService: LastidService) {
    }

    ngOnInit() {
        this.service.getAll()
            .subscribe(labels => {
                this.labels = labels;
            });
    }

    getLastid(name) {
        let a = '';
        this.lastidService.getAll()
            .subscribe(lastids => {
                for (let lid of lastids) {
                    if (lid.name === name) { a = lid.count; }
                }
            });
        return a;
    }



    createLabel() {
        this.dialogVisible = false;
        this.labels = [this.newLabel, ...this.labels];

        this.service.create(this.newLabel)
            .subscribe(newLabel => {
            }, (error: AppError) => {
                this.labels.splice(0, 1);
                if (error instanceof BadInput) {
                    // this.form.setErrors(originalError);
                } else {
                    throw error;
                }
            });
    }

    deleteLabel(_label: Label) {
        let index = this.labels.indexOf(_label);
        this.labels.splice(index, 1);
        this.labels = [...this.labels];
        this.service.delete(_label.id)
            .subscribe(
            null,
            (error: Response) => {
                this.labels.splice(index, 0, _label);

                if (error instanceof NotFoundError) {
                    alert('this post has already been deleted');
                } else {
                    throw error;
                }
            }
            );
    }

    updateLabel(_label, input: HTMLInputElement) {
        _label.name = input.value;
        this.service.update(_label)
            .subscribe(updatelabel => {
                console.log(updatelabel);
            });
    }

    cancelUpdate(_label) {
        //
    }

    showNewDialoge() {
        this.dialogVisible = true;
        this.newMode = true;
        this.newLabel = {
            datecreate: new Date(),
            dateupdate: new Date(),
            id: 0,
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
        let labels = [...this.labels];
        if (this.newMode) {
            labels.push(this.newLabel);
        } else {
            labels[this.findSelectedLabelIndex()] = this.newLabel;
        }
        this.labels = labels;
        this.newLabel = null;
        this.dialogVisible = false;
    }

    delete() {
        let index = this.findSelectedLabelIndex();
        this.labels = this.labels.filter((val, i) => i !== index);
        this.newLabel = null;
        this.dialogVisible = false;
    }

    onRowSelect(event) {
        
    }

    cloneLabel(c: Label): Label {
        let label: Label; 
        label = c;
        return label;
    }

    findSelectedLabelIndex(): number {
        return this.labels.indexOf(this.selectedLabel);
    }
}



