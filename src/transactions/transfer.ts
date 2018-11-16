import { TransactionType, TransferTransaction } from '../transactions'
import { concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, OPTION } from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes, Params } from '../types'
import { generalValidation, raiseValidationErrors } from '../validation'
import { validators } from '../schemas'

export interface TransferParams extends Params {
  recipient: string
  amount: number
  attachment?: string
  feeAssetId?: string
  assetId?: string
  fee?: number
  timestamp?: number
}

export const transferToBytes = (tx: TransferTransaction) => concat(
  BYTE(TransactionType.Transfer),
  BYTE(tx.version),
  BASE58_STRING(tx.senderPublicKey),
  OPTION(BASE58_STRING)(tx.assetId),
  OPTION(BASE58_STRING)(tx.feeAssetId),
  LONG(tx.timestamp),
  LONG(tx.amount),
  LONG(tx.fee),
  BASE58_STRING(tx.recipient),
  LEN(SHORT)(STRING)(tx.attachment)
)

export const transferValidation = (tx: TransferTransaction) => []

/* @echo DOCS */
export function transfer(paramsOrTx: TransferParams | TransferTransaction, seed?: SeedTypes): TransferTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: TransferTransaction = {
    type: TransactionType.Transfer,
    version: 2,
    fee: 100000,
    senderPublicKey,
    timestamp: Date.now(),
    proofs: [],
    id: '',
    ...paramsOrTx,
  }

  raiseValidationErrors(
    generalValidation(tx, validators.TransferTransaction),
    transferValidation(tx)
  )

  const bytes = transferToBytes(tx)

    mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? transfer(tx, nextSeed) : tx
}