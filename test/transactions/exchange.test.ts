//const seed1 = 'alter bar cycle pioneer library eye calm soft swing motion limit taste supreme afford caution' //complex account

import {broadcast, exchange, order} from '../../src'
import {Seed} from '../../src/seedUtils'
import {publicKey} from '@waves/ts-lib-crypto'
import {txToProtoBytes} from '../../src/proto-serialize'

var fs = require('fs')


const seed1 = 'shoe used festival regular fancy electric powder symptom stool physical cabbage need accuse silly ring' //plain acc

const seed2 = 'next one puppy history bag vanish conduct lion royal dentist reject usual story invite leader'


// scripted asset: "DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK",

describe('exchange', () => {

    it('Should build exchange tx', () => {
        const order1 = {
            version: 4,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 4,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 'T',
            fee: 700000,
            version: 3,
            proofs: [],
        }

        // @ts-ignore
        console.log(exchange({...txOk}, seed1))
    })

    it('Should build exchange tx ver1-1-1', () => {
        const order1 = {
            version: 1,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 1,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 'T',
            fee: 700000,
            version: 1,
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk, chainId: txOk.chainId.charCodeAt()})
    })


    it('Should build exchange tx ver2-1-1', () => {
        const order1 = {
            version: 1,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 1,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 2,
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver2-1-2', () => {
        const order1 = {
            version: 1,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 2,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 2,
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver2-2-2', () => {
        const order1 = {
            version: 2,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 2,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 2,
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver2-1-3', () => {
        const order1 = {
            version: 1,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 3,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 2,
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver2-2-3', () => {
        const order1 = {
            version: 2,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 3,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 2,
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver3-4-4', () => {
        const order1 = {
            version: 4,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 4,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 3,
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver3-1-1', () => {
        const order1 = {
            version: 1,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 1,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 3,
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver3-1-2', () => {
        const order1 = {
            version: 1,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 2,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 3,
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver3-2-2', () => {
        const order1 = {
            version: 2,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 2,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 3,
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver3-2-3', () => {
        const order1 = {
            version: 2,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 3,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 3,
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver3-3-4', async () => {
        const order1 = {
            version: 3,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'buy' as 'buy',
        }

        const order2 = {
            version: 4,
            matcherFee: 100,
            matcherFeeAssetId: 'DvXjujyWbi7ARdExyayN42gcfBKGTBRgYYyPWMxy5grK',
            amount: 100,
            price: 500000000,
            amountAsset: '3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg',
            priceAsset: null,
            matcherPublicKey: 'BvJEWY79uQEFetuyiZAF5U4yjPioMj9J6ZrF9uTNfe3E',
            orderType: 'sell' as 'sell',
        }


        const txOk = {
            order1: order(order1, seed1),
            order2: order(order2, seed2),
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 3,
        }

        // @ts-ignore
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })


    it('', async () => {
        const nodeUrl = 'https://nodes-testnet.wavesnodes.com/'
        const buy_seed = 'acc0'
        const sell_seed = 'acc0'
        const matcher_seed = 'acc0'

        const buy_params = {
            chainId: 'T',
            version: 4,
            amount: 123,
            price: 12_300_000,
            priceAsset: '2jwWMYV12tVeAhMyKy8HphyaMAgQHJL2fWzZgYNCHkNk',
            amountAsset: null,
            matcherPublicKey: publicKey(matcher_seed),
            orderType: 'buy' as 'buy',
            matcherFee: 300000,
            matcherFeeAssetId: null,
            priceMode: 'fixedDecimals' as 'fixedDecimals',
            attachment: 'base64:dGVzdA==',
        }

        const sell_params = {
            chainId: 'T',
            version: 3,
            amount: 123,
            price: 123,
            priceAsset: '2jwWMYV12tVeAhMyKy8HphyaMAgQHJL2fWzZgYNCHkNk',
            amountAsset: null,
            matcherPublicKey: publicKey(matcher_seed),
            orderType: 'sell' as 'sell',
            matcherFee: 300000,
            matcherFeeAssetId: null,
          //  priceMode: 'fixedDecimals',
        }

        const buyOrder = order(buy_params, buy_seed)
        const sellOrder = order(sell_params, sell_seed)

        const exchange_params = {
            chainId: 'T',
            type: 7,
            version: 3,
            order1: buyOrder,
            order2: sellOrder,
            amount: 100,
            price: 12_300_000,
            buyMatcherFee: 300000,
            sellMatcherFee: 300000,
            fee: 300000,
            feeAssetId: null,
        }

        const exchangeTx = exchange(exchange_params, matcher_seed)
        console.log('exchangeTx', JSON.stringify(exchangeTx, undefined, ' '))
        const tx = await broadcast(exchangeTx, nodeUrl).then(resp => console.log(resp)).catch(rej => console.log(rej))
        console.log('tx', JSON.stringify(tx, undefined, ' '))

    })

    it('ex', async () => {
            const fs = require('fs')

            const nodeUrl = 'https://nodes-testnet.wavesnodes.com'
            const buy_seed = 'reject cheese exist bracket kitten body dress piece meadow tuition involve slight estate front fog'
            const sell_seed = 'reject cheese exist bracket kitten body dress piece meadow tuition involve slight estate front fog'
            const matcher_seed = 'reject cheese exist bracket kitten body dress piece meadow tuition involve slight estate front fog'

            const mSeed = new Seed(matcher_seed, 'T')
            console.log(mSeed)
            const mPub = mSeed.keyPair.publicKey

            const t = Date.now()
            const buy_params = {
                chainId: 84,
                version: 4,
                amount: 123,
                price: 123,
                priceAsset: '25FEqEjRkqK6yCkiT7Lz6SAYz7gUFCtxfCChnrVFD5AT',
                amountAsset: null,
                matcherPublicKey: publicKey(matcher_seed),
                orderType: 'buy' as 'buy',
                matcherFee: 300000,
                matcherFeeAssetId: null,
                priceMode: 'fixedDecimals' as 'fixedDecimals',
            }

            const sell_params = {
                chainId: 'T',
                version: 4,
                amount: 123,
                price: 123,
                priceAsset: '25FEqEjRkqK6yCkiT7Lz6SAYz7gUFCtxfCChnrVFD5AT',
                amountAsset: null,
                matcherPublicKey: publicKey(matcher_seed),
                orderType: 'sell' as 'sell',
                matcherFee: 300000,
                timestamp: t,
                expiration: t + 29 * 24 * 60 * 60 * 1000,
                priceMode: 'fixedDecimals' as 'fixedDecimals',
            }


            const sellOrder = order(sell_params, sell_seed)
            const buyOrder = order(buy_params, buy_seed)

            const exchange_params = {
                chainId: 84,
                type: 7,
                version: 3,
                order1: buyOrder,
                order2: sellOrder,
                price: 123,
                amount: 123,
                buyMatcherFee: 300000,
                sellMatcherFee: 300000,
                fee: 300000,
            }

            const exchangeTx = exchange(exchange_params, matcher_seed)
        console.log(exchangeTx)
            await broadcast(exchangeTx, nodeUrl)//.then(resp => console.log(resp)).catch(rej => console.log(rej))

//      const txbytes = txToProtoBytes(exchangeTx)
//      fs.writeFile('bytes.txt', txbytes, function(err, result){
// 	    if(err) console.log('error', err);
// });
        }, 60000
    )

})
