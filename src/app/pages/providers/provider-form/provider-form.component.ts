import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInput, IonNote, IonButton, IonSelectOption, IonSelect } from "@ionic/angular/standalone";
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { ProviderRequest } from 'src/app/core/models/provider.model';
import { ProviderService } from 'src/app/core/services/provider.service';
import { ValidationService } from 'src/app/core/services/utils/validation.service';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { SectorResponse } from 'src/app/core/models/sector.model';
import { SectorService } from 'src/app/core/services/sector.service';
import { AsyncPipe } from '@angular/common';
import { MaskitoElementPredicate } from '@maskito/core';
import { cuitMask } from 'src/app/core/masks/cuit.mask';
import { MaskitoDirective} from '@maskito/angular';
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
export class ProviderFormComponent  implements OnInit {

  readonly cuitMask = cuitMask;
  readonly telephoneMask = telephoneMask;
  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private providerService = inject(ProviderService);
  private sectorService = inject(SectorService);
  public validationService = inject(ValidationService);
  private alertService = inject(AlertService);

  public provider: ProviderRequest = {
    sector: { id: 0, name: '' },
    contact: { email: '', telephone: ''},
    percentages: { profitPercentage: '', vatPercentage: ''},
    vatCondition: '',
    companyName: '',
    firstName: '',
    lastName: '',
    cuit: ''
  }
  public providerId!: number;

  public isProviderEdit!: boolean;

  public customInterfaceOptions: any = { cssClass: 'custom-select-options' } // Clase necesaria para customizar alert de options.
  @ViewChild('sectorSelect', { static: false }) sectorSelect!: NgModel;
  @ViewChild('vatConditionSelect', { static: false }) vatConditionSelect!: NgModel;
  public sectors$: Observable<SectorResponse[]> = this.sectorService.getSectors(true).pipe(
    tap((sectors) => {
      if (this.providerId) {
        this.provider.sector = sectors.find(sector => sector.id === this.provider.sector.id)!;
      }
    })
  ); 
  public vatConditions: VatCondition[] = VAT_CONDITIONS;

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const providerId = params.get('id');
        if (this.isParameterValid(providerId)) {
          this.providerId = Number(providerId);
          return this.providerService.getProviderById(this.providerId).pipe(
            tap((response) => {
              this.provider.sector = response.sector;
              this.provider.contact.email = response.contact.email;
              this.provider.contact.telephone = response.contact.telephone;
              this.provider.percentages.vatPercentage = response.percentages.vatPercentage;
              this.provider.percentages.profitPercentage = response.percentages.profitPercentage;

              this.provider.vatCondition = response.vatCondition;
              this.provider.companyName = response.companyName;
              this.provider.firstName = response.firstName;
              this.provider.lastName = response.lastName;
              this.provider.cuit = response.cuit;

              this.isProviderEdit = true;
            }),
            catchError((error) => {
              console.log(error.message);
              return of(null);
            })
          )
        } else {
          this.isProviderEdit = false;
          return of(null);
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  public onSubmit(providerForm: NgForm){
    if (providerForm.valid) {
      of(this.isProviderEdit).pipe(
        switchMap((isEdit) => {
          if (isEdit) return this.providerService.editProvider(this.providerId, this.provider);
          else return this.providerService.createProvider(this.provider);
        }),
        tap((response) => {
          this.alertService.getSuccessToast(response).fire();
          this.router.navigate(['providers', 'dashboard']);
        }),
        catchError((error) => {
          // Marcar errores de validación en inputs (valores únicos ya ingresados por ejemplo).
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();
    } else {
      providerForm.form.markAllAsTouched();
    }
  }

  public isSelectNotValid(select: NgModel, connectedValue: SectorResponse | string) {
    return (select && select.touched && !connectedValue);
  }

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}