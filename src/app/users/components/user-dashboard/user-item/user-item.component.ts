import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { catchError, of, tap } from 'rxjs';
import { UserResponse } from 'src/app/users/models/user.model';
import { UserService } from 'src/app/users/services/user.service';
import { AlertService } from 'src/shared/services/alert.service';

@Component({
    selector: 'app-user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['./user-item.component.scss'],
    imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding,]
})
export class UserItemComponent {

  public router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  private alertService = inject(AlertService);

  public user: any = input<UserResponse>();
  public refreshDashboard = output<void>();

  public openDeleteUserAlert() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas eliminar el usuario?', 'Esta acción no se puede deshacer')
      .fire()
      .then((result: any) => {
        if (result.isConfirmed) {
          this.deleteUser(this.user().id);
        }
      });
  }

  private deleteUser(id: number) {
    this.userService.deleteUser(id).pipe(
      tap((response) => {
        this.alertService.getSuccessToast(response).fire();
        this.refreshDashboard.emit();
      }),
      catchError((error) => {
        console.log(error);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
