import { Component, inject, model } from '@angular/core';
import { IonContent, IonMenu, MenuController, IonSelectOption } from "@ionic/angular/standalone";
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { FormButtonComponent } from 'src/app/shared/components/form/form-button/form-button.component';
import { ProviderResponse } from 'src/app/modules/providers/models/provider.model';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProviderMapper } from 'src/app/shared/mappers/provider.mapper';
import { ProviderStore } from 'src/app/modules/providers/stores/provider.store';
import { watchState } from '@ngrx/signals';
import { ProductStore } from 'src/app/modules/products/store/product.store';

@Component({
  selector: 'app-provider-percentages',
  templateUrl: './provider-percentages.component.html',
  styleUrls: ['./provider-percentages.component.scss'],
  imports: [IonContent, IonMenu, NumberInputComponent, FormButtonComponent, SelectInputComponent, IonSelectOption],
  standalone: true
})
export class ProviderPercentagesComponent {

  private alertService = inject(AlertService);
  private providerStore = inject(ProviderStore);
  private productStore = inject(ProductStore);
  private menuController = inject(MenuController);

  public provider = model<ProviderResponse>();

  constructor() {
    watchState(this.providerStore, () => {
      if (this.providerStore.success()) this.handleSuccess(this.providerStore.message());
      if (this.providerStore.error()) this.alertService.getErrorAlert(this.providerStore.message());
    });
  }

  public savePercentages() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas continuar?', 'Se modificarán los porcentajes del proveedor seleccionado', 'APLICAR')
      .then((result: any) => { 
        if (result.isConfirmed) this.applyNewPercentages(); 
      });
  }

  private applyNewPercentages() {
    const provider = this.provider()!;
    const providerRequest = ProviderMapper.toProviderRequest(provider);

    this.providerStore.editEntity({ id: provider.id!, entity: providerRequest });
    this.menuController.close('provider-percentages-menu');
  }

  private handleSuccess(message: string) {
    if (message.includes('Modificado')) {
      this.productStore.updateEntitiesByProvider(this.providerStore.lastUpdatedEntity()!);
    }
    this.alertService.getSuccessToast(this.providerStore.message());
  }

}
