export const invokeScriptTx = {
    'InvokeScript TX (type 16 v2)  case 1': {
        'Bytes': 'CFQSIJL4Cg7m8oV+sUn/3SQWcJnIDvBjXYh3TIjvckIJrSwvGgQQoMIeIPTlkL2mLygCogcbChYKFMCJgEpQH4BNVdKzU7jR4jDzcS12EgEA',
        'Json': {
            'id': '2tCkJaF4pwcb4WGypPXoPHqfZnP88eQNyiC5UcrZznHf',
            'type': 16,
            'version': 2,
            'chainId': 84,
            'senderPublicKey': 'Athtgb7Zm9V6ExyAzAJM1mP57qNAW1A76TmzXdDZDjbt',
            'sender': '3N3kDDPYNbb3vzZRAPkgiR1R7YnLVtSrsiZ',
            'dApp': '3N7U8EVrPNXRp4rQ6LNebhmjqzA4gPY641Q',
            'payment': [],
            'fee': 500000,
            'feeAssetId': null,
            'timestamp': 1625236452084,
            'proofs': ['2GEDViputWwT9zA2do5rU1ErhYMubtpka78D5LFx7Uqqo2t91rCve4jzVKZtZN4eGpPkBSXyyaJmD6A4jVoDPjfE'],
        },
    },
    'InvokeScript TX (type 16 v2)  case 2': {
        'Bytes': 'CFQSIJL4Cg7m8oV+sUn/3SQWcJnIDvBjXYh3TIjvckIJrSwvGiwKIMoaglOigu8JmH4V0CybQhURZvAmnXAhYMYSGV4ZSfbrEP//////////fyD95ZC9pi8oAqIHVgoWChTAiYBKUB+ATVXSs1O40eIw83EtdhISAQkBAAAAB2RlZmF1bHQAAAAAGgIQChokCiDKGoJTooLvCZh+FdAsm0IVEWbwJp1wIWDGEhleGUn26xAU',
        'Json': {
            'id': 'EAFs6Mv92VsvFnxgrHnZQ9qbxPsCukdSsmnZ39kBBhgK',
            'type': 16,
            'version': 2,
            'chainId': 84,
            'senderPublicKey': 'Athtgb7Zm9V6ExyAzAJM1mP57qNAW1A76TmzXdDZDjbt',
            'sender': '3N3kDDPYNbb3vzZRAPkgiR1R7YnLVtSrsiZ',
            'dApp': '3N7U8EVrPNXRp4rQ6LNebhmjqzA4gPY641Q',
            'call': {'function': 'default', 'args': []},
            'payment': [{'amount': 10, 'assetId': null}, {
                'amount': 20,
                'assetId': 'EbvoPG191bVa2HfMGoRAJyeysHQbTDLDMadtSfCmSggJ',
            }],
            'fee': '9223372036854775807',
            'feeAssetId': 'EbvoPG191bVa2HfMGoRAJyeysHQbTDLDMadtSfCmSggJ',
            'timestamp': 1625236452093,
            'proofs': ['57bggAeTpEzjf5d5Lcuc8bKo5NH3bzKtUG2CJZCE4w2HcNoY4DncAMmvVGfc5aMz5Unoa6KxKPv3TYjUo99N71rs'],
        },
    },/*
    'InvokeScript TX (type 16 v2)  case 3': {
        'Bytes': 'CFQSIJL4Cg7m8oV+sUn/3SQWcJnIDvBjXYh3TIjvckIJrSwvGgQQoMIeIP/lkL2mLygCogeIAQoWChTAiYBKUB+ATVXSs1O40eIw83EtdhJIAQkBAAAADnRlc3RGdW5jdGlvblYyAAAABwYHAQAAAAZhYWFhYWEAf/////////8AAAAAAAAAAAACAAAABmFhYWFhYQIAAAAAGiQKIMoaglOigu8JmH4V0CybQhURZvAmnXAhYMYSGV4ZSfbrEBQ=',
        'Json': {
            'id': '6gNfvezEjEwNnVZRBzuPLDky74Nf7i5t1KH58KQY4Jgx',
            'type': 16,
            'version': 2,
            'chainId': 84,
            'senderPublicKey': 'Athtgb7Zm9V6ExyAzAJM1mP57qNAW1A76TmzXdDZDjbt',
            'sender': '3N3kDDPYNbb3vzZRAPkgiR1R7YnLVtSrsiZ',
            'dApp': '3N7U8EVrPNXRp4rQ6LNebhmjqzA4gPY641Q',
            'call': {
                'function': 'testFunctionV2',
                'args': [
                    {'type': 'boolean', 'value': true},
                    {'type': 'boolean', 'value': false},
                    {'type': 'binary', 'value': 'base64:YWFhYWFh'},
                    {'type': 'integer', 'value': '9223372036854775807'},
                    {'type': 'integer', 'value': 0},
                    {'type': 'string', 'value': 'aaaaaa'},
                    {'type': 'string', 'value': ''},
                ],
            },
            'payment': [{'amount': 20, 'assetId': 'EbvoPG191bVa2HfMGoRAJyeysHQbTDLDMadtSfCmSggJ'}],
            'fee': 500000,
            'feeAssetId': null,
            'timestamp': 1625236452095,
            'proofs': ['4YZWF78DugAmmRyAv75JEGQ6jB2tLzqYozh13iTkWY73ARvEANBUM27TjvuYQ2A9au7nycUNJEuoRMjvhKkRecun'],
        },
    },
    'InvokeScript TX (type 16 v2)  case 4': {
        'Bytes': 'CFQSIJL4Cg7m8oV+sUn/3SQWcJnIDvBjXYh3TIjvckIJrSwvGgQQoMIeIIDmkL2mLygCogeWAQoWChTAiYBKUB+ATVXSs1O40eIw83EtdhJ8AQkBAAAADnRlc3RGdW5jdGlvblYyAAAACAYHAQAAAAZhYWFhYWEAf/////////8AAAAAAAAAAAACAAAABmFhYWFhYQIAAAAACwAAAAcGBwEAAAAGYWFhYWFhAH//////////AAAAAAAAAAAAAgAAAAZhYWFhYWECAAAAAA==',
        'Json': {
            'id': '8Lnpz9rwXiEkLNptkVb2HRQsEM3KdSSqTSAi1B2fDirJ',
            'type': 16,
            'version': 2,
            'chainId': 84,
            'senderPublicKey': 'Athtgb7Zm9V6ExyAzAJM1mP57qNAW1A76TmzXdDZDjbt',
            'sender': '3N3kDDPYNbb3vzZRAPkgiR1R7YnLVtSrsiZ',
            'dApp': '3N7U8EVrPNXRp4rQ6LNebhmjqzA4gPY641Q',
            'call': {
                'function': 'testFunctionV2',
                'args': [{'type': 'boolean', 'value': true}, {'type': 'boolean', 'value': false}, {
                    'type': 'binary',
                    'value': 'base64:YWFhYWFh',
                }, {'type': 'integer', 'value': '9223372036854775807'}, {
                    'type': 'integer',
                    'value': 0,
                }, {'type': 'string', 'value': 'aaaaaa'}, {'type': 'string', 'value': ''}, {
                    'type': 'list',
                    'value': [{'type': 'boolean', 'value': true}, {
                        'type': 'boolean',
                        'value': false,
                    }, {'type': 'binary', 'value': 'base64:YWFhYWFh'}, {
                        'type': 'integer',
                        'value': '9223372036854775807',
                    }, {'type': 'integer', 'value': 0}, {'type': 'string', 'value': 'aaaaaa'}, {
                        'type': 'string',
                        'value': '',
                    }],
                }],
            },
            'payment': [],
            'fee': 500000,
            'feeAssetId': null,
            'timestamp': 1625236452096,
            'proofs': ['rGSSy6kSyfQKqZspWgjHGavKuaEjE5zncdciKMGjZ78cvuXLaDBNejUu6FUwc7pUQczn4HryHENTB6iZCiR9qHG'],
        },
    },
    'InvokeScript TX (type 16 v2)  case 5': {
        'Bytes': 'CFQSIJL4Cg7m8oV+sUn/3SQWcJnIDvBjXYh3TIjvckIJrSwvGgQQoMIeIIHmkL2mLygCoge+AQoWChTAiYBKUB+ATVXSs1O40eIw83EtdhJ8AQkBAAAADnRlc3RGdW5jdGlvblYyAAAACAYHAQAAAAZhYWFhYWEAf/////////8AAAAAAAAAAAACAAAABmFhYWFhYQIAAAAACwAAAAcGBwEAAAAGYWFhYWFhAH//////////AAAAAAAAAAAAAgAAAAZhYWFhYWECAAAAABoCEAEaAhACGgIQAxoCEAQaAhAFGgIQBhoCEAcaAhAIGgIQCRoCEAo=',
        'Json': {
            'id': 'D3DnfGkCTu4mpruDY6wmBx2kyN1y3Rzrjhcc2GQoWfM2',
            'type': 16,
            'version': 2,
            'chainId': 84,
            'senderPublicKey': 'Athtgb7Zm9V6ExyAzAJM1mP57qNAW1A76TmzXdDZDjbt',
            'sender': '3N3kDDPYNbb3vzZRAPkgiR1R7YnLVtSrsiZ',
            'dApp': '3N7U8EVrPNXRp4rQ6LNebhmjqzA4gPY641Q',
            'call': {
                'function': 'testFunctionV2',
                'args': [{'type': 'boolean', 'value': true}, {'type': 'boolean', 'value': false}, {
                    'type': 'binary',
                    'value': 'base64:YWFhYWFh',
                }, {'type': 'integer', 'value': '9223372036854775807'}, {
                    'type': 'integer',
                    'value': 0,
                }, {'type': 'string', 'value': 'aaaaaa'}, {'type': 'string', 'value': ''}, {
                    'type': 'list',
                    'value': [{'type': 'boolean', 'value': true}, {
                        'type': 'boolean',
                        'value': false,
                    }, {'type': 'binary', 'value': 'base64:YWFhYWFh'}, {
                        'type': 'integer',
                        'value': '9223372036854775807',
                    }, {'type': 'integer', 'value': 0}, {'type': 'string', 'value': 'aaaaaa'}, {
                        'type': 'string',
                        'value': '',
                    }],
                }],
            },
            'payment': [{'amount': 1, 'assetId': null}, {'amount': 2, 'assetId': null}, {
                'amount': 3,
                'assetId': null,
            }, {'amount': 4, 'assetId': null}, {'amount': 5, 'assetId': null}, {
                'amount': 6,
                'assetId': null,
            }, {'amount': 7, 'assetId': null}, {'amount': 8, 'assetId': null}, {
                'amount': 9,
                'assetId': null,
            }, {'amount': 10, 'assetId': null}],
            'fee': 500000,
            'feeAssetId': null,
            'timestamp': 1625236452097,
            'proofs': ['2RfTMxn8U9KYB3FRKyGNXRp5mbNCPutXi4HpF43ZnNEmMDfLiv68YsJyKodaD1akVHX8KEtKb7C6U1vsjhAeDChP'],
        },
    },*/
}
