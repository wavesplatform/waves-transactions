import { publicKey, verifySignature } from '@waves/ts-lib-crypto'
import {invokeScript, issue} from '../../src'
import {checkSerializeDeserialize, validateTxSignature} from '../../test/utils'
import {invokeScriptMinimalParams, issueMinimalParams} from '../minimalParams'
import {issueTx} from "./expected/issue.tx";

describe('issue', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'
  const protoBytesMinVersion = 2

  it('should build from minimal set of params', () => {
    const tx = issue({ ...issueMinimalParams }, stringSeed)
    expect(tx).toMatchObject({ ...issueMinimalParams })
  })

  it('should build from minimal set of params with quantity 1', () => {
    const tx = issue({ ...issueMinimalParams, quantity: 1 }, stringSeed)
    expect(tx.quantity).toEqual(1)
  })

  // fix me?
  it('should create from minimal set of params with zero quantity', () => {
    const tx = issue({ ...issueMinimalParams, quantity: 0 }, stringSeed)
    expect(tx.quantity).toEqual(0)
  })

  it('should not create from minimal set of params with negative quantity', () => {
    expect(() =>issue({ ...issueMinimalParams, quantity: -1}, stringSeed))
        .toThrowError('tx "quantity", has wrong data: "-1". Check tx data.')
    //const tx = issue({ ...issueMinimalParams, quantity: -1 }, stringSeed)
    //expect(tx.quantity).toEqual(-1)
  })

  const maxQuantity = '9223372036854775807';
  it('should create from minimal set of params with maximal quantity', () => {
    const tx = issue({ ...issueMinimalParams, quantity: maxQuantity }, stringSeed)
    expect(tx.quantity).toEqual(maxQuantity)
  })

  it('should build with asset script', () => {
    const tx = issue({ ...issueMinimalParams, script:'AQQAAAAHJG1hdGNoMAUAAAACdHgDCQAAAQAAAAIFAAAAByRtYXRjaDACAAAAD0J1cm5UcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAcGPmRSDA==' }, stringSeed)
    expect(tx).toMatchObject({ ...issueMinimalParams })
  })

  it('should correctly sed reissuable and decimals', () => {
    const tx = issue({ ...issueMinimalParams, decimals: 0, reissuable:true}, stringSeed)
    expect(tx).toMatchObject({ decimals: 0, reissuable: true})
  })

  it('Should get correct signature', () => {
    const tx = issue({ ...issueMinimalParams }, stringSeed)

    expect(validateTxSignature(tx, protoBytesMinVersion)).toBeTruthy()    
  })

  it('Should get correct signature of NFT token', () => {
    const tx = issue({
      ...issueMinimalParams,
      quantity: 1,
      decimals: 0
    }, stringSeed)

    expect(validateTxSignature(tx, protoBytesMinVersion)).toBeTruthy()    
  })

  it('Should sign already signed', () => {
    let tx = issue({ ...issueMinimalParams }, stringSeed)
    tx = issue(tx, stringSeed)
    expect(validateTxSignature(tx, protoBytesMinVersion, 1)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = issue({ ...issueMinimalParams }, [null, stringSeed, null, stringSeed2])
    expect(validateTxSignature(tx, protoBytesMinVersion, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, protoBytesMinVersion, 3, publicKey(stringSeed2))).toBeTruthy()
  })

  it('should create correctly with minimal fee', () => {
    const tx = issue({ ...issueMinimalParams, fee: 100000}, stringSeed)
    expect(tx.fee).toEqual(100000)
  })

  // fixme?
  it('should create correctly with zero fee', () => {
    const tx = issue({ ...issueMinimalParams, fee: 0}, stringSeed)
    expect(tx.fee).toEqual(0)
  })

  it('should not create correctly with negative fee', () => {
    expect(() =>issue({ ...issueMinimalParams, fee: -1}, stringSeed))
        .toThrowError('tx "fee", has wrong data: "-1". Check tx data.')
    //const tx = issue({ ...issueMinimalParams, fee: -1}, stringSeed)
    //expect(tx.fee).toEqual(-1)
  })

});

describe('serialize/deserialize issue tx', () => {

  Object.entries(issueTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkSerializeDeserialize({Json: Json, Bytes: Bytes});
      }))

});
