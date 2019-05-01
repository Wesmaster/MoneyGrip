import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'dialog-laden',
  templateUrl: './dialog-laden.component.html',
  styleUrls: ['./dialog-laden.component.scss']
})
export class DialogLadenComponent implements OnInit {

  faSpinner = faSpinner;
  
  constructor() { }

  ngOnInit() {
  }

}
