import { Component, inject } from '@angular/core';
import { Camera, CameraDirection, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AlertService } from 'src/shared/services/alert.service';
import { FileUtility } from 'src/shared/utils/file.utility';
import { SubmitButtonComponent } from 'src/shared/components/form/submit-button/submit-button.component';
import { AttendanceService } from '../../services/attendance.service';
import { IonContent, IonModal } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/shared/components/header/header.component';

@Component({
    selector: 'app-mark-attendance-modal',
    templateUrl: './mark-attendance-modal.component.html',
    styleUrls: ['./mark-attendance-modal.component.scss'],
    imports: [IonModal, IonContent, SubmitButtonComponent, HeaderComponent]
})
export class MarkAttendanceModalComponent {

  private attendanceService = inject(AttendanceService);
  private alertService = inject(AlertService);

  public isInert = false; // Propiedad necesaria para que los alert se puedan mostrar sobre el modal.

  public setInert(value: boolean) {
    this.isInert = value;
  }

  public async openCamera() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera, // Esto fuerza a abrir la cámara sin opciones adicionales
        direction: CameraDirection.Front // Configura la cámara frontal
      });  

      console.log('Imagen seleccionada:', image);

      this.submitImage(image);
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      this.alertService.getErrorToast('No se pudo cargar la imagen').fire();
    }
  }

  private submitImage(image: Photo) {
    const formData = new FormData();
    const blob = FileUtility.dataUrlToBlob(image.dataUrl!);
    
    formData.append('faceImage', blob, 'face.jpg');

    this.attendanceService.checkAttendance(formData).subscribe({
      next: (response) => {
        if (response.includes("no corresponde")) this.alertService.getWarningAlert(response).fire();
        else this.alertService.getSuccessAlert(response).fire();
      },
      error: (error) => this.alertService.getErrorAlert(error.message).fire()
    });
  }

}
