import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { HomeComponent } from './home/home.component';
import { RoutingModule } from './routing.module';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { ItemService } from './services/item.service';
import { ItemsComponent } from './product/items/items.component';
import { ItemComponent } from './product/item/item.component';
import { ItemFilterComponent } from './product/item-filter/item-filter.component';
import { CommentService } from './services/comment.service';
import { CartComponent } from './product/cart/cart.component';
import { CartService } from './services/cart.service';
import { OrderComponent } from './product/order/order.component';
import { OrderService } from './services/order.service';
import { EditOrderComponent } from './product/edit-order/edit-order.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HomeComponent,
    ItemsComponent,
    ItemComponent,
    ItemFilterComponent,
    CartComponent,
    OrderComponent,
    EditOrderComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    ReactiveFormsModule    
  ],
  providers: [
    UserService, 
    ItemService,
    CommentService,
    CartService,
    OrderService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {   }

