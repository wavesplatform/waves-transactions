import {base16Decode, base16Encode, base64Decode, base64Encode, publicKey} from '@waves/ts-lib-crypto'
import {alias} from '../../src'
import {aliasMinimalParams} from '../minimalParams'
import {
  checkBinarySerializeDeserialize,
  checkProtoSerializeDeserialize,
  errorMessageByTemplate,
  validateTxSignature
} from '../utils'
import {aliasTx} from "./expected/proto/alias.tx";
import {aliasBinaryTx} from "./expected/binary/alias.tx";
import {binary} from '@waves/marshall'


describe('alias', () => {

  const stringSeed = 'adsa';
  const privateKey = {privateKey: 'YkoCJDT4eLtCv5ynNAc4gmZo8ELM9bEbBXsEtGTWrCc'};

  it('should build from minimal set of params', () => {
    const tx = alias({ ...aliasMinimalParams }, stringSeed);
    expect(tx).toMatchObject({ ...aliasMinimalParams, fee: 100000, chainId: 87 })
  });


  it('Should get correct signature', () => {
    const tx = alias({ ...aliasMinimalParams }, stringSeed);
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  });

  it('Should sign already signed', () => {
    let tx = alias({ ...aliasMinimalParams }, stringSeed);
    tx = alias(tx, stringSeed);
    expect(validateTxSignature(tx, 2, 1)).toBeTruthy()
  });

  it('Should get correct signature with private key', () => {
    let tx = alias({ ...aliasMinimalParams }, privateKey);
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  });

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2';
    const tx = alias({ ...aliasMinimalParams }, [null, stringSeed, null, stringSeed2]);
    expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy();
    expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
  });

  it('Should build from minimal set of params and custom fee', () => {
    const tx = alias({ ...aliasMinimalParams, fee: 12345 }, stringSeed);
    expect(tx.fee).toEqual(12345)
  });

  it('Should create with zero fee', () => {
    const tx = alias({ ...aliasMinimalParams, fee: 0 }, stringSeed);
    expect(tx.fee).toEqual(0)

  });

  it('Should not create with negative fee', () => {
    expect(() =>alias({ ...aliasMinimalParams, fee: -1}, stringSeed))
         .toThrowError(errorMessageByTemplate('fee', -1))
  });

  it('Should create with minimal alias name = 4', () => {
    const tx = alias({ ...aliasMinimalParams, alias: "west"}, stringSeed);
    expect(tx.alias).toEqual("west")
  });

  it('Should not create with alias name <4', () => {
    expect(() =>alias({ ...aliasMinimalParams, alias: "abc"}, stringSeed))
        .toThrowError(errorMessageByTemplate('alias','abc'))
   });

  it('Should build with maximal alias name = 30', () => {
    const tx = alias({ ...aliasMinimalParams, alias: 'this.is_30@symbols-alias_12345'}, stringSeed);
    expect(tx.alias).toEqual("this.is_30@symbols-alias_12345")
  });

  it('Should not create with alias name lenght > 30', () => {
    expect(() =>alias({ ...aliasMinimalParams, alias: "this.is_31@symbols-alias_123456"}, stringSeed))
        .toThrowError(errorMessageByTemplate('alias', 'this.is_31@symbols-alias_123456'))
  })
});

describe('serialize/deserialize alias proto tx', () => {

  Object.entries(aliasTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes});
      }))

});

describe('serialize/deserialize alias binary tx', () => {

  Object.entries(aliasBinaryTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkBinarySerializeDeserialize({Json: Json, Bytes: Bytes});
      }))
});
