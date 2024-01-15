import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from './item.service';

export interface CartItem {
    item: Item;
    size: string;
    amount: number;
}


@Injectable()
export class CartService {

    cart: CartItem[] = [];
    cartNumber:number = 0;
    obsNumber: Subject<number>;
    obsPayment: Subject<number>;
    payment: number = 0;
    constructor() {
       this.obsNumber = new Subject();
       this.obsPayment = new Subject();
    }

    
    getCart(): CartItem[]{
        return this.cart;
    }

    addToCart(item: Item, size: string){

        let a = this.cart.find(cartItem => cartItem.item.id === item.id && cartItem.size === size );
        if(a === undefined){
            let b = {
                item: item,
                size: size,
                amount: 1
              } 
            this.cart.push(b);
        } else {
            this.cart.forEach(element => {
                if(element.item.id === item.id && element.size === size ){
                    if(element.amount !== undefined){
                        element.amount = element.amount + 1;
                    }
                }
            });
        }
        
        let b = 0;
        this.cart.forEach(element => {
            b += element.amount;
        });
        this.cartNumber = b;
        this.obsNumber.next(this.cartNumber);
        this.payment = this.forPayment();
        this.obsPayment.next(this.payment);
        
    }
    removeFromCart(cartItem: CartItem){
        this.cart = this.cart.filter(itemCart => itemCart.item.id !== cartItem.item.id || itemCart.size !== cartItem.size);
        let b = 0;
        this.cart.forEach(element => {
            b += element.amount;
        });
        this.cartNumber = b;
        this.obsNumber.next(this.cartNumber);
        this.payment = this.forPayment();
        this.obsPayment.next(this.payment);
    }

    forPayment(){
        let a = 0;
        this.cart.forEach(itemCart => {
        if(itemCart.amount !== undefined){
            let b = itemCart.item.price * itemCart.amount;
            a = a + b;}
        })
        return a;
    }
    emptyCard(){
        this.cart = [];
        this.cartNumber = 0;
        this.obsNumber.next(this.cartNumber);
        this.payment = 0;
        this.obsPayment.next(this.payment);
    }



}