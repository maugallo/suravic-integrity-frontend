import { Component, computed, effect, inject, OnInit, Signal, signal } from '@angular/core';
import { IonContent, IonSearchbar, IonList, IonButton } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { UserItemComponent } from './user-item/user-item.component';
import { UserResponse } from '../../models/user.model';
import { Router } from '@angular/router';
import { NotFoundComponent } from 'src/shared/components/not-found/not-found.component';
import { UsersStore } from '../../stores/users.store';

@Component({
    selector: 'app-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.scss'],
    imports: [IonButton, IonList, IonSearchbar, IonContent, HeaderComponent, UserItemComponent, NotFoundComponent]
})
export class UserDashboardComponent {

  private userStore = inject(UsersStore);
  public router = inject(Router);

  private searchQuery = signal('');

  public searchBarResult: Signal<UserResponse[]> = computed(() => this.userStore.users().filter(user => user.username.toLowerCase().indexOf(this.searchQuery()) > -1));

  public searchForUsers(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

}
