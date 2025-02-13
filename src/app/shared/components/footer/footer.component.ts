import { Component, inject } from '@angular/core';
import { IonTabButton, IonTabs, IonTabBar } from "@ionic/angular/standalone";
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AlertService } from '../../services/alert.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, of, switchMap, tap } from 'rxjs';
import { StorageService, StorageType } from '../../services/storage.service';
import { TokenUtility } from '../../utils/token.utility';

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
  private storageService = inject(StorageService);
  private router = inject(Router);

  public role = toSignal(this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    switchMap(() => {
      if (this.router.url.includes('welcome') || this.router.url.includes('login'))
        return of(null);
      return this.storageService.getStorage(StorageType.TOKEN)
    }),
    map((token) => { 
      if(token) return TokenUtility.getRoleFromToken(token);
      return undefined;
    })
  ));

  public logout() {
    this.alertService.getConfirmationAlert('¿Estás seguro que deseas cerrar sesión?')
      .then((result: any) => {
        if (result.isConfirmed) this.authService.logout().subscribe();
      });
  }

}
