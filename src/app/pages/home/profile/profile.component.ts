import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonContent, FooterComponent]
})
export class ProfileComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
