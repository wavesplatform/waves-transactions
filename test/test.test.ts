import {issue} from '../src/transactions/issue'
import {broadcast, waitForTx} from '../src'
import {transfer} from '../src/transactions/transfer'
import {massTransfer} from '../src/transactions/mass-transfer'
import {data} from '../src/transactions/data'
import {invokeScript} from '../src/transactions/invoke-script'
import {address, randomSeed} from '@waves/ts-lib-crypto'
import {setScript} from '../src/transactions/set-script'
import {API_BASE, TIMEOUT, MASTER_SEED, CHAIN_ID} from './integration/config'
import {waitForTxWithNConfirmations} from '../src/nodeInteraction'

let dappAddress1 = ''
let dappAddress2 = ''
let assetId = ''
jest.setTimeout(60000)

it('issue', async () => {
    const tx = issue({
        name: 'test',
        description: 'test',
        quantity: 1097654321,
        chainId: CHAIN_ID,
        fee: 100000000,
    }, MASTER_SEED)
    const {id} = await broadcast(tx, API_BASE)
    assetId = id
})

// it('updateAssetInfo', async () => {
//     const tx = updateAssetInfo({
//         name: 'myCoin',
//         description: 'description for myCoin',
//         assetId: '9Qkr6cBZmfPZosCwbnHKVHciEJgFSzahe4H9HL6avmT9',
//         chainId: CHAIN_ID,
//     }, masterSeed)
//     console.log(JSON.stringify(tx, null, 4))
//     console.log(await broadcast(tx, nodeUrl))
// })

it('transfer', async () => {

    const recipient = address(randomSeed(), CHAIN_ID)
    const tx = transfer({
        recipient: recipient,
        amount: 1,
        chainId: CHAIN_ID,
        attachment: '',
    }, MASTER_SEED)
    await broadcast(tx, API_BASE)
})

it('masstransfer', async () => {
    const r1 = address(randomSeed(), CHAIN_ID)
    const r2 = address(randomSeed(), CHAIN_ID)
    const tx = massTransfer({
        transfers: [
            {
                recipient: r1,
                amount: 1,
            },
            {
                recipient: r2,
                amount: 1,
            },
        ],
        chainId: CHAIN_ID,
        attachment: '',
    }, MASTER_SEED)
    await broadcast(tx, API_BASE)
})

it('set data', async () => {
    const tx = data({
        data: [{key: 'foo', type:'string',value: 'bar'}],
        chainId: CHAIN_ID,
    }, MASTER_SEED)
    await broadcast(tx, API_BASE)
})

it('drop data', async () => {
    const tx = data({
        data: [{key: 'foo'}],
        chainId: CHAIN_ID,
    }, MASTER_SEED)
    await broadcast(tx, API_BASE)
})


