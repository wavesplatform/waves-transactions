import { ValidationResult, noError } from 'waves-crypto/validation'
import { ValidateFunction } from 'ajv'
import { IOrder, TTx } from "./transactions";


export function generalValidation(tx: TTx | IOrder, validate: ValidateFunction): ValidationResult {
  const valid = validate(tx);
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