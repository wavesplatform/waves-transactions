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

const SEED = 'test acc 2'
const NODE_URL = 'https://devnet-aws-si-1.wavesnodes.com'
const myAssetId = 'DXefNpMsjMaxXVSK5VsNPWgkDKvNmsZFgJK3nAk1ratE'
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

  it('broadcasts new transactions', async() => {
    const itx = issue({ quantity: 100000, description: 'my token', name: 'my token', chainId: 'D', reissuable:true }, SEED)
    const ttx = transfer({ amount: 10000, recipient: libs.crypto.address(SEED, "D") }, SEED)
    const reitx = reissue({
      assetId: myAssetId,
      quantity: 100,
      chainId: 'D',
      reissuable: true
    }, SEED)
    const btx = burn({ assetId: myAssetId, quantity: 2, chainId: 'D' }, SEED)
    const dtx = data({ data: [{ type: 'string', key: 'foo', value: 'bar' }], chainId: 'D'}, SEED)
    const ltx = lease({ amount: 1000, recipient: libs.crypto.address(SEED + 'foo', "D") }, SEED)
    const canltx = cancelLease({ leaseId: '6pDDM84arAdJ4Ts7cY7JaDbhjBHMbPdYsr3WyiDSDzbt', chainId: 'D' }, SEED)
    const mttx = massTransfer({
      attachment: '123',
      chainId: 'D',
      transfers:[{recipient: libs.crypto.address(SEED, 'D'), amount: 1000}]
    }, SEED)
    const atx = alias({ alias: 'super-alias2', chainId: 'D' }, SEED)
    const ssTx = setScript({ script: null, chainId: 'D' }, SEED)
    const sastx = setAssetScript({
      assetId: myAssetId,
      chainId: 'D',
      script: 'base64:AwZd0cYf'
    }, SEED)
    const spontx = sponsorship({
      chainId: 'D',
      assetId: myAssetId,
      minSponsoredAssetFee: 1000
    }, SEED)
    const istx = invokeScript({ dApp: libs.crypto.address(SEED, "D"), chainId: 'D', call: { function: 'foo' } }, SEED);
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
    // await broadcast(itx, NODE_URL)
    // await broadcast(reitx, NODE_URL)
    // await broadcast(atx, NODE_URL)
    // await broadcast(btx, NODE_URL)
    // await broadcast(dtx, NODE_URL)
    // await broadcast(ltx, NODE_URL); console.log(ltx.id)
    // await broadcast(canltx, NODE_URL)
    //   await broadcast(mttx, NODE_URL)
    // await broadcast(ssTx, NODE_URL)
    // await broadcast(sastx, NODE_URL)
    // await broadcast(spontx, NODE_URL)
    // await broadcast(istx, NODE_URL)

    }catch (e) {
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
