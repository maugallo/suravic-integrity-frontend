import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  public getInputAlert(title: string, placeholder: string, confirmButtontext: string, preConfirm: (inputValue: string) => boolean | Promise<any>, inputValue?: string) {
    return Swal.mixin({
      title: title,
      input: "text",
      inputValue: inputValue ?? '',
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: confirmButtontext,
      cancelButtonText: "CERRAR",
      allowOutsideClick: false,
      heightAuto: false,
      focusConfirm: false,
      customClass: {
        title: 'sweet-modal-title',
        input: 'sweet-modal-input',
        confirmButton: 'sweet-modal-button',
        cancelButton: 'sweet-modal-cancel-button'
      },
      preConfirm: preConfirm
    })
  }

  public getWarningConfirmationAlert(title: string, text?: string) {
    return Swal.mixin({
      title: title,
      text: text ?? '',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'ELIMINAR',
      cancelButtonText: "CERRAR",
      heightAuto: false,
      customClass: {
        title: 'sweet-modal-title',
        confirmButton: 'sweet-modal-button',
        cancelButton: 'sweet-modal-cancel-button'
      }
    });
  }

  public getConfirmationAlert(title: string, text: string) {
    return Swal.mixin({
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: 'VOLVER',
      cancelButtonText: "CERRAR",
      heightAuto: false,
      customClass: {
        title: 'sweet-modal-title',
        confirmButton: 'sweet-modal-button',
        cancelButton: 'sweet-modal-cancel-button'
      }
    });
  }

  getSuccessToast(titleMessage: string){
    return Swal.mixin({
        toast: true,
        icon: 'success',
        position: 'top-end',
        title: titleMessage,
        showConfirmButton: false,
        timer: 1250,
        customClass: {
          title: ''
        }
    });
  }

}
