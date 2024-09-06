import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { catchError, of, tap } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, ]
})
export class UserItemComponent {

  public router = inject(Router);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  public user: any = input();
  public userDeleted = output<void>();
  
  public deleteUser(id: number) {
    this.userService.deleteUser(id).pipe(
      tap((response) => {
        alert(response);
        this.userDeleted.emit();
      }),
      catchError((error) => {
        console.log(error);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
