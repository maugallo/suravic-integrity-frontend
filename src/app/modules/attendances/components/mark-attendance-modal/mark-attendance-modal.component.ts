import { Component, inject } from '@angular/core';
import { Camera, CameraDirection, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FileUtility } from 'src/app/shared/utils/file.utility';
import { SubmitButtonComponent } from 'src/app/shared/components/form/submit-button/submit-button.component';
import { IonContent, IonModal } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { AttendanceStore } from '../../store/attendance.store';
import { watchState } from '@ngrx/signals';

@Component({
  selector: 'app-mark-attendance-modal',
  templateUrl: './mark-attendance-modal.component.html',
  styleUrls: ['./mark-attendance-modal.component.scss'],
  imports: [IonModal, IonContent, SubmitButtonComponent, HeaderComponent],
  standalone: true
})
export class MarkAttendanceModalComponent {

  private attendanceStore = inject(AttendanceStore);
  private alertService = inject(AlertService);

  public isInert = false; // Propiedad necesaria para que los alert se puedan mostrar sobre el modal.

  public setInert(value: boolean) {
    this.isInert = value;
  }

  constructor() {
    watchState(this.attendanceStore, () => {
      if (this.attendanceStore.success()) this.handleSuccess(this.attendanceStore.message());
      if (this.attendanceStore.error()) this.alertService.getErrorAlert(this.attendanceStore.message());
    });
  }

  public async openCamera() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
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
    const formData = new FormData();
    const blob = FileUtility.dataUrlToBlob(image.dataUrl!);

    formData.append('faceImage', blob, 'face.jpg');

    this.attendanceStore.markAttendance(formData);
  }

  private handleSuccess(message: string) {
    if (message.includes("no corresponde") || message.includes("ya marcó")) this.alertService.getWarningAlert('Atención', message);
    else this.alertService.getSuccessAlert(message);
  }

}
