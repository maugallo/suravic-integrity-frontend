import { Component, computed, inject } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { OptionComponent } from "./option/option.component";
import { DUENO_OPTIONS, ENCARGADO_OPTIONS, Option } from '../../models/home-options.constant';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, of, switchMap, tap } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { StorageType } from 'src/app/shared/services/storage.service';
import { TokenUtility } from 'src/app/shared/utils/token.utility';
import { MarkAttendanceModalComponent } from 'src/app/modules/attendances/components/mark-attendance-modal/mark-attendance-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [IonContent, OptionComponent, MarkAttendanceModalComponent],
  standalone: true
})
export class HomeComponent {

  private router = inject(Router);
  private storageService = inject(StorageService);

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
  
  public options = computed(() => {
    if (this.role()) {
      if (this.role() === 'ROLE_DUENO') return DUENO_OPTIONS;
      if (this.role() === 'ROLE_ENCARGADO') return ENCARGADO_OPTIONS;
    }
    return [];
  });

}
