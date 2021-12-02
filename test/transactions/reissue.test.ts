import { publicKey } from '@waves/ts-lib-crypto'
import { reissue } from '../../src'
import {checkSerializeDeserialize, validateTxSignature} from '../../test/utils'
import { reissueMinimalParams } from '../minimalParams'
import {reissueTx} from "./expected/reissue.tx";

describe('reissue', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = reissue({ ...reissueMinimalParams }as any, stringSeed)
    expect(tx).toMatchObject({ ...reissueMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = reissue({ ...reissueMinimalParams }, stringSeed)
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = reissue({ ...reissueMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
  })

  it('Should build with zero fee', () => {
    const tx = reissue({ ...reissueMinimalParams, fee: 0 }as any, stringSeed)
    expect(tx.fee).toEqual(0)
    //toMatchObject({ ...reissueMinimalParams })
  })

  it('Should build with negative fee', () => {
    const tx = reissue({ ...reissueMinimalParams, fee: -1 }as any, stringSeed)
    expect(tx.fee).toEqual(-1)
  })

  it('Should build with maximal fee', () => {
    const tx = reissue({ ...reissueMinimalParams, fee: '9223372036854775807' }as any, stringSeed)
    expect(tx.fee).toEqual('9223372036854775807')
  })

  it('Should build with minimal fee', () => {
    const tx = reissue({ ...reissueMinimalParams, fee: 100000 }as any, stringSeed)
    expect(tx.fee).toEqual(100000)
    //toMatchObject({ ...reissueMinimalParams })
  })

  it('Should build with minimal quantity', () => {
    const tx = reissue({ ...reissueMinimalParams, quantity: 1 }as any, stringSeed)
    expect(tx.quantity).toEqual(1)
    //toMatchObject({ ...reissueMinimalParams })
  })

  it('Should build with zero quantity', () => {
    const tx = reissue({ ...reissueMinimalParams, quantity: 0 }as any, stringSeed)
    expect(tx.quantity).toEqual(0)
    //toMatchObject({ ...reissueMinimalParams })
  })

  it('Should build with negative quantity', () => {
    const tx = reissue({ ...reissueMinimalParams, quantity: -1 }as any, stringSeed)
    expect(tx.quantity).toEqual(-1)
    //toMatchObject({ ...reissueMinimalParams })
  })

});

describe('serialize/deserialize reissue tx', () => {

  Object.entries(reissueTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkSerializeDeserialize({Json: Json, Bytes: Bytes});
      }))

});
