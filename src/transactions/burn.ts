import { TRANSACTION_TYPE, IBurnTransaction, IBurnParams } from '../transactions'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes } from '../types'
import { generalValidation, raiseValidationErrors } from '../validation'
import { validators } from '../schemas'
import { noError, ValidationResult } from 'waves-crypto/validation'

export const burnValidation = (tx: IBurnTransaction): ValidationResult => [
  noError,
]

export const burnToBytes = (tx: IBurnTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.BURN, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.assetId),
  LONG(tx.quantity),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function burn(paramsOrTx: IBurnParams | IBurnTransaction, seed?: SeedTypes): IBurnTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: IBurnTransaction = {
    type: TRANSACTION_TYPE.BURN,
    version: 2,
    chainId: 'W',
    fee: 100000,
    senderPublicKey,
    timestamp: Date.now(),
    proofs: [],
    id: '',
    ...paramsOrTx,
  }

  raiseValidationErrors(
    generalValidation(tx, validators.IBurnTransaction),
    burnValidation(tx)
  )

  const bytes = burnToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? burn(tx, nextSeed) : tx
}
