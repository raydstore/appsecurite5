import { Component, OnInit, Input } from '@angular/core';
import { SiteService } from '../../services/site.service';

@Component({
  selector: 'app-site-name',
  template: ' {{name}} '
  /* Url: './site-name.component.html',
  styleUrls: ['./site-name.component.css'] */
})
export class SiteNameComponent implements OnInit {
  @Input() idsite: any;
  name: '';
  constructor(private service: SiteService) { }

  ngOnInit() {
    this.service.getItem(this.idsite)
        .subscribe(site => this.name = site.name);
  }

}
