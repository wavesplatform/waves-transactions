import { TransactionType, AliasTransaction } from "../transactions"
import { concat, BASE58_STRING, LEN, SHORT, STRING, LONG, signBytes, hashBytes, BYTES } from "waves-crypto"
import { addProof, pullSeedAndIndex, valOrDef, mapSeed, getSenderPublicKey } from "../generic"
import { SeedTypes, Params} from "../types";

export interface AliasParams extends Params {
  alias: string
  fee?: number
  timestamp?: number
  chainId?: string
}

export const aliasValidation = (paramsOrTx: AliasParams | AliasTransaction): ValidationResult => [
  paramsOrTx.fee < 100000 ? 'fee is lees than 100000' : noError,
  !paramsOrTx.alias || paramsOrTx.alias.length == 0 ? `alias is empty or undefined` : noError,
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
  const { alias: _alias, fee, timestamp } = paramsOrTx
  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)
  const tx: AliasTransaction = {
    type: TransactionType.Alias,
    version: 2,
    alias: _alias,
    fee: valOrDef(fee, 100000),
    senderPublicKey: senderPublicKey || mapSeed(seed, s => publicKey(s)),
    timestamp: valOrDef(timestamp, Date.now()),
    id: '',
    proofs: [],
    ...paramsOrTx
  }

  raiseValidationErrors(
    generalValidation(seed, tx),
    aliasValidation(tx)
  )

  const bytes = aliasToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? alias(nextSeed, tx) : tx
}