it('setScriptTest', async () => {
    const script = 'AAIEAAAAAAAAAAQIAhIAAAAAAAAAAAEAAAABaQEAAAADZm9vAAAAAAkABEwAAAACCQEAAAAMSW50ZWdlckVudHJ5AAAAAgIAAAADa2V5AAAAAAAAAAABCQAETAAAAAIJAQAAAAxCb29sZWFuRW50cnkAAAACAgAAAANrZXkGCQAETAAAAAIJAQAAAAtTdHJpbmdFbnRyeQAAAAICAAAAA2tleQIAAAADc3RyBQAAAANuaWwAAAAAl/lsvw=='

    const script2 = 'base64:AAIFAAAAAAAAAAsIAhIHCgUBAgQIHwAAAAAAAAABAAAAAWkBAAAABGNhbGwAAAAFAAAAAWEAAAABYgAAAAFjAAAAAWQAAAABZgQAAAAEaW50VgQAAAAHJG1hdGNoMAkAAZEAAAACBQAAAAFmAAAAAAAAAAAAAwkAAAEAAAACBQAAAAckbWF0Y2gwAgAAAANJbnQEAAAAAXQFAAAAByRtYXRjaDAFAAAAAXQJAAACAAAAAQIAAAAOd3JvbmcgYXJnIHR5cGUEAAAABWJ5dGVWBAAAAAckbWF0Y2gwCQABkQAAAAIFAAAAAWYAAAAAAAAAAAEDCQAAAQAAAAIFAAAAByRtYXRjaDACAAAACkJ5dGVWZWN0b3IEAAAAAXQFAAAAByRtYXRjaDAFAAAAAXQJAAACAAAAAQIAAAAOd3JvbmcgYXJnIHR5cGUEAAAABWJvb2xWBAAAAAckbWF0Y2gwCQABkQAAAAIFAAAAAWYAAAAAAAAAAAIDCQAAAQAAAAIFAAAAByRtYXRjaDACAAAAB0Jvb2xlYW4EAAAAAXQFAAAAByRtYXRjaDAFAAAAAXQJAAACAAAAAQIAAAAOd3JvbmcgYXJnIHR5cGUEAAAABHN0clYEAAAAByRtYXRjaDAJAAGRAAAAAgUAAAABZgAAAAAAAAAAAwMJAAABAAAAAgUAAAAHJG1hdGNoMAIAAAAGU3RyaW5nBAAAAAF0BQAAAAckbWF0Y2gwBQAAAAF0CQAAAgAAAAECAAAADndyb25nIGFyZyB0eXBlCQAETAAAAAIJAQAAAAtCaW5hcnlFbnRyeQAAAAICAAAAA2JpbgUAAAABYgkABEwAAAACCQEAAAALQmluYXJ5RW50cnkAAAACAgAAAARib29sBQAAAAVieXRlVgkABEwAAAACCQEAAAAMSW50ZWdlckVudHJ5AAAAAgIAAAAEaW50MQUAAAABYQkABEwAAAACCQEAAAAMSW50ZWdlckVudHJ5AAAAAgIAAAAEaW50MgUAAAAEaW50VgkABEwAAAACCQEAAAALU3RyaW5nRW50cnkAAAACAgAAAARzdHIxBQAAAAFkCQAETAAAAAIJAQAAAAtTdHJpbmdFbnRyeQAAAAICAAAABHN0cjIFAAAABHN0clYJAARMAAAAAgkBAAAADEJvb2xlYW5FbnRyeQAAAAICAAAABWJvb2wxBQAAAAFjCQAETAAAAAIJAQAAAAxCb29sZWFuRW50cnkAAAACAgAAAAVib29sMgUAAAAFYm9vbFYFAAAAA25pbAAAAAEAAAACdHgBAAAABnZlcmlmeQAAAAAGaGqCnQ=='
    const seed = randomSeed()
    const addr = address(seed, CHAIN_ID)

    const seed2 = randomSeed()
    const addr2 = address(seed2, CHAIN_ID)


    dappAddress1 = addr
    dappAddress2 = addr2

    let tx = transfer({
        recipient: addr,
        amount: 0.05e8,
        chainId: CHAIN_ID,
    }, MASTER_SEED)

    let tx2 = transfer({
        recipient: addr2,
        amount: 0.05e8,
        chainId: CHAIN_ID,
    }, MASTER_SEED)

    await broadcast(tx, API_BASE)
    await broadcast(tx2, API_BASE)
    await waitForTx(tx.id, {apiBase: API_BASE, timeout: 10000})

    const setScriptTx = setScript({
        script,
        chainId: CHAIN_ID,
    }, seed)

    const setScriptTx2 = setScript({
        script: script2,
        chainId: CHAIN_ID,
    }, seed2)

    await broadcast(setScriptTx2, API_BASE)
    await broadcast(setScriptTx, API_BASE)
    await waitForTx(setScriptTx.id, {apiBase: API_BASE, timeout: 10000})
    // await sleep(15000);
    // try {
    //     const invokeTx = invokeScript({
    //         dApp: addr,
    //         call: {function: 'foo', args: []},
    //         chainId: chainId,
    //         fee: 500000,
    //         payment: [{assetId: null, amount: 1}],
    //         feeAssetId: null
    //     }, masterSeed);
    //     console.log(await broadcast(invokeTx, nodeUrl));
    //     await sleep(15000);
    // } catch (e) {
    //     'tx' in e && console.log(JSON.stringify(e.tx, null, 4));
    //     'message' in e && console.log(e.message);
    // }
    //
    // try {
    //     const invokeTx1pay = invokeScript({
    //         dApp: addr,
    //         call: {function: 'foo', args: []},
    //         chainId: chainId,
    //         fee: 500000,
    //         payment: [{amount: 1, assetId: null}],
    //         feeAssetId: null
    //     }, masterSeed);
    //     console.log(await broadcast(invokeTx1pay, nodeUrl));
    //     await sleep(15000);
    // } catch (e) {
    //     'tx' in e && console.log(JSON.stringify(e.tx, null, 4));
    //     'message' in e && console.log(e.message);
    // }

    // try {
    //     const invokeTx2pay = invokeScript({
    //         // dApp: addr,
    //         dApp: '3HaN7nm7LuC7bDpgiG917VdJ1mmJE3iXMPM',
    //         call: {function: 'foo', args: []},
    //         chainId: chainId,
    //         fee: 500000,
    //         payment: [{amount: 1, assetId: null}, {amount: 1, assetId: null}],
    //     }, masterSeed)
    //     console.log(await broadcast(invokeTx2pay, nodeUrl))
    // } catch (e) {
    //     'tx' in e && console.log(JSON.stringify(e.tx, null, 4))
    //     'message' in e && console.log(e.message)
    // }


}, 1000000000)


