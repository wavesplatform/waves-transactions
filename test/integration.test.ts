import { broadcast, issue, reissue, setScript } from "../src";
import { IssueParams } from "../src/transactions/issue";
import { ReissueParams } from "../src/transactions/reissue";
import { SetScriptParams } from "../src/transactions/set-script";
import { publicKey } from "waves-crypto";
import { txToJson } from "../src/txToJson";

describe('Blockchain interaction', () => {
  /**
   * Before running test you should prepare new account with WAVES on it!!
   */
  const seed = 'test seed 1'
  const apiBase = 'https://testnodes.wavesnodes.com'
  const chainId = 'T'
  const assetId = '3oYpW3VuUx3eqMzTwE8YotDv4nntCXhFaLLS9jiTvcNd'
  const scriptedAssetId = 'CcYTiNMf2S52JSuhd8cd51wW8FNDGyAPxnUFXHqsC6ev'


  describe('Token issue', () => {

    it('Should Issue new token', async () => {
      const txParams: IssueParams = {
        name: 'Test token',
        description: 'no description',
        decimals: 3,
        quantity: 1000,
        chainId,
        reissuable: true
      }
      const tx = issue(txParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(3)
    })

    it('Should ReIssue token', async () => {
      const txParams: ReissueParams = {
        reissuable: true,
        assetId,
        quantity: 100000,
        chainId
      }
      const tx = reissue(txParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(5)
    })

    it('Should issue token with script', async () => {
      // proof[7] validate against seed='test issue script'
      const script = "AQQAAAACUEsBAAAAIJLLiW7wRE4edH8g03S6x0EIIGbwvLACkgyEVaEE3jdICQAB9AAAAAMIBQAAAAJ0eAAAAAlib2R5Qnl0ZXMJAAGRAAAAAggFAAAAAnR4AAAABnByb29mcwAAAAAAAAAABwUAAAACUEsfohTZ"
      const txParams: IssueParams = {
        name: 'scriptedToken',
        description: 'no description',
        decimals: 3,
        quantity: 10000,
        reissuable: true,
        chainId,
        script
      }
      const tx = issue(txParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(3)
    })

    it('Should ReIssue token with script', async () => {
      const txParams: ReissueParams = {
        reissuable: true,
        assetId: scriptedAssetId,
        quantity: 100000,
        chainId,
        senderPublicKey: publicKey(seed),
        fee: 100800000
      }

      const tx = reissue(txParams, { 0: seed, 7: 'test issue script' })
      // console.log(tx)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(5)
    })
  })

  describe('Account scripts', () => {
    it('Should set multisig account script', async () => {
      // Multisig script 2 of 3. 'alice', 'bob', 'cooper'
      const script = 'AQQAAAALYWxpY2VQdWJLZXkBAAAAID3+K0HJI42oXrHhtHFpHijU5PC4nn1fIFVsJp5UWrYABAAAAAlib2JQdWJLZXkBAAAAIBO1uieokBahePoeVqt4/usbhaXRq+i5EvtfsdBILNtuBAAAAAxjb29wZXJQdWJLZXkBAAAAIOfM/qkwkfi4pdngdn18n5yxNwCrBOBC3ihWaFg4gV4yBAAAAAthbGljZVNpZ25lZAMJAAH0AAAAAwgFAAAAAnR4AAAACWJvZHlCeXRlcwkAAZEAAAACCAUAAAACdHgAAAAGcHJvb2ZzAAAAAAAAAAAABQAAAAthbGljZVB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJYm9iU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWJvYlB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAMY29vcGVyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAIFAAAADGNvb3BlclB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIJAABkAAAAAgUAAAALYWxpY2VTaWduZWQFAAAACWJvYlNpZ25lZAUAAAAMY29vcGVyU2lnbmVkAAAAAAAAAAACVateHg=='
      const txParams: SetScriptParams = {
        chainId,
        script
      }

      const tx = setScript(txParams, seed)
      console.log(txToJson(tx))
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(13)
    })

    it('Should remove script from multisignature account', async () => {
      // Multisig script 2 of 3. 'alice', 'bob', 'cooper'
      const txParams: SetScriptParams = {
        senderPublicKey: publicKey(seed),
        chainId,
        script: null
      }

      const tx = setScript(txParams, [null, 'bob', 'cooper'])
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(13)
    })
  })
})

