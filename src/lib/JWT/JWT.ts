import jwt, {JwtPayload} from 'jsonwebtoken';

// Retrieve JWT secret key from environment variables
const SECRET_KEY:string = process.env['JWT_KEY'] || "";

// Ensure JWT secret key is defined
if (SECRET_KEY==""){
    throw new Error("JWT secret key is not defined in environment variables");
}

// Payload interface for JSON Web Token
export type Payload = {
    employee_id: number,
    email: string,
    full_name: string
};

// Interface extending JwtPayload to include 'exp' field
interface DecodedToken extends JwtPayload {
    exp: number;
}

/**
 * JSON Web Token utility class for token creation and validation.
 */
export class JsonWebToken{
    /**
     * Creates a new JSON Web Token (JWT) with the provided payload.
     * 
     * @param {Payload} payload - The payload object containing user data.
     * @returns {string} The generated JWT token.
     */
    createToken(payload : Payload): string{
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '10d' });
    }


    /**
     * Validates the provided JWT token.
     * 
     * @param {string} token - The JWT token to validate.
     * @returns - An object indicating the validation result:
     *                   - success: True if the token is valid, otherwise false.
     *                   - error: Error message if validation fails.
     *                   - reason: Reason for token invalidation (expired, invalid format, etc.).
     */
    validateToken(token: string){
        try{
            const decodedToken = jwt.verify(token, SECRET_KEY) as DecodedToken;
            if (decodedToken.exp < Math.floor(Date.now() / 1000)) {   
                throw new Error("Token has expired");   
            }
            return {
                success: true
            };
        }   
        catch (error){
            let reason = "Unknown Error";
            if (error instanceof jwt.TokenExpiredError) {
                reason = "Token has expired";
            } else if (error instanceof jwt.JsonWebTokenError) {
                reason = error.message;
            } else if (error instanceof Error) {
                reason = error.message;
            }

            return {
                success: false,
                error: 'Invalid Token',
                reason: reason
            };
        }
    }

}