import {
  getError,
  validateByShema,
  isNumber,
  isPublicKey
} from './validators'


const authScheme = {
  publicKey: isPublicKey,
  timestamp: isNumber,
}


export const authValidator = validateByShema(authScheme, getError)
