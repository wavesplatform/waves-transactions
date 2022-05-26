import {base16Encode, base64Decode, verifySignature} from '@waves/ts-lib-crypto'
import {binary} from '@waves/marshall'

import {makeTx, TTx} from '../src'

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
    const tx: any = t
    delete tx.id
    delete tx.proofs
    return tx
}

export function checkProtoSerializeDeserialize({Json, Bytes}: { Json: any, Bytes: string }) {
    const txJson = deleteProofsAndId(Json);
    const txObject = makeTx(txJson);
    const protoBytes = txToProtoBytes(txObject);
    const parsed = protoBytesToTx(protoBytes);
    expect(parsed).toMatchObject(txJson);

    const actualBytes = base16Encode(protoBytes);
    const expectedBytes = base16Encode(base64Decode(Bytes));
    expect(expectedBytes).toBe(actualBytes)

}

export function checkBinarySerializeDeserialize({Json, Bytes}: { Json: any, Bytes: string }) {
    const txJson = deleteProofsAndId(Json);
    const binaryBytes = binary.serializeTx(makeTx(txJson));
    const actualBytes = base16Encode(binaryBytes);
    const expectedBytes = base16Encode(base64Decode(Bytes));
    expect(expectedBytes).toBe(actualBytes)
}
export const longMax = '9223372036854775807';

export function errorMessageByTemplate(field: String, value: any) {
    if (typeof(value) == 'number')
        return `tx "${field}", has wrong data: ${value}. Check tx data.`
    else
        return `tx "${field}", has wrong data: "${value}". Check tx data.`
}

export function rndString(len: number) {
    const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"];
    const rndStr = [...Array(len)].map(i=>chars[Math.random()*chars.length|0]).join('');
    return rndStr
}

