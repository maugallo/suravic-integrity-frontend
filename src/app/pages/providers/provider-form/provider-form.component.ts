import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInput, IonNote, IonButton, IonSelectOption, IonSelect } from "@ionic/angular/standalone";
import { catchError, of, switchMap, tap } from 'rxjs';
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
import { VAT_CONDITIONS, VatCondition } from 'src/app/core/constants/vat-conditions.constants';
import { telephoneMask } from 'src/app/core/masks/telephone.mask';
import { AlertService } from 'src/app/core/services/utils/alert.service';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.scss'],
  standalone: true,
  imports: [IonButton, IonNote, IonInput, IonContent, HeaderComponent, FormsModule, IonSelectOption, AsyncPipe, IonSelect, MaskitoDirective]
})
export class ProviderFormComponent implements OnInit {

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

  public provider: ProviderRequest = {
    sector: { id: 0, name: '' },
    contact: { email: '', telephone: '' },
    percentages: { profitPercentage: '', vatPercentage: '' },
    vatCondition: '',
    companyName: '',
    firstName: '',
    lastName: '',
    cuit: ''
  }
  public providerId!: number;

  public sectors = computed(() => {
    const sectors = this.sectorService.sectors();
    this.providerId ? this.provider.sector = sectors.find(sector => sector.id === this.provider.sector.id)! : '';
    return sectors;
  });

  public vatConditions: VatCondition[] = VAT_CONDITIONS;
  public customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.

  public isProviderEdit!: boolean;

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      tap((params) => {
        const providerId = params.get('id');
        if (this.isParameterValid(providerId)) {
          const provider = this.providerService.getProviderById(Number(providerId));
          this.provider = {
            sector: provider!.sector,
            contact: { email: provider!.contact.email, telephone: provider!.contact.telephone },
            percentages: { profitPercentage: provider!.percentages.profitPercentage, vatPercentage: provider!.percentages.vatPercentage },
            vatCondition: provider!.vatCondition,
            companyName: provider!.companyName,
            firstName: provider!.firstName,
            lastName: provider!.lastName,
            cuit: provider!.cuit
          }
          this.providerId = provider!.id;
        } else {
          this.isProviderEdit = false;
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  public onSubmit(providerForm: NgForm) {
    if (providerForm.valid) {
      const operation$ = this.isProviderEdit
        ? this.providerService.editProvider(this.providerId, this.provider)
        : this.providerService.createProvider(this.provider);

      operation$.pipe(
        tap((response) => {
          this.alertService.getSuccessToast(response).fire();
          this.router.navigate(['providers', 'dashboard']);
        }),
        catchError((error) => {
          console.error(error);
          // Marcar errores de validación en inputs (valores únicos ya ingresados por ejemplo).
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
    } else {
      providerForm.form.markAllAsTouched();
    }
  }

  public isSelectNotValid(select: NgModel, selectedValue: string) {
    return (select && select.touched && !selectedValue);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

} 