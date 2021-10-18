import { publicKey } from '@waves/ts-lib-crypto'
import { alias } from '../../src'
import { aliasMinimalParams } from '../minimalParams'
import { protoBytesToTx, txToProtoBytes } from '../../src/proto-serialize'
import { validateTxSignature } from '../../test/utils'

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

  it('Should build with zero fee', () => {
    const tx = alias({ ...aliasMinimalParams, fee: 0 }, stringSeed)
    expect(tx).toMatchObject({ ...aliasMinimalParams })
  })

  it('Should build with negative fee', () => {
    const tx = alias({ ...aliasMinimalParams, fee: 0 }, stringSeed)
    expect(tx).toMatchObject({ ...aliasMinimalParams })
  })

  it('Should build with minimal alias name', () => {
    const tx = alias({ ...aliasMinimalParams, alias: "west"}, stringSeed)
    expect(tx.alias).toEqual("west")
  })

  it('Should build with extra minimal alias name', () => {
    const tx = alias({ ...aliasMinimalParams, alias: "pip"}, stringSeed)
    expect(tx.alias).toEqual("pip")
  })

  it('Should build with maximal alias name', () => {
    const tx = alias({ ...aliasMinimalParams, alias: "fordmersedesbmwtoyotasuzukiraf"}, stringSeed)
    expect(tx.alias).toEqual("fordmersedesbmwtoyotasuzukiraf")
  })

  it('Should build with extra maximal alias name', () => {
    const tx = alias({ ...aliasMinimalParams, alias: "fordmersedesbmwtoyotasuzukiraff"}, stringSeed)
    expect(tx.alias).toEqual("fordmersedesbmwtoyotasuzukiraff")
  })
})
