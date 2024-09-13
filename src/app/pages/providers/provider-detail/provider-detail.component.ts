import { Component, inject } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { ProviderResponse } from 'src/app/core/models/provider.model';
import { ProviderService } from 'src/app/core/services/provider.service';
import { AsyncPipe } from '@angular/common';
import { NotFoundComponent } from "../../../shared/components/not-found/not-found.component";
import { FormatEnumPipe } from 'src/app/shared/pipes/format-enum.pipe';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, BackButtonComponent, AsyncPipe, NotFoundComponent, FormatEnumPipe]
})
export class ProviderDetailComponent {

  private activatedRoute = inject(ActivatedRoute);
  private providerService = inject(ProviderService);

  public  provider$: Observable<ProviderResponse | null> = this.activatedRoute.paramMap.pipe(
    switchMap((params) => {
      if (this.isParameterValid(params.get('id'))) {
        const providerId = Number(params.get('id'));
        return this.providerService.getProviderById(providerId);
      }
      return of(null);
    })
  );

  private isParameterValid(param: string | null) {
    return !isNaN(Number(param)) && Number(param);
  }

}
