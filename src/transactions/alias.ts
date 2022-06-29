/**
 * @module index
 */
import {IAliasParams, WithId, WithProofs, WithSender} from '../transactions'
import {binary} from '@waves/marshall'
import {base58Encode, blake2b, signBytes} from '@waves/ts-lib-crypto'
import {txToProtoBytes} from '../proto-serialize'
import {addProof, convertToPairs, fee, getSenderPublicKey, networkByte} from '../generic'
import {TSeedTypes} from '../types'
import {validate} from '../validators'
import {DEFAULT_VERSIONS} from '../defaultVersions'
import {AliasTransaction, TRANSACTION_TYPE} from '@waves/ts-types'


/* @echo DOCS */
export function alias(params: IAliasParams, seed: TSeedTypes): AliasTransaction & WithId & WithProofs
export function alias(paramsOrTx: IAliasParams & WithSender | AliasTransaction, seed?: TSeedTypes): AliasTransaction & WithId & WithProofs
export function alias(paramsOrTx: any, seed?: TSeedTypes): AliasTransaction & WithId & WithProofs {
    const type = TRANSACTION_TYPE.ALIAS
    const version = paramsOrTx.version || DEFAULT_VERSIONS.ALIAS
    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

    const tx: AliasTransaction & WithId & WithProofs = {
        type,
        version,
        senderPublicKey,
        alias: paramsOrTx.alias,
        fee: fee(paramsOrTx, 100000),
        timestamp: paramsOrTx.timestamp || Date.now(),
        chainId: networkByte(paramsOrTx.chainId, 87),
        proofs: paramsOrTx.proofs || [],
        id: '',
    }

    validate.alias(tx)

    const bytes = version > 2 ? txToProtoBytes(tx) : binary.serializeTx(tx)
    const idBytes = version > 2 ? bytes : [bytes[0], ...bytes.slice(36, -16)]

    seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))

    tx.id = base58Encode(blake2b(Uint8Array.from(idBytes)))

    return tx
}
