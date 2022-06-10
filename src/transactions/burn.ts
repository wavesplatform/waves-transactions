/**
 * @module index
 */
import {IBurnParams, WithId, WithProofs, WithSender} from '../transactions'
import { binary } from '@waves/marshall'
import { signBytes, blake2b, base58Encode } from '@waves/ts-lib-crypto'
import {addProof, getSenderPublicKey, convertToPairs, networkByte, fee, normalizeAssetId} from '../generic'
import { TSeedTypes } from '../types'
import { validate } from '../validators'
import { txToProtoBytes } from '../proto-serialize'
import { DEFAULT_VERSIONS } from '../defaultVersions'
import {BurnTransaction, TRANSACTION_TYPE} from '@waves/ts-types'


/* @echo DOCS */
export function burn(params: IBurnParams, seed: TSeedTypes): BurnTransaction & WithId & WithProofs
export function burn(paramsOrTx: IBurnParams & WithSender | BurnTransaction, seed?: TSeedTypes): BurnTransaction & WithId & WithProofs
export function burn(paramsOrTx: any, seed?: TSeedTypes): BurnTransaction & WithId & WithProofs{
  const type = TRANSACTION_TYPE.BURN
  const version = paramsOrTx.version || DEFAULT_VERSIONS.BURN
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

  const tx: BurnTransaction & WithId & WithProofs = {
    type,
    version,
    senderPublicKey,
    assetId: paramsOrTx.assetId,
    amount: paramsOrTx.amount,
    chainId: networkByte(paramsOrTx.chainId, 87),
    fee: fee(paramsOrTx, 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    id: '',
  }

  validate.burn(tx)

  const bytes = version > 2 ? txToProtoBytes(tx) : binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
  tx.id = base58Encode(blake2b(bytes))

  return tx
}
