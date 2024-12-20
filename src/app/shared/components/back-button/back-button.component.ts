import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-back-button',
    templateUrl: './back-button.component.html',
    styleUrls: ['./back-button.component.scss'],
    imports: [],
standalone: true
})
export class BackButtonComponent {

  private location = inject(Location);
  private router = inject(Router);

  private alertService = inject(AlertService);

  public class = input();

  public navigateBack() {
    if (this.location.path().includes('operations/dashboard/')) this.router.navigate(['employees', 'dashboard']);
    else if (this.location.path().includes('days-off/dashboard')) this.router.navigate(['rests', 'menu']);
    else if (this.location.path().includes('licenses/dashboard')) this.router.navigate(['rests', 'menu']);
    else if (this.location.path().includes('rests/menu'))  this.router.navigate(['tabs', 'home']);
    else if (this.location.path().includes('dashboard')) this.router.navigate(['tabs', 'home']);
    else if (this.location.path().includes('form')) this.alertService.getConfirmationAlert('¿Estás seguro de volver?','Perderás toda la información no guardada').then((result: any) => { if (result.isConfirmed) this.location.back() })
    else this.location.back();
  }

}
