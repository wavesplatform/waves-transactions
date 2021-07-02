/**
 * @module index
 */
import {ITransferParams, WithId, WithProofs, WithSender} from '../transactions'
import {base58Encode, blake2b, signBytes} from '@waves/ts-lib-crypto'
import {
    addProof,
    chainIdFromRecipient,
    convertToPairs,
    fee,
    getSenderPublicKey,
    networkByte,
    normalizeAssetId
} from '../generic'
import {validate} from '../validators'
import {TSeedTypes} from '../types'
import {binary} from '@waves/marshall'
import {txToProtoBytes} from '../proto-serialize'
import {DEFAULT_VERSIONS} from '../defaultVersions'
import {TRANSACTION_TYPE, TransferTransaction} from '@waves/ts-types'

/* @echo DOCS */
export function transfer(params: ITransferParams, seed: TSeedTypes): TransferTransaction & WithId & WithProofs
export function transfer(paramsOrTx: ITransferParams & WithSender | TransferTransaction, seed?: TSeedTypes): TransferTransaction & WithId & WithProofs
export function transfer(paramsOrTx: any, seed?: TSeedTypes): TransferTransaction & WithId & WithProofs{
    const type = TRANSACTION_TYPE.TRANSFER
    const version = paramsOrTx.version || DEFAULT_VERSIONS.TRANSFER
    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

    const tx: TransferTransaction & WithId & WithProofs= {
        type,
        version,
        senderPublicKey,
        assetId: normalizeAssetId(paramsOrTx.assetId),
        recipient: paramsOrTx.recipient,
        amount: paramsOrTx.amount,
        attachment: paramsOrTx.attachment || '',
        fee: fee(paramsOrTx, 100000),
        feeAssetId: normalizeAssetId(paramsOrTx.feeAssetId),
        timestamp: paramsOrTx.timestamp || Date.now(),
        proofs: paramsOrTx.proofs || [],
        chainId: networkByte(paramsOrTx.chainId, chainIdFromRecipient(paramsOrTx.recipient)),
        id: '',
    }

    validate.transfer(tx)

    const bytes = version > 2 ? txToProtoBytes(tx) : binary.serializeTx(tx)

    seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes), i))
    tx.id = base58Encode(blake2b(bytes))

    return tx
}
