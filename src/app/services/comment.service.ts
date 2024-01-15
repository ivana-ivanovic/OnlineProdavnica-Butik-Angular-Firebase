import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";

export interface Comment {
    id?: string,
    comment: string,
	stars: number,
	idItem: string,
	idUser: string,
	date: string
}

@Injectable()
export class CommentService {

    commentRef!: AngularFireList<Comment>;
    commentArray!: Comment[];


    constructor(public db: AngularFireDatabase) {
        this.db.list('comment').snapshotChanges().subscribe(item => {
            this.commentArray = [];
            item.forEach(item => {
                let a = item.payload.toJSON() as Comment;
                this.commentArray.push(a);
            })
          });
        this.commentRef = db.list('comment');
    }

    getCommentsByItem(id: string | undefined){
        return this.commentArray.filter(comment => comment.idItem === id);
    }

    addComment(comment: string, stars: number, idItem: string, idUser: string){
        let date = new Date().toLocaleString();
        this.commentRef.push({
            comment: comment,
	        stars: stars,
	        idItem: idItem,
	        idUser: idUser,
	        date: date
        });
    }

    countStars(id: string): number{
        let a = this.commentArray.filter(comment => comment.idItem == id);
        let stars = 0;
        let i = 0;
        a.forEach(comment => stars += Number(comment.stars) );
        return stars/a.length;
    }



}
