import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TokenService } from 'src/app/core/services/utils/token.service';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { IonContent } from "@ionic/angular/standalone";
import { OptionComponent } from "./option/option.component";
import { DUENO_OPTIONS, ENCARGADO_OPTIONS, Option } from '../../../core/constants/home-options.constants';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonContent, FooterComponent, OptionComponent]
})
export class HomeComponent implements OnInit {

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  
  private tokenService = inject(TokenService);

  public role: string = '';
  public options: Option[] = [];

  ngOnInit() { // Necesario usar un routerEvents para renderizar bien los roles en un componente que forma parte del tab. (ionViwWillEnter no funciona para este caso)
    this.router.events.pipe(
      filter((event) => (event instanceof NavigationEnd && event.url == '/tabs/home')),
      switchMap(() => this.tokenService.getToken().pipe(
        tap((token) => {
          this.role = this.tokenService.getRoleFromToken(token);

          if (this.role === 'ROLE_DUENO') this.options = DUENO_OPTIONS;
          if (this.role === 'ROLE_ENCARGADO') this.options = ENCARGADO_OPTIONS;
        })
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

}
