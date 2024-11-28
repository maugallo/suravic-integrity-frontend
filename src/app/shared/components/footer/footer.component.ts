import { Component, inject } from '@angular/core';
import { IonFooter, IonToolbar, IonTabButton, IonTabs, IonIcon, IonTabBar, IonContent } from "@ionic/angular/standalone";
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [IonContent, IonTabBar, IonIcon, IonTabs, IonTabButton, IonFooter, IonToolbar,]
})
export class FooterComponent {

  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  public logout() {
    this.alertService.getConfirmationAlert('¿Estás seguro que deseas cerrar sesión?')
    .fire()
    .then((result: any) => {
      if (result.isConfirmed) this.authService.logout().subscribe();
    });
  }

}
