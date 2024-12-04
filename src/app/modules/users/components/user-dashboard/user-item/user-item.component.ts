import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { UserResponse } from '../../../models/user.model';
import { UserStore } from '../../../stores/user.store';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding,],
  standalone: true
})
export class UserItemComponent {

  private alertService = inject(AlertService);
  private userStore = inject(UserStore);
  public router = inject(Router);

  public user: any = input<UserResponse>();

  public openDeleteUserAlert() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas eliminar el usuario?', 'Esta acción no se puede deshacer')
      .fire()
      .then((result: any) => {
        if (result.isConfirmed)
          this.userStore.deleteEntity(this.user().id);
      });
  }

}
