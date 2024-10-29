import { Component, inject } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ProviderService } from 'src/app/core/services/provider.service';
import { AsyncPipe } from '@angular/common';
import { FormatEnumPipe } from 'src/app/shared/pipes/format-enum.pipe';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, BackButtonComponent, AsyncPipe, FormatEnumPipe]
})
export class ProviderDetailComponent {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private providerService = inject(ProviderService);

  public provider = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      if (this.isParameterValid(params.get('id'))) {
        const provider = this.providerService.getProviderById(Number(params.get('id')));
        if (!provider) this.router.navigate(['providers', 'dashboard']);
        return of(provider);
      }
      return of(null);
    })
  ));

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
