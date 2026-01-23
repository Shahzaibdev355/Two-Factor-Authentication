
import OTPAuth from 'otpauth';
import { customAlphabet } from 'nanoid';
import { hashValue } from './encryption.helper';

export const generateOTP = (email: string) => { 
    const totp = new OTPAuth.TOTP({
        issuer: 'Two-FAuth-App',
        label: email,
        algorithm: 'SHA256',
        digits: 6,
        period: 45,
        
    });

    return totp
}


export const generateRecoveryCodes = async (count: number) =>{

    const APLHA_NUMERIC_SEQ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const recoveryCodes: Record<'plainText' | 'hashed', string[]> = {
        plainText: [],
        hashed: []
    };
    
    for (let i = 0; i < count; i++) {
        const recoveryCode = customAlphabet(APLHA_NUMERIC_SEQ, 10)();
        recoveryCodes.plainText.push(recoveryCode);

        // In a real application, you would hash the code before storing it
        const hashedrecoveryCode = await hashValue(recoveryCode);
        recoveryCodes.hashed.push(hashedrecoveryCode); // Placeholder for hashed code
    }

    return recoveryCodes;
}