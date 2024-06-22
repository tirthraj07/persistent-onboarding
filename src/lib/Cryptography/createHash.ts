import { scryptSync, randomBytes } from 'crypto'

/**
 * Generates a hashed password using scrypt with a random salt.
 * 
 * @param {string} password - The plain text password to hash.
 * @returns {string} - The hashed password in the format salt:hash.
 */
function generateHash(password: string) : string {
    // Generate a random salt and convert it to a hex string
    const salt = randomBytes(16).toString('hex');
    
    // length of the key
    const keylen: number = 64;

    // Create the hashed password using the scrypt algorithm
    const hashedPassword = scryptSync(password,salt,keylen).toString('hex');
    

    // Return hashed password in the format salt:hash
    return `${salt}:${hashedPassword}`;
}

export { generateHash }