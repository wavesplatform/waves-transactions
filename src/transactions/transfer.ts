/**
 * @module index
 */
import { TRANSACTION_TYPE, ITransferTransaction, ITransferParams, WithId, WithSender } from '../transactions'
import { signBytes, blake2b, base58Encode } from '@waves/ts-lib-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee, normalizeAssetId } from '../generic'
import { validate } from '../validators'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'
import { txToProtoBytes } from '../proto-serialize'

/* @echo DOCS */
export function transfer(params: ITransferParams, seed: TSeedTypes): ITransferTransaction & WithId
export function transfer(paramsOrTx: ITransferParams & WithSender | ITransferTransaction, seed?: TSeedTypes): ITransferTransaction & WithId
export function transfer(paramsOrTx: any, seed?: TSeedTypes): ITransferTransaction & WithId {
  const type = TRANSACTION_TYPE.TRANSFER
  const version = paramsOrTx.version || 3
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: ITransferTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    assetId: normalizeAssetId(paramsOrTx.assetId),
    recipient: paramsOrTx.recipient,
    amount: paramsOrTx.amount,
    attachment: paramsOrTx.attachment || '',
    fee: fee(paramsOrTx, 100000),
    feeAssetId: normalizeAssetId(paramsOrTx.feeAssetId),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    chainId: 'D',
    id: '',
  } as any

  validate.transfer(tx)

  const bytes = version > 2 ? txToProtoBytes(tx) : binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
