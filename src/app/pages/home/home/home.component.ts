import { Component, inject, OnInit } from '@angular/core';
import { TokenService } from 'src/app/core/services/token.service';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { IonContent } from "@ionic/angular/standalone";
import { OptionComponent } from "../../../shared/components/option/option.component";
import { DUENO_OPTIONS, ENCARGADO_OPTIONS, Option } from './options.constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonContent, FooterComponent, OptionComponent]
})
export class HomeComponent  implements OnInit {

  tokenService = inject(TokenService);

  role: string = '';
  options: Option[] = [];

  async ngOnInit() {
    this.role = this.tokenService.getRoleFromToken(await this.tokenService.getToken());
    if (this.role === 'ROLE_DUENO' ) this.options = DUENO_OPTIONS;
    if (this.role === 'ROLE_ENCARGADO') this.options = ENCARGADO_OPTIONS;
  }

}
