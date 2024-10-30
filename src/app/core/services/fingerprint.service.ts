import { inject, Injectable } from '@angular/core';
import { AndroidBiometryStrength, BiometricAuth, BiometryError, BiometryErrorType, CheckBiometryResult } from '@aparajita/capacitor-biometric-auth';
import { StorageService } from './utils/storage.service';
import { StorageType } from '../models/enums/storage-type.enum';

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {

  private storageService = inject(StorageService);

  public async checkBiometryAvailability(): Promise<void> {
    try {
      const result: CheckBiometryResult = await BiometricAuth.checkBiometry();
      if (result.isAvailable) {
        console.log('Autenticación biométrica disponible:', result.biometryType);
        // Puedes habilitar la opción para registrar la biometría
      } else {
        console.error('Autenticación biométrica no disponible:', result.reason);
      }
    } catch (error) {
      console.error('Error al verificar la biometría:', error);
    }
  }

  public async authenticateEmployee(employeeId: number): Promise<void> {
    try {
      await BiometricAuth.authenticate({
        reason: 'Por favor autentícate para enlazar tu huella',
        cancelTitle: 'Cancelar',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Usar código de acceso',
        androidTitle: 'Ingreso biométrico',
        androidSubtitle: 'Ingresa usando autenticación biométrica',
        androidConfirmationRequired: false,
        androidBiometryStrength: AndroidBiometryStrength.weak,
      });
  
      // Si la autenticación es exitosa, guarda el estado de autenticación biométrica
      this.storageService.setStorage(StorageType.BIOMETRIC_AUTH + employeeId, true).subscribe({
        next: () => console.log('Autenticación biométrica exitosa, estado registrado')
      });      
    } catch (error) {
      if (error instanceof BiometryError) {
        if (error.code !== BiometryErrorType.userCancel) {
          console.error('Error de autenticación biométrica:', error.message);
        }
      } else {
        console.error('Error desconocido durante la autenticación:', error);
      }
    }
  }

/*   public async markAttendance(employeeId: number): Promise<void> {
    // Verificar si la autenticación biométrica está habilitada para este empleado
    this.storageService.getStorage(StorageType.BIOMETRIC_AUTH + employeeId).subscribe({
      next: (value) => {
        if (value) {
          await this.authenticateEmployee(employeeId);
        }
      }
    }); */
    /* const { value } = await Storage.get({ key: `biometricAuth_${employeeId}` }); */
  
/*     if (value) {
      const biometricData = JSON.parse(value);
      if (biometricData.enabled) {
        // Intentar autenticar al usuario
        await authenticateEmployee(employeeId);
        
        // Si llegas aquí, significa que la autenticación fue exitosa
        // Llamada al backend para registrar la asistencia del empleado
        await apiService.markAttendance(employeeId);
        console.log('Asistencia registrada exitosamente para el empleado:', employeeId);
      } else {
        console.log('La autenticación biométrica no está habilitada para este empleado');
      }
    } else {
      console.log('Empleado no registrado para autenticación biométrica');
    }
  } */
  
}
