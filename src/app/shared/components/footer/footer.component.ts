import { Component, inject } from '@angular/core';
import { IonTabButton, IonTabs, IonTabBar } from "@ionic/angular/standalone";
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [IonTabBar, IonTabs, IonTabButton],
standalone: true
})
export class FooterComponent {

  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  public logout() {
    this.alertService.getConfirmationAlert('¿Estás seguro que deseas cerrar sesión?')
    
    .then((result: any) => {
      if (result.isConfirmed) this.authService.logout().subscribe();
    });
  }

}
