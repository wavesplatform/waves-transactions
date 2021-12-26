export const invokeScriptBinaryTx = {
    'InvokeScript TX (type 16 v1)  case 1': {
        'Bytes': 'EAFUjY+yjcB1fArFRi26YEYA7BeLB3tUgJK6I9GKMWhjN3QBVMCJgEpQH4BNVdKzU7jR4jDzcS12MCJROwAAAH//////////AAAAAX3tST2r',
        'Json': {
            'id': '6s4Y9YDWzqBjQM8b4iXCYBxZcK1qD9DEA8Fi4gFfHQgc',
            'type': 16,
            'version': 1,
            'senderPublicKey': 'AXbaBkJNocyrVpwqTzD4TpUY8fQ6eeRto9k1m2bNCzXV',
            'sender': '3MsX9C2MzzxE4ySF5aYcJoaiPfkyxZMg4cW',
            'dApp': '3N7U8EVrPNXRp4rQ6LNebhmjqzA4gPY641Q',
            'chainId': 84,
            'payment': [],
            'fee': '9223372036854775807',
            'feeAssetId': null,
            'timestamp': 1640363539883,
            'proofs': ['4kcTJ3PTPEbcoa35WWkZG1vtr7qD6StsXASk3zJ1vxFFGu6qy8VNjpmi23juhCkZMrHBekyJUHKj7L3iKk46NKHn']
        },
    },
     'InvokeScript TX (type 16 v1)  case 2': {
        'Bytes': 'EAFUjY+yjcB1fArFRi26YEYA7BeLB3tUgJK6I9GKMWhjN3QBVMCJgEpQH4BNVdKzU7jR4jDzcS12MCJROwAAAgAJAAAAAAAAAAoAACl//////////wHKGoJTooLvCZh+FdAsm0IVEWbwJp1wIWDGEhleGUn263//////////AAAAAX3tQ6q4',
        'Json': {
            'id': 'GgCva2bMstqoBqNPc45oVagFavwvgXm2e4ek5T7qmDAG',
            'type': 16,
            'version': 1,
            'chainId': 84,
            'senderPublicKey': 'AXbaBkJNocyrVpwqTzD4TpUY8fQ6eeRto9k1m2bNCzXV',
            'sender': '3MsX9C2MzzxE4ySF5aYcJoaiPfkyxZMg4cW',
            'dApp': '3N7U8EVrPNXRp4rQ6LNebhmjqzA4gPY641Q',
            'payment': [
                { 'amount': 10, 'assetId': null },
                { 'amount': '9223372036854775807', 'assetId': 'EbvoPG191bVa2HfMGoRAJyeysHQbTDLDMadtSfCmSggJ' }
            ],
            'fee': '9223372036854775807',
            'feeAssetId': null,
            'timestamp': 1640363174584,
            'proofs': ['4hfyReG7jzKRMi6QnXNoikrVD148xWCmfWjbSoYhKtWJAuJ9oy8Np5aeDn5Yru5P8nr3PwftonuZjjQGWcCeLUiD']
        },
    },
    'InvokeScript TX (type 16 v1)  case 3': {
        'Bytes': 'EAFUjY+yjcB1fArFRi26YEYA7BeLB3tUgJK6I9GKMWhjN3QBVMCJgEpQH4BNVdKzU7jR4jDzcS12MCJROwEJAQAAAAx0ZXN0RnVuY3Rpb24AAAAFAAAAAAAAAABmBgEAAAAaAUSrt+cbF9ynG8qp35jiFFS61VDjH3rKYsMCAAAAJjExMTNGUFFnSnduVlhZSjg4UW56NFY0Z3FSODliQXFSYTdxTmlZCwAAAAQAAAAAAAAAAGUHAQAAABoBRKu35xsX3KcbyqnfmOIUVLrVUOMfespiwwIAAAAjM0ZQUWdKd25WWFlKODhRbno0VjRncVI4OWJBcVJhN3FOaVkAAgAJAAAAAAAAAAoAACl//////////wHKGoJTooLvCZh+FdAsm0IVEWbwJp1wIWDGEhleGUn26wAAAAAAB6EgAAAAAX3tOFjh',
        'Json': {
            'id': 'GMVTgVwH99LcxCWQhh8NgaWaXMrg8rm5RLeBxRsEFnzx',
            'type': 16,
            'chainId': 84,
            'version': 1,
            'senderPublicKey': 'AXbaBkJNocyrVpwqTzD4TpUY8fQ6eeRto9k1m2bNCzXV',
            'sender': '3MsX9C2MzzxE4ySF5aYcJoaiPfkyxZMg4cW',
            'dApp': '3N7U8EVrPNXRp4rQ6LNebhmjqzA4gPY641Q',
            'call': {
                'function': 'testFunction',
                'args': [
                    { 'type': 'integer', 'value': 102 },
                    { 'type': 'boolean', 'value': true },
                    { 'type': 'binary', 'value': 'base64:AUSrt+cbF9ynG8qp35jiFFS61VDjH3rKYsM=' },
                    { 'type': 'string', 'value': '1113FPQgJwnVXYJ88Qnz4V4gqR89bAqRa7qNiY' },
                    {
                        'type': 'list',
                        'value': [
                            { 'type': 'integer', 'value': 101 },
                            { 'type': 'boolean', 'value': false },
                            { 'type': 'binary', 'value': 'base64:AUSrt+cbF9ynG8qp35jiFFS61VDjH3rKYsM=' },
                            { 'type': 'string', 'value': '3FPQgJwnVXYJ88Qnz4V4gqR89bAqRa7qNiY' }
                        ]
                    }
                ]
            },
            'payment': [
                { 'amount': 10, 'assetId': null },
                { 'amount': '9223372036854775807', 'assetId': 'EbvoPG191bVa2HfMGoRAJyeysHQbTDLDMadtSfCmSggJ' }
            ],
            'fee': 500000,
            'feeAssetId': null,
            'timestamp': 1640362432737,
            'proofs': ['2fNW96ZxxyFQenaiewB7NiSmfv2QEqbquET2upDLWKPTuja7YZ6uSnd11yBCCQWkiCJS9iJT9nv12A9L2HvHrQgh']
        },
    },
}
