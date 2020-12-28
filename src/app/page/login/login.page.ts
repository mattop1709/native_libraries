import { Component, OnInit } from '@angular/core';
import { Credential } from 'src/app/interface/credential';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: Credential = { email: '', password: '' };
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onLogin(): void {
    this.authService.authenticate(this.credentials).subscribe(
      (isSuccess: boolean) => {
        // console.log(response);
        if (isSuccess) {
          this.router.navigateByUrl('/home');
          console.log('Success');
        } else {
          console.log('Kindly insert the credentials');
        }
      },
      error => {
        console.log(`error ${error}`);
      }
    );
  }
}
