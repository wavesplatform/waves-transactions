import { TransactionType, AliasTransaction } from '../transactions'
import { concat, BASE58_STRING, LEN, SHORT, STRING, LONG, signBytes, hashBytes, BYTES } from 'waves-crypto'
import { addProof, pullSeedAndIndex, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes, Params } from '../types'
import { generalValidation, raiseValidationErrors } from '../validation'
import { ValidationResult, noError } from 'waves-crypto/validation'
import { VALIDATOR_MAP } from '../schemas'

export interface AliasParams extends Params {
  alias: string
  fee?: number
  timestamp?: number
  chainId?: string
}

export const aliasValidation = (tx: AliasTransaction): ValidationResult => [
  tx.fee < 100000 ? 'fee is lees than 100000' : noError,
  !tx.alias || tx.alias.length === 0 ? 'alias is empty or undefined' : noError,
]

export const aliasToBytes = (tx: AliasTransaction): Uint8Array => concat(
  BYTES([TransactionType.Alias, tx.version]),
  BASE58_STRING(tx.senderPublicKey),
  LEN(SHORT)(STRING)(tx.alias),
  LONG(tx.fee),
  LONG(tx.timestamp)
)

/* @echo DOCS */
export function alias(paramsOrTx: AliasParams | AliasTransaction, seed?: SeedTypes): AliasTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: AliasTransaction = {
    type: TransactionType.Alias,
    version: 2,
    fee: 100000,
    senderPublicKey,
    timestamp: Date.now(),
    id: '',
    proofs: [],
    ...paramsOrTx,
  }

  raiseValidationErrors(
    generalValidation(tx, VALIDATOR_MAP['AliasTransaction']),
    aliasValidation(tx)
  )

  const bytes = aliasToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? alias(tx, nextSeed) : tx
}