import { issue } from '../src/transactions/issue';
import { broadcast } from '../src';
import { updateAssetInfo } from '../src/transactions/update-asset-info';
import { transfer } from '../src/transactions/transfer';
import { massTransfer } from '../src/transactions/mass-transfer';
import { data } from '../src/transactions/data';
import { invokeScript } from '../src/transactions/invoke-script';
import { address, randomSeed } from '@waves/ts-lib-crypto';
import { setScript } from '../src/transactions/set-script';

const nodeUrl = 'http://localhost:32772';


it('issue', async () => {
    const tx = issue({
        name: 'test',
        description: 'test',
        quantity: 1,
        chainId: 73,
        fee: 100000000
    }, 'node10');
    console.log(await broadcast(tx, nodeUrl));
});

it('updateAssetInfo', async () => {
    const tx = updateAssetInfo({
        name: 'myCoin',
        description: 'description for myCoin',
        assetId: '9Qkr6cBZmfPZosCwbnHKVHciEJgFSzahe4H9HL6avmT9',
        chainId: 73,
    }, 'node10');
    console.log(JSON.stringify(tx, null, 4));
    console.log(await broadcast(tx, nodeUrl));
});

it('transfer', async () => {
    const tx = transfer({
        recipient: '3HmFkAoQRs4Y3PE2uR6ohN7wS4VqPBGKv7k',
        amount: 1,
        chainId: 73,
        attachment: {value: 'hello', type: 'string'}
    }, 'node10');
    console.log(JSON.stringify(tx, null, 4));
    console.log(await broadcast(tx, nodeUrl));
});

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
        chainId: 73,
        attachment: {value: 'hello', type: 'string'}
    }, 'node10');
    console.log(JSON.stringify(tx, null, 4));
    console.log(await broadcast(tx, nodeUrl));
});

it('set data', async () => {
    const tx = data({
        data: [{key: 'foo', value: 'bar'}],
        chainId: 73,
    }, 'node10');
    console.log(JSON.stringify(tx, null, 4));
    console.log(await broadcast(tx, nodeUrl));
});

it('drop data', async () => {
    const tx = data({
        data: [{key: 'foo', value: null}],
        chainId: 73,
    }, 'node10');
    console.log(JSON.stringify(tx, null, 4));
    console.log(await broadcast(tx, nodeUrl));
});


it('invoke', async () => {
    // const script = 'AAIEAAAAAAAAAAQIAhIAAAAAAAAAAAEAAAABaQEAAAADZm9vAAAAAAkABEwAAAACCQEAAAAMSW50ZWdlckVudHJ5AAAAAgIAAAADa2V5AAAAAAAAAAABCQAETAAAAAIJAQAAAAxCb29sZWFuRW50cnkAAAACAgAAAANrZXkGCQAETAAAAAIJAQAAAAtTdHJpbmdFbnRyeQAAAAICAAAAA2tleQIAAAADc3RyBQAAAANuaWwAAAAAl/lsvw==';
    //
    // const seed = randomSeed();
    // const addr = address(seed, 73);
    //
    // let tx = transfer({
    //     recipient: addr,
    //     amount: 2e8,
    //     chainId: 73,
    //     attachment: {value: 'send tokens', type: 'string'}
    // }, 'node10');
    // console.log(await broadcast(tx, nodeUrl));
    // await sleep(15000);
    //
    // const setScriptTx = setScript({
    //     script,
    //     chainId: 73,
    // }, seed);
    // console.log(await broadcast(setScriptTx, nodeUrl));
    // await sleep(15000);
    // try {
    //     const invokeTx = invokeScript({
    //         dApp: addr,
    //         call: {function: 'foo', args: []},
    //         chainId: 73,
    //         fee: 500000,
    //         payment: [{assetId: null, amount: 1}],
    //         feeAssetId: null
    //     }, 'node10');
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
    //         chainId: 73,
    //         fee: 500000,
    //         payment: [{amount: 1, assetId: null}],
    //         feeAssetId: null
    //     }, 'node10');
    //     console.log(await broadcast(invokeTx1pay, nodeUrl));
    //     await sleep(15000);
    // } catch (e) {
    //     'tx' in e && console.log(JSON.stringify(e.tx, null, 4));
    //     'message' in e && console.log(e.message);
    // }

    try {
        const invokeTx2pay = invokeScript({
            // dApp: addr,
            dApp: '3HaN7nm7LuC7bDpgiG917VdJ1mmJE3iXMPM',
            call: {function: 'foo', args: []},
            chainId: 73,
            fee: 500000,
            payment: [{amount: 1, assetId: null}, {amount: 1, assetId: null}],
        }, 'node10');
        console.log(await broadcast(invokeTx2pay, nodeUrl));
    } catch (e) {
        'tx' in e && console.log(JSON.stringify(e.tx, null, 4));
        'message' in e && console.log(e.message);
    }


}, 1000000000);


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
