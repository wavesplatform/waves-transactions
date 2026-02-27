/**
 * @module index
 */
import {ICommitToGeneractionParams, WithId, WithProofs, WithSender} from '../transactions'
import {base58Decode, base58Encode, blake2b,  concat, crypto, signBytes} from '@waves/ts-lib-crypto'
import {addProof, convertToPairs, fee, getSenderPublicKey, networkByte} from '../generic'
import {validate} from '../validators'
import {TSeedTypes} from '../types'
import {txToProtoBytes} from '../proto-serialize'
import {DEFAULT_VERSIONS} from '../defaultVersions'
import {CommitToGeneractionTransaction, TRANSACTION_TYPE} from '@waves/ts-types'

const wavesCrypto = crypto({output: 'Bytes'})

const int32ToBigEndianBytes = (value: number): Uint8Array => {
    if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647) {
        throw new Error(`generationPeriodStart should be a 32-bit integer, but got: ${value}`)
    }

    const result = new Uint8Array(4)
    new DataView(result.buffer).setInt32(0, value, false)

    return result
}

/* @echo DOCS */
export function commitToGeneraction(params: ICommitToGeneractionParams, seed: TSeedTypes): CommitToGeneractionTransaction & WithId & WithProofs
export function commitToGeneraction(paramsOrTx: ICommitToGeneractionParams & WithSender | CommitToGeneractionTransaction, seed?: TSeedTypes): CommitToGeneractionTransaction & WithId & WithProofs
export function commitToGeneraction(paramsOrTx: any, seed?: TSeedTypes): CommitToGeneractionTransaction & WithId & WithProofs {
    const type = TRANSACTION_TYPE.COMMIT_TO_GENERATION
    const version = paramsOrTx.version || DEFAULT_VERSIONS.COMMIT_TO_GENERATION
    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)
    const primarySeed = seedsAndIndexes[0]?.[0]
    const blsKeyPair = primarySeed == null
        ? undefined
        : wavesCrypto.blsKeyPair(typeof primarySeed === 'string' ? primarySeed : primarySeed.privateKey)
    const blsSecret = blsKeyPair?.blsSecret

    const endorserPublicKey = paramsOrTx.endorserPublicKey == null
        ? blsKeyPair == null
            ? undefined
            : base58Encode(blsKeyPair.blsPublic)
        : paramsOrTx.endorserPublicKey

    if (endorserPublicKey == null) {
        throw new Error('Please provide either seed or endorserPublicKey for CommitToGeneractionTransaction')
    }

    const commitmentSignature = paramsOrTx.commitmentSignature == null
        ? blsSecret == null
            ? undefined
            : base58Encode(wavesCrypto.blsSign(
                blsSecret,
                concat(base58Decode(endorserPublicKey), int32ToBigEndianBytes(paramsOrTx.generationPeriodStart)),
            ))
        : paramsOrTx.commitmentSignature

    if (commitmentSignature == null) {
        throw new Error('Please provide either seed or commitmentSignature for CommitToGeneractionTransaction')
    }

    const tx: CommitToGeneractionTransaction & WithId & WithProofs = {
        type,
        version,
        senderPublicKey,
        generationPeriodStart: paramsOrTx.generationPeriodStart,
        endorserPublicKey,
        commitmentSignature,
        fee: fee(paramsOrTx, 10000000),
        timestamp: paramsOrTx.timestamp || Date.now(),
        chainId: networkByte(paramsOrTx.chainId, 87),
        proofs: paramsOrTx.proofs || [],
        id: '',
    }

    validate.commitToGeneraction(tx)

    const bytes = txToProtoBytes(tx)

    seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
    tx.id = base58Encode(blake2b(bytes))

    return tx as CommitToGeneractionTransaction & WithId & WithProofs
}
