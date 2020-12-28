import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { TodoService } from 'src/app/service/todo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  todos: string[] = [];
  constructor(
    private authService: AuthService,
    private todoService: TodoService
  ) {}

  ngOnInit() {
    this.onGetTodos();
  }

  onGetTodos() {
    this.todoService.fetchTodos().subscribe(
      (todo: string[]) => {
        console.log(todo);
        this.todos = todo;
      },
      error => console.log(JSON.stringify(error))
    );
  }

  onLogout(): void {
    this.authService.revokeAllTokens();
  }
}
