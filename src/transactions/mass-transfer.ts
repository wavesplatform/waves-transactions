/**
 * @module index
 */
import { TRANSACTION_TYPE, IMassTransferTransaction, IMassTransferParams, WithId, WithSender } from '../transactions'
import {
  addProof,
  chainIdFromRecipient,
  convertToPairs,
  fee,
  getSenderPublicKey,
  networkByte,
  normalizeAssetId
} from '../generic'
import { TSeedTypes } from '../types'
import { base58Encode, blake2b, signBytes } from '@waves/ts-lib-crypto'
import { binary } from '@waves/marshall'
import { validate } from '../validators'
import { txToProtoBytes } from '../proto-serialize'
import { DEFAULT_VERSIONS } from '../defaultVersions';


/* @echo DOCS */
export function massTransfer(params: IMassTransferParams, seed: TSeedTypes): IMassTransferTransaction & WithId
export function massTransfer(paramsOrTx: IMassTransferParams & WithSender | IMassTransferTransaction, seed?: TSeedTypes): IMassTransferTransaction & WithId
export function massTransfer(paramsOrTx: any, seed?: TSeedTypes): IMassTransferTransaction & WithId {
  const type = TRANSACTION_TYPE.MASS_TRANSFER
  const version = paramsOrTx.version || DEFAULT_VERSIONS.MASS_TRANSFER
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  if (!Array.isArray(paramsOrTx.transfers) || paramsOrTx.transfers.length === 0) throw new Error('Should contain at least one transfer')

  const tx: IMassTransferTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    assetId: normalizeAssetId(paramsOrTx.assetId),
    transfers: paramsOrTx.transfers,
    fee: fee(paramsOrTx, 100000 + Math.ceil(0.5 * paramsOrTx.transfers.length) * 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    attachment: paramsOrTx.attachment || null,
    proofs: paramsOrTx.proofs || [],
    chainId: networkByte(paramsOrTx.chainId, chainIdFromRecipient(paramsOrTx.transfers[0]?.recipient)),
    id: '',
  }
  validate.massTransfer(tx)

  const bytes = version > 1 ? txToProtoBytes(tx) : binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
