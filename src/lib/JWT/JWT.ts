import jwt, {JwtPayload} from 'jsonwebtoken';
const SECRET_KEY:string = process.env['JWT_KEY'] || "";

if (SECRET_KEY==""){
    throw new Error("JWT secret key is not defined in environment variables");
}

export type Payload = {
    employee_id: number,
    email: string,
    full_name: string
};

interface DecodedToken extends JwtPayload {
    exp: number;
}


export class JsonWebToken{
    constructor(){
        console.log(SECRET_KEY);
    }

    createToken(payload : Payload): string{
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
    }

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