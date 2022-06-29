/**
 * @module index
 */
import {IReissueParams, WithId, WithProofs, WithSender} from '../transactions'
import { signBytes, blake2b, base58Encode } from '@waves/ts-lib-crypto'
import {addProof, convertToPairs, fee, getSenderPublicKey, networkByte} from '../generic'
import { TSeedTypes } from '../types'
import { binary } from '@waves/marshall'
import { validate } from '../validators'
import { txToProtoBytes } from '../proto-serialize'
import { DEFAULT_VERSIONS } from '../defaultVersions'
import {ReissueTransaction, TRANSACTION_TYPE} from '@waves/ts-types'


/* @echo DOCS */
export function reissue(paramsOrTx: IReissueParams, seed: TSeedTypes): ReissueTransaction & WithId & WithProofs
export function reissue(paramsOrTx: IReissueParams & WithSender | ReissueTransaction, seed?: TSeedTypes): ReissueTransaction & WithId & WithProofs
export function reissue(paramsOrTx: any, seed?: TSeedTypes): ReissueTransaction & WithId & WithProofs{
  const type = TRANSACTION_TYPE.REISSUE
  const version = paramsOrTx.version || DEFAULT_VERSIONS.REISSUE
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: ReissueTransaction & WithId & WithProofs = {
    type,
    version,
    senderPublicKey,
    assetId: paramsOrTx.assetId,
    quantity: paramsOrTx.quantity,
    reissuable: paramsOrTx.reissuable,
    chainId: networkByte(paramsOrTx.chainId, 87),
    fee: fee(paramsOrTx,100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  validate.reissue(tx)

  const bytes = version > 2 ? txToProtoBytes(tx) : binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s,i]) => addProof(tx, signBytes(s, bytes),i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
