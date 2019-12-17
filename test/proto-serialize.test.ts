import { exampleTxs } from './exampleTxs'
import { broadcast, libs, TTx, WithId } from '../src'
import { protoBytesToTx, txToProtoBytes } from '../src/proto-serialize'
import { transfer } from '../src/transactions/transfer'
import { issue } from '../src/transactions/issue'
import { reissue } from '../src/transactions/reissue'
import { alias } from '../src/transactions/alias'
import { burn } from '../src/transactions/burn'
import { data } from '../src/transactions/data'
import { lease } from '../src/transactions/lease'
import { cancelLease } from '../src/transactions/cancel-lease'
import { setScript } from '../src/transactions/set-script'
import { setAssetScript } from '../src/transactions/set-asset-script'
import { invokeScript } from '../src/transactions/invoke-script'
import { sponsorship } from '../src/transactions/sponsorship'
import axios from 'axios'
import { txs, transfers } from './example-proto-tx'
import { massTransfer } from '../src/transactions/mass-transfer'
import { updateAssetInfo } from '../src/transactions/update-asset-info'

const SEED = 'test acc 2'
const NODE_URL = 'https://devnet-aws-si-1.wavesnodes.com'
const myAssetId = 'AZZnDexy7dZAsJ4SGX8dbVcAv9cermXvDKfy5jHeTs79'
const myChainId = 'D'
/**
 * Longs as strings, remove unnecessary fields
 * @param t
 */
