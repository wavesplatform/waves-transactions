import { TransactionType, MassTransferTransaction, Transfer } from "../transactions"
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from "../generic"
import { SeedTypes, Params } from "../types";
import { noError, ValidationResult } from "waves-crypto/validation";
import {
  BASE58_STRING,
  BYTE,
  concat,
  COUNT,
  hashBytes,
  LEN,
  LONG,
  OPTION,
  SHORT,
  signBytes,
  STRING
} from "waves-crypto";
import { generalValidation, raiseValidationErrors } from "../validation";
import { VALIDATOR_MAP } from "../schemas";

export interface MassTransferParams extends Params {
  transfers: Transfer[]
  attachment?: string
  assetId?: string
  fee?: number
  timestamp?: number
}

export const massTransferValidation = (tx: MassTransferTransaction): ValidationResult => [
  noError
]

export const massTransferToBytes = (tx: MassTransferTransaction): Uint8Array => concat(
  BYTE(TransactionType.MassTransfer),
  BYTE(1),
  BASE58_STRING(tx.senderPublicKey),
  OPTION(BASE58_STRING)(tx.assetId),
  COUNT(SHORT)((x: Transfer) => concat(BASE58_STRING(x.recipient), LONG(x.amount)))(tx.transfers),
  LONG(tx.timestamp),
  LONG(tx.fee),
  LEN(SHORT)(STRING)(tx.attachment),
)

/* @echo DOCS */
export function massTransfer(paramsOrTx: MassTransferParams | MassTransferTransaction, seed?: SeedTypes): MassTransferTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  if (!Array.isArray(paramsOrTx.transfers))  throw new Error('["transfers should be array"]')

  const tx: MassTransferTransaction = {
    type: TransactionType.MassTransfer,
    version: 1,
    fee: (100000 + Math.ceil(0.5 * paramsOrTx.transfers.length) * 100000),
    senderPublicKey,
    timestamp: Date.now(),
    proofs: [],
    id: '', //TODO: invalid id for masstransfer tx
    ...paramsOrTx
  }

  raiseValidationErrors(
    generalValidation(tx, VALIDATOR_MAP['MassTransferTransaction']),
    massTransferValidation(tx)
  )

  const bytes = massTransferToBytes(tx)

  mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? massTransfer(tx, nextSeed) : tx
}