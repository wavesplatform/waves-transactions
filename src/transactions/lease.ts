import { TRANSACTION_TYPE, ILeaseTransaction, ILeaseParams, WithId, WithSender } from '../transactions'
import { signBytes, hashBytes } from '@waves/waves-crypto'
import { addProof, convertToPairs, fee, getSenderPublicKey } from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'


/* @echo DOCS */
export function lease(params: ILeaseParams, seed: TSeedTypes): ILeaseTransaction & WithId
export function lease(paramsOrTx: ILeaseParams & WithSender | ILeaseTransaction, seed?: TSeedTypes): ILeaseTransaction & WithId
export function lease(paramsOrTx: any, seed?: TSeedTypes): ILeaseTransaction & WithId {
  const type = TRANSACTION_TYPE.LEASE
  const version = paramsOrTx.version || 2
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: ILeaseTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    amount: paramsOrTx.amount,
    recipient: paramsOrTx.recipient,
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