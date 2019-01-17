import { TRANSACTION_TYPE, IBurnTransaction, IBurnParams, WithId, WithSender } from '../transactions'
import { binary } from '@waves/marshall'
import { signBytes, hashBytes } from '@waves/waves-crypto'
import { addProof, getSenderPublicKey, convertToPairs, networkByte, fee } from '../generic'
import { TSeedTypes } from '../types'

/* @echo DOCS */
export function burn(params: IBurnParams, seed: TSeedTypes): IBurnTransaction & WithId
export function burn(paramsOrTx: IBurnParams & WithSender | IBurnTransaction, seed?: TSeedTypes): IBurnTransaction & WithId
export function burn(paramsOrTx: any, seed?: TSeedTypes): IBurnTransaction & WithId {
  const type = TRANSACTION_TYPE.BURN
  const version = paramsOrTx.version || 2
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: IBurnTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    assetId: paramsOrTx.assetId,
    quantity: paramsOrTx.quantity,
    chainId: networkByte(paramsOrTx.chainId, 87),
    fee: fee(paramsOrTx, 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  const bytes = binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(bytes, s), i))
  tx.id = hashBytes(bytes)

  return tx
}
