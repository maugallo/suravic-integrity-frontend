import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { IonButton, IonAlert, IonModal } from "@ionic/angular/standalone";
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/utils/alert.service';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true,
  imports: [IonAlert, IonButton, IonModal]
})
export class BackButtonComponent {

  private location = inject(Location);
  private router = inject(Router);

  private alertService = inject(AlertService);

  public class = input();

  public navigateBack() {
    if (this.location.path().includes('operations/dashboard/')) this.router.navigate(['employees', 'dashboard']);
    else if (this.location.path().includes('dashboard')) this.router.navigate(['tabs', 'home']);
    else if (this.location.path().includes('form')) this.alertService.getConfirmationAlert('¿Estás seguro de volver?','Perderás toda la información no guardada').fire().then((result: any) => { if (result.isConfirmed) this.location.back() })
    else this.location.back();
  }

}
