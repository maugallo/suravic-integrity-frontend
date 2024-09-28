import { Component, inject } from '@angular/core';
import { TokenService } from 'src/app/core/services/utils/token.service';
import { IonContent } from "@ionic/angular/standalone";
import { OptionComponent } from "./option/option.component";
import { DUENO_OPTIONS, ENCARGADO_OPTIONS, Option } from '../../../core/constants/home-options.constants';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonContent, OptionComponent]
})
export class HomeComponent {

  private router = inject(Router);

  private tokenService = inject(TokenService);

  public duenoOptions: Option[] = DUENO_OPTIONS;
  public encargadoOptions: Option[] = ENCARGADO_OPTIONS;

  public role = toSignal(this.router.events.pipe(
    filter((event) => (event instanceof NavigationEnd && event.url == '/tabs/home')),
      switchMap(() => this.tokenService.getToken()), // El observable previo emite un nuevo valor, uso switchMap para cambiar a un nuevo observable.
      map((token) => this.tokenService.getRoleFromToken(token)) // Este nuevo observable emite un valor, lo mapeo para hacer lo que quiero (en este caso lo uso para obtener el rol).
    )
  );

}
