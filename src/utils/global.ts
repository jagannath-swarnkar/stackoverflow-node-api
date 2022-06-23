import jwt from 'jsonwebtoken';

export const PASS_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/

export const createToken = async(data:any) => {
    return jwt.sign(
        data, 
        process.env.SECRETE_KEY, 
        { expiresIn: 60 * 60 * 24 }
    )
    
}