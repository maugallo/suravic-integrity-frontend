import { Component, computed, inject, input } from '@angular/core';
import { EmployeeResponse } from 'src/app/employees/models/employee.model';
import { IonModal, IonContent } from "@ionic/angular/standalone";
import { HeaderComponent } from 'src/shared/components/header/header.component';
import { EmployeeService } from 'src/app/employees/services/employee.service';
import { AlertService } from 'src/shared/services/alert.service';
import { AsyncPipe } from '@angular/common';
import { from, of, switchMap } from 'rxjs';
import { FileUtility } from 'src/shared/utils/file.utility';
import { SubmitButtonComponent } from 'src/shared/components/form/submit-button/submit-button.component';
import { Camera, CameraDirection, CameraResultType, Photo } from '@capacitor/camera';

@Component({
  selector: 'app-register-face-modal',
  templateUrl: './register-face-modal.component.html',
  styleUrls: ['./register-face-modal.component.scss'],
  imports: [IonContent, IonModal, HeaderComponent, AsyncPipe, SubmitButtonComponent],
  standalone: true
})
export class RegisterFaceModalComponent {

  private employeeService = inject(EmployeeService);
  private alertService = inject(AlertService);

  public fileUtility = FileUtility;
  
  public employee = input<EmployeeResponse>();

  public faceImage = computed(() => {
    if (this.employee()) {
      return this.employeeService.getFaceImageFile(this.employee()!.id).pipe(
        switchMap((faceImage) => {
          if (faceImage instanceof Blob) {
            // Convertimos la promesa a un observable
            return from(FileUtility.getPhotoFromBlob(faceImage));
          } else {
            return of(null);
          }
        })
      );
    }
    return of(null);
  });

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
        direction: CameraDirection.Front
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

    this.employeeService.createFaceImage(this.employee()!.id, formData).subscribe({
      next: (response) => this.alertService.getSuccessAlert(response).fire(),
      error: (error) => this.alertService.getErrorAlert(error.message).fire()
    });
  }

}
