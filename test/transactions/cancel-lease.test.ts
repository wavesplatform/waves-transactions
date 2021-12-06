import {
  address,
  base16Encode,
  base58Decode,
  base58Encode,
  base64Decode,
  buildAddress,
  concat,
  publicKey, TBase58, TBinaryIn
} from '@waves/ts-lib-crypto'
import {burn, cancelLease, ICancelLeaseParams, libs} from '../../src'
import {burnMinimalParams, cancelLeaseMinimalParams} from '../minimalParams'
import {checkSerializeDeserialize, deleteProofsAndId, validateTxSignature} from '../../test/utils'
import {cancelLeaseTx} from "./expected/cancel-lease.tx";


describe('cancel-lease', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...cancelLeaseMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, stringSeed)
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should sign already signed', () => {
    let tx = cancelLease({ ...cancelLeaseMinimalParams }, stringSeed)
    tx = cancelLease(tx, stringSeed)
    expect(validateTxSignature(tx, 2, 1)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, [null, stringSeed, null, stringSeed2])

    expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
  })

  const cancelLeaseTestParams = {
    leaseId: "DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr",
    senderPublicKey: "Athtgb7Zm9V6ExyAzAJM1mP57qNAW1A76TmzXdDZDjbt"
  };


  it('Should build from minimal set of params check fee', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams }, stringSeed)
    expect(tx.fee).toEqual(100000)
  })

  it('Should build from minimal params set fee', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams, fee: 500000 }, stringSeed)
    expect(tx.fee).toEqual(500000)
  })

  it('Should create with complex params', () => {
    const tx = cancelLease({ ...cancelLeaseTestParams }, stringSeed)
    expect(tx).toMatchObject({ ...cancelLeaseTestParams })
  })

  // fix me?
  it('Should not create with zero fee', () => {
    const tx = cancelLease({ ...cancelLeaseMinimalParams, fee: 0 }, stringSeed)
    expect(tx.fee).toEqual(100000)
  })

  it('Should not create with negative fee', () => {
    expect(() =>cancelLease({ ...cancelLeaseMinimalParams, fee: -1}, stringSeed))
        .toThrowError('tx "fee", has wrong data: "-1". Check tx data.')
    //const tx = cancelLease({ ...cancelLeaseMinimalParams, fee: -1 }, stringSeed)
    //expect(tx.fee).toEqual(-1)
  })

});

describe('serialize/deserialize cancel lease tx', () => {

  Object.entries(cancelLeaseTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkSerializeDeserialize({Json: Json, Bytes: Bytes});
      }))

});
