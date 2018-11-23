import { verifySignature, publicKey, } from 'waves-crypto'
import { setAssetScript } from '../../src'
import { ISetAssetScriptTransaction } from '../../src/transactions'
import { setAssetScriptToBytes } from '../../src/transactions/set-asset-script'

describe('setAssetScript', () => {

  const seed = 'test seed'
  const seed2 = 'test seed 2'
  const compiledContract = 'AQQAAAALYWxpY2VQdWJLZXkBAAAAID3+K0HJI42oXrHhtHFpHijU5PC4nn1fIFVsJp5UWrYABAAAAAlib2JQdWJLZXkBAAAAIBO1uieokBahePoeVqt4/usbhaXRq+i5EvtfsdBILNtuBAAAAAxjb29wZXJQdWJLZXkBAAAAIOfM/qkwkfi4pdngdn18n5yxNwCrBOBC3ihWaFg4gV4yBAAAAAthbGljZVNpZ25lZAMJAAH0AAAAAwgFAAAAAnR4AAAACWJvZHlCeXRlcwkAAZEAAAACCAUAAAACdHgAAAAGcHJvb2ZzAAAAAAAAAAAABQAAAAthbGljZVB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJYm9iU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWJvYlB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAMY29vcGVyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAIFAAAADGNvb3BlclB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIJAABkAAAAAgUAAAALYWxpY2VTaWduZWQFAAAACWJvYlNpZ25lZAUAAAAMY29vcGVyU2lnbmVkAAAAAAAAAAACVateHg=='

  it('Should generate correct signed setAssetScript transaction', () => {
    const txParams = { script: compiledContract, assetId: '' }
    const signedTx = setAssetScript(txParams, seed)

    expect(validateSetScriptTx(signedTx)).toBe(true)
  })

  it('Should generate correct signed setAssetScript transaction with multiple signers via array', () => {
    const txParams = { script: null, assetId: '' }
    const signedTx = setAssetScript(txParams, [null, seed, seed2])

    expect(signedTx.proofs[0]).toEqual('')
    expect(signedTx.script).toBeNull()
    expect(validateSetScriptTx(signedTx, 1)).toBe(true)
    expect(validateSetScriptTx(signedTx, 2, publicKey(seed2))).toBe(true)
  })

  it('Should generate correct signed setAssetScript transaction with multiple signers via object', () => {
    const txParams = { script: compiledContract, assetId: '' }
    const signedTx = setAssetScript(txParams, { '1': seed, '2': seed2 })

    expect(signedTx.proofs[0]).toEqual('')
    expect(validateSetScriptTx(signedTx, 1, publicKey(seed))).toBe(true)
    expect(validateSetScriptTx(signedTx, 2, publicKey(seed2))).toBe(true)
  })

  it('Should generate correct signed setAssetScript transaction with null script', () => {
    const txParams = { script: null, assetId: '' }
    const signedTx = setAssetScript(txParams, seed)

    expect(validateSetScriptTx(signedTx)).toBe(true)
  })

  it('Should generate correct setAssetScript transaction without seed', () => {
    const txParams = { script: compiledContract, senderPublicKey: publicKey(seed), assetId: '' }
    const tx = setAssetScript(txParams,)

    expect(tx.script).toEqual('base64:' + txParams.script)
    expect(tx.senderPublicKey).toEqual(publicKey(seed))
  })

  it('Should throw on undefined script', () => {
    const txParams = {}
    expect(() => setAssetScript(txParams as any, seed)).toThrow('Script field cannot be undefined. Use null explicitly to remove script')
  })

  it('Should handle incorrect keys in seedObject', () => {
    const txParams = { script: compiledContract, assetId: '' }
    const signedTx = setAssetScript(txParams, { 'asd1': seed, '2': seed2 } as any)

    expect(signedTx.proofs[0]).toEqual('')
    expect(signedTx.proofs[1]).toEqual('')
    expect(validateSetScriptTx(signedTx, 2, publicKey(seed2))).toBe(true)
  })

  it('Should throw on schema validation', () => {
    const tx = () => setAssetScript({ script: null, fee: null } as any, seed)
    expect(tx).toThrow(`[{
  "keyword": "required",
  "dataPath": "",
  "schemaPath": "#/required",
  "params": {
    "missingProperty": "assetId"
  },
  "message": "should have required property 'assetId'"
},
{
  "keyword": "type",
  "dataPath": ".fee",
  "schemaPath": "#/properties/fee/type",
  "params": {
    "type": "string,number"
  },
  "message": "should be string,number"
}]`)
  })
})

function validateSetScriptTx(tx: ISetAssetScriptTransaction, proofNumber = 0, publicKey?: string): boolean {
  const bytes = setAssetScriptToBytes(tx)
  return verifySignature(publicKey || tx.senderPublicKey, bytes, tx.proofs[proofNumber]!)
}