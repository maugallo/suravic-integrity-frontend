import { Component, inject } from '@angular/core';
import { IonTabButton, IonTabs, IonTabBar } from "@ionic/angular/standalone";
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [IonTabBar, IonTabs, IonTabButton]
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
