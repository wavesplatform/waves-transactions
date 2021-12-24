export const invokeScriptBinaryTx = {
    'InvokeScript TX (type 16 v1)  case 1': {
        'Bytes': 'EAFUjY+yjcB1fArFRi26YEYA7BeLB3tUgJK6I9GKMWhjN3QBVMCJgEpQH4BNVdKzU7jR4jDzcS12MCJROwAAAH//////////AAAAAX3s0HPM',
        'Json': {
            "id": "BQQE2DUvARCFEmxMibnTNwc4S66LmVXuqhZtVYgwBgCd",
            "type": 16,
            "version": 1,
            "senderPublicKey": "AXbaBkJNocyrVpwqTzD4TpUY8fQ6eeRto9k1m2bNCzXV",
            "sender": "3MsX9C2MzzxE4ySF5aYcJoaiPfkyxZMg4cW",
            "dApp": "3N7U8EVrPNXRp4rQ6LNebhmjqzA4gPY641Q",
            "payment": [],
            "fee": '9223372036854775807',
            "feeAssetId": null,
            "timestamp": 1640355623884,
            "proofs": ["3Bpf95Wfb3LzG92QrW3hibot33PVCKkkkV2o7NzwKhdXgPixTzWvGGzCFM5ySeoMxzP5ZGoMTLsE9ZHtcb6LVVq6"]
        },
    },
     'InvokeScript TX (type 16 v1)  case 2': {
        'Bytes': 'EAFUjY+yjcB1fArFRi26YEYA7BeLB3tUgJK6I9GKMWhjN3QBVMCJgEpQH4BNVdKzU7jR4jDzcS12MCJROwAAAgAJAAAAAAAAAAoAACl//////////wHKGoJTooLvCZh+FdAsm0IVEWbwJp1wIWDGEhleGUn263//////////AAAAAX3tAqgm',
        'Json': {
            'id': 'FsZJ8i7pUCfBkTE8JA1xvi7mMWeRCbuXMUfdx1bM6Btr',
            'type': 16,
            'version': 1,
            'senderPublicKey': 'AXbaBkJNocyrVpwqTzD4TpUY8fQ6eeRto9k1m2bNCzXV',
            'sender': '3MsX9C2MzzxE4ySF5aYcJoaiPfkyxZMg4cW',
            'dApp': '3N7U8EVrPNXRp4rQ6LNebhmjqzA4gPY641Q',
            'payment': [
                { 'amount': 10, 'assetId': null },
                { 'amount': '9223372036854775807', 'assetId': 'EbvoPG191bVa2HfMGoRAJyeysHQbTDLDMadtSfCmSggJ' }
            ],
            'fee': '9223372036854775807',
            'feeAssetId': null,
            'timestamp': 1640358914086,
            'proofs': ['5eSXMu8BBNpZNbbaod9bKt2y1NstGyHTohLvzZ59uMryQym3fGskEWBCPPtCY87A5c7CotTJCYPjzUe9MD311Jyn']
        },
    },
    'InvokeScript TX (type 16 v1)  case 3': {
        'Bytes': 'EAFUjY+yjcB1fArFRi26YEYA7BeLB3tUgJK6I9GKMWhjN3QBVMCJgEpQH4BNVdKzU7jR4jDzcS12MCJROwEJAQAAAAx0ZXN0RnVuY3Rpb24AAAAFAAAAAAAAAABmBgEAAAAaAUSrt+cbF9ynG8qp35jiFFS61VDjH3rKYsMCAAAAJjExMTNGUFFnSnduVlhZSjg4UW56NFY0Z3FSODliQXFSYTdxTmlZCwAAAAQAAAAAAAAAAGUHAQAAABoBRKu35xsX3KcbyqnfmOIUVLrVUOMfespiwwIAAAAjM0ZQUWdKd25WWFlKODhRbno0VjRncVI4OWJBcVJhN3FOaVkAAgAJAAAAAAAAAAoAACl//////////wHKGoJTooLvCZh+FdAsm0IVEWbwJp1wIWDGEhleGUn26wAAAAAAB6EgAAAAAX3tEjIe',
        'Json': {
            'id': 'Chz3zudzxTjHzXU8gkchF58jf42eYM3ixHM8s2941hth',
            'type': 16,
            'version': 1,
            'senderPublicKey': 'AXbaBkJNocyrVpwqTzD4TpUY8fQ6eeRto9k1m2bNCzXV',
            'sender': '3MsX9C2MzzxE4ySF5aYcJoaiPfkyxZMg4cW',
            'dApp': '3N7U8EVrPNXRp4rQ6LNebhmjqzA4gPY641Q',
            'call': {
                'function': 'testFunction',
                'args': [
                    { 'type': 'integer', 'value': 102 },
                    { 'type': 'boolean', 'value': true },
                    { 'type': 'binary',  'value': 'base64:AUSrt+cbF9ynG8qp35jiFFS61VDjH3rKYsM=' },
                    { 'type': 'string',  'value': '1113FPQgJwnVXYJ88Qnz4V4gqR89bAqRa7qNiY' },
                    {
                        'type': 'list',
                        'value': [
                            { 'type': 'integer', 'value': 101 },
                            { 'type': 'boolean', 'value': false },
                            { 'type': 'binary',  'value': 'base64:AUSrt+cbF9ynG8qp35jiFFS61VDjH3rKYsM=' },
                            { 'type': 'string',  'value': '3FPQgJwnVXYJ88Qnz4V4gqR89bAqRa7qNiY' }
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
            'timestamp': 1640359932446,
            'proofs': ['5X7AwR3tD5oXp4mFPGAZjZ9pELRy5JBhLwdWCmbReYwPDqRUj5yHqyHoqXqTx99ZZryNhM3FKYGVPQvwt6Utfh66']
        },
    },
}
