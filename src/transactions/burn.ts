import { TransactionType, BurnTransaction } from '../transactions'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES } from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes, Params } from '../types'
import { generalValidation, raiseValidationErrors } from '../validation'
import { VALIDATOR_MAP } from '../schemas'
import { noError, ValidationResult } from 'waves-crypto/validation'


export interface BurnParams extends Params {
  assetId: string
  quantity: number
  fee?: number
  timestamp?: number
  chainId?: string
}

export const burnValidation = (tx: BurnTransaction): ValidationResult => [
  noError,
]

export const burnToBytes = (tx: BurnTransaction): Uint8Array => concat(
  BYTES([TransactionType.Burn, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.assetId),
  LONG(tx.quantity),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function burn(paramsOrTx: BurnParams | BurnTransaction, seed?: SeedTypes): BurnTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: BurnTransaction = {
    type: TransactionType.Burn,
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
    generalValidation(tx, VALIDATOR_MAP['BurnTransaction']),
    burnValidation(tx)
  )

  const bytes = burnToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? burn(tx, nextSeed) : tx
}
