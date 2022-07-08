//const seed1 = 'alter bar cycle pioneer library eye calm soft swing motion limit taste supreme afford caution' //complex account

import {burn, exchange, order} from '../../src'
import {base16Decode, base58Decode} from '@waves/ts-lib-crypto'

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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 1
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 2
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 2
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 2
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 2
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 2
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 3
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 3
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 3
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 3
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 3
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver3-3-3', () => {
        const order1 = {
            version: 3,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 3
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx ver3-3-4', () => {
        const order1 = {
            version: 3,
            amount: 100,
            price: 500000000,
            matcherFee: 100,
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            amountAsset: "3JmaWyFqWo8YSA8x3DXCBUW7veesxacvKx19dMv7wTMg",
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
            version: 3
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        expect(tx).toMatchObject({...txOk})
    })

    it('Should build exchange tx with eth order', () => {
        const order1 = {
            version: 4,
            orderType: "buy",
            assetPair: {
                amountAsset: "WAVES",
                priceAsset: "49y6xCWJJdNhCG88oPktziUuqiTGmd4d62AYGZ84ecTR"
            },
            matcherPublicKey: "Hs9CHtitSJHmKqa9euDxBtjD1HrRJMVBqPDVcAEjZesz",
            senderPublicKey: "Bra4LL9m1sDXqg6XMJxRGKBZwLVbgE77kurgduBhRFew",
            matcherFeeAssetId: "49y6xCWJJdNhCG88oPktziUuqiTGmd4d62AYGZ84ecTR",
            amount: 1000000,
            price: 5267200,
            matcherFee: 100000,
            timestamp: 1657106983249,
            expiration: 1657193383249,
            eip712Signature: '0x9b2dc19109b2ab57c5ac9468c43c8648457d981b159f1428bf02ea56a5f6438260d4cfda0e29a59bc5e7bead4485ac4b239818accc509d4d4efc6c530627473c1c',
            id: ''
        }

        const order2 = {
            orderType: "sell",
            version: 3,
            assetPair: {
                "amountAsset": "WAVES",
                "priceAsset": "49y6xCWJJdNhCG88oPktziUuqiTGmd4d62AYGZ84ecTR"
            },
            price: 5267200,
            amount: 1000000,
            timestamp: 1657106991124,
            expiration: 1657193391124,
            matcherFee: 100000,
            matcherPublicKey: "Hs9CHtitSJHmKqa9euDxBtjD1HrRJMVBqPDVcAEjZesz",
            senderPublicKey: "Hs9CHtitSJHmKqa9euDxBtjD1HrRJMVBqPDVcAEjZesz",
            proofs: [
                "5E9Un2fmTLFMXfRTJNkEeSnP8zSJVB4Va5z9qh2FX89rYnw5bvcKBzmZkSNpeWnJgX2CGk6Wt5iuUK7HTR14dQiz"
            ],
            matcherFeeAssetId: null,
            id: "8GA6YUtAyS3HZTFk3JVq3PD5bCaJXmAYSu5hai25Nm64"
        }


        const txOk = {
            order1,
            order2,
            price: 500000000,
            amount: 100,
            buyMatcherFee: 100,
            sellMatcherFee: 100,
            chainId: 84,
            fee: 700000,
            version: 3
        }

        // @ts-ignore
        //console.log(
        const tx = exchange({...txOk}, seed1)
        console.log('tx', tx)
        expect(tx).toMatchObject({...txOk})
    })

})
