import {  pullSeedAndIndex } from './generic';
import { ValidationResult, noError } from 'waves-crypto/validation';
import { Option, Params, SeedTypes } from "./types";

export function generalValidation(seed: Option<SeedTypes>, params: Params): ValidationResult {
  const { seed: s } = pullSeedAndIndex(seed)
  return [
    s == null && !params.senderPublicKey?
      'Please provide either seed or senderPublicKey' : noError
  ]
}

export function raiseValidationErrors(...result: ValidationResult[]) {
  const r = result.reduce((a, b) => [...a, ...b], []) as string[]
  const rr = r.filter(x => x.length > 0)
  if (rr.length > 0) throw new Error(rr.join('\n'))
}