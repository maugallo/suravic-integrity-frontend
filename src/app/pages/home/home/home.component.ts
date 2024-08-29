import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from 'src/app/core/services/token.service';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonContent, FooterComponent]
})
export class HomeComponent  implements OnInit {

  tokenService = inject(TokenService);

  role: string = '';

  async ngOnInit() {
    this.role = this.tokenService.getRoleFromToken(await this.tokenService.getToken())
  }

}
