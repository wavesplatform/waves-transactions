import {protoBytesToTx, txToProtoBytes} from '../../src/proto-serialize'
import {signTx} from '../../src'
import {issue} from '../../src/transactions/issue'

const data1 = {
    type: 17,
    version: 1,
    chainId: 68,
    senderPublicKey: '8oKJXQtbtQ6gh5GJGYFXs8fPo7bmVgtWBNFyL4fULYvy',
    sender: '3FZxrnQSk1AgZifVwTSxeD3sES8rNq1nXaw',
    assetId: 'CR7DB15TWwnr3xE9CYJx6EMJGjGqDEbwxB6AsKch5FGM',
    name: 'Asset1',
    description: '1234description',
    fee: 200000000,
    feeAssetId: null,
    timestamp: 1607691024082,
}

const data2 = {
    version: 1,
    type: 17,
    senderPublicKey: '6XL9j54z68ZrHV5UcMtNULkUQYaviy8n7H2rhW2kpca',
    timestamp: 1625058886516,
    fee: 100000,
    chainId: 68,
    assetId: '12qPBifsNthFfUVdML7oUsNC1AyBegZUWjWQpmkzGeVr',
    name: 'abc',
    description: '',
}

const data3 ={
    version:3,
    type: 3,
    name: 'aaaaaaaaaaaaaaaa',
    description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    senderPublicKey: 'HXs9rwQW9CGM2KXkxMoubwnhWypCa2LtH1JEJkZa9yDF',
    sender:'3Fe3oGLjrxJasvgLyEVHEfA3ryMF3G9BEhX',
        chainId: 68,
    quantity: 1234567,
    decimals: 7,
    feeAssetId: 'EbvoPG191bVa2HfMGoRAJyeysHQbTDLDMadtSfCmSggJ',
    timestamp: 1601311665776,
    reissuable: true,

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
            new Uint8Array([8,68,18,32,1,106,50,-48,47,-58,30,17,-43,-58,54,56,-46,-52,32,-109,-19,90,-71,67,-88,-71,109,104,20,119,94,117,40,-79,36,19,26,4,16,-96,-115,6,32,-12,-122,-69,-24,-91,47,40,1,-86,7,39,10,32,0,120,73,125,-110,-47,8,-116,67,-42,-103,-73,103,118,37,-80,-22,97,121,-61,-52,-122,17,74,-18,48,107,112,51,52,-87,5,18,3,97,98,99]),
        ],
    ])('check serialization for %o, tx version: %i', (data, name, expectedBytes) => {
        const tx = data
        const bytes = txToProtoBytes(tx)
        expect(bytes).toEqual(expectedBytes)

    })
    it('hhh', () =>{
        let tx = issue({...data3})
        console.log(tx)
        console.log(tx.id)
        //const signed = signTx(data3, stringSeed)
    })
})
