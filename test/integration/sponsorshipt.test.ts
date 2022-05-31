import { broadcast, issue, sponsorship, transfer, waitForTx} from '../../src'
import {API_BASE, CHAIN_ID, MASTER_SEED, TIMEOUT} from './config'
import {address} from '@waves/ts-lib-crypto'
import {validate} from '../../src/validators'

describe('Sponsorship', () => {
    let assetId: string;

    it('Issue asset for sponsorship', async () => {
        const issueTx = issue({
            decimals: 8,
            name: 'testAsset',
            description: '',
            quantity: '9000000000000',
            reissuable: true,
            chainId: CHAIN_ID,
        }, MASTER_SEED)
        assetId = issueTx.id
        await broadcast(issueTx, API_BASE)

        await waitForTx(issueTx.id, {apiBase: API_BASE, timeout: 10000})
    }, TIMEOUT)

    it('Should set sponsorship', async () => {
        const sponTx = sponsorship({assetId, minSponsoredAssetFee: '100000', chainId: CHAIN_ID}, MASTER_SEED)
        await broadcast(sponTx, API_BASE)
        await waitForTx(sponTx.id, {timeout: TIMEOUT, apiBase: API_BASE})

        const ttx = transfer({
            recipient: address(MASTER_SEED, CHAIN_ID),
            amount: '100',
            feeAssetId: assetId,
            fee: '100000',
            chainId: CHAIN_ID
        }, MASTER_SEED)
        await broadcast(ttx, API_BASE)
    }, TIMEOUT)

    it('Should remove sponsorship', async () => {
        const sponTx = sponsorship({assetId, minSponsoredAssetFee: null, chainId: CHAIN_ID}, MASTER_SEED)
        await broadcast(sponTx, API_BASE)
        await waitForTx(sponTx.id, {timeout: TIMEOUT, apiBase: API_BASE})
        const ttx = transfer({
            recipient: address(MASTER_SEED, CHAIN_ID),
            amount: 1000,
            feeAssetId: assetId
        }, MASTER_SEED)
        await expect(broadcast(ttx, API_BASE)).rejects
    }, TIMEOUT)
})
