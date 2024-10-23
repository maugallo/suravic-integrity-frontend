import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { catchError, of, tap } from 'rxjs';
import { ProviderResponse } from 'src/app/core/models/provider.model';
import { ProviderService } from 'src/app/core/services/provider.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';

@Component({
  selector: 'app-provider-item',
  templateUrl: './provider-item.component.html',
  styleUrls: ['./provider-item.component.scss'],
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, TitleCasePipe, UpperCasePipe]
})
export class ProviderItemComponent {

  public router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private providerService = inject(ProviderService);
  private alertService = inject(AlertService);

  public provider: any = input<ProviderResponse>();

  public openDeleteProviderAlert() {
    this.alertService.getWarningConfirmationAlert('¿Estás seguro que deseas eliminar el proveedor?')
      .fire()
      .then((result) => { if (result.isConfirmed) this.deleteProvider(this.provider().id) });
  }

  private deleteProvider(id: number) {
    this.providerService.deleteOrRecoverProvider(id).pipe(
      tap((response) => this.alertService.getSuccessToast(response).fire()),
      catchError((error) => {
        console.log(error);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
