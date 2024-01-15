import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  errorExists = false;
  errorText = "";
  constructor(private userSrvice: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm){
    if(this.userSrvice.getUserByEmail(form.value.email) === undefined){
      this.errorExists = false;
      let user = this.userSrvice.makeUser(form.value.name, form.value.surname, 
        form.value.address, form.value.city, form.value.email, form.value.password, 
        String(form.value.birthDate), form.value.phoneNumber);
      this.userSrvice.registerUser(user);
      this.router.navigate(['']);
      } else {
        this.errorText = "Korisnik sa ovom mail adresom vec postoji";
        this.errorExists = true;
      }
  }

}
