import { broadcast, burn, issue, massTransfer, reissue, setAssetScript, setScript, transfer } from "../src";
import { address, publicKey } from "waves-crypto";
import { waitForTx } from "../src/generic";
import {
  IBurnParams,
  IIssueParams, IMassTransferParams,
  IReissueParams,
  ISetAssetScriptParams,
  ISetScriptParams, ITransferParams
} from "../src/transactions";
import { json, convert } from '@waves/marshall'

describe('Blockchain interaction', () => {
  /**
   * Before running test you should prepare new account with WAVES on it!!
   */
  const seed = 'test seed 1';
  const recipientSeed = 'MyRecipient'
  const apiBase = 'https://testnodes.wavesnodes.com'
  const chainId = 'T'
  const timeout = 120000

  describe('Assets', () => {
    let assetId = '';

    it('Should ISSUE new token', async () => {
      const txParams: IIssueParams = {
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
      assetId = tx.id
      await waitForTx(assetId, timeout, apiBase)
    }, timeout);

    it('Should ReIssue token', async () => {
      const txParams: IReissueParams = {
        reissuable: true,
        assetId,
        quantity: 1000,
        chainId
      }
      const tx = reissue(txParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(5)
    });

    it('Should BURN token', async () => {
      const burnParams: IBurnParams = {
        assetId,
        quantity: 500,
        chainId
      }
      const burnTx = burn(burnParams, seed)
      const resp =  await broadcast(burnTx, apiBase)
      expect(resp.type).toEqual(6)
    })

    it('Should transfer asset', async () =>{
      const transferParams: ITransferParams = {
        amount: '500',
        recipient: address(recipientSeed, chainId),
        attachment: '3MyAGEBuZGDKZDzYn6sbh2noqk9uYHy4kjw'
      }

      const tx = transfer(transferParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(4)
    });

    it('Should masstransfer asset', async () =>{
      const massTransferParams: IMassTransferParams = {
        //fee:'200000',
        assetId,
        transfers:[
          {
            recipient: address(recipientSeed, chainId),
            amount: '100'
          },
          {
            recipient: address(recipientSeed, chainId),
            amount: '100'
          }
        ]
      }

      const tx = massTransfer(massTransferParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(11)
      expect(resp.id).toEqual(tx.id)
    })
  });

  describe('Scripted assets', () => {
    let assetId = '';

    it('Should issue token with script. Should execute token script', async () => {
      // script prohibits burn transaction
      const script = "AQQAAAAHJG1hdGNoMAUAAAACdHgDCQAAAQAAAAIFAAAAByRtYXRjaDACAAAAD0J1cm5UcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAcGPmRSDA=="
      const txParams: IIssueParams = {
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
      assetId = tx.id
      await waitForTx(assetId, timeout, apiBase)

      const burnParams: IBurnParams = {
        assetId,
        quantity: 1000,
        chainId
      }
      const burnTx = burn(burnParams, seed)
      const respPromise = broadcast(burnTx, apiBase)
      await expect(respPromise).rejects.toEqual(new Error('Transaction is not allowed by token-script'))

    }, timeout + 20000);

    it('Should set new token script. Should execute new token script', async () => {
      // script allows everything
      const script = "AQa3b8tH"
      const txParams: ISetAssetScriptParams = {
        assetId,
        chainId,
        script
      }
      const tx = setAssetScript(txParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(15)
      await waitForTx(tx.id, timeout, apiBase)

      const burnParams: IBurnParams = {
        assetId,
        quantity: '1000',
        chainId,
        additionalFee: 400000
      }
      const burnTx = burn(burnParams, seed)
      const burnResp = await broadcast(burnTx, apiBase)
      expect(burnResp.type).toEqual(6)
    }, timeout + 20000)

  });

  describe('Account scripts', () => {
    it('Should set and then remove multisig account script', async () => {
      // Multisig script 2 of 3. 'alice', 'bob', 'cooper'
      const script = 'AQQAAAALYWxpY2VQdWJLZXkBAAAAID3+K0HJI42oXrHhtHFpHijU5PC4nn1fIFVsJp5UWrYABAAAAAlib2JQdWJLZXkBAAAAIBO1uieokBahePoeVqt4/usbhaXRq+i5EvtfsdBILNtuBAAAAAxjb29wZXJQdWJLZXkBAAAAIOfM/qkwkfi4pdngdn18n5yxNwCrBOBC3ihWaFg4gV4yBAAAAAthbGljZVNpZ25lZAMJAAH0AAAAAwgFAAAAAnR4AAAACWJvZHlCeXRlcwkAAZEAAAACCAUAAAACdHgAAAAGcHJvb2ZzAAAAAAAAAAAABQAAAAthbGljZVB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJYm9iU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWJvYlB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAMY29vcGVyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAIFAAAADGNvb3BlclB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIJAABkAAAAAgUAAAALYWxpY2VTaWduZWQFAAAACWJvYlNpZ25lZAUAAAAMY29vcGVyU2lnbmVkAAAAAAAAAAACVateHg=='
      const txParams: ISetScriptParams = {
        chainId,
        script
      }

      const tx = setScript(txParams, seed)

      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(13)

      await waitForTx(tx.id, timeout, apiBase)

      const removeTxParams: ISetScriptParams = {
        senderPublicKey: publicKey(seed),
        chainId,
        script: null,
        additionalFee: 400000
      }

      const removeTx = setScript(removeTxParams, [null, 'bob', 'cooper'])
      const resp2 = await broadcast(removeTx, apiBase)
      await waitForTx(removeTx.id, timeout, apiBase)
      expect(resp2.type).toEqual(13)

    }, timeout)
  });

})

