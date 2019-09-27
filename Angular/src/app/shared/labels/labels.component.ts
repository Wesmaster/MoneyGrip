import { Component, OnInit, Input, Output } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild} from '@angular/core';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { MatChipList } from '@angular/material';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import { FormControl } from '@angular/forms';
import { Label } from '../../labels/label/label';
import { LabelService } from '../../labels/label.service';
import {map, startWith} from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit 
{
    @Input() aanwezigeLabels: Label[];
    @Output() updateForm = new EventEmitter<Label[]>();

    allLabels: Label[] = [];
    labelsLoaded: Promise<boolean>;
  
    visible = true;
    selectable = false;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    labelInputCtrl = new FormControl();
    gefilterdeLabels: Observable<Label[]>;
    gekozenLabels: Label[] = [];
  
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    @ViewChild('chipList') chipList: MatChipList;

    constructor(private labelService: LabelService)
    {
        this.allLabels = this.labelService.getData();

        this.gefilterdeLabels = this.labelInputCtrl.valueChanges.pipe
        (
            startWith(null),
            map((label: string | null) => label ? this.filterLabels(label) : this.allLabels.slice())
        );
    }

    ngOnInit()
    {
        this.gekozenLabels = this.aanwezigeLabels;
    }

  add(event: MatChipInputEvent): void 
  {
    if (!this.matAutocomplete.isOpen) 
    {
        const input = event.input;
        var value = event.value.substring(0, 1).toUpperCase() + event.value.substring(1);
        value = value.trim();

        if (value || '') 
        {
            this.addNewLabel(value);
        }

        if (input) 
        {
            input.value = '';
        }

        this.labelInputCtrl.setValue(null);
    }
  }

  remove(fruit: Label): void 
  {
    const index = this.gekozenLabels.indexOf(fruit);

    if (index >= 0)
    {
      this.gekozenLabels.splice(index, 1);
    }

    this.updateForm.emit(this.gekozenLabels);
  }

  selected(event: MatAutocompleteSelectedEvent): void 
  {
    this.gekozenLabels.push(event.option.value);

    this.labelInput.nativeElement.value = '';
    this.labelInputCtrl.setValue(null);

    this.updateForm.emit(this.gekozenLabels);
  }

  private filterLabels(value: string): Label[] 
  {
    return this.allLabels.filter(label => label.naam.toLowerCase().indexOf(value.toString().toLowerCase()) === 0);
  }

  private async addNewLabel(naam: string)
  {
    var label: Label = new Label();
    label.id = 0;
    label.naam = naam;
    await this.labelService.add(label).then(id => {
        label.id = parseInt(id.toString());
        this.allLabels.push(label);
        this.gekozenLabels.push(label);
        this.updateForm.emit(this.gekozenLabels);
    });
  }
}
