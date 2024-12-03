import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { UserResponse } from '../../../models/user.model';
import { UserStore } from '../../../stores/user.store';
import { AlertService } from 'src/app/shared/services/alert.service';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding,],
  standalone: true
})
export class UserItemComponent {

  constructor() {
    watchState(this.userStore, () => {
      if (this.userStore.success()) this.handleSuccess(this.userStore.message());
      if (this.userStore.error()) this.handleError(this.userStore.message());
    })
  }

  private alertService = inject(AlertService);
  public router = inject(Router);
  private userStore = inject(UserStore);

  public user: any = input<UserResponse>();

  public openDeleteUserAlert() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas eliminar el usuario?', 'Esta acción no se puede deshacer')
      .fire()
      .then((result: any) => {
        if (result.isConfirmed)
          this.userStore.deleteUser(this.user().id);
      });
  }

  private handleSuccess(message: string) {
    this.alertService.getSuccessToast(message).fire();
    this.router.navigate(['users', 'dashboard']);
  }

  private handleError(message: string) {
    this.alertService.getErrorAlert(message).fire();
  }

}
