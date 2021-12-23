import {publicKey,} from '@waves/ts-lib-crypto'
import {setAssetScript} from '../../src'
import {
  checkBinarySerializeDeserialize,
  checkProtoSerializeDeserialize,
  errorMessageByTemplate,
  validateTxSignature
} from '../../test/utils'
import {setAssetScriptTx} from "./expected/proto/set-asset-script.tx";
import {setAssetScriptMinimalParams} from "../minimalParams";
import {setAssetScriptBinaryTx} from "./expected/binary/set-asset_script.tx";

describe('setAssetScript', () => {

  const seed = 'test seed'
  const seed2 = 'test seed 2'
  const compiledContract = 'AQQAAAALYWxpY2VQdWJLZXkBAAAAID3+K0HJI42oXrHhtHFpHijU5PC4nn1fIFVsJp5UWrYABAAAAAlib2JQdWJLZXkBAAAAIBO1uieokBahePoeVqt4/usbhaXRq+i5EvtfsdBILNtuBAAAAAxjb29wZXJQdWJLZXkBAAAAIOfM/qkwkfi4pdngdn18n5yxNwCrBOBC3ihWaFg4gV4yBAAAAAthbGljZVNpZ25lZAMJAAH0AAAAAwgFAAAAAnR4AAAACWJvZHlCeXRlcwkAAZEAAAACCAUAAAACdHgAAAAGcHJvb2ZzAAAAAAAAAAAABQAAAAthbGljZVB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJYm9iU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWJvYlB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAMY29vcGVyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAIFAAAADGNvb3BlclB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIJAABkAAAAAgUAAAALYWxpY2VTaWduZWQFAAAACWJvYlNpZ25lZAUAAAAMY29vcGVyU2lnbmVkAAAAAAAAAAACVateHg=='

  it('Should generate correct signed setAssetScript transaction', () => {
    const signedTx = setAssetScript( { ...setAssetScriptMinimalParams }, seed);
    expect(validateTxSignature(signedTx, 1)).toBe(true)
  })

  it('Should generate correct signed setAssetScript transaction with multiple signers via array', () => {
    const signedTx = setAssetScript({ ...setAssetScriptMinimalParams }, [null, seed, seed2]);

    expect(signedTx.proofs[0]).toEqual('')
    expect(signedTx.script).toEqual(setAssetScriptMinimalParams.script);
    expect(validateTxSignature(signedTx, 1, 1)).toBe(true);
    expect(validateTxSignature(signedTx, 1, 2, publicKey(seed2))).toBe(true)
  })

  it('Should generate correct signed setAssetScript transaction with multiple signers via object', () => {
    const txParams = { ...setAssetScriptMinimalParams }
    const signedTx = setAssetScript(txParams, { '1': seed, '2': seed2 })

    expect(signedTx.proofs[0]).toEqual('')
    expect(validateTxSignature(signedTx, 1, 1, publicKey(seed))).toBe(true)
    expect(validateTxSignature(signedTx, 1, 2, publicKey(seed2))).toBe(true)
  })


  it('Should generate correct setAssetScript transaction without seed', () => {
    const txParams = { ...setAssetScriptMinimalParams, senderPublicKey: publicKey(seed)}
    const tx = setAssetScript(txParams,)

    expect(tx.script).toEqual(txParams.script)
    expect(tx.senderPublicKey).toEqual(publicKey(seed))
  })

  it('Should throw on undefined script', () => {
    const txParams = {assetId: 'syXBywr2HVY7wxqkaci1jKY73KMpoLh46cp1peJAZNJ'}
    expect(() => setAssetScript(txParams as any, seed)).toThrow('Asset script cannot be empty')
  });

  it('Should throw on empty asssetId', () => {
    const txParams = {...setAssetScriptMinimalParams, assetId: ''}
    expect(() => setAssetScript(txParams as any, seed)).toThrow(errorMessageByTemplate('assetId', ''))
  });

  it('Should handle incorrect keys in seedObject', () => {
    const txParams = { script: compiledContract, assetId: 'syXBywr2HVY7wxqkaci1jKY73KMpoLh46cp1peJAZNJ' }
    const signedTx = setAssetScript(txParams, { 'asd1': seed, '2': seed2 } as any)

    expect(signedTx.proofs[0]).toEqual('')
    expect(signedTx.proofs[1]).toEqual('')
    expect(validateTxSignature(signedTx, 1, 2, publicKey(seed2))).toBe(true)
  });

  it('Should generate correct signed setAssetScript transaction with zero fee', () => {
    const txParams = { ...setAssetScriptMinimalParams, fee: 0 }
    const signedTx = setAssetScript(txParams, seed)

    expect(signedTx.fee).toEqual(0)
  });

  it('Should not generate correct signed setAssetScript transaction with negative fee', () => {
    expect(() =>setAssetScript({...setAssetScriptMinimalParams, fee: -1 }, seed))
         .toThrowError(errorMessageByTemplate('fee', -1))
  });

  it('Should create setAssetScript transaction with minimal params', () => {
    const txParams = { ...setAssetScriptMinimalParams };
    const signedTx = setAssetScript(txParams, seed)

    expect(signedTx).toMatchObject({...setAssetScriptMinimalParams, fee: 100000000, chainId: 87})
  })

  it('Should add base64 prefix for script when create setAssetScript tz', () => {
    const txParams = { ...setAssetScriptMinimalParams, script: compiledContract};
    const signedTx = setAssetScript(txParams, seed)

    expect(signedTx.script).toEqual('base64:' + compiledContract)
  })

});

describe('serialize/deserialize SetAssetScript proto tx', () => {

  Object.entries(setAssetScriptTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkProtoSerializeDeserialize({Json: Json, Bytes: Bytes});
      }))
});

describe('serialize/deserialize SetAssetScript binary tx', () => {

  Object.entries(setAssetScriptBinaryTx).forEach(([name, {Bytes, Json}]) =>
      it(name, () => {
        checkBinarySerializeDeserialize({Json: Json, Bytes: Bytes});
      }))
});