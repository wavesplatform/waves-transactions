import { TRANSACTION_TYPE, IAliasTransaction, IAliasParams } from '../transactions'
import { concat, BASE58_STRING, LEN, SHORT, STRING, LONG, signBytes, hashBytes, BYTES } from 'waves-crypto'
import { addProof, pullSeedAndIndex, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes } from '../types'
import { generalValidation, raiseValidationErrors } from '../validation'
import { ValidationResult, noError } from 'waves-crypto/validation'


export const aliasValidation = (tx: IAliasTransaction): ValidationResult => [
  tx.fee < 100000 ? 'fee is lees than 100000' : noError,
  !tx.alias || tx.alias.length === 0 ? 'alias is empty or undefined' : noError,
]

export const aliasToBytes = (tx: IAliasTransaction): Uint8Array => concat(
  BYTES([TRANSACTION_TYPE.ALIAS, tx.version]),
  BASE58_STRING(tx.senderPublicKey),
  LEN(SHORT)(STRING)(tx.alias),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function alias(paramsOrTx: IAliasParams | IAliasTransaction, seed?: SeedTypes): IAliasTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: IAliasTransaction = {
    type: TRANSACTION_TYPE.ALIAS,
    version: 2,
    fee: 100000,
    senderPublicKey,
    timestamp: Date.now(),
    id: '',
    proofs: [],
    ...paramsOrTx,
  }

  raiseValidationErrors(
    aliasValidation(tx)
  )

  const bytes = aliasToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? alias(tx, nextSeed) : tx
}