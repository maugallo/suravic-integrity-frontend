import { Component, computed, inject, Signal, signal } from '@angular/core';
import { IonContent, IonSearchbar, IonList, IonButton, IonProgressBar } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { UserItemComponent } from './user-item/user-item.component';
import { UserService } from 'src/app/core/services/user.service';
import { UserResponse } from 'src/app/core/models/interfaces/user.model';
import { Router } from '@angular/router';
import { NotFoundComponent } from 'src/app/shared/components/not-found/not-found.component';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
  standalone: true,
  imports: [IonProgressBar, IonButton, IonList, IonSearchbar, IonContent, HeaderComponent, FooterComponent, UserItemComponent, NotFoundComponent]
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
