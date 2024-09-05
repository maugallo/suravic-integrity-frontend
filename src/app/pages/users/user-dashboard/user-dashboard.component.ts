import { Component, inject, OnDestroy } from '@angular/core';
import { IonContent, IonSearchbar, IonList, IonLabel, IonItem, IonItemSliding, IonIcon, IonAvatar, IonItemOptions, IonItemOption, IonButton, IonProgressBar } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { UserItemComponent } from "./user-item/user-item.component";
import { UserService } from 'src/app/core/services/user.service';
import { UserResponse } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';
import { map, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { addIcons } from "ionicons";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  standalone: true,
  imports: [IonProgressBar, IonButton, IonItemOption, IonItemOptions, IonAvatar, IonIcon, IonItemSliding, IonItem, IonLabel, IonList, IonSearchbar, IonContent, HeaderComponent, FooterComponent, UserItemComponent, AsyncPipe]
})
export class UserDashboardComponent implements OnDestroy {

  router = inject(Router);
  userService = inject(UserService);

  private destroy$ = new Subject<void>();

  users$: Observable<UserResponse[]> = this.userService.getUsers(true).pipe(shareReplay(1), takeUntil(this.destroy$));
  searchBarResult$: Observable<UserResponse[]> = this.users$;

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
    this.users$ = this.userService.getUsers(true).pipe(shareReplay(1), takeUntil(this.destroy$)); 
    this.searchBarResult$ = this.users$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
