import { Component, OnInit } from '@angular/core';
import { BegrotingService } from './begroting.service';
import { BedragPerMaand, Begroting } from './begroting';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { CurrencyPipe } from '../currency.pipe';

@Component({
  selector: 'app-begroting',
  templateUrl: './begroting.component.html',
  styleUrls: ['./begroting.component.scss']
})
export class BegrotingComponent implements OnInit
{
  filter: number[] = [];
  buttonText = "Berekenen";
  contracten: BedragPerMaand;
  budgetten: BedragPerMaand;
  reserveringen: BedragPerMaand;
  inkomsten: BedragPerMaand;
  afschrijvingen: BedragPerMaand;
  spaardoelen: BedragPerMaand[] = [];
  resultaat: BedragPerMaand;
  uitgaven: BedragPerMaand;
  filterOptie: number;
  titel: string = "Begroting";
  tabel: any[];
  data: BedragPerMaand[] = [];
  spaardoelenTitel: string = "Spaardoelen";

  faCheck = faCheck;

  constructor(private service: BegrotingService, private customCurrency: CurrencyPipe)
  {
    this.tabel = [
        {kolomnaam: " "},
        {kolomnaam: "Januari", kolombreedte: -1, align: "right"},
        {kolomnaam: "Februari", kolombreedte: -1, align: "right"},
        {kolomnaam: "Maart", kolombreedte: -1, align: "right"},
        {kolomnaam: "April", kolombreedte: -1, align: "right"},
        {kolomnaam: "Mei", kolombreedte: -1, align: "right"},
        {kolomnaam: "Juni", kolombreedte: -1, align: "right"},
        {kolomnaam: "Juli", kolombreedte: -1, align: "right"},
        {kolomnaam: "Augustus", kolombreedte: 1, align: "right"},
        {kolomnaam: "September", kolombreedte: 1, align: "right"},
        {kolomnaam: "Oktober", kolombreedte: -1, align: "right"},
        {kolomnaam: "November", kolombreedte: 1, align: "right"},
        {kolomnaam: "December", kolombreedte: 1, align: "right"}
      ];
  }

  ngOnInit()
  {
    this.getFilter();
  }

  getFilter(): void
  {
    this.service.getFilter().subscribe(item => {
      this.filter = item;
      this.filter.sort((n1, n2)=> n2 - n1);
      this.filterOptie = this.filter[0] ? this.filter[0] : new Date().getFullYear();
    });
  }

  getValue(item: BedragPerMaand, header: string): string
  {
    return item.getValue(header);
  }

  berekenen(jaar: number): void
  {
    this.service.get(jaar).subscribe(item => {
        this.inkomsten = Object.assign(new BedragPerMaand(this.customCurrency, "Inkomsten"), item.inkomst);
        this.afschrijvingen = Object.assign(new BedragPerMaand(this.customCurrency, "Afschrijvingen"), item.afschrijving);
        this.budgetten = Object.assign(new BedragPerMaand(this.customCurrency, "Budgetten"), item.budget);
        this.contracten = Object.assign(new BedragPerMaand(this.customCurrency, "Contracten"), item.contract);
        this.reserveringen = Object.assign(new BedragPerMaand(this.customCurrency, "Reserveringen"), item.reservering);
        this.resultaat = Object.assign(new BedragPerMaand(this.customCurrency, "Resultaat"), item.resultaat);
        this.uitgaven = Object.assign(new BedragPerMaand(this.customCurrency, "Uitgaven"), item.uitgaven);

        var tempArray = [];
        for(let label in item.spaardoel)
        {
            tempArray.push(Object.assign(new BedragPerMaand(this.customCurrency, label), item.spaardoel[label]));

        }
        this.spaardoelen = tempArray;
        this.data = [this.resultaat, this.inkomsten, this.contracten, this.reserveringen, this.budgetten, this.afschrijvingen];
    });
  }
}
