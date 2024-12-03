import { Component, inject } from '@angular/core';
import { IonContent, IonCard, IonCardHeader, IonCardContent } from "@ionic/angular/standalone";
import { BackButtonComponent } from 'src/shared/components/back-button/back-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ProviderService } from '../../services/provider.service';
import { FormatEnumPipe } from 'src/shared/pipes/format-enum.pipe';
import { toSignal } from '@angular/core/rxjs-interop';
import { DetailCardComponent } from 'src/shared/components/detail-card/detail-card.component';

@Component({
    selector: 'app-provider-detail',
    templateUrl: './provider-detail.component.html',
    styleUrls: ['./provider-detail.component.scss'],
    imports: [IonCardContent, IonCardHeader, IonCard, IonContent, BackButtonComponent, FormatEnumPipe, DetailCardComponent],
standalone: true
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
