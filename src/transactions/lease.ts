/**
 * @module index
 */
import {ILeaseParams, WithId, WithProofs, WithSender} from '../transactions'
import { signBytes, blake2b, base58Encode } from '@waves/ts-lib-crypto'
import {addProof, convertToPairs, fee, getSenderPublicKey, networkByte} from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'
import { validate } from '../validators'
import { txToProtoBytes } from '../proto-serialize'
import { DEFAULT_VERSIONS } from '../defaultVersions'
import {LeaseTransaction, TRANSACTION_TYPE} from '@waves/ts-types'


/* @echo DOCS */
export function lease(params: ILeaseParams, seed: TSeedTypes): LeaseTransaction & WithId & WithProofs
export function lease(paramsOrTx: ILeaseParams & WithSender | LeaseTransaction, seed?: TSeedTypes): LeaseTransaction & WithId & WithProofs
export function lease(paramsOrTx: any, seed?: TSeedTypes): LeaseTransaction & WithId & WithProofs{
  const type = TRANSACTION_TYPE.LEASE
  const version = paramsOrTx.version || DEFAULT_VERSIONS.LEASE
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: LeaseTransaction & WithId & WithProofs = {
    type,
    version,
    senderPublicKey,
    amount: paramsOrTx.amount,
    recipient: paramsOrTx.recipient,
    fee: fee(paramsOrTx, 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    chainId: networkByte(paramsOrTx.chainId, 87),
    id: '',
  }

  validate.lease(tx)

  const bytes = version > 2 ? txToProtoBytes(tx) : binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
