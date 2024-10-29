import { Photo } from "@capacitor/camera";

export class FileUtility {

    public static isPhoto(file: any): Photo | null {
        return 'dataUrl' in file ? file as Photo : null;
    }

    public static isFile(file: any): File | null {
        return file instanceof File ? file as File : null;
    }

    public static dataUrlToBlob(dataUrl: string): Blob {
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    public static async fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

    public static async getPhotoFromBlob(blob: Blob): Promise<Photo> {
        const format = FileUtility.getFileExtension(blob.type);
        const reader = new FileReader();

        return new Promise<Photo>((resolve) => {
            reader.onload = () => {
                const photo: Photo = {
                    dataUrl: reader.result as string,
                    format: format,
                    saved: false
                };
                resolve(photo);
            };

            reader.readAsDataURL(blob);
        });
    }

    public static getFileFromBlob(blob: Blob, fileName: string): File {
        return new File([blob], `${fileName}.${FileUtility.getFileExtension(blob.type)}`, {
            type: blob.type,
        });
    }

    public static getFileExtension(mimeType: string): string {
        switch (mimeType) {
            case 'application/pdf':
                return 'pdf';
            case 'application/msword':
                return 'doc';
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'docx';
            case 'image/jpeg':
                return 'jpg';
            case 'image/png':
                return 'png';
            default:
                return '';
        }
    }

    public static getFileMimeType(file: File): string {
        const extension = file.name.split('.').pop();
        switch (extension) {
          case 'pdf': return 'application/pdf';
          case 'jpg': return 'image/jpeg';
          case 'png': return 'image/png';
          case 'doc': return 'application/msword';
          case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          default: return 'application/octet-stream';
        }
      }

}