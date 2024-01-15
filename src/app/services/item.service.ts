import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Subject } from 'rxjs';
import { CommentService } from './comment.service';
import { OrderItem } from './order.service';

export interface Size {
     S: number;
     M: number;
     L: number;
     XL: number;
 
}

export interface Item {
    id: string;
    name: string;
    image: string;
    category: string;
    type: string;
    amount: Size;
    stars: number;
    price: number;
    description: string;
    country: string
}

@Injectable()
export class ItemService {

    itemRef!: AngularFireList<Item>;
    itemArray!: Item[];
    obsStars: Subject<number>;

    static controlItem: Item = {
        id: '',
        name: '',
        image: '',
        category: '',
        type: '',
        amount: {S: 0, M:0, L: 0, XL: 0},
        stars: 0,
        price: 0,
        description: '',
        country: ''
    }

    constructor(public db: AngularFireDatabase,
                public commentService: CommentService) {
        this.db.list('item').snapshotChanges().subscribe(item => {
            this.itemArray = [];
            item.forEach(item => {
                let a = item.payload.toJSON() as Item;
                this.itemArray.push(a);
                //console.log(a);
            })
          });
        this.itemRef = db.list('item');
        this.obsStars =  new Subject();
    }

    getAllItems(){
        return this.itemArray;
    }

    getByCategoryAndType(category: string, type: string) {
        return  this.itemArray.filter(item => item.type === type && item.category===category);
    }

    getItemById(id: string){
        return  this.itemArray.find(item => item.id == id);
    }

    getSimilarItems(cItem: Item){
        return this.itemArray.filter(item => item.type === cItem.type && item.category===cItem.category 
            && item.price < cItem.price+100 && item.price > cItem.price-100
            && item.id != cItem.id);
    }

    updateItemStars(item: Item, stars: number){
        this.obsStars.next(this.commentService.countStars(item.id));
        this.db.object("item/" + item.id).update({
            id: item.id,
            name: item.name,
            image: item.image,
            category: item.category,
            type: item.type,
            amount: item.amount,
            stars: stars,
            price: item.price,
            description: item.description,
            country: item.country
        });
        

    }

    updateItemAmount(item: Item, amount: number, size: string){
        switch(size){
            case"S":
                item.amount.S -= amount; 
                break;
            case"M":
                item.amount.M -= amount; 
                break;
            case"L":
                item.amount.L -= amount; 
                break;
            case"XL":
                item.amount.XL -= amount; 
                break;

        }
        this.db.object("item/" + item.id).update({
            id: item.id,
            name: item.name,
            image: item.image,
            category: item.category,
            type: item.type,
            amount: item.amount,
            stars: item.stars,
            price: item.price,
            description: item.description,
            country: item.country
        });
    }

    getItemsByOrderItemsArray(orderItems: OrderItem[]){
        let items: Item[] = [];
        orderItems.forEach(orderItem => {
            let item = this.itemArray.find(i => i.id === orderItem.idItem);
            if(item) items.push(item);
        });
        return items;
    }
}


