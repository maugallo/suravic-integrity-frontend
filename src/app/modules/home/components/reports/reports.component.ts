import { Component, computed, inject } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { OptionLargeComponent } from 'src/app/shared/components/option-large/option-large.component';
import { ChosenMonth, ReportService } from '../../services/report.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FileUtility } from 'src/app/shared/utils/file.utility';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';
import { EmployeeStore } from 'src/app/modules/employees/stores/employee.store';
import { EmployeeResponse } from 'src/app/modules/employees/models/employee.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  imports: [IonContent, OptionLargeComponent],
  standalone: true
})
export class ReportsComponent {

  private reportService = inject(ReportService);
  private alertService = inject(AlertService);
  private employeeStore = inject(EmployeeStore);

  private employees = computed(() => {
    const employees = this.employeeStore.enabledEntities();
    if (employees) {
      return employees.map((element: EmployeeResponse) => ({
        value: element.id,
        label: `${element.firstName} ${element.lastName}`,
      }));
    }
    return [];
  });

  private months = [
    { label: 'Mes Actual', value: 'current' },
    { label: 'Mes Anterior', value: 'last' }
  ];

  public downloadEmployeesReport() {
    this.reportService.getEmployeesReport().subscribe({
      next: (response) => this.downloadFile(response, 'empleados'),
      error: (error) => this.alertService.getErrorAlert(error)
    });
  }

  public downloadAttendancesReport() {
    this.alertService.getDualButtonAlert('Elegí el mes del reporte', 'Mes Actual', 'Mes Anterior')
      .then((result) => {
        if (result.isConfirmed) {
          this.getAttendances(ChosenMonth.CURRENT);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.getAttendances(ChosenMonth.LAST);
        }
      });
  }

  private getAttendances(month: ChosenMonth) {
    this.reportService.getAttendancesReport(month).subscribe({
      next: (response) => this.downloadFile(response, 'asistencias'),
      error: (error) => this.alertService.getErrorAlert(error)
    });
  }

  public downloadTicketsReport() {
    this.alertService.getMultipleSelectAlert('Selecciona un empleado', 'Generar', 'Selecciona un empleado', 'Selecciona un mes', this.employees(), this.months)
      .then((result) => {
        if (result.isConfirmed) {
          const employeeId = result.value.firstSelect;
          const month = result.value.secondSelect;
          this.reportService.getTicketsReport(employeeId, month).subscribe({
            next: (response) => this.downloadFile(response, `tickets_${result.value.firstSelect}`),
            error: (error) => this.alertService.getErrorAlert(error)
          });
        }
      })
      .catch((error) => console.error('Error en el modal:', error));
  }

  public downloadPayAdvancesReport() {
    this.alertService.getMultipleSelectAlert('Selecciona un empleado', 'Generar', 'Selecciona un empleado', 'Selecciona un mes', this.employees(), this.months)
      .then((result) => {
        if (result.isConfirmed) {
          const employeeId = result.value.firstSelect;
          const month = result.value.secondSelect;
          this.reportService.getPayAdvancesReport(employeeId, month).subscribe({
            next: (response) => this.downloadFile(response, `tickets_${result.value.firstSelect}`),
            error: (error) => this.alertService.getErrorAlert(error)
          });
        }
      })
      .catch((error) => console.error('Error en el modal:', error));
  }

  public downloadDebtsReport() {
    this.reportService.getDebtsReport().subscribe({
      next: (response) => this.downloadFile(response, 'deudas'),
      error: (error) => this.alertService.getErrorAlert(error)
    });
  }

  /*   private async downloadFile(response: Blob) { // Smartphone
      try {
        // Guardar archivo en dispositivo.
        const base64Data = await FileUtility.blobToBase64(response);
        const savedFile = await Filesystem.writeFile({
          path: `Download/empleados_${new Date().getTime()}.pdf`,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true
        });
  
        // Abrir archivo.
        const options: FileOpenerOptions = {
          filePath: savedFile.uri,
          contentType: 'application/pdf',
          openWithDefault: true,
        };
        await FileOpener.open(options);
  
        console.log('Archivo descargado y abierto:', savedFile.uri);
      } catch (error) {
        console.error('Error al descargar y abrir el archivo:', error);
      }
    } */

  private downloadFile(response: Blob, name: string) { // PC
    try {
      // Crear un objeto URL desde el blob
      const url = window.URL.createObjectURL(response);
      const fileName = `${name}_${new Date().getTime()}.pdf`;

      // Crear un enlace de descarga temporal
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      // Simular el clic para iniciar la descarga
      link.click();

      // Liberar el objeto URL una vez que no sea necesario
      window.URL.revokeObjectURL(url);

      console.log('Archivo descargado:', fileName);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  }

}