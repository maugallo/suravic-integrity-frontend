import { Component, computed, inject, QueryList, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { of, switchMap } from 'rxjs';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { cuitMask } from 'src/app/shared/masks/cuit.mask';
import { VAT_CONDITIONS, VatCondition } from '../../models/provider-selects.constant';
import { telephoneMask } from 'src/app/shared/masks/telephone.mask';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TextInputComponent } from 'src/app/shared/components/form/text-input/text-input.component';
import { SelectInputComponent } from 'src/app/shared/components/form/select-input/select-input.component';
import { NumberInputComponent } from 'src/app/shared/components/form/number-input/number-input.component';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { ProviderMapper } from 'src/app/shared/mappers/provider.mapper';
import { EntitiesUtility } from 'src/app/shared/utils/entities.utility';
import { ProviderStore } from '../../stores/provider.store';
import { watchState } from '@ngrx/signals';
import { SectorStore } from 'src/app/modules/sectors/stores/sector.store';
import { ProductStore } from 'src/app/modules/products/store/product.store';
import { SectorResponse } from 'src/app/modules/sectors/models/sector.model';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.scss'],
  imports: [IonContent, HeaderComponent, FormsModule, IonSelectOption, TextInputComponent, SelectInputComponent, NumberInputComponent, SubmitButtonComponent],
  standalone: true
})
export class ProviderFormComponent {

  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);
  private providerStore = inject(ProviderStore);
  private sectorStore = inject(SectorStore);
  private productStore = inject(ProductStore);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public sectors = this.sectorStore.enabledEntities();
  public vatConditions: VatCondition[] = VAT_CONDITIONS;

  public providerId = 0;

  public readonly cuitMask = cuitMask;
  public readonly telephoneMask = telephoneMask;

  @ViewChildren('formInput') inputComponents!: QueryList<any>;

  constructor() {
    watchState(this.providerStore, () => {
      if (this.providerStore.success()) this.handleSuccess(this.providerStore.message());
      if (this.providerStore.error()) this.handleError(this.providerStore.message());
    });
  }

  public idParam = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')) || undefined))
  ));

  public provider = computed(() => {
    if (this.idParam()) {
      const provider = this.providerStore.getEntityById(this.idParam()!);
      if (this.isProviderSectorDeleted(provider.sector)) provider.sector.id = -1
      this.providerId = provider.id!;

      return ProviderMapper.toProviderRequest(provider!);
    } else {
      return EntitiesUtility.getEmptyProviderRequest();
    }
  });

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    if (this.idParam()) {
      this.providerStore.editEntity({ id: this.providerId, entity: this.provider() });
    } else {
      this.providerStore.addEntity(this.provider());
    }
  }

  private handleSuccess(message: string) {
    if (message.includes('Modificado')) {
      this.productStore.updateEntitiesByProvider(this.providerStore.lastUpdatedEntity()!);
    }
    this.alertService.getSuccessToast(message);
    this.router.navigate(['providers', 'dashboard']);
  }

  private handleError(error: any) {
    this.alertService.getErrorAlert(error.message);
    console.error(error.message);
  }

  private isProviderSectorDeleted(sectorResponse: SectorResponse) {
    return !this.sectors.some(sector => sector.id === sectorResponse.id);
  }

} 