import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonFooter, IonToolbar, IonTabButton, IonTabs, IonIcon, IonTabBar, IonContent } from "@ionic/angular/standalone";
import { Subscription } from 'rxjs';
import { TokenService } from 'src/app/core/services/token.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonContent, IonTabBar, IonIcon, IonTabs, IonTabButton, IonFooter, IonToolbar,],
})
export class FooterComponent implements OnInit {

  router = inject(Router);
  tokenService = inject(TokenService);

  suscription!: Subscription;

  ngOnInit(): void {
    
  }

  private handleHomeRender() {

  }

  public logout() {
    this.tokenService.clearToken();
    this.router.navigate(['welcome']);
  }

}
