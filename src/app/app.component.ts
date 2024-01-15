import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'onlineprodavnica';
  badgeNumber: number = 0;
 

  constructor(public userService: UserService, 
              private router: Router,
              private cartService: CartService){

   }

   ngOnInit() {
  
    this.cartService.obsNumber.subscribe(val => {
      //console.log(val);
      this.badgeNumber = val;
    });
 
  }
    
    logOut(){
      this.userService.currentUser = UserService.controlUser;
      this.router.navigate(['']);
  }
}
