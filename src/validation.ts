import { ValidationResult, noError } from 'waves-crypto/validation';
import { Option, Params } from "./types";
import { ValidateFunction } from "ajv";


export function generalValidation(params: Params, validate: ValidateFunction): ValidationResult {
  const valid = validate(params)
//  console.log(validate.errors)
  return valid || validate.errors == null
    ? [noError]
    : validate.errors.map(value => JSON.stringify(value,null, 2))
}

export function raiseValidationErrors(...result: ValidationResult[]) {
  //console.log(result)
  const r = result.reduce((a, b) => [...a, ...b], []) as string[]
  const rr = r.filter(x => x.length > 0)
  //debugger
  //console.log(rr)
  if (rr.length > 0) throw new Error('[' + rr.join(',\n') + ']')
}