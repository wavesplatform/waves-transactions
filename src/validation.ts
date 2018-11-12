import { ValidationResult, noError } from 'waves-crypto/validation';
import { Option, Params } from "./types";
import { ValidateFunction } from "ajv";


export function generalValidation(params: Params, validate: ValidateFunction): ValidationResult {
  const valid = validate(params)
  return valid || validate.errors == null ? [noError] : validate.errors.map(value => value.toString())
}

export function raiseValidationErrors(...result: ValidationResult[]) {
  const r = result.reduce((a, b) => [...a, ...b], []) as string[]
  const rr = r.filter(x => x.length > 0)
  if (rr.length > 0) throw new Error(rr.join('\n'))
}