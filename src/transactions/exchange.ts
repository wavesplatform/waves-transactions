/**
 * @module index
 */
import {WithId, WithProofs} from '../transactions'
import {binary} from '@waves/marshall'
import {base58Encode, blake2b, signBytes} from '@waves/ts-lib-crypto'
import {addProof, convertToPairs, fee, getSenderPublicKey, networkByte} from '../generic'
import {TSeedTypes} from '../types'
import {validate} from '../validators'
import {txToProtoBytes} from '../proto-serialize'
import {DEFAULT_VERSIONS} from '../defaultVersions'
import {ExchangeTransaction, TRANSACTION_TYPE} from '@waves/ts-types'

/* @echo DOCS */
export function exchange(paramsOrTx: ExchangeTransaction & WithProofs, seed?: TSeedTypes): ExchangeTransaction & WithId & WithProofs{

    const type = TRANSACTION_TYPE.EXCHANGE
    const version = paramsOrTx.version || DEFAULT_VERSIONS.EXCHANGE
    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)


    const tx: ExchangeTransaction & WithId & WithProofs = {
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
