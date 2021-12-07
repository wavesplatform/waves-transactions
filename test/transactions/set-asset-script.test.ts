import { publicKey, } from '@waves/ts-lib-crypto'
import {reissue, setAssetScript} from '../../src'
import {checkSerializeDeserialize, validateTxSignature} from '../../test/utils'
import {setAssetScriptTx} from "./expected/set-asset-script.tx";
import {reissueMinimalParams} from "../minimalParams";

describe('setAssetScript', () => {

  const seed = 'test seed'
  const seed2 = 'test seed 2'
  const compiledContract = 'AQQAAAALYWxpY2VQdWJLZXkBAAAAID3+K0HJI42oXrHhtHFpHijU5PC4nn1fIFVsJp5UWrYABAAAAAlib2JQdWJLZXkBAAAAIBO1uieokBahePoeVqt4/usbhaXRq+i5EvtfsdBILNtuBAAAAAxjb29wZXJQdWJLZXkBAAAAIOfM/qkwkfi4pdngdn18n5yxNwCrBOBC3ihWaFg4gV4yBAAAAAthbGljZVNpZ25lZAMJAAH0AAAAAwgFAAAAAnR4AAAACWJvZHlCeXRlcwkAAZEAAAACCAUAAAACdHgAAAAGcHJvb2ZzAAAAAAAAAAAABQAAAAthbGljZVB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJYm9iU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWJvYlB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAMY29vcGVyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAIFAAAADGNvb3BlclB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIJAABkAAAAAgUAAAALYWxpY2VTaWduZWQFAAAACWJvYlNpZ25lZAUAAAAMY29vcGVyU2lnbmVkAAAAAAAAAAACVateHg=='

  it('Should generate correct signed setAssetScript transaction', () => {
    const txParams = { script: compiledContract, assetId: '' }
    const signedTx = setAssetScript(txParams, seed)

    expect(validateTxSignature(signedTx, 1)).toBe(true)
  })

  it('Should generate correct signed setAssetScript transaction with multiple signers via array', () => {
    const txParams = { script: 'AQIDBA==', assetId: '' }
    const signedTx = setAssetScript(txParams, [null, seed, seed2])

    expect(signedTx.proofs[0]).toEqual('')
    expect(signedTx.script).toEqual('base64:AQIDBA==')
    expect(validateTxSignature(signedTx, 1, 1)).toBe(true)
    expect(validateTxSignature(signedTx, 1, 2, publicKey(seed2))).toBe(true)
  })

  it('Should generate correct signed setAssetScript transaction with multiple signers via object', () => {
    const txParams = { script: compiledContract, assetId: '' }
    const signedTx = setAssetScript(txParams, { '1': seed, '2': seed2 })

    expect(signedTx.proofs[0]).toEqual('')
    expect(validateTxSignature(signedTx, 1, 1, publicKey(seed))).toBe(true)
    expect(validateTxSignature(signedTx, 1, 2, publicKey(seed2))).toBe(true)
  })


  it('Should generate correct setAssetScript transaction without seed', () => {
    const txParams = { script: compiledContract, senderPublicKey: publicKey(seed), assetId: '' }
    const tx = setAssetScript(txParams,)

    expect(tx.script).toEqual('base64:' + txParams.script)
    expect(tx.senderPublicKey).toEqual(publicKey(seed))
  })

  it('Should throw on undefined script', () => {
    const txParams = {}
    expect(() => setAssetScript(txParams as any, seed)).toThrow('Asset script cannot be empty')
  })

  it('Should handle incorrect keys in seedObject', () => {
    const txParams = { script: compiledContract, assetId: '' }
    const signedTx = setAssetScript(txParams, { 'asd1': seed, '2': seed2 } as any)

    expect(signedTx.proofs[0]).toEqual('')
    expect(signedTx.proofs[1]).toEqual('')
    expect(validateTxSignature(signedTx, 1, 2, publicKey(seed2))).toBe(true)
  })

  //fixme?
  it('Should generate correct signed setAssetScript transaction with zero fee', () => {
    const txParams = { script: compiledContract, assetId: '', fee: 0 }
    const signedTx = setAssetScript(txParams, seed)

    expect(signedTx.fee).toEqual(0)
  })

  it('Should not generate correct signed setAssetScript transaction with negative fee', () => {
    expect(() =>setAssetScript({script: compiledContract, assetId: '', fee: -1 }, seed))
        .toThrowError('tx "fee", has wrong data: "-1". Check tx data.')
    //const txParams = { script: compiledContract, assetId: '', fee: -1 }
    //const signedTx = setAssetScript(txParams, seed)

    //expect(signedTx.fee).toEqual(-1)
  })

  it('Should generate correct signed setAssetScript transaction with minimal fee', () => {
    const txParams = { script: compiledContract, assetId: '', fee: 100000 }
    const signedTx = setAssetScript(txParams, seed)

    expect(signedTx.fee).toEqual(100000)
  })

});

describe('serialize/deserialize set asset script tx', () => {

  Object.entries(setAssetScriptTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkSerializeDeserialize({Json: Json, Bytes: Bytes});
      }))

});
