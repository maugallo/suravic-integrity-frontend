import { Component, inject, input } from '@angular/core';
import { ShiftResponse } from '../../../models/shift.model';
import { ShiftService } from '../../../services/shift.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { Router } from '@angular/router';

@Component({
    selector: 'app-shift-item',
    templateUrl: './shift-item.component.html',
    styleUrls: ['./shift-item.component.scss'],
    imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding,],
standalone: true
})
export class ShiftItemComponent {

  public router = inject(Router);

  private shiftService = inject(ShiftService);
  private alertService = inject(AlertService);

  public shift: any = input<ShiftResponse>();

  public openDeleteShiftAlert() {
    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas eliminar el turno?`, 'Esta acción no se puede deshacer')
      
      .then((result) => { if (result.isConfirmed) this.deleteShift(this.shift().id) });
  }

  private deleteShift(id: number) {
    this.shiftService.deleteShift(id).subscribe({
      next: (response) => this.alertService.getSuccessToast(response),
      error: (error) => this.alertService.getErrorAlert(error)
    });
  }

}
