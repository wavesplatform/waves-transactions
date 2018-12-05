import { TRANSACTION_TYPE, ITransferTransaction, ITransferParams } from '../transactions'
import { concat, BASE58_STRING, BYTE, LEN, SHORT, STRING, LONG, signBytes, hashBytes, OPTION } from 'waves-crypto'
import { pullSeedAndIndex, addProof, mapSeed, getSenderPublicKey } from '../generic'
import { SeedTypes } from '../types'
import { generalValidation, raiseValidationErrors } from '../validation'


export const transferToBytes = (tx: ITransferTransaction) => concat(
  BYTE(TRANSACTION_TYPE.TRANSFER),
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

export const transferValidation = (tx: ITransferTransaction) => []

/* @echo DOCS */
export function transfer(paramsOrTx: ITransferParams | ITransferTransaction, seed?: SeedTypes): ITransferTransaction {
  const { nextSeed } = pullSeedAndIndex(seed)

  const senderPublicKey = getSenderPublicKey(seed, paramsOrTx)

  const tx: ITransferTransaction = {
    type: TRANSACTION_TYPE.TRANSFER,
    version: 2,
    fee: 100000,
    senderPublicKey,
    timestamp: Date.now(),
    proofs: [],
    id: '',
    ...paramsOrTx,
  }

  raiseValidationErrors(
    transferValidation(tx)
  )

  const bytes = transferToBytes(tx)

    mapSeed(seed, (s, i) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)
  return nextSeed ? transfer(tx, nextSeed) : tx
}