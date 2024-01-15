import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CartItem, CartService } from 'src/app/services/cart.service';
import { User, UserService } from 'src/app/services/user.service';
import { OrderComponent } from '../order/order.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  dataSource!: MatTableDataSource<CartItem>;
  displayedColumns: string[] = ['image', 'name', 'size', 'amount', 'price', 'delete'];
  payment!: number;
  currentUser!: User;

  constructor( private cartService: CartService, private userService: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.payment = this.cartService.forPayment();
    this.currentUser = this.userService.currentUser;

    if(!this.dataSource) {
      this.dataSource = new MatTableDataSource<CartItem>(this.cartService.getCart());
    }
   
    this.cartService.obsPayment.subscribe(val => {
      this.payment = val;
    });
    if(!this.dataSource) {
      this.dataSource = new MatTableDataSource<CartItem>(this.cartService.getCart());
    }
  }


  delete(element: CartItem){
    this.cartService.removeFromCart(element);
    console.log(this.cartService.getCart())
    this.dataSource.data = this.cartService.getCart();
  }

  openDialog(){
    const dialogRef = this.dialog.open(OrderComponent, {
      width: '800px'
    });
  }
  emptyCart(){
    this.cartService.emptyCard();
  }

}
