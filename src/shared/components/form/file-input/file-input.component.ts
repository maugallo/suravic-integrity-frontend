import { Component, inject, input, model, ViewChild } from '@angular/core';
import { IonButton } from "@ionic/angular/standalone";
import { ActionSheetController } from '@ionic/angular'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { FileUtility } from 'src/app/core/models/utils/file.utility';

@Component({
    selector: 'app-file-input',
    templateUrl: './file-input.component.html',
    styleUrls: ['./file-input.component.scss'],
    imports: [IonButton,]
})
export class FileInputComponent {

  private alertService = inject(AlertService);

  public fileUtility = FileUtility;
  private actionSheetCtrl = inject(ActionSheetController);

  public bindedObject = model<any>();
  public label = input<string>('');
  public class = input<string>('');
  public onlyPhoto = input<boolean>(false);
  
  @ViewChild('fileInput') fileInput: any;

  public async selectImageSource() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleccionar una imagen',
      buttons: [
        {
          text: 'Elegir de la galería',
          handler: () => {
            this.openCameraOrGallery(CameraSource.Photos);
          },
        },
        {
          text: 'Tomar una foto',
          handler: () => {
            this.openCameraOrGallery(CameraSource.Camera);
          },
        }
      ],
    });
    await actionSheet.present();
  }

  public async openCameraOrGallery(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source,
      });

      console.log('Imagen seleccionada:', image);
      this.bindedObject.set(image);
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      this.alertService.getErrorToast('No se pudo cargar la imagen').fire();
    }
  }

  public triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  public onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      console.log('Archivo seleccionado:', file);
      this.bindedObject.set(file);
    } else {
      this.alertService.getErrorToast('No se pudo cargar el archivo').fire();
    }
  }

}
