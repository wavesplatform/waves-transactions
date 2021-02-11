import {protoBytesToTx, txToProtoBytes} from '../../src/proto-serialize'
import {binary} from '@waves/marshall'

const data1 = {
    type: 17,
    version: 1,
    chainId: 68,
    senderPublicKey: "8oKJXQtbtQ6gh5GJGYFXs8fPo7bmVgtWBNFyL4fULYvy",
    sender: "3FZxrnQSk1AgZifVwTSxeD3sES8rNq1nXaw",
    assetId: "CR7DB15TWwnr3xE9CYJx6EMJGjGqDEbwxB6AsKch5FGM",
    name: "Asset1",
    description: "1234description",
    fee: 200000000,
    feeAssetId: null,
    timestamp: 1607691024082,
}

const data2 = {
    type: 17,
    version: 1,
    chainId: 68,
    senderPublicKey: "8oKJXQtbtQ6gh5GJGYFXs8fPo7bmVgtWBNFyL4fULYvy",
    sender: "3FZxrnQSk1AgZifVwTSxeD3sES8rNq1nXaw",
    assetId: "EbvoPG191bVa2HfMGoRAJyeysHQbTDLDMadtSfCmSggJ",
    name: "aaaa",
    description: "",
    fee: 9223372036854775807,
    feeAssetId: null,
    timestamp: 1613033219687,
}

describe('data', () => {


    test.each([
        [
            data1,
            new Uint8Array([8, 68, 18, 32, 115, -33, 56, 82, 12, 6, 24, -37, 112, -87, -97, -67, 96, -14, -90, -20, 29, 34, 0, 117, -26, -105, 48, -72, 76, -39, -113, 32, 72, 88, -35, 62, 26, 5, 16, -128, -124, -81, 95, 32, -46, -19, -24, -114, -27, 46, 40, 1, -86, 7, 59, 10, 32, -87, -99, -124, 98, -101, 66, -4, -6, 36, -114, -67, -20, -48, -104, -91, -53, 86, -19, -38, -7, -79, 97, -56, 57, 26, 0, 9, -40, 0, -11, -21, -14, 18, 6, 65, 115, 115, 101, 116, 49, 26, 15, 49, 50, 51, 52, 100, 101, 115, 99, 114, 105, 112, 116, 105, 111, 110]),
        ],
        [
            data2,
            new Uint8Array([8, 68, 18, 32, 115, -33, 56, 82, 12, 6, 24, -37, 112, -87, -97, -67, 96, -14, -90, -20, 29, 34, 0, 117, -26, -105, 48, -72, 76, -39, -113, 32, 72, 88, -35, 62, 26, 10, 16, -1, -1, -1, -1, -1, -1, -1, -1, 127, 32, -57, -10, -59, -125, -7, 46, 40, 1, -86, 7, 40, 10, 32, -54, 26, -126, 83, -94, -126, -17, 9, -104, 126, 21, -48, 44, -101, 66, 21, 17, 102, -16, 38, -99, 112, 33, 96, -58, 18, 25, 94, 25, 73, -10, -21, 18, 4, 97, 97, 97, 97]),
        ],
    ])('check serialization for %o, tx version: %i', (data, expectedBytes) => {
        const tx = data
        console.log(protoBytesToTx(new Uint8Array([8, 68, 18, 32, 115, -33, 56, 82, 12, 6, 24, -37, 112, -87, -97, -67, 96, -14, -90, -20, 29, 34, 0, 117, -26, -105, 48, -72, 76, -39, -113, 32, 72, 88, -35, 62, 26, 10, 16, -1, -1, -1, -1, -1, -1, -1, -1, 127, 32, -57, -10, -59, -125, -7, 46, 40, 1, -86, 7, 40, 10, 32, -54, 26, -126, 83, -94, -126, -17, 9, -104, 126, 21, -48, 44, -101, 66, 21, 17, 102, -16, 38, -99, 112, 33, 96, -58, 18, 25, 94, 25, 73, -10, -21, 18, 4, 97, 97, 97, 97])))
        console.log(protoBytesToTx(txToProtoBytes(tx)))
        // console.log(txToProtoBytes(tx).slice(90))
        const bytes = txToProtoBytes(tx)
        expect(bytes).toEqual(expectedBytes)
    })
})
