import { Component, inject } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { OptionLargeComponent } from "../../../shared/components/option-large/option-large.component";
import { ReportService } from 'src/app/core/services/report.service';
import { AlertService } from 'src/app/core/services/utils/alert.service';
import { FileUtility } from 'src/app/core/models/utils/file.utility';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';

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

  public downloadEmployeesReport() {
    this.reportService.getEmployeesReport().subscribe({
      next: (response) => this.downloadFile(response),
      error: (error) => this.alertService.getErrorAlert(error)
    });
  }

/*   private async downloadFile(response: Blob) {
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

  private downloadFile(response: Blob) {
    try {
      // Crear un objeto URL desde el blob
      const url = window.URL.createObjectURL(response);
      const fileName = `empleados_${new Date().getTime()}.pdf`;
  
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
