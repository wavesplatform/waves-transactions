/**
 * @module index
 */
import { ICancelLeaseParams, WithSender } from '../transactions'
import { binary } from '@waves/marshall'
import { base58Encode, blake2b, signBytes } from '@waves/ts-lib-crypto'
import { addProof, convertToPairs, fee, getSenderPublicKey, networkByte } from '../generic'
import { TSeedTypes } from '../types'
import { validate } from '../validators'
import { txToProtoBytes } from '../proto-serialize'
import { TCancelLeaseTransaction, TRANSACTION_TYPE, TCancelLeaseTransactionWithId } from '@waves/ts-types'


/* @echo DOCS */
export function cancelLease(params: ICancelLeaseParams, seed: TSeedTypes): TCancelLeaseTransactionWithId
export function cancelLease(paramsOrTx: ICancelLeaseParams & WithSender | TCancelLeaseTransaction, seed?: TSeedTypes): TCancelLeaseTransactionWithId
export function cancelLease(paramsOrTx: any, seed?: TSeedTypes): TCancelLeaseTransactionWithId {
    const type = TRANSACTION_TYPE.CANCEL_LEASE
    const version = paramsOrTx.version || 3
    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

    const tx: TCancelLeaseTransactionWithId = {
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
