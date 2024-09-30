import { Component, DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInput, IonNote, IonButton, IonSelectOption, IonSelect } from "@ionic/angular/standalone";
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { ProviderRequest } from 'src/app/core/models/provider.model';
import { ProviderService } from 'src/app/core/services/provider.service';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { SectorService } from 'src/app/core/services/sector.service';
import { AsyncPipe } from '@angular/common';
import { MaskitoElementPredicate } from '@maskito/core';
import { cuitMask } from 'src/app/core/masks/cuit.mask';
import { MaskitoDirective } from '@maskito/angular';
import { VAT_CONDITIONS, VatCondition } from 'src/app/core/constants/vat-conditions.constant';
import { telephoneMask } from 'src/app/core/masks/telephone.mask';
import { AlertService } from 'src/app/core/services/utils/alert.service';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.scss'],
  standalone: true,
  imports: [IonButton, IonNote, IonInput, IonContent, HeaderComponent, FormsModule, IonSelectOption, AsyncPipe, IonSelect, MaskitoDirective]
})
export class ProviderFormComponent {

  readonly cuitMask = cuitMask;
  readonly telephoneMask = telephoneMask;
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  public validationService = inject(ValidationService);
  private providerService = inject(ProviderService);
  private sectorService = inject(SectorService);
  private alertService = inject(AlertService);

  public vatConditions: VatCondition[] = VAT_CONDITIONS;
  public customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.

  public isProviderEdit!: boolean;
  public providerId!: number;

  public sectors = this.sectorService.sectors;

  public provider: Signal<ProviderRequest | undefined> = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      const providerId = params.get('id');
      if (this.isParameterValid(providerId)) {
        const provider = this.providerService.getProviderById(Number(providerId));
        if (!provider) this.router.navigate(['providers', 'dashboard']);
        this.isProviderEdit = true;
        this.providerId = provider.id;
        return of({
          sectorId: provider.sector.id,
          contact: { email: provider.contact.email, telephone: provider.contact.telephone },
          percentages: { profitPercentage: provider.percentages.profitPercentage, vatPercentage: provider.percentages.vatPercentage },
          vatCondition: provider.vatCondition,
          companyName: provider.companyName,
          firstName: provider.firstName,
          lastName: provider.lastName,
          cuit: provider.cuit
        });
      } else {
        this.isProviderEdit = false;
        return of({
          sectorId: 0,
          contact: { email: '', telephone: '' },
          percentages: { profitPercentage: '', vatPercentage: '' },
          vatCondition: '',
          companyName: '',
          firstName: '',
          lastName: '',
          cuit: ''
        });
      }
    })
  ));

  public onSectorChange(selectedSectorId: any) {
    this.provider()!.sectorId = selectedSectorId;
  }

  public onSubmit(providerForm: NgForm) {
    if (!providerForm.valid) {
      providerForm.form.markAllAsTouched();
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

  public isSectorSelectNotValid(select: NgModel, selectedValue: number) {
    return (select && select.touched && selectedValue === 0)
  }

  public isSelectNotValid(select: NgModel, selectedValue: string) {
    return (select && select.touched && !selectedValue);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

} 