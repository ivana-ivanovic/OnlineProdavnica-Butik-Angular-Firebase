import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment, CommentService } from 'src/app/services/comment.service';
import { Item, ItemService } from 'src/app/services/item.service';
import { User, UserService } from 'src/app/services/user.service';
import { NgForm } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { Order, OrderItem, OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  item: Item;
  selectedSize!: string;
  message: boolean = false;
  itemsSimilar!: Item[];
  commentArray!: Comment[];
  isLogged!: boolean;
  @Input('rating') rating: number = 3;
  @Input('starCount') starCount: number = 5;
  ratingArr: number[] = [];
  ordered: boolean = false;
  orderItemArray!: OrderItem[];
  otherBought!: Item[];
  orderArray!: Order[];
  usersArray!: User[];
  isFavourite: boolean = false;
  stars: number = 0;


  constructor(private itemService: ItemService, 
              private route: ActivatedRoute,
              private userService: UserService,
              private commentService: CommentService,
              private cartService: CartService,
              private orderService: OrderService) { 
      this.item = ItemService.controlItem; 
      
   }


  ngOnInit(): void {

    this.itemService.obsStars.subscribe(val => {
      this.stars = val;
    });
    
    
      
    this.userService.usersRef.snapshotChanges().subscribe(users => {
        this.usersArray = [];
        users.forEach(user => {
            let a = user.payload.toJSON() as User;
            a.id = user.key!;
            this.usersArray.push(a);
        });
    });
 
    this.orderService.orderItemRef.snapshotChanges().subscribe(item => {
      this.orderItemArray = [];
      item.forEach(item => {
          let a = item.payload.toJSON() as OrderItem;
          this.orderItemArray.push(a);
      })  
      let b = this.orderItemArray.filter(e => 
        e.idUser === this.userService.currentUser.id!  
        && e.idItem === this.item.id);
      if(b.length !== 0){
        this.ordered = true;
      } else {
        this.ordered = false;
      }
      this.orderService.orderRef.snapshotChanges().subscribe(item => {
        this.orderArray = [];
        item.forEach(item => {
            let a = item.payload.toJSON() as Order;
            a.id = item.key!;
            a.items = this.orderItemArray.filter(item =>  item.idOrder == a.id);
            this.orderArray.push(a);          
        });
        this.commentService.commentRef.snapshotChanges().subscribe(comment => {
          this.commentArray = [];
          comment.forEach(comment => {
              let a = comment.payload.toJSON() as Comment;
              this.commentArray.push(a);
          });
          
          this.route.params.subscribe(queryParams => {
            
            this.commentArray = this.commentService.commentArray;
            let id = queryParams['id'];
            let a = this.itemService.getItemById(id);
            if(a !== undefined){
              this.stars = a.stars;
              this.item = a;
              this.itemsSimilar = this.itemService.getSimilarItems(this.item);
              this.commentArray = this.commentArray.filter(comment => comment.idItem == id);
              this.commentArray.forEach(comment => {
              comment.idUser = this.getUserNameById(comment.idUser);
              });
              let b = this.userService.currentUser.favouriteItems?.find(f => f.idItem == this.item.id)
              if(b) this.isFavourite = true;
              else this.isFavourite = false;
              this.otherBought = this.getOtherBought(this.item);
            }
            
            let b = this.orderItemArray.filter(e => 
              e.idUser === this.userService.currentUser.id!  
              && e.idItem === this.item.id);
            if(b.length !== 0){
              this.ordered = true;
            }else {
              this.ordered = false;
            }
          }); 
        });
      });
    });

    


    this.commentArray = this.commentService.commentArray;
    if(this.userService.currentUser.id === ""){
      this.isLogged = false;
    }else {
      this.isLogged = true;
    } 

    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  
    

  }
  onValChange(event: any){
    this.selectedSize = event.value;
  }

  addToCart(){
    if(this.selectedSize === undefined){
      this.message = true;
    } else {
      this.message = false;
      let b = false;
      switch(this.selectedSize){
        case "S":
          if(this.item.amount.S < 1){b = true;}
          break;
        case "M":
          if(this.item.amount.M < 1){b = true;}
          break;
        case "L":
          if(this.item.amount.L < 1){b = true;}
          break;
        case "XL":
          if(this.item.amount.XL < 1){b = true;}
          break;
      }
      if(!b){
        let a = {
          item: this.item,
          size: this.selectedSize
        }
        this.cartService.addToCart(this.item,  this.selectedSize);
      } else {
        alert("Nemamo "+this.selectedSize+" velicinu na stanju.")
      }
    }
  }

  onClick(rating:number) {
    this.rating = rating;
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  onSubmit(form: NgForm){
    if(this.item.id !== undefined && this.userService.currentUser.id !== undefined){
      this.commentService.addComment(form.value.commentInput, this.rating, this.item.id, this.userService.currentUser.id);
      let starsCount = this.commentService.countStars(this.item.id);
      this.stars = starsCount;
      this.itemService.obsStars.next(starsCount)
      console.log(this.stars)
      this.itemService.updateItemStars(this.item, starsCount);
    }
  }

  getOtherBought(item: Item){

    let c: OrderItem[] = this.orderItemArray.filter(orderItem => orderItem.idItem === item.id);
    let discC = c.filter((orderItem, i, arr) => arr.findIndex(t => t.idOrder === orderItem.idOrder) === i);
    let orders : Order[] = [];
    discC.forEach(orderItem => {
      let b = this.orderArray.find(order => order.id === orderItem.idOrder);
      if(b !== undefined)orders.push(b);
    });
    let itemsIdOnOrders: OrderItem[]  = []
    orders.forEach(order => { order.items?.forEach( item => itemsIdOnOrders.push(item))})
    let discItemsIdOnOrders = itemsIdOnOrders.filter((orderItem, i, arr) => arr.findIndex(t => t.idItem === orderItem.idItem) === i);
    discItemsIdOnOrders = discItemsIdOnOrders.filter(orderItem => orderItem.idItem !== item.id);
    let d = this.itemService.getItemsByOrderItemsArray(discItemsIdOnOrders);
    return d;
  }

  getUserNameById(id: String): string {
    var user = this.usersArray.find(userToFind => userToFind.id === id);
    if (user === undefined){
        return '';
    }else {
        return user.name;
    }
  }

  toggleFavourite(){
    if(this.isFavourite == true) {
      this.userService.deleteFavouriteItemByItemId(this.item.id.toString());
      this.isFavourite = false;
    } else {
      this.userService.addFavouriteItemByItemId(this.item.id.toString());
      this.isFavourite = true;
    }
  }

}
