import { TFunctionName } from '../../table/table';
import { DataService } from '../../services/data.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})

export class AutocompleteComponent implements OnInit {
  @Input() i_item: any;
  @Input() service: any;
  @Input() functionName: TFunctionName;
  @Input() args: string[];
  @Output() changeItem = new EventEmitter();
  item: IItem = {
    item: null,
    name: ''
  };
  filteredList: IItem[];

  constructor() { }

  ngOnInit() {
    this.item.item = this.i_item;
    this.item.name = this.functionName(this.item.item, this.args);
    }

  getProperty<T, K extends keyof T>(obj: T, key: K) {
     return obj[key];
  }

  setProperty<T, K extends keyof T>(obj: T, key: K, value) {
    obj[key] = value;
  }

  onSelect(event) {
    console.log(event);
    this.changeItem.emit(event);
  }



  filterItem(event) {
    let query = event.query;
    this.service.getAll().subscribe(items => {
      this.filteredList = this.filter(query, items);
    });
  }


  filter <T>(query, items: T[]): IItem[] {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: IItem[] = [];
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let displayName = this.functionName(item, this.args);
      if (displayName.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        let iitem: IItem = {
          item: item,
          name: displayName
          }
        filtered.push(iitem);
      }
    }
    return filtered;
  }

}


interface IItem {
  item: any;
  name: string;
}