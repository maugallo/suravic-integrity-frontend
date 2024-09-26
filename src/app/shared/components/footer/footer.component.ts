import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonFooter, IonToolbar, IonTabButton, IonTabs, IonIcon, IonTabBar, IonContent } from "@ionic/angular/standalone";
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { TokenService } from 'src/app/core/services/utils/token.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonContent, IonTabBar, IonIcon, IonTabs, IonTabButton, IonFooter, IonToolbar,],
})
export class FooterComponent {

  private router = inject(Router);
  private tokenService = inject(TokenService);
  private alertService = inject(AlertService);

  public logout() {
    this.alertService.getConfirmationAlert('¿Estás seguro que deseas cerrar sesión?')
    .fire()
    .then((result) => {
      if (result.isConfirmed) {
        this.tokenService.clearToken();
        this.router.navigate(['welcome']);
      }
    });
  }

}
