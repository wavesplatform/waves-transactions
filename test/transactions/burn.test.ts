import {base16Encode, base64Decode, publicKey} from '@waves/ts-lib-crypto'
import {alias, burn} from '../../src'
import {aliasMinimalParams, burnMinimalParams} from '../minimalParams'
import {checkProtoSerializeDeserialize, deleteProofsAndId, validateTxSignature} from '../../test/utils'
import {burnTx} from "./expected/proto/burn.tx";


describe('burn', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  it('should build from minimal set of params', () => {
    const tx = burn({ ...burnMinimalParams } as any, stringSeed)
    expect(tx).toMatchObject({ ...burnMinimalParams })
    // const bytes = serializeToProtoBytes(tx)
    // const parsed = parseProtoBytes(bytes)
    const a = 20
  })


  it('Should get correct signature', () => {
    const tx = burn({ ...burnMinimalParams }, stringSeed)
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should sign already signed', () => {
    let tx = burn({ ...burnMinimalParams }, stringSeed)
    tx = burn(tx, stringSeed)
    expect(validateTxSignature(tx, 2, 1)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = burn({ ...burnMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
  })

  it('Should create with zero amount', () => {
    const tx = burn({ ...burnMinimalParams, amount: 0 }, stringSeed)
    expect(tx.amount).toEqual(0)
  })

  it('Should not create with negative amount', () => {
    expect(() =>burn({ ...burnMinimalParams, amount: -1}, stringSeed))
        .toThrowError('tx "amount", has wrong data: -1. Check tx data.')
    //const tx = burn({ ...burnMinimalParams, amount: -1 }, stringSeed)
    //expect(tx.amount).toEqual(-1)
  })

  it('Should create with minimal fee', () => {
    const tx = burn({ ...burnMinimalParams, fee: 100000 }, stringSeed)
    expect(tx.fee).toEqual(100000)
  })

  // fixme?
  it('Should create with zero fee', () => {
    const tx = burn({ ...burnMinimalParams, fee: 0 }, stringSeed)
    expect(tx.fee).toEqual(0)
  })

  it('Should not create with negative fee', () => {
    expect(() =>burn({ ...burnMinimalParams, fee: -1}, stringSeed))
        .toThrowError('tx "fee", has wrong data: -1. Check tx data.')
    //const tx = burn({ ...burnMinimalParams, fee: -1 }, stringSeed)
    //expect(tx.fee).toEqual(-1)
  })

});

describe('serialize/deserialize burn tx', () => {

  Object.entries(burnTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes});
      }))

});
