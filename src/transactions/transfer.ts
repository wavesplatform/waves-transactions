import { TRANSACTION_TYPE, ITransferTransaction, ITransferParams, WithId, WithSender } from '../transactions'
import { signBytes, hashBytes } from '@waves/waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'

/* @echo DOCS */
export function transfer(params: ITransferParams, seed: TSeedTypes): ITransferTransaction & WithId
export function transfer(paramsOrTx: ITransferParams & WithSender | ITransferTransaction, seed?: TSeedTypes): ITransferTransaction & WithId
export function transfer(paramsOrTx: any, seed?: TSeedTypes): ITransferTransaction {
  const type = TRANSACTION_TYPE.TRANSFER
  const version = paramsOrTx.version || 2
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: ITransferTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    assetId: paramsOrTx.assetId === 'WAVES' ? null : paramsOrTx.assetId,
    recipient: paramsOrTx.recipient,
    amount: paramsOrTx.amount,
    attachment: paramsOrTx.attachment || '',
    fee: fee(paramsOrTx, 100000),
    feeAssetId: paramsOrTx.feeAssetId === 'WAVES' ? null : paramsOrTx.feeAssetId,
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)

  return tx
}