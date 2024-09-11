import { Component, inject } from '@angular/core';
import { IonContent, IonSearchbar, IonList, IonLabel, IonItem, IonItemSliding, IonIcon, IonAvatar, IonItemOptions, IonItemOption, IonButton, IonProgressBar } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { UserItemComponent } from './user-item/user-item.component';
import { UserService } from 'src/app/core/services/user.service';
import { UserResponse } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from 'rxjs';
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

  private searchQuery$ = new BehaviorSubject('');
  // Observable que obtiene los usuarios y los almacena para evitar múltiples llamadas.
  private users$: Observable<UserResponse[]> = this.userService.getUsers(true).pipe(
    shareReplay(1)
  );
  // Observable que combina usuarios y la búsqueda para generar el resultado filtrado.
  public searchBarResult$: Observable<UserResponse[]> = combineLatest([this.users$, this.searchQuery$]).pipe(
    map(([users, query]) => {
      return users.filter(user => user.username.toLowerCase().indexOf(query) > -1);
    })
  );

  ionViewWillEnter() {
    this.refreshDashboard();
  }

  searchForUsers(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery$.next(query);
  }

  public refreshDashboard() {
    this.users$ = this.userService.getUsers(true).pipe(
      shareReplay(1)
    );
    this.searchBarResult$ = combineLatest([this.users$, this.searchQuery$]).pipe(
      map(([users, query]) => {
        return users.filter(user => user.username.toLowerCase().indexOf(query) > -1);
      })
    );
  }

}
