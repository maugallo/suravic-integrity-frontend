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

  public getWarningAlert(title: string, text?: string) {
    return Swal.fire({
      icon: "warning",
      title: title,
      text: text || '',
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

  public getDualButtonAlert(title: string, confirmButtonText: string, cancelButtonText: string) {
    return Swal.fire({
      title,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      heightAuto: false,
      customClass: {
        title: 'sweet-modal-title',
        confirmButton: 'sweet-modal-button-2',
        cancelButton: 'sweet-modal-cancel-button-2'
      }
    });
  }

  public getSelectAlert(title: string, confirmButtonText: string, inputPlaceholder: string, options: any[]) {
    return Swal.fire({
      title,
      input: 'select',
      inputOptions: options,
      inputPlaceholder,
      confirmButtonText,
      heightAuto: false,
      customClass: {
        title: 'sweet-modal-title',
        input: 'sweet-modal-input',
        confirmButton: 'sweet-modal-button-3'
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('Debes seleccionar un elemento');
        } else {
          return value;
        }
      },
    });
  }

  public getMultipleSelectAlert(title: string, confirmButtonText: string,
    firstPlaceholder: string, secondPlaceholder: string,
    firstOptions: any[], secondOptions: any[]) {
    const firstSelect = firstOptions.map(opcion => `<option value="${opcion.value}">${opcion.label}</option>`).join('');
    const secondSelect = secondOptions.map(opcion => `<option value="${opcion.value}">${opcion.label}</option>`).join('');

    return Swal.fire({
      title,
      html: `
      <label for="first-select">${firstPlaceholder}</label>
      <select id="first-select" class="swal2-select">
        ${firstSelect}
      </select>
      <br><br>
      <label for="second-select">${secondPlaceholder}</label>
      <select id="second-select" class="swal2-select">
        ${secondSelect}
      </select>
    `,
      heightAuto: false,
      confirmButtonText,
      customClass: {
        title: 'sweet-modal-title',
        confirmButton: 'sweet-modal-button-3'
      },
      preConfirm: () => {
        const firstSelectValue = (document.getElementById('first-select') as HTMLSelectElement).value;
        const secondSelectValue = (document.getElementById('second-select') as HTMLSelectElement).value;

        if (!firstSelectValue || !secondSelectValue) {
          Swal.showValidationMessage('Debes seleccionar una opción en ambos campos.');
          return false;
        }

        return {
          firstSelect: firstSelectValue,
          secondSelect: secondSelectValue,
        };
      }
    });
  }

}
