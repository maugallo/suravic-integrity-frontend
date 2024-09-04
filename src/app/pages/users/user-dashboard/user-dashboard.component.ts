import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonSearchbar, IonList, IonLabel, IonItem, IonItemSliding, IonIcon, IonAvatar, IonItemOptions, IonItemOption, IonButton, IonProgressBar } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { ListItemComponent } from "../../../shared/components/list-item/list-item.component";
import { UserService } from 'src/app/core/services/user.service';
import { UserResponse } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { addIcons } from "ionicons";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  standalone: true,
  imports: [IonProgressBar, IonButton, IonItemOption, IonItemOptions, IonAvatar, IonIcon, IonItemSliding, IonItem, IonLabel, IonList, IonSearchbar, IonContent, HeaderComponent, FooterComponent, ListItemComponent, AsyncPipe]
})
export class UserDashboardComponent implements OnInit {

  router = inject(Router);
  userService = inject(UserService);

  users$!: Observable<UserResponse[]>;
  searchBarResult$!: Observable<UserResponse[]>;

  ngOnInit(): void {
    this.handleUsersLoad();
  }

  ionViewWillEnter() {
    this.handleUsersLoad();
  }

  searchForUsers(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchBarResult$ = this.users$.pipe(map(user => user.filter(data => data.username.toLowerCase().indexOf(query) > -1)));
  }

  isUserDeleted(isDeleted: boolean) {
    if (isDeleted) this.handleUsersLoad();
  }

  private handleUsersLoad() {
    this.users$ = this.userService.getUsers(true).pipe(shareReplay(1)); 
    this.searchBarResult$ = this.users$;
  }

}
