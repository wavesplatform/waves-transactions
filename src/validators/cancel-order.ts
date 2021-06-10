import {
  getError,
  validateByShema,
  isPublicKey,
  isHash,
  isBase58
} from './validators'


const cancelOrderScheme = {
  sender: isPublicKey,
  orderId: isHash,
  signature: isBase58,
  hash: isBase58,
}

export const cancelOrderValidator = validateByShema(cancelOrderScheme, getError)
