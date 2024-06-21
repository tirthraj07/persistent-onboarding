import { scryptSync, timingSafeEqual } from 'crypto';

function verifyPassword(password:string, hashedPassword:string): boolean{
    
    // Salt retrieval mechanism
    const [ salt, hash ] = hashedPassword.split(':');

    // length of the key
    const keylen: number = 64;

    const generatedHashBufferFromPassword = scryptSync(password, salt, keylen);

    const actualHashBuffer = Buffer.from(hash, 'hex');

    return timingSafeEqual(actualHashBuffer, generatedHashBufferFromPassword);

}

export { verifyPassword }