import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedSlide = 0;
  countSlide    = 4;

  constructor() { }

  ngOnInit() {
  }

  prevSlide() {
    if (this.selectedSlide > 0) {
      this.selectedSlide--;
    }
  }

  nextSlide() {
    if (this.selectedSlide < this.countSlide) {
      this.selectedSlide++;
    }
  }

}
