import {publicKey} from '@waves/ts-lib-crypto'
import {cancelLease} from '../../src'
import {cancelLeaseMinimalParams} from '../minimalParams'
import {
  checkBinarySerializeDeserialize,
  checkProtoSerializeDeserialize,
  errorMessageByTemplate,
  validateTxSignature
} from '../../test/utils'
import {cancelLeaseTx} from "./expected/proto/cancel-lease.tx";
import {cancelLeaseBinaryTx} from "./expected/binary/cancel-lease.tx";


describe('cancel-lease', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams } as any, stringSeed);
    expect(tx).toMatchObject({ ...cancelLeaseMinimalParams, version: 3, fee: 100000, chainId: 87})
  })


  it('Should get correct signature', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, stringSeed);
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should sign already signed', () => {
    let tx = cancelLease({ ...cancelLeaseMinimalParams }, stringSeed);
    tx = cancelLease(tx, stringSeed);
    expect(validateTxSignature(tx, 2, 1)).toBeTruthy()
  });

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2';
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, [null, stringSeed, null, stringSeed2]);

    expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy();
    expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
  });


  it('Should build from minimal params set with custom fee', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams, fee: 500000 }, stringSeed);
    expect(tx.fee).toEqual(500000)
  })

  it('Should not create with zero fee', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams, fee: 0 }, stringSeed);
    expect(tx.fee).toEqual(0)
  })

  it('Should not create with negative fee', () => {
    expect(() =>cancelLease({ ...cancelLeaseMinimalParams, fee: -1}, stringSeed))
         .toThrowError(errorMessageByTemplate('fee', -1))
  })

  it('Should not create with empty leaseId', () => {
    expect(() =>cancelLease({ ...cancelLeaseMinimalParams, leaseId: ""}, stringSeed))
        .toThrowError(errorMessageByTemplate('leaseId', ""))
  })


});

describe('serialize/deserialize cancel lease tx', () => {

  Object.entries(cancelLeaseTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes});
      }))

});

describe('serialize/deserialize binary cancel lease tx', () => {

  Object.entries(cancelLeaseBinaryTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkBinarySerializeDeserialize({Json: Json, Bytes: Bytes});
      }))

});