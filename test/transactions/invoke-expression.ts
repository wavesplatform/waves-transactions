// import { broadcast, signTx } from '../../src'
// import { invokeExpression } from '../../src'
//
// describe('invoke-expression', () => {
//
//     const stringSeed = 'visual order dream december rifle bachelor split mountain between slam figure minor section tongue recycle'
//
//     it('should build and broadcast', async () => {
//         const senderPublicKey = 'CpgZLkDgsjH5cwzFNH2w1GBfUSc1c3ndK56WkjQpEWjm'
//         const tx = invokeExpression({
//             'type': 18,
//             'version': 1,
//             'expression': 'base64:/wYFAAAAA25pbBYQh30=',
//             'fee': 1400000,
//             'feeAssetId': null,
//             'timestamp': Date.now(),
//             'chainId': 83,
//             'proofs': [],
//             senderPublicKey,
//         } as any)
//         // console.log(JSON.stringify(tx, null, ' '))
//
//         const signingTx = await signTx(tx, stringSeed)
//         await broadcast(signingTx, 'https://nodes-stagenet.wavesnodes.com')
//     })
// })
