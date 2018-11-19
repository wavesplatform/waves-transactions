import { TransactionType, ReissueTransaction, long } from '../transactions'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes, Params } from '../types'
import { noError, ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'
import { validators } from '../schemas'

export interface ReissueParams extends Params {
  assetId: string
  quantity: long
  reissuable: boolean
  fee?: long
  timestamp?: number
  chainId?: string
}

export const reissueValidation = (tx: ReissueTransaction): ValidationResult => [
  noError,
]

export const reissueToBytes = (tx: ReissueTransaction): Uint8Array => concat(
  BYTES([TransactionType.Reissue, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.assetId),
  LONG(tx.quantity),
  BOOL(tx.reissuable),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function reissue(paramsOrTx: ReissueParams | ReissueTransaction, seed?: SeedTypes): ReissueTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: ReissueTransaction = {
    type: TransactionType.Reissue,
    version: 2,
    chainId: 'W',
    fee: 100000000,
    senderPublicKey,
    timestamp: Date.now(),
    proofs: [],
    id: '',
    ...paramsOrTx,
  }

  raiseValidationErrors(
    generalValidation(tx, validators.ReissueTransaction),
    reissueValidation(tx)
)
  const bytes = reissueToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? reissue(tx, nextSeed) : tx
}