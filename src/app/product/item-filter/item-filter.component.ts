import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item-filter',
  templateUrl: './item-filter.component.html',
  styleUrls: ['./item-filter.component.css']
})
export class ItemFilterComponent implements OnInit {
  typesOfSize: string[] = ["S", "M", "L", "XL"];
  typesOfCountry: string[] = ["Srbija", "P.R.C"];
  typesOfStars = [{value: 1, name: "0 do 1"},
                  {value: 2, name: "1 do 2"}, 
                  {value: 3, name: "2 do 3"}, 
                  {value: 4, name: "3 do 4"}, 
                  {value: 5, name: "4 do 5"}
                ];
  selectedOptionsSize: any;
  selectedOptionsCountry : any;
  selectedPrice : any;
  selectedOptionsStars : any;
  @Output() filter = new EventEmitter<any>();
  filterData: any;

  constructor() {
    
  }

  ngOnInit(): void {
    
  }
  onNgModelChange(event: any) {
    //console.log(this.selectedOptionsSize);
    //console.log(this.selectedOptionsCountry);
    if(event.value !== undefined) {
      this.selectedPrice = event.value;
    }
    //console.log(this.selectedPrice);
    //console.log(this.selectedOptionsStars);
    if(this.selectedOptionsCountry === undefined){
      this.selectedOptionsCountry = 0;
    }
    if(this.selectedOptionsSize === undefined){
      this.selectedOptionsSize = 0;
    }
    if(this.selectedOptionsStars === undefined){
      this.selectedOptionsStars = 0;
    }
    

    this.filterData = {
      "size": this.selectedOptionsSize,
      "country" : this.selectedOptionsCountry,
      "price" : this.selectedPrice,
      "stars" : this.selectedOptionsStars
    }
    console.log(this.filterData)
    this.filter.emit(this.filterData);


  }
  formatLabel(value: number) {
    return value;
  }
  
}
