import {protoBytesToTx, txToProtoBytes} from '../../src/proto-serialize'

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
    version: 1,
    type: 17,
    senderPublicKey: "Athtgb7Zm9V6ExyAzAJM1mP57qNAW1A76TmzXdDZDjbt",
    timestamp: 1613040552320,
    fee: 100000,
    chainId: 84,
    assetId: "CBEJvpsMfhT9qFxNYL5Efv1DwE3JJ4LUPX3hpPfvjU3x",
    name: "aaaa",
    description: "",
}

describe('data', () => {


    test.each([
        [
            data1,
            'data1',
            new Uint8Array([8, 68, 18, 32, 115, -33, 56, 82, 12, 6, 24, -37, 112, -87, -97, -67, 96, -14, -90, -20, 29, 34, 0, 117, -26, -105, 48, -72, 76, -39, -113, 32, 72, 88, -35, 62, 26, 5, 16, -128, -124, -81, 95, 32, -46, -19, -24, -114, -27, 46, 40, 1, -86, 7, 59, 10, 32, -87, -99, -124, 98, -101, 66, -4, -6, 36, -114, -67, -20, -48, -104, -91, -53, 86, -19, -38, -7, -79, 97, -56, 57, 26, 0, 9, -40, 0, -11, -21, -14, 18, 6, 65, 115, 115, 101, 116, 49, 26, 15, 49, 50, 51, 52, 100, 101, 115, 99, 114, 105, 112, 116, 105, 111, 110]),
        ],
        [
            data2,
            'data2',
            new Uint8Array([8,84,18,32,-110,-8,10,14,-26,-14,-123,126,-79,73,-1,-35,36,22,112,-103,-56,14,-16,99,93,-120,119,76,-120,-17,114,66,9,-83,44,47,26,4,16,-96,-115,6,32,-128,-109,-42,-123,-7,46,40,1,-86,7,40,10,32,-90,15,105,-75,-18,-100,13,54,93,21,-84,56,-15,-84,-49,-48,57,75,12,-97,123,-118,35,25,-88,-42,10,-101,55,-117,99,23,18,4,97,97,97,97])
        ]
    ])('check serialization for %o, tx version: %i', (data, name, expectedBytes) => {
        const tx = data
        console.log('data', data)
        console.log('protoBytesToTx', protoBytesToTx(new Uint8Array(expectedBytes)))
        console.log('txToProtoBytes -> protoBytesToTx', protoBytesToTx(txToProtoBytes(tx)))
        const fs=require('fs')
        fs.writeFileSync(`../${name}_bytes.txt`, txToProtoBytes(tx))
        const bytes = txToProtoBytes(tx)
        expect(bytes).toEqual(expectedBytes)
    })
})
