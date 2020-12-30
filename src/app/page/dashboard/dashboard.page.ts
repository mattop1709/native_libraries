import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { TodoService } from 'src/app/service/todo.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseItems } from 'src/app/interface/items';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  todos: string[] = [];
  items: FirebaseItems[];
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private todoService: TodoService,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.onGetTodos();
    this.onGetFirebaseItems();
  }

  onGetTodos(): void {
    this.todoService.fetchTodos().subscribe(
      (todo: string[]) => {
        console.log(todo);
        this.todos = todo;
      },
      error => console.log(JSON.stringify(error))
    );
  }

  onGetFirebaseItems(): void {
    this.isLoading = true;
    this.db
      .collection('items')
      .valueChanges()
      .subscribe(
        (items: FirebaseItems[]) => {
          this.items = items;
          this.isLoading = false;
        },
        error => console.error(`error from get firebase items ${error}`)
      );
  }

  onLogout(): void {
    this.authService.revokeAllTokens();
  }
}
