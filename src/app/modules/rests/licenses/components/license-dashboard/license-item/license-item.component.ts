import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { LicenseResponse } from '../../../models/license.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { FormatEnumPipe } from 'src/app/shared/pipes/format-enum.pipe';
import { DatePipe } from '@angular/common';
import { LicenseStore } from '../../../store/licenses.store';

@Component({
  selector: 'app-license-item',
  templateUrl: './license-item.component.html',
  styleUrls: ['./license-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, FormatEnumPipe, DatePipe],
  standalone: true
})
export class LicenseItemComponent {

  private alertService = inject(AlertService);
  private licenseStore = inject(LicenseStore);
  public router = inject(Router);

  public license: any = input<LicenseResponse>();

  public openDeleteLicenseAlert() {
    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas eliminar la licencia?`, 'Esta acción no se puede deshacer')
      .then((result: any) => {
        if (result.isConfirmed)
          this.licenseStore.deleteEntity(this.license().id);
      });
  }

}
