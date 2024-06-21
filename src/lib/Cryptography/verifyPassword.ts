import { scryptSync, timingSafeEqual } from 'crypto';

/**
 * Verifies if a given password matches the hashed password.
 * 
 * @param {string} password - The plain-text password to verify.
 * @param {string} hashedPassword - The hashed password stored in the database.
 * @returns {boolean} True if the password matches the hashed password, otherwise false.
 */
function verifyPassword(password:string, hashedPassword:string): boolean{
    
    // Salt retrieval mechanism
    const [ salt, hash ] = hashedPassword.split(':');

    // length of the key
    const keylen: number = 64;

    // Generate hash buffer from provided password and salt
    const generatedHashBufferFromPassword = scryptSync(password, salt, keylen);

    // Convert stored hash from hex to buffer
    const actualHashBuffer = Buffer.from(hash, 'hex');

    // Use timingSafeEqual to compare both buffers securely
    return timingSafeEqual(actualHashBuffer, generatedHashBufferFromPassword);

}

export { verifyPassword }