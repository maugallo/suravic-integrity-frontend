import { Component, computed, effect, inject, input } from '@angular/core';
import { IonModal, IonContent } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FileUtility } from 'src/app/shared/utils/file.utility';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { Camera, CameraDirection, CameraResultType, Photo } from '@capacitor/camera';
import { FacialRecognitionStore } from '../../stores/facial-recognition.store';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-register-face-modal',
  templateUrl: './register-face-modal.component.html',
  styleUrls: ['./register-face-modal.component.scss'],
  imports: [IonContent, IonModal, HeaderComponent, SubmitButtonComponent],
  providers: [FacialRecognitionStore],
  standalone: true
})
export class RegisterFaceModalComponent {

  private alertService = inject(AlertService);
  private recognitionStore = inject(FacialRecognitionStore);

  public employeeId = input<number>(0);

  constructor() {
    effect(() => this.recognitionStore.getFaceImageFile(this.employeeId())),
    watchState(this.recognitionStore, () => {
      if (this.recognitionStore.success()) this.alertService.getSuccessAlert(this.recognitionStore.message());
      if (this.recognitionStore.error()) this.alertService.getErrorAlert(this.recognitionStore.message());
    })
  }

  public faceImage = computed(() => this.recognitionStore.faceImage());

  public async openCamera() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        direction: CameraDirection.Front
      });

      console.log('Imagen seleccionada:', image);

      this.submitImage(image);
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      this.alertService.getErrorToast('No se pudo cargar la imagen');
    }
  }

  private submitImage(image: Photo) {
    const employeeId = this.employeeId();
    const blob = FileUtility.dataUrlToBlob(image.dataUrl!);

    const formData = new FormData();
    formData.append('faceImage', blob, 'face.jpg');

    this.recognitionStore.createFaceImage({ id: employeeId, faceImageData: formData });
  }

}

