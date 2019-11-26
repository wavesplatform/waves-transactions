import { exampleTxs } from './exampleTxs'
import { broadcast, libs, TTx } from '../src'
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

describe('serializes and parses txs', () => {
  const txs = Object.keys(exampleTxs).map(x => (<any>exampleTxs)[x] as TTx)
  txs.forEach(tx => {
    it('type: ' + tx.type, () => {
      const parsed =protoBytesToTx(txToProtoBytes(tx))
      expect(parsed).toEqual(tx)
    })
  })

  it('broadcasts new transactions', async () => {
    const ttx = transfer({amount:10000, recipient: libs.crypto.address(SEED, "D")}, SEED)
    const itx = issue({quantity:1000, description:'my token', name:'my token', chainId: 'D'}, SEED)
    const reitx = reissue({assetId: 'DkmetPmMFTj7ddRZGTRdGS5G4GrfNKooot8BxvmJTrqm', quantity: 100, chainId: 'D', reissuable: true}, SEED)
    const atx = alias({alias:'super-alias', chainId: 'D'}, SEED)
    const btx = burn({assetId: 'DkmetPmMFTj7ddRZGTRdGS5G4GrfNKooot8BxvmJTrqm', quantity:2, chainId: 'D'}, SEED)
    const dtx = data({data:[{type:'string', key: 'foo', value: 'bar'}]}, SEED)
    const ltx = lease({amount:1000, recipient:  libs.crypto.address(SEED, "D")}, SEED)
    const canltx = cancelLease({leaseId: ltx.id, chainId: 'D'}, SEED)
    const ssTx = setScript({script: null, chainId: 'D'}, SEED)
    const sastx = setAssetScript({assetId: 'DkmetPmMFTj7ddRZGTRdGS5G4GrfNKooot8BxvmJTrqm', chainId: 'D', script: 'base64:AwZd0cYf'}, SEED)
    const spontx = sponsorship({assetId:'DkmetPmMFTj7ddRZGTRdGS5G4GrfNKooot8BxvmJTrqm', minSponsoredAssetFee:1000}, SEED)
    const istx = invokeScript({dApp: libs.crypto.address(SEED, "D"), chainId: 'D', call: {function:'foo'}}, SEED)
    // await broadcast(ttx, NODE_URL)
    // await broadcast(itx, NODE_URL)
    // await broadcast(reitx, NODE_URL)
    // await broadcast(atx, NODE_URL)
    // await broadcast(btx, NODE_URL)
    // await broadcast(dtx, NODE_URL)
    // await broadcast(ltx, NODE_URL)
    // await broadcast(canltx, NODE_URL)
    // await broadcast(ssTx, NODE_URL)
    // await broadcast(sastx, NODE_URL)
    await broadcast(spontx, NODE_URL)
    await broadcast(istx, NODE_URL)
  })
})
