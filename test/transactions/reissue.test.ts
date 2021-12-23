import {publicKey} from '@waves/ts-lib-crypto'
import {reissue} from '../../src'
import {
    checkBinarySerializeDeserialize,
    checkProtoSerializeDeserialize,
    errorMessageByTemplate,
    validateTxSignature
} from '../../test/utils'
import {reissueMinimalParams} from '../minimalParams'
import {reissueTx} from "./expected/proto/reissue.tx";
import {reissueBinaryTx} from "./expected/binary/reissue.tx";

describe('reissue', () => {

    const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8';

    it('should build from minimal set of params', () => {
        const tx = reissue({...reissueMinimalParams} as any, stringSeed);
        expect(tx).toMatchObject({...reissueMinimalParams, fee: 100000, chainId: 87})
    })


    it('Should get correct signature', () => {
        const tx = reissue({...reissueMinimalParams}, stringSeed);
        expect(validateTxSignature(tx, 2)).toBeTruthy()
    });

    it('Should get correct multiSignature', () => {
        const stringSeed2 = 'example seed 2';
        const tx = reissue({...reissueMinimalParams}, [null, stringSeed, null, stringSeed2]);
        expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy();
        expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
    });

    it('Should create with zero fee', () => {
        const tx = reissue({...reissueMinimalParams, fee: 0} as any, stringSeed);
        expect(tx.fee).toEqual(0)
    });

    it('Should not create with negative fee', () => {
        expect(() => reissue({...reissueMinimalParams, fee: -1}, stringSeed))
            .toThrowError(errorMessageByTemplate('fee', -1))
    });

    it('Should create with custom fee', () => {
        const tx = reissue({...reissueMinimalParams, fee: 12345}, stringSeed);
        expect(tx.fee).toEqual(12345)
    });

    it('Should not create with zero quantity', () => {
        expect(() => reissue({...reissueMinimalParams, quantity: 0}, stringSeed))
            .toThrowError(errorMessageByTemplate('quantity', 0))
    });

    it('Should not create with negative quantity', () => {
        expect(() => reissue({...reissueMinimalParams, quantity: -1}, stringSeed))
            .toThrowError(errorMessageByTemplate('quantity', -1))
    })

    it('Should not create with empty assetId', () => {
        expect(() => reissue({...reissueMinimalParams, assetId: ''}, stringSeed))
            .toThrowError(errorMessageByTemplate('assetId', ''))
    })

});

describe('serialize/deserialize reissue proto tx', () => {

    Object.entries(reissueTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes});
        }))

});

describe('serialize/deserialize reissue binary proto tx', () => {

    Object.entries(reissueBinaryTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkBinarySerializeDeserialize({Json: Json, Bytes: Bytes});
        }))

});
