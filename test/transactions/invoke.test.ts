import {broadcast, invokeScript, waitForTx} from '../../src'
import {TIMEOUT} from '../integration/config'
import {TRANSACTION_TYPE} from '../../src/transactions'

const dataTestnet = {
    type: TRANSACTION_TYPE.INVOKE_SCRIPT,
    version: 2,
    dApp: '3N5DJuwBeYpyATrWqFc5DqcKLPGHfNEtFyX',
    call: {function: 'sometest',
        args: [{type: 'integer', value: '1'},
            {type: 'string', value: 'qwerty'}],
    },
    chainId: 84,
    senderPublicKey: '5uETz7mMqdRRkSoPTJZ1p5qWR5jwhCxQwUKqSzgBaTaX',
    fee: 1000000,
    proofs: [],
}

const dataMainnet = {
    type: TRANSACTION_TYPE.INVOKE_SCRIPT,
    version: 2,
    dApp: '3N5DJuwBeYpyATrWqFc5DqcKLPGHfNEtFyX',
    call: {function: 'sometest',
        args: [{type: 'integer', value: '1'},
            {type: 'string', value: 'qwerty'}],
    },
    chainId: 87,
    senderPublicKey: '5uETz7mMqdRRkSoPTJZ1p5qWR5jwhCxQwUKqSzgBaTaX',
    fee: 1000000,
    proofs: [],
}

const seed = 'release melody settle mad undo combine rich rug artist reason crucial genius fiction bid click'

describe('data', () => {

    it('Broadcast script-invocation', async () => {
        // @ts-ignore
        const invokeTx = invokeScript(dataTestnet, seed)
        await broadcast(invokeTx, 'https://nodes-testnet.wavesnodes.com')

        await waitForTx(invokeTx.id, { timeout: TIMEOUT, apiBase: 'https://nodes-testnet.wavesnodes.com' })
    }, TIMEOUT)
})
