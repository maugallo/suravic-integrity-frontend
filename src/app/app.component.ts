import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonContent } from '@ionic/angular/standalone';
import { TokenService } from './core/services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonContent, IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  
  tokenService = inject(TokenService);

  ngOnInit(): void {
    
  }



}
