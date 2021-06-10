import {
  getError,
  validateByShema,
  isString
} from './validators'


const authScheme = {
  data: isString,
  host: isString,
}


export const authValidator = validateByShema(authScheme, getError)
