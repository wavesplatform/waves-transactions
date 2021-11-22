import { verifySignature } from '@waves/ts-lib-crypto'
import { binary } from '@waves/marshall'

import {libs, TTx} from '../src'

import {protoBytesToTx, txToProtoBytes} from '../src/proto-serialize'
import {exampleTxs} from "./exampleTxs";
import {txs} from "./example-proto-tx";
import {TIMEOUT} from "./integration/config";

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
const deleteProofsAndId = (t:any) => {
    const tx: any = t
    delete tx.id
    delete tx.proofs
    return tx
}

describe('serialize/deserialize', () => {
    const txss = Object.keys(exampleTxs).map(x => (<any>exampleTxs)[x] as any)
    txss.forEach(tx => {
        it('type: ' + tx.type, () => {
            tx = deleteProofsAndId(tx)
            const parsed = protoBytesToTx(txToProtoBytes(tx))
            expect(parsed).toMatchObject(tx)
        })
    })

    it('correctly serialized transactions', () => {
        Object.entries(txs).forEach(([name, { Bytes, Json }]) => {
            const actualBytes = libs.crypto.base16Encode(txToProtoBytes(Json as any))
            const expectedBytes = libs.crypto.base16Encode(libs.crypto.base64Decode(Bytes))
            expect(expectedBytes).toBe(actualBytes)
        })
    }, TIMEOUT)

})
