import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { ProviderResponse } from 'src/app/modules/providers/models/provider.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProviderStore } from '../../../stores/provider.store';

@Component({
  selector: 'app-provider-item',
  templateUrl: './provider-item.component.html',
  styleUrls: ['./provider-item.component.scss'],
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, TitleCasePipe, UpperCasePipe],
  standalone: true
})
export class ProviderItemComponent {

  private alertService = inject(AlertService);
  private providerStore = inject(ProviderStore);
  public router = inject(Router);

  public provider: any = input<ProviderResponse>();

  public openDeleteOrRecoverProviderAlert() {
    const action = this.provider().isEnabled ? 'eliminar' : 'recuperar';
    const confirmLabel = this.provider().isEnabled ? 'ELIMINAR' : 'ACEPTAR';

    this.alertService.getWarningConfirmationAlert(`¿Estás seguro que deseas ${action} el proveedor?`, '', confirmLabel)
      .then((result: any) => {
        if (result.isConfirmed)
          this.providerStore.deleteEntity(this.provider().id);
      });
  }

}
