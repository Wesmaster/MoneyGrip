import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { LabelService } from './labels/label.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title: string = environment.app_name;

  constructor(private labelService: LabelService)
  {

  }

  ngOnInit()
  {
    this.labelService.loadAll();
  }
}
