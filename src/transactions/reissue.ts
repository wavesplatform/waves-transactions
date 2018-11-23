import { TRANSACTION_TYPE, IReissueTransaction, IReissueParams } from '../transactions'
import { concat, BASE58_STRING, LONG, signBytes, hashBytes, BYTES, BOOL } from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes } from '../types'
import { noError, ValidationResult } from 'waves-crypto/validation'
import { generalValidation, raiseValidationErrors } from '../validation'
import { validators } from '../schemas'

export const reissueValidation = (tx: IReissueTransaction): ValidationResult => [
  noError,
]

export const reissueToBytes = (tx: IReissueTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.REISSUE, tx.version, tx.chainId.charCodeAt(0)]),
  BASE58_STRING(tx.senderPublicKey),
  BASE58_STRING(tx.assetId),
  LONG(tx.quantity),
  BOOL(tx.reissuable),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function reissue(paramsOrTx: IReissueParams | IReissueTransaction, seed?: SeedTypes): IReissueTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: IReissueTransaction = {
    type: TRANSACTION_TYPE.REISSUE,
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
    generalValidation(tx, validators.IReissueTransaction),
    reissueValidation(tx)
)
  const bytes = reissueToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? reissue(tx, nextSeed) : tx
}