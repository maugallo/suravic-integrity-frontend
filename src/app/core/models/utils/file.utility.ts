import { Photo } from "@capacitor/camera";

export class FileUtility {

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

    public static isPhoto(file: any): Photo | null {
        return 'dataUrl' in file ? file as Photo : null;
    }

    public static isFile(file: any): File | null {
        return file instanceof File ? file as File : null;
    }

}