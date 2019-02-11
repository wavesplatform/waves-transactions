import { broadcast, burn, exchange, issue, massTransfer, reissue, setAssetScript, setScript, transfer } from '../src'
import { address, publicKey } from '@waves/waves-crypto'
import { waitForTx } from '../src/generic'
import {
  IBurnParams,
  IIssueParams, IMassTransferParams,
  IReissueParams,
  ISetAssetScriptParams,
  ISetScriptParams, ITransferParams
} from '../src/transactions'
import { order, cancelOrder } from '../src'
import { cancelSubmittedOrder, submitOrder } from '../src/general'
import { alias } from '../src/transactions/alias'

/**
 * Before running test ensure test account has WAVES!!
 */
const seed = 'test acc 2'
const recipientSeed = 'MyRecipient'
const apiBase = 'https://testnodes.wavesnodes.com'
const chainId = 'T'
const matcherPublicKey = '8QUAqtTckM5B8gvcuP7mMswat9SjKUuafJMusEoSn1Gy'
const matcherUrl = 'https://matcher.testnet.wavesnodes.com/'
const timeout = 120000

describe('Blockchain interaction', () => {



  describe('Assets', () => {
    let assetId = ''

    it('Should ISSUE new token', async () => {
      const txParams: IIssueParams = {
        name: 'Test token',
        description: 'no description',
        decimals: 3,
        quantity: 1000,
        chainId,
        reissuable: true,
      }

      const tx = issue(txParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(3)
      assetId = tx.id
      await waitForTx(assetId, timeout, apiBase)
    }, timeout)

    it('Should ReIssue token', async () => {
      const txParams: IReissueParams = {
        reissuable: true,
        assetId,
        quantity: 1000,
        chainId,
      }
      const tx = reissue(txParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(5)
    })

    it('Should BURN token', async () => {
      const burnParams: IBurnParams = {
        assetId,
        quantity: 500,
        chainId,
      }
      const burnTx = burn(burnParams, seed)
      const resp = await broadcast(burnTx, apiBase)
      expect(resp.type).toEqual(6)
    })

    it('Should transfer asset', async () => {
      const transferParams: ITransferParams = {
        amount: '500',
        assetId,
        recipient: address(recipientSeed, chainId),
        attachment: '3MyAGEBuZGDKZDzYn6sbh2noqk9uYHy4kjw',
      }

      const tx = transfer(transferParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(4)
    })

    it('Should masstransfer asset', async () => {
      const massTransferParams: IMassTransferParams = {
        //fee:'200000',
        assetId,
        transfers: [
          {
            recipient: address(recipientSeed, chainId),
            amount: '100',
          },
          {
            recipient: address(recipientSeed, chainId),
            amount: '100',
          },
        ],
      }

      const tx = massTransfer(massTransferParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(11)
      expect(resp.id).toEqual(tx.id)
    })
  })

  describe('Scripted assets', () => {
    let assetId = ''

    it('Should issue token with script. Should execute token script', async () => {
      // script prohibits burn transaction
      const script = 'AQQAAAAHJG1hdGNoMAUAAAACdHgDCQAAAQAAAAIFAAAAByRtYXRjaDACAAAAD0J1cm5UcmFuc2FjdGlvbgQAAAABdAUAAAAHJG1hdGNoMAcGPmRSDA=='
      const txParams: IIssueParams = {
        name: 'scriptedToken',
        description: 'no description',
        decimals: 3,
        quantity: 10000,
        reissuable: true,
        chainId,
        script,
      }
      const tx = issue(txParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(3)
      assetId = tx.id
      await waitForTx(assetId, timeout, apiBase)

      const burnParams: IBurnParams = {
        assetId,
        quantity: 1000,
        chainId,
      }
      const burnTx = burn(burnParams, seed)
      const respPromise = broadcast(burnTx, apiBase)
      await expect(respPromise).rejects.toEqual(new Error('Transaction is not allowed by token-script'))

    }, timeout + 20000)

    it('Should set new token script. Should execute new token script', async () => {
      // script allows everything
      const script = 'AQa3b8tH'
      const txParams: ISetAssetScriptParams = {
        assetId,
        chainId,
        script,
      }
      const tx = setAssetScript(txParams, seed)
      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(15)
      await waitForTx(tx.id, timeout, apiBase)

      const burnParams: IBurnParams = {
        assetId,
        quantity: '1000',
        chainId,
        additionalFee: 400000,
      }
      const burnTx = burn(burnParams, seed)
      const burnResp = await broadcast(burnTx, apiBase)
      expect(burnResp.type).toEqual(6)
    }, timeout + 20000)

  })

  describe('Account scripts', () => {
    it('Should set and then remove multisig account script', async () => {
      // Multisig script 2 of 3. 'alice', 'bob', 'cooper'
      const script = 'AQQAAAALYWxpY2VQdWJLZXkBAAAAID3+K0HJI42oXrHhtHFpHijU5PC4nn1fIFVsJp5UWrYABAAAAAlib2JQdWJLZXkBAAAAIBO1uieokBahePoeVqt4/usbhaXRq+i5EvtfsdBILNtuBAAAAAxjb29wZXJQdWJLZXkBAAAAIOfM/qkwkfi4pdngdn18n5yxNwCrBOBC3ihWaFg4gV4yBAAAAAthbGljZVNpZ25lZAMJAAH0AAAAAwgFAAAAAnR4AAAACWJvZHlCeXRlcwkAAZEAAAACCAUAAAACdHgAAAAGcHJvb2ZzAAAAAAAAAAAABQAAAAthbGljZVB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJYm9iU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWJvYlB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAMY29vcGVyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAIFAAAADGNvb3BlclB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIJAABkAAAAAgUAAAALYWxpY2VTaWduZWQFAAAACWJvYlNpZ25lZAUAAAAMY29vcGVyU2lnbmVkAAAAAAAAAAACVateHg=='
      const txParams: ISetScriptParams = {
        chainId,
        script,
      }

      const tx = setScript(txParams, seed)

      const resp = await broadcast(tx, apiBase)
      expect(resp.type).toEqual(13)

      await waitForTx(tx.id, timeout, apiBase)

      const removeTxParams: ISetScriptParams = {
        senderPublicKey: publicKey(seed),
        chainId,
        script: null,
        additionalFee: 400000,
      }

      const removeTx = setScript(removeTxParams, [null, 'bob', 'cooper'])
      const resp2 = await broadcast(removeTx, apiBase)
      await waitForTx(removeTx.id, timeout, apiBase)
      expect(resp2.type).toEqual(13)

    }, timeout)
  })

  it('Should perform exchange transaction', async ()=>{
   // ISSUE ASSET
    let account2 = 'exchange test';
    let assetId: string;
    // const txParams: IIssueParams = {
    //   name: 'Test token',
    //   description: 'no description',
    //   //decimals: 3,
    //   quantity: 100000000000,
    //   chainId,
    //   reissuable: true,
    // }
    //
    // const issueTx = issue(txParams, seed)
    // await broadcast(issueTx, apiBase)
    // // GIVE WAVES TO TEST ACC
    // const transferTx = transfer({recipient: address(account2, 'T'), amount:100000000}, seed)
    // await broadcast(transferTx, apiBase)
    //
    // //WAIT BOTH TX TO COMPLETE
    // await waitForTx(issueTx.id, timeout, apiBase)
    // await waitForTx(transferTx.id, timeout, apiBase)
    /////////////////////////

    assetId = 'qmhEv7NeL39kDiWBVfzZh6aT1ZwzpD7y1CFxvmiH78U'

    const order1 = order({
      matcherPublicKey: publicKey(seed),
      orderType: 'buy',
      amountAsset: assetId,
      priceAsset: null,
      amount: 100000000,
      price: 100000000
    }, account2)

    const order2 = order({
      matcherPublicKey: publicKey(seed),
      orderType: 'sell',
      amountAsset: assetId,
      priceAsset: null,
      amount: 100000000,
      price:100000000
    },seed)

    const exchangeTx = exchange({
      type: 7,
      version: 2,
      order1,
      order2,
      price: 100000000,
      amount: 100000000,
      buyMatcherFee: order1.matcherFee,
      sellMatcherFee: order2.matcherFee,
      timestamp: Date.now(),
      proofs: [],
      fee: 100000,
      senderPublicKey: publicKey(seed)
    }, seed)

    await broadcast(exchangeTx, apiBase)
  }, timeout)
})

describe('Matcher requests', () => {

  const assetId = 'GVmtioaQfyackGbeFSrLTMJsD69D8pcBe2UjAth61ny3';

  it('should submit and cancel order', async () => {
    const oParams = {
      orderType: 'buy' as 'buy',
      matcherPublicKey,
      price: 10000000000000,
      amount: 1000,
      matcherFee: 700000,
      priceAsset: null,
      amountAsset: assetId
    }

    const ord = order(oParams, seed)
    const submitResp = await submitOrder(ord, matcherUrl)
    expect(submitResp.status).toEqual('OrderAccepted')

    const co = cancelOrder({orderId: ord.id}, seed)
    const cancelResp = await cancelSubmittedOrder(co,ord.assetPair.amountAsset, ord.assetPair.priceAsset, matcherUrl)
    expect(cancelResp.status).toEqual('OrderCanceled')
  })
})
