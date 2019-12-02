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

const SEED = 'test acc 2'
const NODE_URL = 'https://devnet-aws-si-1.wavesnodes.com'

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


  describe('broadcasts new transactions', () => {
    const itx = issue({ quantity: 1000, description: 'my token', name: 'my token', chainId: 'D' }, SEED)
    const ttx = transfer({ amount: 10000, recipient: libs.crypto.address(SEED, "D") }, SEED)
    const reitx = reissue({
      assetId: 'DkmetPmMFTj7ddRZGTRdGS5G4GrfNKooot8BxvmJTrqm',
      quantity: 100,
      chainId: 'D',
      reissuable: true
    }, SEED)
    const btx = burn({ assetId: 'DkmetPmMFTj7ddRZGTRdGS5G4GrfNKooot8BxvmJTrqm', quantity: 2, chainId: 'D' }, SEED)
    const dtx = data({ data: [{ type: 'string', key: 'foo', value: 'bar' }] }, SEED)
    const ltx = lease({ amount: 1000, recipient: libs.crypto.address(SEED, "D") }, SEED)
    const canltx = cancelLease({ leaseId: ltx.id, chainId: 'D' }, SEED)
    const atx = alias({ alias: 'super-alias', chainId: 'D' }, SEED)
    const ssTx = setScript({ script: null, chainId: 'D' }, SEED)
    const sastx = setAssetScript({
      assetId: 'DkmetPmMFTj7ddRZGTRdGS5G4GrfNKooot8BxvmJTrqm',
      chainId: 'D',
      script: 'base64:AwZd0cYf'
    }, SEED)
    const spontx = sponsorship({
      assetId: 'DkmetPmMFTj7ddRZGTRdGS5G4GrfNKooot8BxvmJTrqm',
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

    it('sends transfer', async () => {
      const i1 = {
        "type": 3,
        "version": 3,
        "senderPublicKey": "FKRh2Dkxjxk5YkTUBByefDnJRdPvJSDFhB7sFCkM7kVC",
        "name": "my token",
        "description": "my token",
        "quantity": 1000,
        "decimals": 8,
        "reissuable": false,
        "fee": 100000000,
        "timestamp": 1575273869206,
        "chainId": 68,
        "proofs": [
          "5U6R6URJuB1ZnpqbhQvaNCkXjj5jahLJ1LE3agZH8cxiY1hyQWTnK92Uuwn1TJiQ2s8Gkoo1pJnDi3XabBRcwA1h"
        ],
        "id": "CvCG1NdSKEGcwwY2g4PLm4qKfLDjjLEz7c44VhoT1dfz"
      }

      const t1 = {
        "type": 4,
        "chainId": 68,
        "version": 3,
        "senderPublicKey": "FKRh2Dkxjxk5YkTUBByefDnJRdPvJSDFhB7sFCkM7kVC",
        "assetId": null,
        "recipient": "3FT8LrsdEqHPJVrdm4Vpn43VDBDbVFaMtwP",
        "amount": 10000,
        "attachment": "",
        "fee": 100000,
        "feeAssetId": null,
        "timestamp": 1575036390623,
        "proofs": [
          "4QPp9ofdsD3S1JofwQpBwVmdt8nWnxHpghKXJnN6vYzfi2rEXsy9eEfSwe8Cdg2smXh5zSAZn6bAkps1xwD2tAHQ"
        ],
        "id": "98uYzS6eBYDkVZYJwWaMuBc6DwD4QQCYN4NhZHEG466K"
      }

      const b1 = {
        "type": 6,
        "version": 3,
        "senderPublicKey": "FKRh2Dkxjxk5YkTUBByefDnJRdPvJSDFhB7sFCkM7kVC",
        "assetId": "DkmetPmMFTj7ddRZGTRdGS5G4GrfNKooot8BxvmJTrqm",
        "quantity": 2,
        "chainId": 68,
        "fee": 100000,
        "timestamp": 1575275216221,
        "proofs": [
          "7So2MGMVyWsy5mzHtcNxgMY5hhrHLQgA82cVwzBqgbZCoj2dTtX7rvK76QpKSdnqEwudqeKptMRbn1r5UaicaoB"
        ],
        "id": "DCmzb7EE3HC3jab2cfvwM3XsAKkr9v7p31sxxfhniDuy"
      }
      console.log(libs.crypto.base16Encode(txToProtoBytes(b1)))
      try {

        const result = await broadcast(b1, NODE_URL)
        console.log(result)
      } catch (e) {
        console.error(e)
      }finally {
      }
    })
    // await broadcast(itx, NODE_URL)
    // await broadcast(reitx, NODE_URL)
    // await broadcast(atx, NODE_URL)
    // await broadcast(btx, NODE_URL)
    // await broadcast(dtx, NODE_URL)
    // await broadcast(ltx, NODE_URL)
    // await broadcast(canltx, NODE_URL)
    // await broadcast(ssTx, NODE_URL)
    // await broadcast(sastx, NODE_URL)
    // await broadcast(spontx, NODE_URL)
    // await broadcast(istx, NODE_URL)
  })
})
// const t_my = "8,68,18,32,212,187,253,22,125,199,56,80,193,40,219,49,169,227,185,34,41,203,4,90,252,71,171,150,251,213,219,90,104,71,173,63,26,4,16,160,141,6,32,223,153,240,187,235,45,40,3,194,6,29,10,22,10,20,     50,171,43,132,19,175,225,93,55,37,105,163,197,139,162,177,218,243,30,54,               18,3,16,144,78"
// const t_re = "8,68,18,32,212,187,253,22,125,199,56,80,193,40,219,49,169,227,185,34,41,203,4,90,252,71,171,150,251,213,219,90,104,71,173,63,26,4,16,160,141,6,32,223,153,240,187,235,45,40,3,194,6,37,10,28,10,26,1,68,50,171,43,132,19,175,225,93,55,37,105,163,197,139,162,177,218,243,30,54,17,124,103,110,18,3,16,144,78,26,0"

const i_my = "08441220d4bbfd167dc73850c128db31a9e3b92229cb045afc47ab96fbd5db5a6847ad3f1a051080c2d72f2096df8eadec2d2803ba061b0a086d7920746f6b656e12086d7920746f6b656e18e80720082800"
const i_re = "08441220d4bbfd167dc73850c128db31a9e3b92229cb045afc47ab96fbd5db5a6847ad3f1a051080c2d72f2096df8eadec2d2803ba06190a086d7920746f6b656e12086d7920746f6b656e18e8072008"

const burn_my = "08441220d4bbfd167dc73850c128db31a9e3b92229cb045afc47ab96fbd5db5a6847ad3f1a0410a08d0620ddfae0adec2d2803d206260a240a20bd82b51b70e797c5fd963c1e21534e16cd18362068aec38503979f61511855501002"
