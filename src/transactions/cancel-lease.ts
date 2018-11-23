import { TRANSACTION_TYPE, ICancelLeaseTransaction, ICancelLeaseParams } from '../transactions'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes } from '../types'
import { noError, ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'
import { validators } from '../schemas'



export const cancelLeaseValidation = (tx: ICancelLeaseTransaction): ValidationResult => [

]

export const cancelLeaseToBytes = (tx: ICancelLeaseTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.CANCEL_LEASE, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  LONG(tx.fee),
  LONG(tx.timestamp),
  BASE58_STRING(tx.leaseId)
)

/* @echo DOCS */
export function cancelLease(paramsOrTx: ICancelLeaseParams | ICancelLeaseTransaction, seed?: SeedTypes): ICancelLeaseTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: ICancelLeaseTransaction = {
      type: TRANSACTION_TYPE.CANCEL_LEASE,
      version: 2,
      fee:100000,
      senderPublicKey,
      timestamp: Date.now(),
      chainId: 'W',
      proofs: [],
      id: '',
    ...paramsOrTx,
    }

  raiseValidationErrors(
    generalValidation(tx, validators.ICancelLeaseTransaction),
    cancelLeaseValidation(tx)
  )

  const bytes = cancelLeaseToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? cancelLease(tx, nextSeed) : tx
}