const normalizeTx = (t: TTx): TTx => {
  const tx: any = t
  if (tx.quantity) tx.quantity = tx.quantity.toString()
  if (tx.amount) tx.amount = tx.amount.toString()
  if (tx.payment) tx.payment = tx.payment.map((item: any) => ({ ...item, amount: item.amount.toString() }))
  if (tx.transfers) tx.transfers = tx.transfers.map((item: any) => ({ ...item, amount: item.amount.toString() }))
  delete tx.id
  delete tx.proofs
  return tx
}
describe('transactions v3', () => {
  describe('serialize/deserialize', () => {
    const txs = Object.keys(exampleTxs).map(x => (<any>exampleTxs)[x] as any)
    txs.forEach(tx => {
      it('type: ' + tx.type, () => {
        tx = normalizeTx(tx)
        const parsed = protoBytesToTx(txToProtoBytes(tx))
        expect(parsed).toMatchObject(tx)
      })
    })
  })

  it('broadcasts new transactions', async () => {
    const itx = issue({
      quantity: 100000,
      description: 'my token',
      name: 'my token',
      chainId: myChainId,
      reissuable: true
    }, SEED)
    const ttx = transfer({ amount: 10000, recipient: libs.crypto.address(SEED, myChainId) }, SEED)
    const reitx = reissue({
      assetId: myAssetId,
      quantity: 100,
      chainId: myChainId,
      reissuable: true
    }, SEED)
    const btx = burn({ assetId: myAssetId, quantity: 2, chainId: myChainId }, SEED)
    const dtx = data({ data: [{ type: 'string', key: 'foo', value: 'bar' }], chainId: myChainId }, SEED)
    const dtx2delete = data({ data: [{key: 'foo'}], chainId: myChainId }, SEED)
    const ltx = lease({ amount: 1000, recipient: libs.crypto.address(SEED + 'foo', myChainId) }, SEED)
    const canltx = cancelLease({ leaseId: '6pDDM84arAdJ4Ts7cY7JaDbhjBHMbPdYsr3WyiDSDzbt', chainId: myChainId }, SEED)
    const mttx = massTransfer({
      attachment: '123',
      chainId: myChainId,
      transfers: [{ recipient: libs.crypto.address(SEED, myChainId), amount: 1000 }]
    }, SEED)
    const atx = alias({ alias: 'super-alias2', chainId: myChainId }, SEED)
    const ssTx = setScript({
      //script: 'AwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAAIBQAAAAJ0eAAAAA9zZW5kZXJQdWJsaWNLZXmIg5mo',
      script: null,
      chainId: myChainId,
      additionalFee: 400000
    }, SEED)
    const sastx = setAssetScript({
      assetId: myAssetId,
      chainId: myChainId,
      script: 'base64:AwZd0cYf'
    }, SEED)
    const spontx = sponsorship({
      chainId: myChainId,
      assetId: myAssetId,
      minSponsoredAssetFee: 1000
    }, SEED)
    const istx = invokeScript({
      dApp: libs.crypto.address(SEED, myChainId),
      chainId: myChainId,
      call: { function: 'foo' }
    }, SEED)
    const uaitx = updateAssetInfo({
      assetId: myAssetId,
      name: 'new NAme',
      description: 'new description',
      chainId: myChainId
    }, SEED)
    // [ttx, itx, reitx, atx, btx, dtx, ltx, canltx, ssTx, sastx, spontx, istx].forEach(t => {
    //   it(`Broadcasts ${t.type}`, async () => {
    //     try {
    //       await broadcast(t, NODE_URL)
    //
    //     } catch (e) {
    //       console.error(e)
    //     }
    //   })
    // })
    try {
      // await broadcast(ttx, NODE_URL)
      // console.log(itx.id)
      // await broadcast(itx, NODE_URL)
      // await broadcast(reitx, NODE_URL)
      // await broadcast(atx, NODE_URL)
      // await broadcast(btx, NODE_URL)
      await broadcast(dtx, NODE_URL)
      // await broadcast(dtx2delete, NODE_URL)
      // await broadcast(ltx, NODE_URL); console.log(ltx.id)
      // await broadcast(canltx, NODE_URL)
      //   await broadcast(mttx, NODE_URL)
      // await broadcast(ssTx, NODE_URL)
      // console.log(libs.crypto.base64Encode(txToProtoBytes(sastx)))
      // await broadcast(sastx, NODE_URL)
      // await broadcast(spontx, NODE_URL)
      // await broadcast(istx, NODE_URL)
      // await broadcast(uaitx, NODE_URL)
    } catch (e) {
      console.error(e)
    }
  })

  it('correctly serialized transactions. All but transfer', () => {
    Object.entries(txs).forEach(([name, { Bytes, Json }]) => {
      const myBytes = libs.crypto.base16Encode(txToProtoBytes(Json as any))
      const sbytes = libs.crypto.base16Encode(libs.crypto.base64Decode(Bytes))
      if (!sbytes.includes(myBytes)) {
        console.error(`${name}\nExpected: ${sbytes}\nActual  : ${myBytes}`)
      } else {
        console.log(`${name} Success: \n${sbytes}\n${myBytes}\``)
      }
    })
  })
  it('correctly serialized transfers with attachments', () => {
    transfers.forEach(({ Bytes, Json }, i) => {
      const myBytes = libs.crypto.base16Encode(txToProtoBytes(Json as any))
      const sbytes = libs.crypto.base16Encode(libs.crypto.base64Decode(Bytes))
      if (!sbytes.includes(myBytes)) {
        console.error(`${i}\nExpected: ${sbytes}\nActual  : ${myBytes}`)
      } else {
        console.log(`${i} Success: \n${sbytes}\n${myBytes}\``)
      }
      expect(sbytes).toContain(myBytes)
    })
  })
})

let a= {
  "type":4,
  "version":3,
  "senderPublicKey":"8rbsYsY3pnPveg13yDcoQ8WrS2tciNQS55rAKcC6gJut",
  "assetId":"9NNLqSE68fimL5GpKFacu67auqtq5aYPVnvWJZJPigNA","recipient":"3FVUWaBpL7DmMWwH3e8S7E8JYVvpihviTDK",
  amount:500,
  "attachment":"3MyAGEBuZGDKZDzYn6sbh2noqk9uYHy4kjw",
  "fee":100000,
  "feeAssetId":null,
  "timestamp":1576572672305,
  "proofs":["4TjSReiWQRsfqJahn8jLAsw6yhTCqR4fWyE4vFpxKF6WeZoFRehbxE1FocyE8QDtezE6a5Fv1RpK7HJ2rf4WZLfM"],
  "chainId":68,"id":"4cYF5ryXtyoXKyTWAjxFm2fnMRuASgfMb1H8SgtaMLrH"
}