it('invoke test', async () => {


    if (dappAddress1 == '') {
        dappAddress1 = '3MJ2PHxU4Vsf5HfLzuYrRTP3imrQVvhkWyk'
    }

    const invokeTx = invokeScript({
        dApp: dappAddress1,
        call: {function: 'foo', args: []},
        chainId: CHAIN_ID,
        fee: 500000,
        feeAssetId: null,
    }, MASTER_SEED)
    console.log('invokeTx', JSON.stringify(invokeTx, undefined, ' '))
    const {id} = await broadcast(invokeTx, API_BASE)
    const tx = (await waitForTxWithNConfirmations(id, 0, {apiBase: API_BASE, timeout: TIMEOUT}))
}, 100000)

it('invoke with list test', async () => {

    const invokeTx = invokeScript({
        dApp: dappAddress2,
        call: {
            function: 'call', args: [
                {
                    'type': 'integer',
                    'value': 1,
                },
                {
                    'type': 'binary',
                    'value': 'base64:YWJj',
                },
                {
                    'type': 'boolean',
                    'value': true,
                },
                {
                    'type': 'string',
                    'value': 'abc',
                },
                {
                    'type': 'list',
                    'value': [{
                        'type': 'integer',
                        'value': 2,
                    },
                        {
                            'type': 'binary',
                            'value': 'base64:YWJjZA==',
                        },
                        {
                            'type': 'boolean',
                            'value': false,
                        },
                        {
                            'type': 'string',
                            'value': 'abcd',
                        }],
                },
            ],
        },
        chainId: CHAIN_ID,
        payment: [
            {'amount': 1, 'assetId': null},
            {'amount': 2, 'assetId': null},
            {'amount': 3, 'assetId': null},
            {'amount': 4, 'assetId': null},
            {'amount': 5, 'assetId': null},
            {'amount': 21, 'assetId': assetId},
            {'amount': 22, 'assetId': assetId},
            {'amount': 23, 'assetId': assetId},
            {'amount': 24, 'assetId': assetId},
            {'amount': 25, 'assetId': assetId}],
        fee: 500000,
        feeAssetId: null,
    }, MASTER_SEED)
    const {id} = await broadcast(invokeTx, API_BASE)
    const tx = (await waitForTxWithNConfirmations(id, 0, {apiBase: API_BASE, timeout: TIMEOUT}))
}, 100000)

it('transfer test', async () => {
    const conditions = [
        {attachment: 'StV1DL6CwTryKyV'},
        {attachment: ''},
        {attachment: null},
        {attachment: undefined},
    ]
    const recipient = address(randomSeed(), CHAIN_ID)
    const makeTx = (cond: any) => transfer({
        ...cond,
        chainId: CHAIN_ID,
        amount: 1,
        recipient: recipient,
    }, MASTER_SEED)


    for (let i in conditions) {
        try {
            await broadcast(makeTx(conditions[i]), API_BASE)
        } catch (e) {
            console.log('fail', conditions[i])
            console.error(JSON.stringify(e, null, 4))
        }
    }


})


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
