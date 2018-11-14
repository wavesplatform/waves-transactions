import { TransactionType, CancelLeaseTransaction } from '../transactions'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes, Params} from '../types'
import { noError, ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'
import { VALIDATOR_MAP } from '../schemas'

export interface CancelLeaseParams extends Params {
  leaseId: string
  fee?: number
  timestamp?: number
  chainId?: string
}

export const cancelLeaseValidation = (tx: CancelLeaseTransaction): ValidationResult => [

]

export const cancelLeaseToBytes = (tx: CancelLeaseTransaction): Uint8Array => concat(
  BYTES([TransactionType.CancelLease, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  LONG(tx.fee),
  LONG(tx.timestamp),
  BASE58_STRING(tx.leaseId)
)

/* @echo DOCS */
export function cancelLease(paramsOrTx: CancelLeaseParams | CancelLeaseTransaction, seed?: SeedTypes): CancelLeaseTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: CancelLeaseTransaction = {
      type: TransactionType.CancelLease,
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
    generalValidation(tx, VALIDATOR_MAP['CancelLeaseTransaction']),
    cancelLeaseValidation(tx)
  )

  const bytes = cancelLeaseToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? cancelLease(tx, nextSeed) : tx
}