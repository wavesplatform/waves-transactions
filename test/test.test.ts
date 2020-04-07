import {issue} from '../src/transactions/issue'
import {broadcast, waitForTx} from '../src'
import {updateAssetInfo} from '../src/transactions/update-asset-info'
import {transfer} from '../src/transactions/transfer'
import {massTransfer} from '../src/transactions/mass-transfer'
import {data} from '../src/transactions/data'
import {invokeScript} from '../src/transactions/invoke-script'
import {address, randomSeed} from '@waves/ts-lib-crypto'
import {setScript} from '../src/transactions/set-script'
import {TIMEOUT} from './integration/config'
import {log} from 'util'

const nodeUrl = 'http://localhost:6869'
const masterSeed = 'waves private node seed with waves tokens'

it('issue', async () => {
    const tx = issue({
        name: 'test',
        description: 'test',
        quantity: 1,
        chainId: 82,
        fee: 100000000,
    }, masterSeed)
    console.log(await broadcast(tx, nodeUrl))
})

it('updateAssetInfo', async () => {
    const tx = updateAssetInfo({
        name: 'myCoin',
        description: 'description for myCoin',
        assetId: '9Qkr6cBZmfPZosCwbnHKVHciEJgFSzahe4H9HL6avmT9',
        chainId: 82,
    }, masterSeed)
    console.log(JSON.stringify(tx, null, 4))
    console.log(await broadcast(tx, nodeUrl))
})

it('transfer', async () => {
    const tx = transfer({
        recipient: '3HmFkAoQRs4Y3PE2uR6ohN7wS4VqPBGKv7k',
        amount: 1,
        chainId: 82,
        attachment: {value: 'hello', type: 'string'},
    }, masterSeed)
    console.log(JSON.stringify(tx, null, 4))
    console.log(await broadcast(tx, nodeUrl))
})

it('masstransfer', async () => {
    const tx = massTransfer({
        transfers: [
            {
                recipient: '3HmFkAoQRs4Y3PE2uR6ohN7wS4VqPBGKv7k',
                amount: 1,
            },
            {
                recipient: '3HmFkAoQRs4Y3PE2uR6ohN7wS4VqPBGKv7k',
                amount: 1,
            },
        ],
        chainId: 82,
        attachment: {value: 'hello', type: 'string'},
    }, masterSeed)
    console.log(JSON.stringify(tx, null, 4))
    console.log(await broadcast(tx, nodeUrl))
})

it('set data', async () => {
    const tx = data({
        data: [{key: 'foo', value: 'bar'}],
        chainId: 82,
    }, masterSeed)
    console.log(JSON.stringify(tx, null, 4))
    console.log(await broadcast(tx, nodeUrl))
})

it('drop data', async () => {
    const tx = data({
        data: [{key: 'foo', value: null}],
        chainId: 82,
    }, masterSeed)
    console.log(JSON.stringify(tx, null, 4))
    console.log(await broadcast(tx, nodeUrl))
})


it('setScriptTest', async () => {
    const script = 'AAIEAAAAAAAAAAQIAhIAAAAAAAAAAAEAAAABaQEAAAADZm9vAAAAAAkABEwAAAACCQEAAAAMSW50ZWdlckVudHJ5AAAAAgIAAAADa2V5AAAAAAAAAAABCQAETAAAAAIJAQAAAAxCb29sZWFuRW50cnkAAAACAgAAAANrZXkGCQAETAAAAAIJAQAAAAtTdHJpbmdFbnRyeQAAAAICAAAAA2tleQIAAAADc3RyBQAAAANuaWwAAAAAl/lsvw=='

    const seed = randomSeed()
    const addr = address(seed, 82)
    console.log(addr)
    console.log(seed)

    let tx = transfer({
        recipient: addr,
        amount: 2e8,
        chainId: 82,
    }, masterSeed)
    console.log(await broadcast(tx, nodeUrl))
    await sleep(15000)

    const setScriptTx = setScript({
        script,
        chainId: 82,
    }, seed)
    console.log(await broadcast(setScriptTx, nodeUrl))
    // await sleep(15000);
    // try {
    //     const invokeTx = invokeScript({
    //         dApp: addr,
    //         call: {function: 'foo', args: []},
    //         chainId: 82,
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
    //         chainId: 82,
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
    //         chainId: 82,
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

    const invokeTx = invokeScript({
        dApp: '3MAjRbSNjxihNaMLnhRM5L1JQtyf81AuAHA',
        call: {function: 'foo', args: []},
        chainId: 82,
        fee: 500000,
        feeAssetId: null,
    }, masterSeed)
    const {id} = await broadcast(invokeTx, nodeUrl)
    const tx = (await waitForTx(id, {apiBase: nodeUrl, timeout: TIMEOUT}))
})


it('transfer test', async () => {
    const conditions = [
        {attachment: 'StV1DL6CwTryKyV'},
        {attachment: ''},
        {attachment: null},
        {attachment: undefined},

        {version: 3, attachment: 'StV1DL6CwTryKyV'},
        {version: 3, attachment: ''},
        {version: 3, attachment: null},
        {version: 3, attachment: undefined},

        {version: 3, attachment: {type: 'string', value: ''}},
        {version: 3, attachment: {type: 'string', value: 'hello world'}},

        {version: 3, attachment: {type: 'integer', value: '123'}},
        {version: 3, attachment: {type: 'integer', value: 123}},
        {version: 3, attachment: {type: 'integer', value: -1}},
        {version: 3, attachment: {type: 'integer', value: -1e10}},
        {version: 3, attachment: {type: 'integer', value: -0}},
        {version: 3, attachment: {type: 'integer', value: 0}},
        {version: 3, attachment: {type: 'integer', value: '-9223372036854775808'}},
        {version: 3, attachment: {type: 'integer', value: '9223372036854775807'}},

        {version: 3, attachment: {type: 'boolean', value: false}},
        {version: 3, attachment: {type: 'boolean', value: true}},

        {version: 3, attachment: {type: 'binary', value: ''}},
        {version: 3, attachment: {type: 'binary', value: 'StV1DL6CwTryKyV'}},
    ]
    console.log(conditions.length)
    const makeTx = (cond: any) => transfer({
        ...cond,
        chainId: 82,
        amount: 1,
        recipient: '3Hm3LGoNPmw1VTZ3eRA2pAfeQPhnaBm6YFC',
    }, masterSeed)


    for (let i in conditions) {
        try {
            await broadcast(makeTx(conditions[i]), nodeUrl)
        } catch (e) {
            console.log('fail', conditions[i])
            console.error(JSON.stringify(e, null, 4))
        }
    }


})


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
