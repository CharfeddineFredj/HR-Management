import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  @Input() isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  show() {
    this.isLoading = true;
  }

  hide() {
    this.isLoading = false;
  }

}
