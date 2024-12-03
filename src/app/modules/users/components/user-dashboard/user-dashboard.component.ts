import { Component, computed, inject, Signal, signal } from '@angular/core';
import { IonContent, IonSearchbar, IonList, IonButton } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { UserItemComponent } from './user-item/user-item.component';
import { UserResponse } from '../../models/user.model';
import { Router } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';
import { UserStore } from '../../stores/user.store';

@Component({
    selector: 'app-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.scss'],
    imports: [IonButton, IonList, IonSearchbar, IonContent, HeaderComponent, UserItemComponent, NotFoundComponent],
standalone: true
})
export class UserDashboardComponent {

  private userStore = inject(UserStore);
  public router = inject(Router);

  private searchQuery = signal('');

  public searchBarResult: Signal<UserResponse[]> = computed(() => this.userStore.users().filter(user => user.username.toLowerCase().indexOf(this.searchQuery()) > -1));

  public searchForUsers(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

}
