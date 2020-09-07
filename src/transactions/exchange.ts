/**
 * @module index
 */
import {
  TRANSACTION_TYPE,
  IExchangeTransaction,
  WithId,
  WithSender,
  ITransferTransaction,
  IOrder
} from '../transactions'
import { binary } from '@waves/marshall'
import { signBytes, blake2b, base58Encode } from '@waves/ts-lib-crypto'
import { addProof, getSenderPublicKey, convertToPairs, fee, normalizeAssetId, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { validate } from '../validators'
import { txToProtoBytes } from '../proto-serialize'
import { DEFAULT_VERSIONS } from '../defaultVersions';

/* @echo DOCS */
export function exchange(paramsOrTx: IExchangeTransaction, seed?: TSeedTypes): IExchangeTransaction & WithId {

  const type = TRANSACTION_TYPE.EXCHANGE
  const version = paramsOrTx.version || DEFAULT_VERSIONS.EXCHANGE
  const seedsAndIndexes = convertToPairs(seed)
  const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)


  const tx: IExchangeTransaction & WithId = {
    type,
    version,
    senderPublicKey,
    order1: paramsOrTx.order1,
    order2: paramsOrTx.order2,
    price: paramsOrTx.price,
    amount: paramsOrTx.amount,
    buyMatcherFee: paramsOrTx.buyMatcherFee,
    sellMatcherFee: paramsOrTx.sellMatcherFee,
    fee: fee(paramsOrTx, 100000),
    timestamp: paramsOrTx.timestamp || Date.now(),
    proofs: paramsOrTx.proofs || [],
    chainId: networkByte(paramsOrTx.chainId, 87),
    id: '',
  }

  validate.exchange(tx)

  const bytes = version > 2 ? txToProtoBytes(tx) : binary.serializeTx(tx)

  seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))

  return {...tx, id: base58Encode(blake2b(bytes))}
}
