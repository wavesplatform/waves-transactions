/**
 * @module index
 */
import * as wavesProto from '@waves/protobuf-serialization'
import {binary, serializePrimitives} from '@waves/marshall'
import {base58Encode, blake2b, concat, signBytes} from '@waves/ts-lib-crypto'
import {IDataParams, WithId, WithProofs, WithSender} from '../transactions'
import {addProof, convertToPairs, fee, getSenderPublicKey, networkByte} from '../generic'
import {TSeedTypes} from '../types'
import {validate} from '../validators'
import {dataEntryToProto, txToProtoBytes} from '../proto-serialize'
import {DEFAULT_VERSIONS} from '../defaultVersions'
import {DataFiledType, DataTransaction, TRANSACTION_TYPE, DataTransactionEntry} from '@waves/ts-types'

const {
    BASE58_STRING,
    BASE64_STRING,
    BYTE,
    BYTES,
    COUNT,
    LEN,
    LONG,
    SHORT,
    STRING,
} = serializePrimitives

const typeMap: any = {
    integer: ['integer', 0, LONG],
    number: ['integer', 0, LONG],
    boolean: ['boolean', 1, BYTE],
    string: ['string', 3, LEN(SHORT)(STRING)],
    binary: ['binary', 2, (s: string) => LEN(SHORT)(BASE64_STRING)(s)], // Slice base64: part
    _: ['binary', 2, LEN(SHORT)(BYTES)],
}

const mapType = <T>(value: T, type: string | undefined): [DataFiledType, number, (value: T) => Uint8Array] => {
    return !!type ? typeMap[type] : typeMap[typeof value] || typeMap['_']
}


/* @echo DOCS */
export function data(params: IDataParams, seed: TSeedTypes): DataTransaction & WithId & WithProofs
export function data(paramsOrTx: IDataParams & WithSender | DataTransaction, seed?: TSeedTypes): DataTransaction & WithId & WithProofs
export function data(paramsOrTx: any, seed?: TSeedTypes): DataTransaction & WithId & WithProofs{
    const type = TRANSACTION_TYPE.DATA
    const version = paramsOrTx.version || DEFAULT_VERSIONS.DATA
    const seedsAndIndexes = convertToPairs(seed)
    const senderPublicKey = getSenderPublicKey(seedsAndIndexes, paramsOrTx)

    if (!Array.isArray(paramsOrTx.data)) throw new Error('["data should be array"]')

    const _timestamp = paramsOrTx.timestamp || Date.now()

    // console.log(paramsOrTx)
    const dataEntriesWithTypes = (paramsOrTx.data as any ?? []).map((x: DataTransactionEntry) => {

        if ((<any>x).type || x.value == null) return x
        else {
            const type = mapType(x.value, x.type)[0]
            const y = {
                type,
                key: x.key,
                value: type === 'binary' ? 'base64:' + Buffer.from(x.value as unknown as any[]).toString('base64') : x.value as (string | number | boolean),
            }
            // console.log(y)

            return y
        }
    })

    const schema = (x: DataTransactionEntry) => {
        // console.log('x', JSON.stringify(x, null, ' '))
        // console.log(mapType(x.value, x.type)[1])
        // console.log(mapType(x.value, x.type)[2](x.value))
        return concat(LEN(SHORT)(STRING)(x.key), [mapType(x.value, x.type)[1]], mapType(x.value, x.type)[2](x.value))
    }
    let computedFee
    if (version < 2) {
        // console.log([mapType(x.value)[1]])
        let bytes = concat(
            BYTE(TRANSACTION_TYPE.DATA),
            BYTE(1),
            BASE58_STRING(senderPublicKey),
            COUNT(SHORT)(schema)(dataEntriesWithTypes),
            LONG(_timestamp)
        )

        computedFee = (Math.floor(1 + (bytes.length  - 1) / 1024) * 100000)
    } else {
        let protoEntries = dataEntriesWithTypes.map(dataEntryToProto)
        let dataBytes = wavesProto.waves.DataTransactionData.encode({data: protoEntries}).finish()
        computedFee = (Math.ceil(dataBytes.length / 1024) * 100000)
    }


    const tx: DataTransaction & WithId & WithProofs= {
        type,
        version,
        senderPublicKey,
        fee: fee(paramsOrTx, computedFee),
        timestamp: _timestamp,
        proofs: paramsOrTx.proofs || [],
        chainId: networkByte(paramsOrTx.chainId, 87),
        id: '',
        data: dataEntriesWithTypes,
    }

    validate.data(tx)

    const bytes1 = version > 1 ? txToProtoBytes(tx) : binary.serializeTx(tx)

    seedsAndIndexes.forEach(([s, i]) => addProof(tx, signBytes(s, bytes1), i))
    tx.id = base58Encode(blake2b(bytes1))

    return tx
}
