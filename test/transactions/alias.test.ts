import {base16Encode, base64Decode, publicKey} from '@waves/ts-lib-crypto'
import { alias } from '../../src'
import { aliasMinimalParams } from '../minimalParams'
import { protoBytesToTx, txToProtoBytes } from '../../src/proto-serialize'
import {checkSerializeDeserialize, deleteProofsAndId, validateTxSignature} from '../../test/utils'
import {aliasTx} from "./expected/alias.tx";


describe('alias', () => {

  const stringSeed = 'adsa'
  const privateKey = {privateKey: 'YkoCJDT4eLtCv5ynNAc4gmZo8ELM9bEbBXsEtGTWrCc'}

  it('should build from minimal set of params', () => {

    const tx = alias({ ...aliasMinimalParams }, stringSeed)
    const bytes = txToProtoBytes(tx)
    const parsed = protoBytesToTx(bytes)
    expect(tx).toMatchObject({ ...aliasMinimalParams })
  })

  it('should build from minimal set of params with additional properties', () => {
    const tx = alias({ ...aliasMinimalParams, a: 10000 } as any, stringSeed)
    expect(tx).toMatchObject({ ...aliasMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = alias({ ...aliasMinimalParams }, stringSeed)
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should sign already signed', () => {
    let tx = alias({ ...aliasMinimalParams }, stringSeed)
    tx = alias(tx, stringSeed)
    expect(validateTxSignature(tx, 2, 1)).toBeTruthy()
  })

  it('Should get correct signature with private key', () => {
    let tx = alias({ ...aliasMinimalParams }, privateKey)
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = alias({ ...aliasMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
  })

  it('Should build from minimal set of params and correct fee', () => {
    const tx = alias({ ...aliasMinimalParams }, stringSeed)
    expect(tx.fee).toEqual(100000)
  })

  //fixme?
  it('Should create with zero fee', () => {
    const tx = alias({ ...aliasMinimalParams, fee: 0 }, stringSeed)
    expect(tx.fee).toEqual(0)
    //expect(tx).toThrowError("tx \"alias\", has wrong data: \"0\". Check tx data.")
    //expect(tx).toMatchObject({ ...aliasMinimalParams })
  })

  it('Should not create with negative fee', () => {
    expect(() =>alias({ ...aliasMinimalParams, fee: -1}, stringSeed))
        .toThrowError('tx "fee", has wrong data: "-1". Check tx data.')
    //const tx = alias({ ...aliasMinimalParams, fee: -1 }, stringSeed)
    //expect(tx.fee).toEqual(-1)
  })

  it('Should create with minimal alias name', () => {
    const tx = alias({ ...aliasMinimalParams, alias: "west"}, stringSeed)
    expect(tx.alias).toEqual("west")
  })

  it('Should not create with extra minimal alias name', () => {
    expect(() =>alias({ ...aliasMinimalParams, alias: "abc"}, stringSeed))
        .toThrowError('tx "alias", has wrong data: "abc". Check tx data.')
  })

  it('Should build with maximal alias name', () => {
    const tx = alias({ ...aliasMinimalParams, alias: "abcdefghijklmnoprstquvwxyztest"}, stringSeed)
    expect(tx.alias).toEqual("abcdefghijklmnoprstquvwxyztest")
  })

  it('Should not create with extra maximal alias name', () => {
    expect(() =>alias({ ...aliasMinimalParams, alias: "abcdefghijklmnoprstquvwxyztestA"}, stringSeed))
        .toThrowError('tx "alias", has wrong data: "abcdefghijklmnoprstquvwxyztestA". Check tx data.')
  })
});

describe('serialize/deserialize alias tx', () => {

  Object.entries(aliasTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkSerializeDeserialize({Json: Json, Bytes: Bytes});
      }))

});
