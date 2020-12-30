import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string = '';
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.userInfo.subscribe(response => {
      if (response) {
        this.userName = response.username;
      }
    });
  }
}
