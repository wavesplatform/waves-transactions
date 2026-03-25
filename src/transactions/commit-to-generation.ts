/**
 * @module index
 */
import {base58Decode, base58Encode, blake2b,  concat, crypto, signBytes, isPrivateKey, privateKey} from '@waves/ts-lib-crypto'
import {CommitToGenerationTransaction, TRANSACTION_TYPE} from '@waves/ts-types'

import {ICommitToGenerationParams, WithId, WithProofs, WithSender} from '../transactions'
import {addProof, convertToPairs, fee, getSenderPublicKey, networkByte} from '../generic'
import {validate} from '../validators'
import {TSeedTypes} from '../types'
import {txToProtoBytes} from '../proto-serialize'
import {DEFAULT_VERSIONS} from '../defaultVersions'


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
export function commitToGeneration(params: ICommitToGenerationParams, seed: TSeedTypes): CommitToGenerationTransaction & WithId & WithProofs
export function commitToGeneration(paramsOrTx: ICommitToGenerationParams & WithSender | CommitToGenerationTransaction, seed?: TSeedTypes): CommitToGenerationTransaction & WithId & WithProofs
export function commitToGeneration(paramsOrTx: any, seed?: TSeedTypes): CommitToGenerationTransaction & WithId & WithProofs {
    const type = TRANSACTION_TYPE.COMMIT_TO_GENERATION
    const version = paramsOrTx.version || DEFAULT_VERSIONS.COMMIT_TO_GENERATION
    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)
    const primarySeed = seedsAndIndexes[0]?.[0]
    const shouldComputeBls = paramsOrTx.endorserPublicKey == null || paramsOrTx.commitmentSignature == null
    const blsKeyPair = !shouldComputeBls || primarySeed == null
        ? undefined
        : wavesCrypto.blsKeyPair(isPrivateKey(primarySeed)
            ? primarySeed.privateKey
            : privateKey(primarySeed))
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

    const tx: CommitToGenerationTransaction & WithId & WithProofs = {
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

    return tx as CommitToGenerationTransaction & WithId & WithProofs
}
