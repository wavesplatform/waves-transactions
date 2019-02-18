import { TRANSACTION_TYPE, IMassTransferTransaction, IMassTransferParams, WithId, WithSender } from '../transactions'
import { addProof, convertToPairs, fee, getSenderPublicKey } from '../generic'
import { TSeedTypes } from '../types'
import { hashBytes, signBytes } from '@waves/waves-crypto'
import { binary } from '@waves/marshall'


/* @echo DOCS */
export function massTransfer(params: IMassTransferParams, seed: TSeedTypes): IMassTransferTransaction & WithId
export function massTransfer(paramsOrTx: IMassTransferParams & WithSender | IMassTransferTransaction, seed?: TSeedTypes): IMassTransferTransaction & WithId
export function massTransfer(paramsOrTx: any, seed?: TSeedTypes): IMassTransferTransaction & WithId {
  const type = TRANSACTION_TYPE.MASS_TRANSFER
  const version = paramsOrTx.version || 1
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  if (!Array.isArray(paramsOrTx.transfers)) throw new Error('["transfers should be array"]')

  const tx: IMassTransferTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    assetId: paramsOrTx.assetId === 'WAVES' ? null : paramsOrTx.assetId,
    transfers: paramsOrTx.transfers,
    fee: fee(paramsOrTx, 100000 + Math.ceil(0.5 * paramsOrTx.transfers.length) * 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    attachment: paramsOrTx.attachment || '',
    proofs: paramsOrTx.proofs || [],
    id: '', //TODO: invalid id for masstransfer tx
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)

  return tx
}