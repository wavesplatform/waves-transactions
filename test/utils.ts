import {verifySignature} from '@waves/ts-lib-crypto'
import {binary} from '@waves/marshall'

import {TTx} from '../src'

import {txToProtoBytes} from '../src/proto-serialize'

function validateTxSignature(tx: TTx, protoBytesMinVersion: number, proofNumber = 0, publicKey?: string): boolean {
    const bytes = tx.version > protoBytesMinVersion ? txToProtoBytes(tx) : binary.serializeTx(tx)

    return verifySignature(publicKey || tx.senderPublicKey, bytes, tx.proofs[proofNumber]!)
}

export {
    validateTxSignature
}

/**
 * Longs as strings, remove unnecessary fields
 * @param t
 */
export const deleteProofsAndId = (t: any) => {
    const tx: any = t;
    delete tx.id;
    delete tx.proofs;
    return tx
}

