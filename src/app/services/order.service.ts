import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";
import { CartService } from "./cart.service";
import { Item, ItemService } from "./item.service";
import { UserService } from "./user.service";

export interface OrderItem {
    key?: string;
    idOrder?: string;
    idItem: string;
    payment: number;
    amount: number;
    size: string;
    idUser: string;
}

export interface Order {
   id?: string;
   payment: number;
   idUser: string;
   date: string;
   status: string;
   stars?: number;
   address: string;
   city: string;
   items?: OrderItem[];
}

@Injectable()
export class OrderService {

    orderRef!: AngularFireList<Order>;
    orderArray!: Order[];
    orderItemRef!: AngularFireList<OrderItem>;
    orderItemArray!: OrderItem[];
    orderKey: string = "";


    
    constructor(public db: AngularFireDatabase, 
                private cartService: CartService, 
                private itemService: ItemService, 
                private userService: UserService) {
        this.db.list('order-item').snapshotChanges().subscribe(item => {
            this.orderItemArray = [];
            item.forEach(item => {
                let a = item.payload.toJSON() as OrderItem;
                a.key = item.key!;
                this.orderItemArray.push(a);
            })
          });
        this.orderItemRef = db.list('order-item');
        this.db.list('order').snapshotChanges().subscribe(item => {
            this.orderArray = [];
            item.forEach(item => {
                let a = item.payload.toJSON() as Order;
                a.id = item.key!;
                a.items = this.orderItemArray.filter(item =>  item.idOrder == a.id);
                this.orderArray.push(a);
            })
          });
        this.orderRef = db.list('order');
    }

    makeOrder(  payment: number, idUser: string,   addres: string, city: string){
            let order: Order = {
                payment: payment,
                idUser: idUser,
                date: new Date().toLocaleString(),
                address: addres,
                city: city,
                status: "going"
            }
            order.items  = [];
            this.cartService.getCart().forEach(item =>{ 
                let a: OrderItem = {
                    payment: item.item.price*item.amount,
                    idItem: item.item.id,
                    amount: item.amount,
                    size: item.size,
                    idUser: this.userService.currentUser.id!
                };
                if(order.items){
                    order.items.push(a);
                }
            });
            order.items.forEach(item => {
                let a = this.itemService.getItemById(item.idItem);
                if(a) this.itemService.updateItemAmount(a, item.amount, item.size);
            })
            this.addOrder(order);
            this.cartService.emptyCard();
            

    }

    addOrder(order: Order){
        let date = new Date().toLocaleString();
        
         this.orderRef.push({
            idUser: order.idUser,
            address: order.address,
            payment: order.payment,
            city: order.city,
            date: date,
            status: "going"
        }).then((snap) => {
            if(snap.key ){
                this.orderKey = snap.key;
                order.items?.forEach(e => {
                    this.orderItemRef.push({
                        idOrder: this.orderKey,
                        payment: e.payment,
                        idItem: e.idItem,
                        amount: e.amount,
                        size: e.size,
                        idUser: e.idUser
                    });
                });
            }
         });
    }

    updateOrderWithoutStars(order: Order){
        this.db.object("order/" + order.id).update({
            idUser: order.idUser,
            address: order.address,
            payment: order.payment,
            city: order.city,
            date: order.date,
            status: order.status
        })
    }
    updateOrderWithStars(order: Order, stars: number){
        this.db.object("order/" + order.id).update({
            idUser: order.idUser,
            address: order.address,
            payment: order.payment,
            city: order.city,
            date: order.date,
            status: order.status,
            stars: stars
        })
    }

    deleteOrder(order: Order){
        let a = this.orderItemArray.filter(orderItem => orderItem.idOrder == order.id );
        console.log(a);
        a.forEach(orderItem => this.db.object("order-item/" + orderItem.key).remove());
        this.db.object("order/" + order.id).remove();
    }

    getOrdersByItemOrder(orderItems: OrderItem[]){
        let a: Order[] = [];
        orderItems.forEach(orderItem => {
            let b = this.orderArray.find(order => order.id === orderItem.idOrder);
            if(b !== undefined)a.push(b);
        });
        return a;
    }

    getOtherBought(item: Item){

        let c: OrderItem[] = this.orderItemArray.filter(orderItem => orderItem.idItem === item.id);
        let discC = c.filter((orderItem, i, arr) => arr.findIndex(t => t.idOrder === orderItem.idOrder) === i);
        let orders = this.getOrdersByItemOrder(discC);
        let itemsIdOnOrders: OrderItem[]  = []
        orders.forEach(order => { order.items?.forEach( item => itemsIdOnOrders.push(item))})
        let discItemsIdOnOrders = itemsIdOnOrders.filter((orderItem, i, arr) => arr.findIndex(t => t.idItem === orderItem.idItem) === i);
        discItemsIdOnOrders = discItemsIdOnOrders.filter(orderItem => orderItem.idItem !== item.id);
        let d = this.itemService.getItemsByOrderItemsArray(discItemsIdOnOrders);
        return d;
    }

}
