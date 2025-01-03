import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  public showInputAlert(
    title: string, placeholder: string, confirmButtonText: string, preConfirm: (inputValue: string) => boolean | Promise<any>, inputValue?: string) {
    return Swal.fire({
      title,
      input: 'text',
      inputValue: inputValue || '',
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'CERRAR',
      allowOutsideClick: false,
      heightAuto: false,
      focusConfirm: false,
      customClass: {
        title: 'sweet-modal-title',
        input: 'sweet-modal-input',
        confirmButton: 'sweet-modal-button',
        cancelButton: 'sweet-modal-cancel-button'
      },
      preConfirm
    });
  }

  public getWarningConfirmationAlert(title: string, text?: string, confirmButton?: string) {
    return Swal.fire({
      title: title,
      text: text || '',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: confirmButton ?? "ELIMINAR",
      cancelButtonText: "CERRAR",
      heightAuto: false,
      customClass: {
        title: 'sweet-modal-title',
        confirmButton: 'sweet-modal-button',
        cancelButton: 'sweet-modal-cancel-button'
      }
    });
  }

  public getConfirmationAlert(title: string, text?: string) {
    return Swal.fire({
      title: title,
      text: text || '',
      showCancelButton: true,
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: "CERRAR",
      heightAuto: false,
      customClass: {
        title: 'sweet-modal-title',
        confirmButton: 'sweet-modal-button',
        cancelButton: 'sweet-modal-cancel-button'
      }
    });
  }

  public getSuccessAlert(title: string, text?: string) {
    return Swal.fire({
      icon: "success",
      title: title,
      text: text || '',
      heightAuto: false,
      customClass: {
        title: 'sweet-modal-title',
        confirmButton: 'sweet-modal-button',
      }
    });
  }

  public getWarningAlert(title: string) {
    return Swal.fire({
      icon: "warning",
      title: title,
      heightAuto: false,
      customClass: {
        title: 'sweet-modal-title',
        confirmButton: 'sweet-modal-button',
      }
    });
  }

  public getErrorAlert(text: string) {
    return Swal.fire({
      icon: "error",
      title: "Error",
      text: text,
      heightAuto: false,
      customClass: {
        title: 'sweet-modal-title',
        confirmButton: 'sweet-modal-button',
      }
    });
  }

  public getSuccessToast(title: string) {
    return Swal.fire({
      toast: true,
      icon: 'success',
      position: 'top-end',
      title: title,
      showConfirmButton: false,
      timer: 1250,
      customClass: {
        title: ''
      }
    });
  }

  public getErrorToast(title: string) {
    return Swal.fire({
      toast: true,
      icon: 'error',
      position: 'top-end',
      title: title,
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        title: ''
      }
    });
  }

}
