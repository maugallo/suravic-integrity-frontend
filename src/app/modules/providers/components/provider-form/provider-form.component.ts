import { Component, DestroyRef, inject, QueryList, Signal, ViewChildren } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonSelectOption } from "@ionic/angular/standalone";
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { ProviderRequest } from '../../models/provider.model';
import { ProviderService } from '../../services/provider.service';
import { ValidationService } from 'src/app/shared/services/validation.service';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { FormsModule } from '@angular/forms';
import { SectorService } from 'src/app/modules/sectors/services/sector.service';
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

@Component({
    selector: 'app-provider-form',
    templateUrl: './provider-form.component.html',
    styleUrls: ['./provider-form.component.scss'],
    imports: [IonContent, HeaderComponent, FormsModule, IonSelectOption, TextInputComponent, SelectInputComponent, NumberInputComponent, SubmitButtonComponent],
standalone: true
})
export class ProviderFormComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private providerService = inject(ProviderService);
  private sectorService = inject(SectorService);
  private alertService = inject(AlertService);
  public validationService = inject(ValidationService);

  public sectors = this.sectorService.sectors;
  public vatConditions: VatCondition[] = VAT_CONDITIONS;

  public readonly cuitMask = cuitMask;
  public readonly telephoneMask = telephoneMask;

  public isProviderEdit!: boolean;
  public providerId: number = 0;

  @ViewChildren('formInput') inputComponents!: QueryList<any>;

  public provider: Signal<ProviderRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const providerId = params.get('id');
      if (this.isParameterValid(providerId)) {
        const provider = this.providerService.getProviderById(Number(providerId));
        if (!provider) this.router.navigate(['providers', 'dashboard']);
        this.isProviderEdit = true;
        this.providerId = provider.id;
        return of(ProviderMapper.toProviderRequest(provider));
      } else {
        this.isProviderEdit = false;
        return of(EntitiesUtility.getEmptyProviderRequest());
      }
    })
  ));

  public onSubmit() {
    if (!this.validationService.validateInputs(this.inputComponents)) {
      return;
    }

    this.getFormOperation().pipe(
      tap((response) => this.handleSuccess(response)),
      catchError((error) => this.handleError(error)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private getFormOperation(): Observable<any> {
    return this.isProviderEdit
      ? this.providerService.editProvider(this.providerId, this.provider()!)
      : this.providerService.createProvider(this.provider()!);
  }

  private handleSuccess(response: any) {
    this.alertService.getSuccessToast(response).fire();
    this.router.navigate(['providers', 'dashboard']);
  }

  private handleError(error: any): Observable<null> {
    this.alertService.getErrorAlert(error.message).fire();
    console.error(error.message);
    return of(null);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

} 