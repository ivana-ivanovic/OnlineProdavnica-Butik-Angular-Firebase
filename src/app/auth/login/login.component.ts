import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorExists = false;
  errorText = "";
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    
  }

  onSubmit(form: NgForm){
    var email = form.value.email;
    var password= form.value.password;
    var user = this.userService.getUserByEmail(email);
    if(user === undefined) {
      this.errorExists = true;
      this.errorText = "no registered user " + email;
      return;
    } 
    var isPassValid = this.userService.isPassOk(email, password);
    
    if(!isPassValid){
      this.errorExists = true;
      this.errorText = "pass incorrect";
      return; 
     }
     this.errorExists = false;
     this.router.navigate(['']);
  }

}
