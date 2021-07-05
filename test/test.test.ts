import {issue} from '../src/transactions/issue'
import {broadcast, waitForTx} from '../src'
import {updateAssetInfo} from '../src/transactions/update-asset-info'
import {transfer} from '../src/transactions/transfer'
import {massTransfer} from '../src/transactions/mass-transfer'
import {data} from '../src/transactions/data'
import {invokeScript} from '../src/transactions/invoke-script'
import {address, randomSeed} from '@waves/ts-lib-crypto'
import {setScript} from '../src/transactions/set-script'
import {API_BASE, TIMEOUT} from './integration/config'
import {waitForTxWithNConfirmations} from '../src/nodeInteraction'
import {strengthenPassword} from '../src/seedUtils'

const nodeUrl = 'http://localhost:6869'
const masterSeed = 'waves private node seed with waves tokens'
const CHAIN_ID = 82
let dappAddress1 = ''
let dappAddress2 = ''
jest.setTimeout(60000)

it('issue', async () => {
    const tx = issue({
        name: 'test',
        description: 'test',
        quantity: 1,
        chainId: CHAIN_ID,
        fee: 100000000,
    }, masterSeed)
    console.log(await broadcast(tx, nodeUrl))
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
    }, masterSeed)
    console.log(JSON.stringify(tx, null, 4))
    console.log(await broadcast(tx, nodeUrl))
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
    }, masterSeed)
    console.log(JSON.stringify(tx, null, 4))
    console.log(await broadcast(tx, nodeUrl))
})

it('set data', async () => {
    const tx = data({
        data: [{key: 'foo', value: 'bar'}],
        chainId: CHAIN_ID,
    }, masterSeed)
    console.log(JSON.stringify(tx, null, 4))
    console.log(await broadcast(tx, nodeUrl))
})

it('drop data', async () => {
    const tx = data({
        data: [{key: 'foo'}],
        chainId: CHAIN_ID,
    }, masterSeed)
    console.log(JSON.stringify(tx, null, 4))
    console.log(await broadcast(tx, nodeUrl))
})


it('setScriptTest', async () => {
    const script = 'AAIEAAAAAAAAAAQIAhIAAAAAAAAAAAEAAAABaQEAAAADZm9vAAAAAAkABEwAAAACCQEAAAAMSW50ZWdlckVudHJ5AAAAAgIAAAADa2V5AAAAAAAAAAABCQAETAAAAAIJAQAAAAxCb29sZWFuRW50cnkAAAACAgAAAANrZXkGCQAETAAAAAIJAQAAAAtTdHJpbmdFbnRyeQAAAAICAAAAA2tleQIAAAADc3RyBQAAAANuaWwAAAAAl/lsvw=='

    const script2 = 'AAIFAAAAAAAAAA4IAhIKCggBAgQIERIUGAAAAAAAAAABAAAAAWkBAAAABGNhbGwAAAAIAAAAAWEAAAABYgAAAAFjAAAAAWQAAAABZgAAAAFnAAAAAWgAAAABagkABEwAAAACCQEAAAALQmluYXJ5RW50cnkAAAACAgAAAANiaW4FAAAAAWIJAARMAAAAAgkBAAAAC0JpbmFyeUVudHJ5AAAAAgIAAAAEYm9vbAkAAZEAAAACBQAAAAFnAAAAAAAAAAAACQAETAAAAAIJAQAAAAxJbnRlZ2VyRW50cnkAAAACAgAAAARpbnQxBQAAAAFhCQAETAAAAAIJAQAAAAxJbnRlZ2VyRW50cnkAAAACAgAAAARpbnQyCQABkQAAAAIFAAAAAWYAAAAAAAAAAAAJAARMAAAAAgkBAAAAC1N0cmluZ0VudHJ5AAAAAgIAAAAEc3RyMQUAAAABZAkABEwAAAACCQEAAAALU3RyaW5nRW50cnkAAAACAgAAAARzdHIyCQABkQAAAAIFAAAAAWoAAAAAAAAAAAAJAARMAAAAAgkBAAAADEJvb2xlYW5FbnRyeQAAAAICAAAABWJvb2wxBQAAAAFjCQAETAAAAAIJAQAAAAxCb29sZWFuRW50cnkAAAACAgAAAAVib29sMgkAAZEAAAACBQAAAAFoAAAAAAAAAAAABQAAAANuaWwAAAABAAAAAnR4AQAAAAZ2ZXJpZnkAAAAABsxUaLQ='
    const seed = randomSeed()
    const addr = address(seed, CHAIN_ID)

    const seed2 = randomSeed()
    const addr2 = address(seed2, CHAIN_ID)


    dappAddress1 = addr
    dappAddress2 = addr2
    console.log(dappAddress1)

    let tx = transfer({
        recipient: addr,
        amount: 2e8,
        chainId: CHAIN_ID,
    }, masterSeed)
    let tx2 = transfer({
        recipient: addr2,
        amount: 2e8,
        chainId: CHAIN_ID,
    }, masterSeed)
    await broadcast(tx, nodeUrl)
    await broadcast(tx2, nodeUrl)
    await waitForTx(tx.id, {apiBase: nodeUrl, timeout: 10000})

    const setScriptTx = setScript({
        script,
        chainId: CHAIN_ID,
    }, seed)

    const setScriptTx2 = setScript({
        script2,
        chainId: CHAIN_ID,
    }, seed2)

    await broadcast(setScriptTx2, nodeUrl)
    await broadcast(setScriptTx, nodeUrl)
    await waitForTx(setScriptTx.id, {apiBase: nodeUrl, timeout: 10000})
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


    if (dappAddress1 =='') {
        dappAddress1 = '3MJ2PHxU4Vsf5HfLzuYrRTP3imrQVvhkWyk'
    }

    const invokeTx = invokeScript({
        dApp: dappAddress1,
        call: {function: 'foo', args: []},
        chainId: CHAIN_ID,
        fee: 500000,
        feeAssetId: null,
    }, masterSeed)
   await broadcast(invokeTx, nodeUrl)
    // const tx = (await waitForTxWithNConfirmations(id,0, {apiBase: nodeUrl, timeout: TIMEOUT}))
    // console.log(tx)
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
