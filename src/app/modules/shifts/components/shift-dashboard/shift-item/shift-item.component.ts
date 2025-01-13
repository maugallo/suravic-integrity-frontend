import { Component, inject, input } from '@angular/core';
import { ShiftResponse } from '../../../models/shift.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { ShiftStore } from '../../../store/shift.store';

@Component({
  selector: 'app-shift-item',
  templateUrl: './shift-item.component.html',
  styleUrls: ['./shift-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding,],
  standalone: true
})
export class ShiftItemComponent {

  public router = inject(Router);

  private alertService = inject(AlertService);
  private shiftStore = inject(ShiftStore);

  public shift: any = input<ShiftResponse>();

  public openDeleteShiftAlert() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas eliminar el turno?', 'Esta acción no se puede deshacer')
      .then((result: any) => {
        if (result.isConfirmed)
          this.shiftStore.deleteEntity(this.shift().id);
      });
  }


}
