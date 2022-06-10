import {base64Decode, base64Encode, publicKey} from '@waves/ts-lib-crypto'
import {burn} from '../../src'
import {burnMinimalParams} from '../minimalParams'
import {
    checkBinarySerializeDeserialize,
    checkProtoSerializeDeserialize,
    errorMessageByTemplate,
    validateTxSignature
} from '../../test/utils'
import {burnTx} from "./expected/proto/burn.tx"
import {burnBinaryTx} from "./expected/binary/burn.tx"
import {binary} from '@waves/marshall'


describe('burn', () => {

    const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

    it('should build from minimal set of params', () => {
        const tx = burn({...burnMinimalParams} as any, stringSeed)
        expect(tx).toMatchObject({...burnMinimalParams, fee: 100000, chainId: 87, version: 3})
    })

    it('Should get correct signature', () => {
        const tx = burn({...burnMinimalParams}, stringSeed)
        expect(validateTxSignature(tx, 2)).toBeTruthy()
    })

    it('Should sign already signed', () => {
        let tx = burn({...burnMinimalParams}, stringSeed)
        tx = burn(tx, stringSeed)
        expect(validateTxSignature(tx, 2, 1)).toBeTruthy()
    })

    it('Should get correct multiSignature', () => {
        const stringSeed2 = 'example seed 2'
        const tx = burn({...burnMinimalParams}, [null, stringSeed, null, stringSeed2])
        expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy()
        expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
    })

    it('Should not create with zero amount', () => {
        expect(() => burn({
            ...burnMinimalParams,
            amount: 0
        }, stringSeed)).toThrowError('tx "amount", has wrong data: 0. Check tx data.')
    })

    it('Should create with custom amount', () => {
        const tx = burn({...burnMinimalParams, amount: 50000}, stringSeed)
        expect(tx.amount).toEqual(50000)
    })


    it('Should not create with negative amount', () => {
        expect(() => burn({...burnMinimalParams, amount: -1}, stringSeed))
            .toThrowError(errorMessageByTemplate('amount', -1))
    })

    it('Should create with custom fee', () => {
        const tx = burn({...burnMinimalParams, fee: 12345}, stringSeed)
        expect(tx.fee).toEqual(12345)
    })

    it('Should create with zero fee', () => {
        const tx = burn({...burnMinimalParams, fee: 0}, stringSeed)
        expect(tx.fee).toEqual(0)
    })

    it('Should not create with negative fee', () => {
        expect(() => burn({...burnMinimalParams, fee: -1}, stringSeed))
            .toThrowError(errorMessageByTemplate('fee', -1))
    })

    it('Should not create with empty assetid', () => {
        expect(() => burn({...burnMinimalParams, assetId: ''}, stringSeed))
            .toThrowError(errorMessageByTemplate('assetId', ''))
    })

})

describe('serialize/deserialize burn tx', () => {

    Object.entries(burnTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes})
        }))

})

describe('serialize/deserialize binary burn tx', () => {

    Object.entries(burnBinaryTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkBinarySerializeDeserialize({Json: Json, Bytes: Bytes})
        }))

})
