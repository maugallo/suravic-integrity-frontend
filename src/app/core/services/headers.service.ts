import { inject, Injectable, OnInit } from '@angular/core';
import { TokenService } from './token.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeadersService implements OnInit {

  tokenService = inject(TokenService);

  token: string = '';

  async ngOnInit(): Promise<void> {
    this.token = await this.tokenService.getToken();
  }

  public getBasicAuthHeader(username: string, password: string) {
    return new HttpHeaders({ 'Authorization': 'Basic ' + btoa(`${username}:${password}`) });
  }

  public getTokenHeader() {
    return new HttpHeaders({ 'Authorization': this.token });
  }

}
