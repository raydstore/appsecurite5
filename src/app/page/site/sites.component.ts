import { InfoSite } from '../dialog-modal/dialog-modal.component';
import { NotFoundError } from '../../common/not-found-error';
/* import { Label } from './../../table/label'; */
import { LabelService } from '../../services/label.service';
import { AppError } from '../../common/app-error';
import { BadInput } from '../../common/bad-input';
/* import { Site } from './../../table/site'; */
import { SiteService } from '../../services/site.service';
import { TreeNode } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { OrganizationChartModule } from 'primeng/primeng';
import { Component, OnInit, ViewEncapsulation, Attribute } from '@angular/core';
import { DataGridModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DialogModalComponent } from '../dialog-modal/dialog-modal.component';
import {Site} from '../../table/table';
import { LastidService } from '../../services/lastid.service';

@Component({
  selector: 'app-site',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SitesComponent implements OnInit {
  sites: Site[] = [];
  data: TreeNode[] = [];
  lastids: any[];
  lastid: any;
 /*  ltLabels: Label[] = [];
  labels: any[] = [{ label: 'Select Label', value: null }];
  selectedLabel: Label;
  display = false;
  nodec: TreeNode; */

  
  constructor(private service: SiteService, private lbService: LabelService, private lastidService: LastidService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.service.getAll()
      .subscribe(sites => {
        this.sites = sites;
        this.buildSites();
      });
  }

  loadLastId() {
    this.lastidService.getAll()
      .subscribe(lastids => this.lastids = lastids);
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


  getSiteRoot(): Site {
     for (let site of this.sites) {
      if (site.idparent == null) {
           return site;
         }
     }
  }

  getChilds(siteParent: Site): TreeNode[] {
    let result: TreeNode[] = [];
    for (let site of this.sites) {
      if (site.idparent !== undefined) {
       if (site.idparent['id'] === siteParent['id']) {
        let value: any;
        let childs: TreeNode[] = this.getChilds(site);
         if (childs.length !== 0) {
         value = {
          label: site.name,
          type: 'branch',
          data: site,
          children: childs,
          expanded: true,
          styleClass: 'stparent'
        };
      } else {
           value = {
            label: site.name,
            type: 'sheet',
            data: site,
            expanded: true,
            styleClass: 'stchild'
          };
      }
        result.push(value);
       }
      }
     }
     return result;
  }

  buildSites() {
     let siteRoot = this.getSiteRoot();
      let value: any = {
       label: siteRoot.name,
       type: 'branch',
       data: siteRoot,
       children: this.getChilds(siteRoot),
       expanded: true,
       partialSelected: true,
       styleClass: 'stparent'
     };
     this.data.push(value);
  }

  newSite(infoSite: InfoSite) {
    let siteChild = {
      id: 0,
      name: infoSite.name,
      idlabel: infoSite.label,
      idparent: infoSite.node.data,
      datecreate: new Date(),
      dateupdate: new Date(),
      owner: 'ali',
      lastuser: 'ali'
    };
    let nd: TreeNode = {
      label: infoSite.name,
      type: 'sheet',
      data: siteChild,
      styleClass: 'stchild'
    };
    if (!('children' in infoSite.node)) {
      infoSite.node.children = [];
      infoSite.node.type = 'branch';
      infoSite.node.styleClass = 'stparent';
    }
    infoSite.node.children.splice(0, 0, nd);
    this.service.create(siteChild)
        .subscribe(nd => {
          this.data = [];
          this.sites = [];
          this.loadData();
      }, (error: AppError) => {
        infoSite.node.children.splice(0, 1);

        if (error instanceof BadInput) {
          // this.form.setErrors(originalError);
        } else {
          throw error;
        }
      });
  }

  deleteSite(node: TreeNode) {
    let index = this.sites.indexOf(node.data);
    this.sites.splice(index, 1);
    this.service.delete((<Site> node.data).id)
      .subscribe(
      () => { this.loadData(); },
      (error: Response) => {
        this.sites.splice(index, 0, node.data);
        if (error instanceof NotFoundError) {
          alert('se site est deja supprimer !');
        } else {
          throw error;
        }
      }
      );
  }


}
