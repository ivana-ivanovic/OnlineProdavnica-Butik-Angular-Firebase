import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EditOrderComponent } from 'src/app/product/edit-order/edit-order.component';
import { Item, ItemService } from 'src/app/services/item.service';
import { Order, OrderItem, OrderService } from 'src/app/services/order.service';
import { FavouriteItem, User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild('orderPaginator', {static: true}) paginator!: MatPaginator;
  @ViewChild('favouriteItemsPaginator', {static: true}) paginatorFavouriteItems!: MatPaginator;
  isEditing: boolean = false;
  profileInput: User = this.userService.currentUser;
  birthDate: Date = new Date(this.profileInput.date);
  orderArray!: Order[];
  orderItemArray!: OrderItem[];
  dataSource!: MatTableDataSource<Order>;
  obs!: Observable<any>;
  obs1!: Observable<any>;
  favouriteItems: Item[] = [];
  dataSourceFavouriteItems!: MatTableDataSource<Item>;
  
  
  constructor( public userService: UserService, 
               private router: Router, 
               private changeDetectorRef: ChangeDetectorRef,
               private changeDetectorRef1: ChangeDetectorRef,
               private orderService: OrderService,
               private itemService: ItemService,
               public dialog: MatDialog ) { 
  }

  ngOnInit(): void {

    
    
    this.orderService.orderItemRef.snapshotChanges().subscribe(item => {
      this.orderItemArray = [];
      item.forEach(item => {
          let a = item.payload.toJSON() as OrderItem;
          a.key = item.key!;
          this.orderItemArray.push(a);
      })
    });
    this.orderService.orderRef.snapshotChanges().subscribe(item => {
      this.orderArray = [];
      item.forEach(item => {
          let a = item.payload.toJSON() as Order;
          a.id = item.key!;
          a.items = this.orderItemArray.filter(item =>  item.idOrder == a.id);
          this.orderArray.push(a);          
      });
      this.orderArray = this.orderArray.filter(order => order.idUser === this.profileInput.id);
      if(!this.dataSource) {
        this.dataSource = new MatTableDataSource<Order>(this.orderArray);
        this.obs = this.dataSource.connect();
        this.dataSource.paginator = this.paginator;
        this.changeDetectorRef.detectChanges();
      }

    });
    this.profileInput.favouriteItems?.forEach(i => {
      let a = this.itemService.itemArray.find(item => item.id == i.idItem);
      if(a) this.favouriteItems.push(a);
    });
    this.dataSourceFavouriteItems = new MatTableDataSource<Item>(this.favouriteItems);
    this.obs1 = this.dataSourceFavouriteItems.connect();
    this.dataSourceFavouriteItems.paginator = this.paginatorFavouriteItems;
    this.changeDetectorRef1.detectChanges();
  }
  finishEditing(f: NgForm){
    var id = this.userService.currentUser.id;
    var user: User = this.userService.makeUser(f.value.name, f.value.surname, f.value.address, f.value.city, f.value.email, f.value.password, String(f.value.dateBirth), f.value.phoneNumber);
    if(id != undefined){
      this.userService.updateUser(id, user);
      this.router.navigate(['/profile']);
    }else {console.log(id)}
    
  }

  getItem(itemId: string){
    return this.itemService.getItemById(itemId);
  }

  getOrderStatus(order: Order){
    return order.status;
  }
  openDialog(order: Order){
    const dialogRef = this.dialog.open(EditOrderComponent, {
      width: '600px',
      data: order
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.data = this.orderArray;
    });
  }
  deleteOrder(order: Order){
    this.orderArray = this.orderArray.filter(e => e.id !== order.id);
    this.dataSource.data = this.orderArray;
    this.orderService.deleteOrder(order);
  }
  doFilter(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();  
  } 
  deleteFavourite(f: Item) {
    this.favouriteItems = this.favouriteItems.filter(fI=> fI.id !== f.id);
    this.dataSourceFavouriteItems.data = this.favouriteItems;
    this.userService.deleteFavouriteItemByItemId(f.id);
  }
}
