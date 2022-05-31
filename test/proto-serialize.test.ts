import { exampleTxs } from './exampleTxs'
import {broadcast, libs, waitForTx, WithId} from '../src'
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
import { txs } from './example-proto-tx'
import { massTransfer } from '../src/transactions/mass-transfer'
import { updateAssetInfo } from '../src/transactions/update-asset-info'
import {randomHexString, TIMEOUT} from './integration/config'
import {address} from '@waves/ts-lib-crypto'
import {issueMinimalParams} from './minimalParams'
import {deleteProofsAndId} from "./utils";



const nodeUrl = 'http://localhost:6869/'
const masterSeed = 'waves private node seed with waves tokens'
const CHAIN_ID = 82
let SEED = 'abc'
const wvs = 1e8
let assetId = ''

/**
 * Longs as strings, remove unnecessary fields
 * @param t
 */


describe('serialize/deserialize', () => {
  const txss = Object.keys(exampleTxs).map(x => (<any>exampleTxs)[x] as any)
  txss.forEach(tx => {
    it('type: ' + tx.type, () => {
      // deleteProofsAndId(tx)
      //const parsed = protoBytesToTx(txToProtoBytes(tx))
      const txWithoutProofAndId = deleteProofsAndId(tx);
      const protoBytes = txToProtoBytes(txWithoutProofAndId);
      const parsed = protoBytesToTx(protoBytes);
      expect(parsed).toMatchObject(txWithoutProofAndId);
    })
  })

  it('correctly serialized transactions', () => {
    Object.entries(txs).forEach(([name, { Bytes, Json }]) => {
      const actualBytes = libs.crypto.base16Encode(txToProtoBytes(Json as any))
      const expectedBytes = libs.crypto.base16Encode(libs.crypto.base64Decode(Bytes))
      expect(expectedBytes).toBe(actualBytes)
    })
  }, TIMEOUT)

})

describe('transactions v3', () => {

  beforeAll(async () => {
    const nonce = randomHexString(6)
    jest.setTimeout(60000)
    SEED = 'account1' + nonce
    const mtt = massTransfer({
      transfers: [
        { recipient: address(SEED, CHAIN_ID), amount: 0.1 * wvs },
      ],
    }, masterSeed)

    const assetIssue = issue({
      ...issueMinimalParams,
      quantity: 1000000000000,
      decimals: 8,
      reissuable: true,
      chainId: CHAIN_ID,
    }, masterSeed)

    await broadcast(assetIssue, nodeUrl)
    assetId = assetIssue.id
    
    await broadcast(mtt, nodeUrl)
    await waitForTx(mtt.id, {apiBase: nodeUrl, timeout: TIMEOUT})

  }, TIMEOUT)

  it('broadcasts new transactions', async () => {
    const itx = issue({
      quantity: 100000,
      description: 'my token',
      name: 'my token',
      chainId: CHAIN_ID,
      reissuable: true,
    }, SEED)
    const ttx = transfer({ amount: 10000, recipient: libs.crypto.address(SEED, CHAIN_ID) }, SEED)
    const reitx = reissue({
      assetId: assetId,
      quantity: 100,
      chainId: CHAIN_ID,
      reissuable: true,
    }, SEED)
    const btx = burn({ assetId: assetId, amount: 2, chainId: CHAIN_ID }, SEED)
    const dtx = data({ data: [{ type: 'string', key: 'foo', value: 'bar' }], chainId: CHAIN_ID }, SEED)
    const dtx2delete = data({ data: [{key: 'foo'}], chainId: CHAIN_ID }, SEED)
    const ltx = lease({ amount: 1000, recipient: libs.crypto.address(SEED + 'foo', CHAIN_ID) }, SEED)
    const canltx = cancelLease({ leaseId: '6pDDM84arAdJ4Ts7cY7JaDbhjBHMbPdYsr3WyiDSDzbt', chainId: CHAIN_ID }, SEED)
    const mttx = massTransfer({
      attachment: '123',
      chainId: CHAIN_ID,
      transfers: [{ recipient: libs.crypto.address(SEED, CHAIN_ID), amount: 1000 }],
    }, SEED)
    const atx = alias({ alias: 'super-alias2', chainId: CHAIN_ID }, SEED)
    const ssTx = setScript({
      //script: 'AwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAAIBQAAAAJ0eAAAAA9zZW5kZXJQdWJsaWNLZXmIg5mo',
      script: null,
      chainId: CHAIN_ID,
      additionalFee: 400000,
    }, SEED)
    const sastx = setAssetScript({
      assetId: assetId,
      chainId: CHAIN_ID,
      script: 'base64:AwZd0cYf',
    }, SEED)
    const spontx = sponsorship({
      chainId: CHAIN_ID,
      assetId: assetId,
      minSponsoredAssetFee: 1000,
    }, SEED)
    const istx = invokeScript({
      dApp: libs.crypto.address(SEED, CHAIN_ID),
      chainId: CHAIN_ID,
      call: { function: 'foo' },
    }, SEED)
    const uaitx = updateAssetInfo({
      assetId: assetId,
      name: 'new NAme',
      description: 'new description',
      chainId: CHAIN_ID,
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
      await broadcast(dtx, nodeUrl)
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
  }, TIMEOUT)


 //  //todo add transfers with bytes
 //  it('correctly serialized transfers with attachments', () => {
 //    transfers.forEach(({ Bytes, Json }, i) => {
 //      const myBytes = libs.crypto.base16Encode(txToProtoBytes(Json as any))
 //      const sbytes = libs.crypto.base16Encode(libs.crypto.base64Decode(Bytes))
 //      if (!sbytes.includes(myBytes)) {
 //        console.error(`${i}\nExpected: ${sbytes}\nActual  : ${myBytes}`)
 //      } else {
 //        console.log(`${i} Success: \n${sbytes}\n${myBytes}\``)
 //      }
 //      expect(sbytes).toContain(myBytes)
 //    })
 // })
})

let a= {
  'type':4,
  'version':3,
  'senderPublicKey':'8rbsYsY3pnPveg13yDcoQ8WrS2tciNQS55rAKcC6gJut',
  'assetId':'9NNLqSE68fimL5GpKFacu67auqtq5aYPVnvWJZJPigNA','recipient':'3FVUWaBpL7DmMWwH3e8S7E8JYVvpihviTDK',
  amount:500,
  'attachment':'3MyAGEBuZGDKZDzYn6sbh2noqk9uYHy4kjw',
  'fee':100000,
  'feeAssetId':null,
  'timestamp':1576572672305,
  'proofs':['4TjSReiWQRsfqJahn8jLAsw6yhTCqR4fWyE4vFpxKF6WeZoFRehbxE1FocyE8QDtezE6a5Fv1RpK7HJ2rf4WZLfM'],
  'chainId':68,'id':'4cYF5ryXtyoXKyTWAjxFm2fnMRuASgfMb1H8SgtaMLrH',
}
