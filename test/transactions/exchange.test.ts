//const seed1 = 'alter bar cycle pioneer library eye calm soft swing motion limit taste supreme afford caution' //complex account

import {burn, exchange, order} from '../../src'
import {
    base16Decode,
    base58Decode,
    base58Encode,
    base64Decode,
    base64Encode,
    decryptSeed,
    privateKey
} from '@waves/ts-lib-crypto'

var fs = require("fs")
import {protoBytesToSignedTx, protoBytesToTx, txToProtoBytes} from '../../src/proto-serialize'

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
        const tx = {
            "type": 7,
            "id": "8P5aaQRM3WqyBR4NKSrQ7DvNS33unGnSLhDrKznuuYwd",
            "fee": 300000,
            "feeAssetId": null,
            "timestamp": 1657298867221,
            "version": 3,
            "chainId": 84,
            "sender": "3N5ZivLz47XoHGPMAq3aGpnJCS4Fx44iDqx",
            "senderPublicKey": "3AQd4ntCbdDnnNqM3NGoXTVCGiDgqEavHKhAmwm8QQDq",
            "order1": {
                "version": 4,
                "id": "45Bo6QfnHDFqxBWeuP3cEt67N7UULuym82NhqZyBMXJk",
                "matcherPublicKey": "3AQd4ntCbdDnnNqM3NGoXTVCGiDgqEavHKhAmwm8QQDq",
                "assetPair": {"amountAsset": null, "priceAsset": "CTnZhTVFPmM9tLZurbKEjqLCVEqVXZXsCSFdMJyXYog4"},
                "orderType": "buy",
                "amount": 300000000,
                "price": 700000000,
                "timestamp": 1657298867221,
                "expiration": 1658738867221,
                "matcherFee": 300,
                "signature": "",
                "proofs": [],
                "matcherFeeAssetId": "CTnZhTVFPmM9tLZurbKEjqLCVEqVXZXsCSFdMJyXYog4",
                "eip712Signature": "0x612b9fd8f8f256ad892d48fb813b92489c1c9775e72e41a7b9dbb91b389d19e1375d822325f30ba7a5c6a5735e809c983ea67080e8ada31208cbe2afdc5c42041b",
                "priceMode": "fixedDecimals"
            },
            "order2": {
                "version": 4,
                "id": "BwQSBPXFdMtFiAtLGsDEjTekeCXsivCEtExcrGVSJc2t",
                "sender": "3N8BBSNsYz3BdcwxjoBJz2kRzeGbPcExsZ8",
                "senderPublicKey": "5eZvmCtYN8gDbXz83vyqyAXgNvFo5gndSfDhCLnv9e2Y",
                "matcherPublicKey": "3AQd4ntCbdDnnNqM3NGoXTVCGiDgqEavHKhAmwm8QQDq",
                "assetPair": {"amountAsset": null, "priceAsset": "CTnZhTVFPmM9tLZurbKEjqLCVEqVXZXsCSFdMJyXYog4"},
                "orderType": "sell",
                "amount": 300000000,
                "price": 700000000,
                "timestamp": 1657298867221,
                "expiration": 1658738867121,
                "matcherFee": 300000,
                "signature": "5oohG1ZeVTyQssp2oQY6snGdCeRri6gMLK5WwCg4p6mGgTndABVWJs3g1XMpBXwPYJ8t6AHPLg9bccENF5Zje1jY",
                "proofs": ["5oohG1ZeVTyQssp2oQY6snGdCeRri6gMLK5WwCg4p6mGgTndABVWJs3g1XMpBXwPYJ8t6AHPLg9bccENF5Zje1jY"],
                "matcherFeeAssetId": null,
                "eip712Signature": null,
                "priceMode": "fixedDecimals"
            },
            "amount": 300000000,
            "price": 700000000,
            "buyMatcherFee": 300,
            "sellMatcherFee": 300000
        }

        const bytes = txToProtoBytes(tx)

        protoBytesToTx(bytes)
        // fs.open('bytes.txt')
        // fs.appendFile('bytes.txt', bytes)
        // fs.appendFile('bytes.txt', base64Decode('CFQSIGUZoN2CVb5lYBT8HonvrWhxoRG8CDfsE7iGyUvQjPQaGgQQ4KcSIOmR+PKdMCgD2ga7AwiAxoaPARCAzuTNAhisAiDgpxIq0AEIVBogZRmg3YJVvmVgFPweie+taHGhEbwIN+wTuIbJS9CM9BoiIhIgqk0tI30IOGpaT3pfVl7EPWkXgJJ7oAiXSru08Edwe0kwgMaGjwE4gM7kzQJA6ZH48p0wSOnhyqGjMFIlCiCqTS0jfQg4alpPel9WXsQ9aReAknugCJdKu7TwR3B7SRCsAlgEakGdvFvMhw3xUMzfM7opWPVSCYrpGaB+RAk0EaHyGcWlzk9CXlOXsf8pGBurCkt1/QOTRTHNcCq5MJGsRhMXfpJ7G3ABKtIBCFQSIEUOd97TqGCXqNFWX6LWvyom7x1JTS0e4afMx34rXWN9GiBlGaDdglW+ZWAU/B6J761ocaERvAg37BO4hslL0Iz0GiIiEiCqTS0jfQg4alpPel9WXsQ9aReAknugCJdKu7TwR3B7SSgBMIDGho8BOIDO5M0CQOmR+PKdMEiF4cqhozBSBBDgpxJYBGJAgmvBpalAPqy0FXVmHj1Dd/RUXq0XBfMXxqd7D28uyt3CEsd1RbWQlVPgK5oJ11SGSvUCkPFDZCdotbtEJjIXCnAB'))

        const signedTx = exchange(tx, 'matcher seed 12345')

        // console.log(base64Encode(base16Decode('9dbc5bcc870df150ccdf33ba2958f552098ae919a07e44093411a1f219c5a5ce4f425e5397b1ff29181bab0a4b75fd03934531cd702ab93091ac4613177e927b1b')))
        console.log(JSON.stringify(signedTx, undefined, ' '))
        expect(bytes).toEqual('CFQSIGUZoN2CVb5lYBT8HonvrWhxoRG8CDfsE7iGyUvQjPQaGgQQ4KcSIJOXiaSdMCgD2ga7AwiAxoaPARCAzuTNAhisAiDgpxIq0AEIVBogZRmg3YJVvmVgFPweie+taHGhEbwIN+wTuIbJS9CM9BoiIhIgqk0tI30IOGpaT3pfVl7EPWkXgJJ7oAiXSru08Edwe0kwgMaGjwE4gM7kzQJAk5eJpJ0wSJPn29KiMFIlCiCqTS0jfQg4alpPel9WXsQ9aReAknugCJdKu7TwR3B7SRCsAlgEakGzikLukKih7e6JB//Nt1C/ToTkROG9taRVjCkMUiL+GgWSvfFAgzRW/i1FEHTMDHVF3C8FGF7OGawon+HJGQuwG3ABKtIBCFQSIEUOd97TqGCXqNFWX6LWvyom7x1JTS0e4afMx34rXWN9GiBlGaDdglW+ZWAU/B6J761ocaERvAg37BO4hslL0Iz0GiIiEiCqTS0jfQg4alpPel9WXsQ9aReAknugCJdKu7TwR3B7SSgBMIDGho8BOIDO5M0CQJOXiaSdMEiv5tvSojBSBBDgpxJYBGJAG6Spyq5rHLSHsUmWJu0P5zMjQIh2RijwGHVPSHAHCyB0SONxT5jBkeUcZAi1NoBfBOBXo9412g72p+09xdXHCnAB')
    })

})
