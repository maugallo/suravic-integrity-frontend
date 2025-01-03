import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { LicenseResponse } from '../../../models/license.model';
import { LicenseService } from '../../../services/license.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { FormatEnumPipe } from 'src/app/shared/pipes/format-enum.pipe';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-license-item',
    templateUrl: './license-item.component.html',
    styleUrls: ['./license-item.component.scss'],
    imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, FormatEnumPipe, DatePipe],
standalone: true
})
export class LicenseItemComponent {

  public router = inject(Router);

  private licenseService = inject(LicenseService);
  private alertService = inject(AlertService);

  public license: any = input<LicenseResponse>();

  public openDeleteLicenseAlert() {
    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas eliminar la licencia?`, 'Esta acción no se puede deshacer')
      
      .then((result) => { if (result.isConfirmed) this.deleteLicense(this.license().id) });
  }

  private deleteLicense(id: number) {
    this.licenseService.deleteLicense(id).subscribe({
      next: (response) => this.alertService.getSuccessToast(response),
      error: (error) => this.alertService.getErrorAlert(error)
    });
  }

}
