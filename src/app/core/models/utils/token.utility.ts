export class TokenUtility {

    public static getRoleFromToken(token: string): string {
        const decodedToken = this.decodeToken(token);
        const role = decodedToken.authorities[0];
        return role ? role : ''; // Debería retornar [ ROLE_DUENO ] o [ ROLE_ENCARGADO ]
    }

    public static getUserIdFromToken(token: string): string {
        const decodedToken = this.decodeToken(token);
        return decodedToken.userId;
    }

    public static isTokenExpired(token: string) {
        const expiration = this.getExpirationTimeFromToken(token);
        const now = new Date();

        return ((expiration.getTime() - now.getTime()) < 2 * 60 * 1000) // Si le quedan menos de 2 minutos para expirar, devuelve true.
    }

    private static getExpirationTimeFromToken(token: string): Date {
        const decodedToken = this.decodeToken(token);
        const exp = decodedToken.exp;

        return new Date(exp * 1000);
    }

    private static decodeToken(token: string): any {
        const payload = token.split('.')[1]; // Get the payload part of the JWT
        const decodedPayload = atob(payload); // Decode the Base64 encoded payload
        return JSON.parse(decodedPayload); // Parse the payload as a JSON object
    }

}