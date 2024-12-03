import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { UserResponse } from 'src/app/users/models/user.model';
import { UserStore } from 'src/app/users/stores/user.store';
import { AlertService } from 'src/shared/services/alert.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding,],
  standalone: true
})
export class UserItemComponent {

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

}
