import { Component, computed, inject, Signal, signal } from '@angular/core';
import { IonContent, IonSearchbar, IonList, IonButton } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { UserItemComponent } from './user-item/user-item.component';
import { UserService } from 'src/app/core/services/user.service';
import { UserResponse } from 'src/app/core/models/interfaces/user.model';
import { Router } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';

@Component({
    selector: 'app-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styleUrls: ['./user-dashboard.component.scss'],
    imports: [IonButton, IonList, IonSearchbar, IonContent, HeaderComponent, UserItemComponent, NotFoundComponent],
    standalone: true
})
export class UserDashboardComponent {

  public router = inject(Router);

  private userService = inject(UserService);

  private searchQuery = signal<string>('');
  private users = this.userService.users;

  public searchBarResult: Signal<UserResponse[]> = computed(() => this.users().filter(user => user.username.toLowerCase().indexOf(this.searchQuery()) > -1));

  public searchForUsers(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

}
