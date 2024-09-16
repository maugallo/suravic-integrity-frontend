import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { IonContent, IonSearchbar, IonList, IonLabel, IonItem, IonItemSliding, IonIcon, IonAvatar, IonItemOptions, IonItemOption, IonButton, IonProgressBar } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { UserItemComponent } from './user-item/user-item.component';
import { UserService } from 'src/app/core/services/user.service';
import { UserResponse } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  standalone: true,
  imports: [IonProgressBar, IonButton, IonItemOption, IonItemOptions, IonAvatar, IonIcon, IonItemSliding, IonItem, IonLabel, IonList, IonSearchbar, IonContent, HeaderComponent, FooterComponent, UserItemComponent, AsyncPipe, NotFoundComponent]
})
export class UserDashboardComponent {

  public router = inject(Router);
  private userService = inject(UserService);

  private searchQuery: WritableSignal<string> = signal('');
  private users: Signal<UserResponse[]> = this.userService.users;

  public searchBarResult: Signal<UserResponse[]> = computed(() => {
    return this.users().filter(user => user.username.toLowerCase().indexOf(this.searchQuery()) > -1);
  });

  ionViewWillEnter() {
    this.renderDashboard();
  }

  searchForUsers(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(query);
  }

  public renderDashboard() {
    this.userService.refreshUsers();
  }

}
