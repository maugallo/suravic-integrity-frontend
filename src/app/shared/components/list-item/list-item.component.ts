import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from "@ionic/angular/standalone";
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  standalone: true,
  imports: [IonItemOption, IonItemOptions, IonLabel, IonItem, IonItemSliding, ]
})
export class ListItemComponent {

  router = inject(Router);
  userService = inject(UserService);

  user: any = input();
  userDeleted = output<boolean>();
  
  public deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: (response) => alert(response),
      error: (error) => console.log(error),
      complete: () => this.userDeleted.emit(true)
    });
  }

}
