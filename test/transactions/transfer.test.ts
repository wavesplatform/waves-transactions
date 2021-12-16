import {base16Encode, base64Decode, publicKey, verifySignature} from '@waves/ts-lib-crypto'
import {sponsorship, transfer} from '../../src'
import {checkProtoSerializeDeserialize, deleteProofsAndId, validateTxSignature} from '../../test/utils'
import {sponsorshipMinimalParams, transferMinimalParams} from '../minimalParams'
import {transferTx} from "./expected/proto/transfer.tx";

describe('transfer', () => {

  const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

  const privateKey = {privateKey: 'YkoCJDT4eLtCv5ynNAc4gmZo8ELM9bEbBXsEtGTWrCc'}
  it('should build from minimal set of params', () => {
    const tx = transfer({ ...transferMinimalParams } , stringSeed)
    expect(tx).toMatchObject({ ...transferMinimalParams })
  })


  it('Should get correct signature', () => {
    const tx = transfer({ ...transferMinimalParams }, stringSeed)
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should get correct signature via private key', () => {
    const tx = transfer({ ...transferMinimalParams }, privateKey)
    expect(validateTxSignature(tx, 2)).toBeTruthy()
  })

  it('Should get correct multiSignature', () => {
    const stringSeed2 = 'example seed 2'
    const tx = transfer({ ...transferMinimalParams }, [null, stringSeed, null, stringSeed2])

    expect(validateTxSignature(tx, 2, 1, publicKey(stringSeed))).toBeTruthy()
    expect(validateTxSignature(tx, 2, 3, publicKey(stringSeed2))).toBeTruthy()
  })

  it('Should build with correct fee', () => {
    const tx = transfer({ ...transferMinimalParams } , stringSeed)
     expect(tx.fee).toEqual(100000)
  })

  it('Should build with correct feeAssetId', () => {
    const faId = "DbAik7g5NQcqTPPTiZnr97w4c6jjuahwjeDtTB7tJuQv"
    const tx = transfer({ ...transferMinimalParams, feeAssetId: faId} , stringSeed)
    expect(tx.feeAssetId).toEqual(faId)
  })

  it('Should build with correct attachment', () => {
    const att = "3vrgtyozxuY88J9RqMBBAci2UzAq9DBMFTpMWLPzMygGeSWnD7k"
    const tx = transfer({ ...transferMinimalParams, attachment: att } , stringSeed)
    expect(tx.attachment).toEqual(att)
  })

  it('Should build with null attachment', () => {
    const att = ""
    const tx = transfer({ ...transferMinimalParams, attachment: att } , stringSeed)
    expect(tx.attachment).toEqual(att)
  })

  // fixme?
  it('Should build with zero fee', () => {
    const tx = transfer({ ...transferMinimalParams, fee: 0 } , stringSeed)
    expect(tx.fee).toEqual(0)
  })

  it('Should not create with negative fee', () => {
    expect(() =>transfer({ ...transferMinimalParams, fee: -1 }, stringSeed))
        .toThrowError('tx "fee", has wrong data: -1. Check tx data.')
    //const tx = transfer({ ...transferMinimalParams, fee: -1 } , stringSeed)
    //expect(tx.fee).toEqual(-1)
  })

  it('Should create with minimal fee', () => {
    const tx = transfer({ ...transferMinimalParams} , stringSeed)
    expect(tx.fee).toEqual(100000)
  })

});

describe('serialize/deserialize transfer tx', () => {

  Object.entries(transferTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes});
      }))

});
