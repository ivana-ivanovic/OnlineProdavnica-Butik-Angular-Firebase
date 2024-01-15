import { Component, OnInit } from '@angular/core';
import { Item, ItemService } from '../services/item.service';
import { OrderItem, OrderService } from '../services/order.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  itemsArray: {item: Item, amount: number}[] = [];

  constructor(private orderService: OrderService, private itemService: ItemService) { }


  ngOnInit(): void {

    this.orderService.orderItemRef.snapshotChanges().subscribe( value => {
      value.forEach(item => {
        let a = item.payload.toJSON() as OrderItem;
        if(this.itemsArray.length ===  0){
          let it = this.itemService.getItemById(a.idItem)
          if(it) this.itemsArray.push({item: it, amount: a.amount})
        } else {
          let c = this.itemsArray.find(x => x.item.id === a.idItem);
          if(c){
            this.itemsArray.forEach(i => {
              if(i.item.id === a.idItem) {
                i.amount += a.amount}
              })
          }  else {
            let it = this.itemService.getItemById(a.idItem)
            if(it) this.itemsArray.push({item: it, amount: a.amount})
          }
        }
      });
    }
    )
  }

}
