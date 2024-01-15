import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './product/cart/cart.component';
import { ItemComponent } from './product/item/item.component';
import { ItemsComponent } from './product/items/items.component';
import { OrderComponent } from './product/order/order.component';

const rute: Routes = [
    {path: '', component: HomeComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'profile', component: ProfileComponent},
    {path: 'items/:category/:type', component: ItemsComponent},
    {path: 'item/:id', component: ItemComponent},
    {path: 'cart', component: CartComponent}
]

@NgModule({
    imports: [
        RouterModule.forRoot(rute)
    ],
    exports: [
        RouterModule
    ]
})


export class RoutingModule {

}