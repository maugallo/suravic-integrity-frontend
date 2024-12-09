import { Component, inject, model } from '@angular/core';
import { IonContent, IonMenu, MenuController, IonSelectOption } from "@ionic/angular/standalone";
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { FormButtonComponent } from 'src/app/shared/components/form/form-button/form-button.component';
import { ProviderResponse } from 'src/app/modules/providers/models/provider.model';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProviderService } from 'src/app/modules/providers/services/provider.service';
import { ProviderMapper } from 'src/app/shared/mappers/provider.mapper';

@Component({
    selector: 'app-provider-percentages',
    templateUrl: './provider-percentages.component.html',
    styleUrls: ['./provider-percentages.component.scss'],
    imports: [IonContent, IonMenu, NumberInputComponent, FormButtonComponent, SelectInputComponent, IonSelectOption],
standalone: true
})
export class ProviderPercentagesComponent {

  private alertService = inject(AlertService);
  private providerService = inject(ProviderService);
  private menuController = inject(MenuController);

  public provider = model<ProviderResponse>();

  public savePercentages() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas continuar?', 'Se modificarán los porcentajes del proveedor seleccionado', 'APLICAR')
      .fire()
      .then((result: any) => { if (result.isConfirmed) this.applyNewPercentages(); });
  }

  private applyNewPercentages() {
    const provider = this.provider()!;
    const providerRequest = ProviderMapper.toProviderRequest(provider);

    this.providerService.editProvider(provider.id, providerRequest).subscribe({
      next: (response) => this.alertService.getSuccessToast(response).fire(),
      error: (error) => this.alertService.getErrorAlert(error.message).fire()
    });

    this.menuController.close('provider-percentages-menu');
  }

}
