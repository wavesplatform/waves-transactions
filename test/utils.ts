import {base16Encode, base64Decode, verifySignature} from '@waves/ts-lib-crypto'
import {binary} from '@waves/marshall'

import {TTx} from '../src'

import {protoBytesToTx, txToProtoBytes} from '../src/proto-serialize'

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

export function checkSerializeDeserialize({Json, Bytes}: { Json: any, Bytes: string }) {
    const tx = deleteProofsAndId(Json);
    const protoBytes = txToProtoBytes(tx);
    const parsed = protoBytesToTx(protoBytes);
    expect(parsed).toMatchObject(tx);

    const actualBytes = base16Encode(protoBytes);
    const expectedBytes = base16Encode(base64Decode(Bytes));
    expect(expectedBytes).toBe(actualBytes)

}

export function checkBinarySerializeDeserialize({Json, Bytes}: { Json: any, Bytes: string }) {
    const tx = deleteProofsAndId(Json);
    const binaryBytes = binary.serializeTx(tx);
    const parsed = binary.parseTx(binaryBytes);
    expect(parsed).toMatchObject(tx);

    const actualBytes = base16Encode(binaryBytes);
    const expectedBytes = base16Encode(base64Decode(Bytes));
    expect(expectedBytes).toBe(actualBytes)

}

