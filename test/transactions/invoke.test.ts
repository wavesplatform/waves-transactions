import {protoBytesToTx, txToProtoBytes} from '../../src/proto-serialize'
import {signTx} from '../../src'
import {signBytes} from '@waves/ts-lib-crypto'

const dataTestnet = {
    type: 16,
    version: 2,
    dApp: '3NBfVHNKz2UWj4pH2XE9fG27GGZCWkt7XBt',
    call: {'function': "call",
        "args": [{"type": "list", "value": [{"type": "integer", "value": 1}]}, {
            "type": "list",
            "value": [{"type": "string", "value": "123"}]
        }]
    },
    senderPublicKey: "FCfxuzbxcMUuTgtn6bHJcwhTEjhSdh1ppnQn9wnfvnyL",
    chainId: 84,
    fee: 1000000,
    timestamp: 1618311766111,
    id: "MpwqRQGv7bq7Ndfg1sbLFhGmzWEtiEQXqAUnZiYDgDY",
    script: "base64:AAIEAAAAAAAAAAgIAhIECgIRGAAAAAAAAAABAAAAAWkBAAAABGNhbGwAAAACAAAABWxpc3RBAAAABWxpc3RCCQAETAAAAAIJAQAAAAxJbnRlZ2VyRW50cnkAAAACAgAAAANpbnQJAAGRAAAAAgUAAAAFbGlzdEEAAAAAAAAAAAAJAARMAAAAAgkBAAAAC1N0cmluZ0VudHJ5AAAAAgIAAAADaW50CQABkQAAAAIFAAAABWxpc3RCAAAAAAAAAAAABQAAAANuaWwAAAAAl/I1IA=="
}

const dataMainnet = {
    type: 16,
    version: 2,
    dApp: '3NBfVHNKz2UWj4pH2XE9fG27GGZCWkt7XBt',
    call: {'function': "call",
        "args": [{"type": "list", "value": [{"type": "integer", "value": 1}]}, {
            "type": "list",
            "value": [{"type": "string", "value": "123"}]
        }]
    },
    senderPublicKey: "FCfxuzbxcMUuTgtn6bHJcwhTEjhSdh1ppnQn9wnfvnyL",
    chainId: 87,
    fee: 1000000,
    timestamp: 1618311766111,
    id: "MpwqRQGv7bq7Ndfg1sbLFhGmzWEtiEQXqAUnZiYDgDY",
    script: "base64:AAIEAAAAAAAAAAgIAhIECgIRGAAAAAAAAAABAAAAAWkBAAAABGNhbGwAAAACAAAABWxpc3RBAAAABWxpc3RCCQAETAAAAAIJAQAAAAxJbnRlZ2VyRW50cnkAAAACAgAAAANpbnQJAAGRAAAAAgUAAAAFbGlzdEEAAAAAAAAAAAAJAARMAAAAAgkBAAAAC1N0cmluZ0VudHJ5AAAAAgIAAAADaW50CQABkQAAAAIFAAAABWxpc3RCAAAAAAAAAAAABQAAAANuaWwAAAAAl/I1IA=="
}

const seed = 'cover couch auto wife acoustic venue economy scan april noise paper horn scene refuse need'

describe('data', () => {


    test.each([
        [
            dataTestnet,
            'dataTestnet',
        ],
        [
            dataMainnet,
            'dataMainnet',
        ],
    ])('check serialization for %o, tx version: %i', (data, name) => {
        const tx = data
        const fs = require('fs')
        fs.writeFileSync(`../${name}_bytes.txt`, txToProtoBytes(tx))
        console.log(txToProtoBytes(tx))
        const bytes = txToProtoBytes(tx)
        const signedBytes = signBytes(seed, bytes)
        fs.writeFileSync(`../${name}_signedBytes.txt`, signedBytes)
    })
})
