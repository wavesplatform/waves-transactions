/**
 * @module index
 */
import {ICancelLeaseParams, WithId, WithProofs, WithSender} from '../transactions'
import { binary } from '@waves/marshall'
import { signBytes, blake2b, base58Encode } from '@waves/ts-lib-crypto'
import {addProof, getSenderPublicKey, convertToPairs, networkByte, fee} from '../generic'
import { TSeedTypes } from '../types'
import { validate } from '../validators'
import { txToProtoBytes } from '../proto-serialize'
import { DEFAULT_VERSIONS } from '../defaultVersions'
import {CancelLeaseTransaction, TRANSACTION_TYPE} from '@waves/ts-types'


/* @echo DOCS */
export function cancelLease(params: ICancelLeaseParams, seed: TSeedTypes): CancelLeaseTransaction & WithId & WithProofs
export function cancelLease(paramsOrTx: ICancelLeaseParams & WithSender | CancelLeaseTransaction, seed?: TSeedTypes): CancelLeaseTransaction & WithId & WithProofs
export function cancelLease(paramsOrTx: any, seed?: TSeedTypes): CancelLeaseTransaction & WithId & WithProofs{
  const type = TRANSACTION_TYPE.CANCEL_LEASE
  const version = paramsOrTx.version || DEFAULT_VERSIONS.CANCEL_LEASE
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: CancelLeaseTransaction & WithId & WithProofs = {
    type,
    version,
    senderPublicKey,
    leaseId: paramsOrTx.leaseId,
    fee: fee(paramsOrTx, 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    chainId: networkByte(paramsOrTx.chainId, 87),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  validate.cancelLease(tx)

  const bytes = version > 2 ? txToProtoBytes(tx) : binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
