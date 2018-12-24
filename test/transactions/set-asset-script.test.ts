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
    const txParams = { script: 'AQIDBA==', assetId: '' }
    const signedTx = setAssetScript(txParams, [null, seed, seed2])

    expect(signedTx.proofs[0]).toEqual('')
    expect(signedTx.script).toEqual('base64:AQIDBA==')
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
    expect(validateSetScriptTx(signedTx, 2, publicKey(seed2))).toBe(true)
  })

})

function validateSetScriptTx(tx: ISetAssetScriptTransaction, proofNumber = 0, publicKey?: string): boolean {
  const bytes = setAssetScriptToBytes(tx)
  return verifySignature(publicKey || tx.senderPublicKey, bytes, tx.proofs[proofNumber]!)
}