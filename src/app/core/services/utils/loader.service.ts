import { inject, Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loadingController = inject(LoadingController)

  private loading: Promise<HTMLIonLoadingElement> | undefined = undefined;

  public async showLoader() {
    if (!this.loading) this.loading = this.generateLoader();
    (await this.loading).present();
  }

  public async hideLoader() {
    if (this.loading)
      (await this.loading)!.dismiss();
      this.loading = undefined;
  }

  private generateLoader() {
    return this.loadingController.create({
      cssClass: 'loader'
    });
  }

}
