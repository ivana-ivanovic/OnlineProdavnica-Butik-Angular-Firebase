import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Item, ItemService } from 'src/app/services/item.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  obs!: Observable<any>;
  dataSource!: MatTableDataSource<Item>;
  itemArray!: Item[];
  itemArrayPage!: Item[];
  type!: string;
  category!: string;
  urlParams!: Observable<string>;

  constructor(private itemService: ItemService, 
              private changeDetectorRef: ChangeDetectorRef, 
              private route: ActivatedRoute) {}
   

  ngOnInit(): void {
    
    this.itemService.itemRef.snapshotChanges().subscribe(item => {
      this.itemArray = [];
      item.forEach(item => {
          let a = item.payload.toJSON() as Item;
          this.itemArray.push(a);
      });
      
      if(!this.dataSource) {
        this.dataSource = new MatTableDataSource<Item>([]);
        this.obs = this.dataSource.connect();
        this.dataSource.paginator = this.paginator;
        this.changeDetectorRef.detectChanges();

        this.route.params.subscribe(queryParams => {
          this.type = queryParams['type'];
          this.category = queryParams['category'];
          this.dataSource.data = this.itemArray.filter(
            item => item.type === this.type && item.category === this.category);
          });
          this.itemArrayPage = this.dataSource.data;
      }
    }); 

  }

  doFilter(event: any) {
       this.dataSource.filter = event.target.value.trim().toLowerCase();  
  }

  onFilter(data: any) {
    let filteredArray: Item[] = this.itemArrayPage;
    
    //console.log(filteredArray);
    if(data.price !== undefined && data.price !== 0){
      filteredArray = filteredArray.filter(item => 0 < item.price && item.price < data.price);
    }
    if(data.stars !== 0 && data.stars.length !== 0){
      let a = data.stars[0] - 1;
      let b = data.stars[data.stars.length - 1]; 
      filteredArray = filteredArray.filter(item => a <= item.stars && item.stars <= b);
    }
    
    if(data.size !== 0 &&  data.size.length !== 0){
      let a = filteredArray;
      data.size.forEach((element: string ) => {
        filteredArray = filteredArray.filter((item) => {
          if(String(element) == "S" && item.amount.S > 0){  return true; }
          if(String(element) == "M" && item.amount.M > 0){ return true; }
          if(String(element) == "L" && item.amount.L > 0){ return true; }
          if(String(element) == "XL" && item.amount.XL > 0){ return true; }
          return false;
        });
      });
    }
    if(data.country !== 0 && data.country.length !== 0){
      let c: Item[] = [];
      data.country.forEach((element: string) => {
        filteredArray.filter(item => item.country == element).forEach(item => c.push(item));
      });
      filteredArray = c;
    }
    this.dataSource.data = filteredArray;
  }
}
