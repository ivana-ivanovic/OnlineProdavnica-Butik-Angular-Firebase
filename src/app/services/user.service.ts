import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';


export interface FavouriteItem {
    key?: string;
    idItem: string;
    idUser: string;
}

export interface User {
    id?: string;
    name: string;
    surname: string;
    address: string;
    city: string;
    email: string;
    password: string;
    date: string;
    phoneNumber: string;
    favouriteItems?: FavouriteItem[];
}

@Injectable()
export class UserService {

    static controlUser: User = {
        id: "",
        name: '',
        surname: '',
        address: '',
        city: '',
        email: '',
        password: '',
        date: "",
        phoneNumber: "",
        favouriteItems: []
    };
    currentUser: User = UserService.controlUser;

    usersRef!: AngularFireList<User>;
    usersArray!: User[];
    favouriteItemArray!: FavouriteItem [];
    favouriteItemRef!: AngularFireList<FavouriteItem>

    constructor(public db: AngularFireDatabase) {

        this.db.list('favourite').snapshotChanges().subscribe(favouriteItem => {
            this.favouriteItemArray = [];
            favouriteItem.forEach(user => {
                let a = user.payload.toJSON() as FavouriteItem;
                a.key = user.key!;
                this.favouriteItemArray.push(a);
            });
          });
        this.favouriteItemRef = db.list('favourite');
        
        this.db.list('user').snapshotChanges().subscribe(users => {
            this.usersArray = [];
            users.forEach(user => {
                let a = user.payload.toJSON() as User;
                a.id = user.key!;
                a.favouriteItems = this.favouriteItemArray.filter(i => i.idUser === a.id);
                this.usersArray.push(a);
            });
          });
        this.usersRef = db.list('user');
        
        
      }
    
    
    getAllUsers(){
        return this.usersArray;
    }
    // 
    makeUser(name: string, surname: string, address: string, city: string, 
        email: string, password: string, dateBirth: string, phoneNumber: string) : User{
            let user: User = { 
                name: name, 
                surname: surname,
                address: address, 
                city: city, 
                email: email,
                password: password, 
                date: dateBirth,
                phoneNumber: phoneNumber 
            }
            return user;
    }
    registerUser(user: User){
        this.currentUser = user;
        // var date = String(user.date);
        this.usersRef.push({
            name: user.name,
            surname: user.surname,
            address: user.address,
            city: user.city,
            email: user.email,
            password: user.password,
            date: user.date,
            phoneNumber: user.phoneNumber
        }).then((snap) => {
            if(snap.key){
                this.currentUser.id = snap.key;
                this.updateUser(this.currentUser.id, user);
            }
         })
         
    }

    getUserByEmail(userEmail: string) : User | undefined {
        var user = this.usersArray.find(userToFind => userToFind.email == userEmail);
        if( user != undefined){
            this.currentUser = user;
        } 
        return user;
    }
    isPassOk(userEmail: string, password: string) : boolean {
        let a = this.usersArray.find(userToFind => 
            (userToFind.email == userEmail && userToFind.password == password)) != undefined;
        let user = this.getUserByEmail(userEmail);
        if( user != undefined){
                this.currentUser = user;
        } 
        return a;
    }
    getUserById(id: string) : User | undefined {
        var user = this.usersArray.find(userToFind => userToFind.id == id);
        return user;
    }
    getUserNameById(id: String): string {
        var user = this.usersArray.find(userToFind => userToFind.id == id);
        if (user === undefined){
            return '';
        }else {
            return user.name;
        }
    }
    updateUser(id: string, user: User){
        this.db.object("user/" + id).update({
            id: id,
            name: user.name,
            surname: user.surname,
            address: user.address,
            city: user.city,
            email: user.email,
            password: user.password,
            date: user.date,
            phoneNumber: user.phoneNumber
        });
        this.currentUser = user;
        this.currentUser.id = id;
    }

    deleteFavouriteItemByItemId(favourite: string){
        let a = this.favouriteItemArray.find(f => f.idItem == favourite && f.idUser == this.currentUser.id)
        console.log(a);
        if(a) {
            this.currentUser.favouriteItems = this.currentUser.favouriteItems?.filter(f => f.key !== a!.key)
            this.db.object("favourite/" + a.key).remove();}
    }

    addFavouriteItemByItemId(favourite: string) {
        this.favouriteItemRef.push({
            idUser: this.currentUser.id!,
            idItem: favourite
        }).then((snap) => {
            if(snap.key){
                console.log(snap.key);
                this.db.object("favourite/" + snap.key).update({
                    idUser: this.currentUser.id!,
                    idItem: favourite,
                    key: snap.key
                })
                let a: FavouriteItem = {
                    idUser: this.currentUser.id!,
                    idItem: favourite,
                    key: snap.key
                }
                this.currentUser.favouriteItems?.push(a);
            }
         });

        

    }




}
