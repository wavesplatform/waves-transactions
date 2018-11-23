import { TRANSACTION_TYPE, ILeaseTransaction, ILeaseParams } from '../transactions'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes } from '../types'
import { ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'
import { validators } from '../schemas'

export const leaseValidation = (tx: ILeaseTransaction): ValidationResult => []

export const leaseToBytes = (tx: ILeaseTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.LEASE, tx.version, 0]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.recipient),
  LONG(tx.amount),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function lease(paramsOrTx: ILeaseParams | ILeaseTransaction, seed?: SeedTypes): ILeaseTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: ILeaseTransaction =  {
      type: TRANSACTION_TYPE.LEASE,
      version: 2,
      fee: 100000,
      senderPublicKey,
      timestamp:Date.now(),
      proofs: [],
      id: '',
    ...paramsOrTx,
    }

  raiseValidationErrors(
    generalValidation(tx, validators.ILeaseTransaction),
    leaseValidation(tx)
  )

  const bytes = leaseToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? lease(tx, nextSeed) : tx
}