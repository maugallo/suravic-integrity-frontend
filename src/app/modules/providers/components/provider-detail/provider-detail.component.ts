import { Component, inject } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from 'src/app/shared/components/back-button/back-button.component';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { FormatEnumPipe } from 'src/app/shared/pipes/format-enum.pipe';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProviderStore } from '../../stores/provider.store';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.scss'],
  imports: [IonCardContent, IonCardHeader, IonCard, IonContent, BackButtonComponent, FormatEnumPipe],
  standalone: true
})
export class ProviderDetailComponent {

  private providerStore = inject(ProviderStore);
  private activatedRoute = inject(ActivatedRoute);

  public provider = toSignal(this.activatedRoute.paramMap.pipe(
    switchMap((params) => of(Number(params.get('id')))),
    switchMap((providerId) => of(this.providerStore.getEntityById(providerId)))
  ));

}
