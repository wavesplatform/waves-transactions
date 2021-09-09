import { broadcast, invokeExpression, transfer, waitForTx } from '../../src'
import { API_BASE, CHAIN_ID, MASTER_SEED, TIMEOUT } from './config'
import {  invokeExpressionMinimalParams } from '../minimalParams'
import { address } from '@waves/ts-lib-crypto'

describe('Invoke express', () => {
    let API_BASE = 'https://devnet1-htz-nbg1-1.wavesnodes.com/'
    let chainID = 'D'
    let seed = ''

    it('Call invoke script tx', async () => {
        const callExpression = invokeExpression({...invokeExpressionMinimalParams}, seed= 'evaluate test seed 9')
        await broadcast(callExpression, API_BASE)
        await waitForTx(callExpression.id, { timeout: TIMEOUT, apiBase: API_BASE })

        console.log(callExpression)
    }, TIMEOUT)

})