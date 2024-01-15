import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order, OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {

  order: Order;
  @Output() orderEdited = new EventEmitter<any>();
  @Input('rating') rating: number = 3;
  @Input('starCount') starCount: number = 5;
  ratingArr: number[] = [];
  selectedStatus: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private orderService: OrderService,
              private dialogRef: MatDialogRef<EditOrderComponent>) {
    this.order = data;
    this.selectedStatus = this.order.status;
   }

  ngOnInit(): void {
    console.log(this.data);
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
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
  finishEditing(form: NgForm){
    this.order.address = form.value.address;
    this.order.city = form.value.city;
    this.order.status = this.selectedStatus;
    this.order.stars = this.rating;

    if( this.selectedStatus === 'completed'){
      this.orderService.updateOrderWithStars(this.order, this.rating);
    } else {
      this.orderService.updateOrderWithoutStars(this.order);
    }
    this.dialogRef.close(this.order);
  }

}
