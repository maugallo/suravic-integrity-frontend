import { Component, inject } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { OptionComponent } from "./option/option.component";
import { DUENO_OPTIONS, ENCARGADO_OPTIONS, Option } from './home-options.constant';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap } from 'rxjs';
import { StorageService } from 'src/app/core/services/utils/storage.service';
import { StorageType } from 'src/app/core/models/enums/storage-type.enum';
import { TokenUtility } from 'src/app/core/models/utils/token.utility';
import { MarkAttendanceModalComponent } from 'src/app/pages/attendances/mark-attendance-modal/mark-attendance-modal.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [IonContent, OptionComponent, MarkAttendanceModalComponent]
})
export class HomeComponent {

  private router = inject(Router);
  private storageService = inject(StorageService);

  public duenoOptions: Option[] = DUENO_OPTIONS;
  public encargadoOptions: Option[] = ENCARGADO_OPTIONS;

  public role = toSignal(this.router.events.pipe(
    filter((event) => (event instanceof NavigationEnd && event.url == '/tabs/home')),
      switchMap(() => this.storageService.getStorage(StorageType.TOKEN)), // El observable previo emite un nuevo valor, uso switchMap para cambiar a un nuevo observable.
      tap((token) => token ?? this.router.navigate(['welcome'])),
      map((token) => TokenUtility.getRoleFromToken(token)) // Este nuevo observable emite un valor, lo mapeo para hacer lo que quiero (en este caso lo uso para obtener el rol).
    )
  );

}
