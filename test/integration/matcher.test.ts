import {cancelOrder, cancelSubmittedOrder, order, submitOrder} from '../../src'
import {MASTER_SEED, MATCHER_PUBLIC_KEY, MATCHER_URL, TIMEOUT} from './config'

describe('Matcher requests', () => {
    let assetId = '7SGJvTYmBKJEz2G1h2WVfAKYrg1G5FYfPpwUqFmircG'

    beforeAll(async () => {
        //const nonce = randomHexString(6)
        jest.setTimeout(60000)

        console.log('Assets setup successful ' + assetId)
    }, TIMEOUT)


    it('should submit and cancel order', async () => {
        const oParams = {
            orderType: 'buy' as 'buy',
            matcherPublicKey: MATCHER_PUBLIC_KEY,
            price: 1000000000,
            amount: 10,
            matcherFee: 1000000,
            priceAsset: null,
            amountAsset: assetId,
        }

        const ord = order(oParams, MASTER_SEED)
        console.log('ord', JSON.stringify(ord, undefined, ' '))
        const submitResp = await submitOrder(ord as any, MATCHER_URL)
        expect(submitResp.status).toEqual('OrderAccepted')

        const co = cancelOrder({orderId: (ord as any).id}, MASTER_SEED)
        const cancelResp: any = await cancelSubmittedOrder(co, ord.assetPair.amountAsset, ord.assetPair.priceAsset, MATCHER_URL)
        expect(cancelResp.status).toEqual('OrderCanceled')
    }, TIMEOUT)


    it('should submit and cancel order', async () => {
        const oParams = {
            orderType: 'buy' as 'buy',
            matcherPublicKey: MATCHER_PUBLIC_KEY,
            price: 1000000000,
            amount: 10,
            matcherFee: 1000000,
            priceAsset: null,
            amountAsset: assetId,
            version: 4,
        }

        const ord = order(oParams, MASTER_SEED)
        console.log('ord', JSON.stringify(ord, undefined, ' '))
        // const submitResp = await submitOrder(ord, MATCHER_URL)
        // expect(submitResp.status).toEqual('OrderAccepted')
        //
        // const co = cancelOrder({orderId: ord.id}, MASTER_SEED)
        // const cancelResp = await cancelSubmittedOrder(co, ord.assetPair.amountAsset, ord.assetPair.priceAsset, MATCHER_URL)
        // expect(cancelResp.status).toEqual('OrderCanceled')
    }, TIMEOUT)

    it('should submit and cancel market order', async () => {
        const oParams = {
            orderType: 'buy' as 'buy',
            matcherPublicKey: MATCHER_PUBLIC_KEY,
            price: 100000000,
            amount: 10,
            matcherFee: 1000000,
            priceAsset: null,
            amountAsset: assetId,
        }

        const ord = order(oParams, MASTER_SEED)
        const submitResp = await submitOrder(ord as any, {market: false, matcherUrl: MATCHER_URL})
        expect(submitResp.status).toEqual('OrderAccepted')

        const co = cancelOrder({orderId: (ord as any).id}, MASTER_SEED)
        const cancelResp: any = await cancelSubmittedOrder(co, ord.assetPair.amountAsset, ord.assetPair.priceAsset, MATCHER_URL)
        expect(cancelResp.status).toEqual('OrderCanceled')
    }, TIMEOUT)

    it('order validation', async () => {
        const order1 = order({
            matcherPublicKey: MATCHER_PUBLIC_KEY,
            //matcherPublicKey: publicKey(seed),
            orderType: 'buy',
            matcherFee: 1000000,
            amountAsset: assetId,
            priceAsset: null,
            amount: 1,
            price: 100000000,
        }, MASTER_SEED)

        const order2 = order({
            matcherPublicKey: MATCHER_PUBLIC_KEY,
            //matcherPublicKey: publicKey(seed),
            orderType: 'sell',
            matcherFee: 1000000,
            amountAsset: assetId,
            priceAsset: null,
            amount: 1,
            price: 100000000,
        }, MASTER_SEED)

        await submitOrder(order1 as any, MATCHER_URL)
        await submitOrder(order2 as any, MATCHER_URL)

    }, TIMEOUT)
})
