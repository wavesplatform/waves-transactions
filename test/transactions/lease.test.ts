import {publicKey} from '@waves/ts-lib-crypto'
import {lease} from '../../src'
import {checkProtoSerializeDeserialize, errorMessageByTemplate, longMax, validateTxSignature} from '../utils'
import {leaseMinimalParams} from '../minimalParams'
import {leaseTx} from "./expected/proto/lease.tx";

describe('lease', () => {

    const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8';

    it('should build from minimal set of params', () => {
        const tx = lease({...leaseMinimalParams}, stringSeed);
        expect(tx).toMatchObject({...leaseMinimalParams, version: 3, fee: 100000})
    });


    it('Should get correct signature', () => {
        const tx = lease({...leaseMinimalParams}, stringSeed);
        expect(validateTxSignature(tx, 2)).toBeTruthy()
    });


    it('Should sign already signed', () => {
        let tx = lease({...leaseMinimalParams}, stringSeed);
        tx = lease(tx, stringSeed);
        expect(validateTxSignature(tx, 2, 1)).toBeTruthy()
    });

    it('Should get correct multiSignature', () => {
        const stringSeed2 = 'example seed 2';
        const tx = lease({...leaseMinimalParams}, [null, stringSeed, null, stringSeed2]);
        expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy();
        expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
    });

    it('Should create with correct fee', () => {
        const tx = lease({...leaseMinimalParams}, stringSeed);
        expect(tx.fee).toEqual(100000)
    });

    it('Should create with zero fee', () => {
        const tx = lease({...leaseMinimalParams, fee: 0}, stringSeed);
        expect(tx.fee).toEqual(0)
    });

    it('Should not create with negative fee', () => {
        expect(() => lease({...leaseMinimalParams, fee: -1}, stringSeed))
            .toThrowError(errorMessageByTemplate('fee', -1))
    });

    it('Should create with set fee', () => {
        const tx = lease({...leaseMinimalParams, fee: 500000}, stringSeed);
        expect(tx.fee).toEqual(500000)
    });

    it('Should create with set amount', () => {
        const tx = lease({...leaseMinimalParams, amount: 500000}, stringSeed);
        expect(tx.amount).toEqual(500000)
    });

    it('Should create with minimal amount', () => {
        const tx = lease({...leaseMinimalParams, amount: 1}, stringSeed);
        expect(tx.amount).toEqual(1)
    });

    it('Should create with zero amount', () => {
        expect(() => lease({...leaseMinimalParams, amount: 0}, stringSeed))
            .toThrowError(errorMessageByTemplate('amount', 0))
    });

    it('Should not create with negative amount', () => {
        expect(() => lease({...leaseMinimalParams, amount: -1}, stringSeed))
            .toThrowError('tx "amount", has wrong data: -1. Check tx data.')
    });


    it('Should build with maximal amount and fee', () => {
        const tx = lease({...leaseMinimalParams, amount: longMax, fee: longMax}, stringSeed);
        expect(tx.amount).toEqual(longMax);
        expect(tx.fee).toEqual(longMax)
    });

    it('Should build with minimal amount and fee', () => {
        const tx = lease({...leaseMinimalParams, amount: 1, fee: 100000}, stringSeed);
        expect(tx.amount).toEqual(1);
        expect(tx.fee).toEqual(100000)
    });

    it('Should build with alias', () => {
        const tx = lease({...leaseMinimalParams, recipient: 'alias:T:test'} as any, stringSeed);
        expect(tx.recipient).toEqual('alias:T:test')
    })

});

describe('serialize/deserialize lease tx', () => {

    Object.entries(leaseTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes});
        }))

});

