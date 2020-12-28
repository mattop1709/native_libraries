import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Credential } from 'src/app/interface/credential';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../interface/user';
import { HttpClient } from '@angular/common/http';
import { Token } from '../interface/token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userInfo = new BehaviorSubject(null);
  jwtHelper = new JwtHelperService();
  checkUserObs: Observable<boolean>;
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private platform: Platform,
    private router: Router
  ) {
    this.loadUserInfo();
  }

  authenticate(credentials: Credential): Observable<boolean> {
    if (credentials && credentials.email && credentials.password) {
      const { email, password } = credentials;
      const parameter = { username: email, password };
      console.log(parameter);
      return this.http.post('/auth/login', { ...parameter }).pipe(
        map((token: Token) => {
          console.log(token);
          this.storage.set('access_token', token.access_token);
          this.storage.set('refresh_token', token.refresh_token);
          let decodedUser: User = this.jwtHelper.decodeToken(
            token.access_token
          );
          this.userInfo.next(decodedUser);
          console.log(decodedUser);
          return true;
        })
      );
    }
    return of(false);
  }

  loadUserInfo(): void {
    let readyPlatformObs = from(this.platform.ready());
    this.checkUserObs = readyPlatformObs.pipe(
      switchMap(() => {
        return from(this.getAccessToken());
      }),
      map((token: string) => {
        if (!token) return null;
        let decodedUser: User = this.jwtHelper.decodeToken(token);
        this.userInfo.next(decodedUser);
        return true;
      })
    );
  }

  refreshAllTokens(token: Token): Observable<any> {
    return this.http.post('/auth/refreshtoken', token);
  }

  getAccessToken(): Promise<string> {
    return this.storage.get('access_token');
  }

  getRefreshToken(): Promise<string> {
    return this.storage.get('refresh_token');
  }

  async revokeAllTokens(): Promise<void> {
    await this.storage.remove('access_token');
    await this.storage.remove('refresh_token');
    this.router.navigateByUrl('/login');
  }
}

/*
 let SAMPLE_JWT =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlc3QiLCJzdWIiOjIsImlhdCI6MTYwNDMwOTc0OSwiZXhwIjoxNjA0MzA5ODA5fQ.jHez9kegJ7GT1AO5A2fQp6Dg9A6PBmeiDW1YPaCQoYs';

      return of(SAMPLE_JWT).pipe(
        map((token: string) => {
          if (!token) return false;
          this.storage.set('access_token', token);
          let decodedUser: User = this.jwtHelper.decodeToken(token);
          this.userInfo.next(decodedUser);
          console.log(`check user info ---> ${JSON.stringify(decodedUser)}`);
          return true;
        })
      );
*/
