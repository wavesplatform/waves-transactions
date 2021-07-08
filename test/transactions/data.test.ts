import {publicKey} from '@waves/ts-lib-crypto'
import {data, libs, makeTxBytes, WithId} from '../../src'
import {txToProtoBytes} from '../../src/proto-serialize'
import {validateTxSignature} from '../../test/utils'
import {dataMinimalParams} from '../minimalParams'
import {binary} from '@waves/marshall'
import {base64Decode} from '@waves/ts-lib-crypto/conversions/base-xx'
import {TSeedTypes} from '../../src/types'


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
        console.log(makeTxBytes(tx).join(','))
        console.log(makeTxBytes(tx).length)
        const bytes = tx.version > 1 ? txToProtoBytes(tx) : binary.serializeTx(tx)
        expect(bytes).toEqual(expectedBytes)
    })

    test.each([
        [[{key: 'bin', value: Array(100).fill(1)}], 1, 100000],
        [[{key: 'bin', value: Array(100).fill(1)}], 2, 100000],
        [[{key: 'bin', value: Array(1000).fill(1)}], 1, 200000],
        [[{key: 'bin', value: Array(1000).fill(1)}], 2, 100000],
        [[{key: 'bin', value: Array(10000).fill(1)}], 1, 1000000], //todo fix feecalc for v1
        [[{key: 'bin', value: Array(10000).fill(1)}], 2, 1000000],
        [[{key: 'bin', type:'binary', value: libs.crypto.base64Encode(Array(10000).fill(1))}], 1, 1000000],
        [[{key: 'bin', type:'binary', value: Array(10000).fill(1)}], 1, 1000000],
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
        [[{key: 'bin', value: null}], 1, 'Cannot read property'],
    ])('should throw on invalid data', (dataEntries, version, expectedError) => {
        const tx = () => data({
            data: dataEntries,
            chainId: testChainId,
            timestamp: timestamp,
            version: version,
        } as any, senderPk)
        expect(tx).toThrow(expectedError)
    })

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
})
