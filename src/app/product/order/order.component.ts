import { Component, OnInit } from '@angular/core';
import { AbstractControl,  FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CartItem, CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { User, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  displayedColumns: string[] = ['name', 'size', 'amount'];
  formGroup!: FormGroup;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  user: User;
  forPayment: number;
  cart: CartItem[];
  dataSource: MatTableDataSource<CartItem>

  
  constructor(private _formBuilder: FormBuilder,  private userService: UserService,  
              private cartService: CartService, private orderService: OrderService,
              private router: Router, private dialogRef: MatDialogRef<OrderComponent>) {
    this.user = userService.currentUser;
    this.forPayment = cartService.payment;
    this.cart = cartService.cart;
    this.dataSource = new MatTableDataSource<CartItem>(this.cart);
  }


  ngOnInit(): void {
    
    this.formGroup = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({
          firstCtrl: ['', Validators.required],
          secondCtrl: ['', Validators.required],
        }),
        this._formBuilder.group({
          thirdCtrl: ['', Validators.required],
          fourthCtrl: ['', Validators.required],
        }),
      ])
    });
    
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      secondCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required],
      fourthCtrl: ['', Validators.required],
    });

    //console.log(this.formGroup.value.formArray[0].firstCtrl);
    //console.log(this.formGroup);
  }

  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  makeOrder(){
    console.log(this.formGroup.value.formArray[0].firstCtrl);
    if(this.user.id !== undefined)
      this.orderService.makeOrder(this.forPayment, this.user.id, this.formGroup.value.formArray[1].thirdCtrl, this.formGroup.value.formArray[1].fourthCtrl);
    alert("Hvala sto ste narucili");
    this.dialogRef.close();
  }
  

}
