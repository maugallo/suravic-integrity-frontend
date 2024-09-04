import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from 'src/app/core/services/token.service';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { IonContent } from "@ionic/angular/standalone";
import { OptionComponent } from "../../../shared/components/option/option.component";
import { DUENO_OPTIONS, ENCARGADO_OPTIONS, Option } from './options.constants';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonContent, FooterComponent, OptionComponent]
})
export class HomeComponent implements OnInit {

  tokenService = inject(TokenService);
  router = inject(Router);

  role: string = '';
  options: Option[] = [];

  ngOnInit() { // Necesario usar un routerEvents para renderizar bien los roles en un componente que forma parte del tab. (ionViwWillEnter no funciona para este caso)
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/tabs/home'){
        this.handleUserRole();
      }
    });
  }

  private handleUserRole() {
    this.tokenService.getToken().subscribe((token) => {
      this.role = this.tokenService.getRoleFromToken(token);
      
      if (this.role === 'ROLE_DUENO') this.options = DUENO_OPTIONS;
      if (this.role === 'ROLE_ENCARGADO') this.options = ENCARGADO_OPTIONS;
    });
  }

}
