import {base64Encode, publicKey} from '@waves/ts-lib-crypto'
import {broadcast, cancelLease, data, IDataParams, libs, makeTxBytes, WithId} from '../../src'
import {txToProtoBytes} from '../../src/proto-serialize'
import {
    checkBinarySerializeDeserialize,
    checkProtoSerializeDeserialize,
    errorMessageByTemplate,
    rndString,
    validateTxSignature
} from '../../test/utils'
import {cancelLeaseMinimalParams, dataMinimalParams} from '../minimalParams'
import {binary} from '@waves/marshall'
import {base64Decode} from '@waves/ts-lib-crypto/conversions/base-xx'
import {dataTx} from './expected/proto/data.tx'
import {dataBinaryTx} from './expected/binary/data.tx'


describe('data', () => {

    const senderPk = {privateKey: 'Ct524rFrsuNZV3sUq2PfV84edzNK6AyA2i7qPHuyF63V'}
    const testChainId = 'I'
    const timestamp = 1600000000000
    const fee = 100000

    test.each([
        [
            [{key: 'int', value: -1}, {key: 'str', value: 'string'}, {key: 'bool', value: true}, {
                key: 'bin',
                type: 'binary',
                value: 'base64:YWxpY2U=',
            }],
            1,
            base64Decode('DAEOfDELVTFkTjXX6NQIecrcVDMzucL6GfiwihJh+rt7SAAEAANpbnQA//////////8AA3N0cgMABnN0cmluZwAEYm9vbAEBAANiaW4CAAVhbGljZQAAAXSHboAAAAAAAAABhqA='),
        ],
        [
            [{key: 'int', value: -1}, {key: 'str', value: 'string'}, {key: 'bool', value: true}, {
                key: 'bin',
                type: 'binary',
                value: 'base64:YWxpY2U=',
            }],
            2,
            base64Decode('CEkSIA58MQtVMWRONdfo1Ah5ytxUMzO5wvoZ+LCKEmH6u3tIGgQQoI0GIICAurvILigCggc5ChAKA2ludFD///////////8BCg0KA3N0cmoGc3RyaW5nCggKBGJvb2xYAQoMCgNiaW5iBWFsaWNl'),
        ],
        [
            [{key: 'int', value: 0}, {key: 'str', value: 'string'}, {key: 'bool', value: false}, {
                key: 'bin',
                value: Uint8Array.from([1, 2, 3, 4]),
            }],
            1,
            base64Decode('DAEOfDELVTFkTjXX6NQIecrcVDMzucL6GfiwihJh+rt7SAAEAANpbnQAAAAAAAAAAAAAA3N0cgMABnN0cmluZwAEYm9vbAEAAANiaW4CAAQBAgMEAAABdIdugAAAAAAAAAGGoA=='),
        ],
        [
            [{key: 'int', value: 0}, {key: 'str', value: 'string'}, {key: 'bool', value: false}, {
                key: 'bin',
                value: Uint8Array.from([1, 2, 3, 4]),
            }],
            2,
            base64Decode('CEkSIA58MQtVMWRONdfo1Ah5ytxUMzO5wvoZ+LCKEmH6u3tIGgQQoI0GIICAurvILigCggcvCgcKA2ludFAACg0KA3N0cmoGc3RyaW5nCggKBGJvb2xYAAoLCgNiaW5iBAECAwQ='),
        ],
        [
            [{key: 'null', value: null}],
            2,
            base64Decode('CEkSIA58MQtVMWRONdfo1Ah5ytxUMzO5wvoZ+LCKEmH6u3tIGgQQoI0GIICAurvILigCggcICgYKBG51bGw='),
        ],
        [
            [{key: 'null', value: null}, {key: 'str', value: 'string'}],
            2,
            base64Decode('CEkSIA58MQtVMWRONdfo1Ah5ytxUMzO5wvoZ+LCKEmH6u3tIGgQQoI0GIICAurvILigCggcXCgYKBG51bGwKDQoDc3RyagZzdHJpbmc='),
        ],
    ])('check serialization for %o, tx version: %i', (dataEntries, version, expectedBytes) => {
        const tx = data({
            data: dataEntries,
            chainId: testChainId,
            timestamp: timestamp,
            version: version,
            fee: fee,
        } as any, senderPk)
        const bytes = tx.version > 1 ? txToProtoBytes(tx) : binary.serializeTx(tx)
        expect(bytes).toEqual(expectedBytes)
    })

    test.each([
        [[{key: 'bin1', value: Array(100).fill(1)}], 1, 100000],
        [[{key: 'bin2', value: Array(100).fill(1)}], 2, 100000],
        [[{key: 'bin3', value: Array(1000).fill(1)}], 1, 200000],
        [[{key: 'bin4', value: Array(1000).fill(1)}], 2, 100000],
        [[{key: 'bin5', value: Array(10000).fill(1)}], 1, 1000000],
        [[{key: 'bin6', value: Array(10000).fill(1)}], 2, 1000000],
        [[{key: 'bin7', type: 'binary', value: base64Encode(Array(10000).fill(1))}], 1, 1000000],
        [[{key: 'bin8', type: 'binary', value: base64Encode(Array(10000).fill(1))}], 1, 1000000],
        [Array(10).fill({key: 'bin', value: Array(10000).fill(1)}), 1, 9800000],
        [Array(10).fill({key: 'bin', value: Array(10000).fill(1)}), 2, 9800000],
        [Array(15).fill({key: 'bin', value: Array(10000).fill(1)}), 1, 14700000],
        [Array(15).fill({key: 'bin', value: Array(10000).fill(1)}), 2, 14700000],
    ])('check fee calculation', (dataEntries, version, expectedFee) => {
        const tx = data({
            data: dataEntries,
            chainId: testChainId,
            timestamp: timestamp,
            version: version,
        } as any, senderPk)
        expect(tx.fee).toEqual(expectedFee)
    })

    test.each([
        [null, 1, '["data should be array"]'],
        [undefined, 1, '["data should be array"]'],
        [{key: 'str', value: 'string'}, 2, '["data should be array"]'],
        [[{
            key: 'bin',
            value: null
        }], 1, 'The value of the "value" field can only be null in a version greater than 1.'],
        [[{
            key: 'main',
            type: 'integer',
            value: '3PAZv9tgK1PX7dKR7b4kchq5qdpUS3G5sYT|3PJ6iR5X1PT2rZcNmbqByKuh7k8mtj5wVGw|3P3NVrhiyHBc4oUWNhtZRnJA5uLX9n39TK9|3PCobfdpn4djVBG1Z3Ubek79kKcEiWYjrDv'
        }], 1, ''],
        [[{
            key: 'bin',
            value: 'false',
            type: 'boolean',
        }], 1, "type \"boolean\" does not match value \"false\"(string)"],
    ])('should throw on invalid data', (dataEntries, version, expectedError) => {
        const tx = () => data({
            data: dataEntries,
            chainId: testChainId,
            timestamp: timestamp,
            version: version,
        } as any, senderPk)
        expect(tx).toThrow(expectedError)
    })

    let sMax = "1234567"
    const smenc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    for (let i = 0; i < 630; i++) {
        sMax += smenc
    }

    it('should get correct signature', () => {
        const tx = data({...dataMinimalParams}, senderPk)
        expect(validateTxSignature(tx, 1)).toBeTruthy()
    })

    it('should get correct multiSignature', () => {
        const stringSeed2 = 'example seed 2'
        const tx = data({...dataMinimalParams}, [null, senderPk, null, stringSeed2])
        expect(validateTxSignature(tx, 1, 1, publicKey(senderPk))).toBeTruthy()
        expect(validateTxSignature(tx, 1, 3, publicKey(stringSeed2))).toBeTruthy()
    })

    it('should get correct default values', () => {
        const expectedTimestamp = new Date().getTime()
        const tx = data({...dataMinimalParams} as any, senderPk)

        expect(tx.data.length).toEqual(3)
        expect(tx.version).toEqual(2)
        expect(tx.timestamp - expectedTimestamp).toBeLessThan(100)
        expect(tx.type).toEqual(12)
    })


    it('Should create data with minimal fee', () => {
        const tx = data({...dataMinimalParams, fee: 100000}, senderPk)
        expect(tx.fee).toEqual(100000)
    })

    it('Should not create data with zero fee', () => {
        const tx = data({...dataMinimalParams, fee: 0}, senderPk)
        expect(tx.fee).toEqual(0)
    })

    it('Should not create data with negative fee', () => {
        expect(() => data({...dataMinimalParams, fee: -1}, senderPk))
            .toThrowError(errorMessageByTemplate('fee', -1))
    })

    const maxKey = rndString(400)
    const extraMaxKey = rndString(401)
    const testMaxKeyParams = [
        {
            key: maxKey,
            type: 'binary',
            value: 'base64:YXNkYQ==',
        }, {
            key: maxKey,
            type: 'boolean',
            value: true,
        }, {
            key: maxKey,
            type: 'integer',
            value: 1234567890,
        }, {
            key: maxKey,
            type: 'string',
            value: "Test Test123 Test321",
        }
    ]


    const testExtraMaxKeyParams = [
        {
            key: extraMaxKey,
            type: 'binary',
            value: 'base16:52696465',
        }, {
            key: extraMaxKey,
            type: 'boolean',
            value: false,
        }, {
            key: extraMaxKey,
            type: 'integer',
            value: 223322,
        }, {
            key: extraMaxKey,
            type: 'string',
            value: "Test Test123 Test321 TEST",
        }
    ]


    it('Should create data with max key', () => {
        const tx = data({data: testMaxKeyParams, chainId: 83, fee: 1000000, version: 2} as any, senderPk)
        //expect(tx).toMatchObject({...testMaxKeyParams})
        expect(tx.data[1].value).toEqual(true)
        expect(tx.data[2].value).toEqual(1234567890)
        expect(tx.data[3].value).toEqual("Test Test123 Test321")
    })

    it('Should not create data with key > 400', () => {
        const tx = data({data: testExtraMaxKeyParams, chainId: 83, fee: 1000000, version: 2} as any, senderPk)
        expect(tx.data[1].value).toEqual(false)
        expect(tx.data[2].value).toEqual(223322)
        expect(tx.data[3].value).toEqual("Test Test123 Test321 TEST")

        /*expect(() =>data({data: testExtraMaxKeyParams, chainId: 83, fee: 1000000, version: 2}as any, senderPk))
            .toThrowError(     'tx "key", has wrong data: ' + extraMaxKey + '. Check tx data.') */
    })

    const testMaxValueParams = [
        {
            key: maxKey,
            type: 'string',
            value: sMax,
        }, {
            key: extraMaxKey,
            type: 'boolean',
            value: false,
        }, {
            key: extraMaxKey,
            type: 'integer',
            value: 223322,
        }, {
            key: extraMaxKey,
            type: 'string',
            value: "Test Test123 Test321 TEST",
        }
    ]

    it('Should get data with max value', () => {
        const tx = data({data: testMaxValueParams, chainId: 83, fee: 1000000, version: 2} as any, senderPk)
        expect(tx.data[0].value).toEqual(sMax)
    })
})

describe('serialize/deserialize data tx', () => {

    Object.entries(dataTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes})
        }))

})

describe('serialize/deserialize data binary tx', () => {
    Object.entries(dataBinaryTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkBinarySerializeDeserialize({Json: Json, Bytes: Bytes})
        }))
})
