import { broadcast, ISetScriptParams, setScript, waitForTx } from '../../src'
import { address, publicKey } from '@waves/waves-crypto'
import { MASTER_SEED, CHAIN_ID, TIMEOUT, API_BASE } from './config'
import { data, invokeScript, transfer } from '../../src'

describe('Smart features', () => {

  describe('Data transactions', () => {
    it('Should set data of all types', async () => {
      const dataTx = data({
        data: [{
          key: 'int_value',
          value: 1000
        }, {
          key: 'boolean_value',
          value: true
        }, {
          key: 'string_value',
          value: 'some str'
        }, {
          key: 'binary_value',
          value: Uint8Array.from([1, 2, 3])
        }, {
          key: 'binary_value_as_base64',
          type: 'binary',
          value: 'AwZd0cYf'
        }]
      }, MASTER_SEED)

      await broadcast(dataTx, API_BASE)
    })
  })

  describe('Account scripts', () => {
    it('Should set and then remove multisig account script', async () => {
      // Multisig script 2 of 3. 'alice', 'bob', 'cooper'
      const script = 'AQQAAAALYWxpY2VQdWJLZXkBAAAAID3+K0HJI42oXrHhtHFpHijU5PC4nn1fIFVsJp5UWrYABAAAAAlib2JQdWJLZXkBAAAAIBO1uieokBahePoeVqt4/usbhaXRq+i5EvtfsdBILNtuBAAAAAxjb29wZXJQdWJLZXkBAAAAIOfM/qkwkfi4pdngdn18n5yxNwCrBOBC3ihWaFg4gV4yBAAAAAthbGljZVNpZ25lZAMJAAH0AAAAAwgFAAAAAnR4AAAACWJvZHlCeXRlcwkAAZEAAAACCAUAAAACdHgAAAAGcHJvb2ZzAAAAAAAAAAAABQAAAAthbGljZVB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAJYm9iU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAEFAAAACWJvYlB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAQAAAAMY29vcGVyU2lnbmVkAwkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAIFAAAADGNvb3BlclB1YktleQAAAAAAAAAAAQAAAAAAAAAAAAkAAGcAAAACCQAAZAAAAAIJAABkAAAAAgUAAAALYWxpY2VTaWduZWQFAAAACWJvYlNpZ25lZAUAAAAMY29vcGVyU2lnbmVkAAAAAAAAAAACVateHg=='
      const txParams: ISetScriptParams = {
        chainId: CHAIN_ID,
        script,
      }

      const tx = setScript(txParams, MASTER_SEED)

      const resp = await broadcast(tx, API_BASE)
      expect(resp.type).toEqual(13)

      await waitForTx(tx.id, { timeout: TIMEOUT, apiBase: API_BASE })

      const removeTxParams: ISetScriptParams = {
        senderPublicKey: publicKey(MASTER_SEED),
        chainId: CHAIN_ID,
        script: null,
        additionalFee: 400000,
      }

      const removeTx = setScript(removeTxParams, [null, 'bob', 'cooper'])
      const resp2 = await broadcast(removeTx, API_BASE)
      await waitForTx(removeTx.id, { timeout: TIMEOUT, apiBase: API_BASE })
      expect(resp2.type).toEqual(13)

    }, TIMEOUT)
  })

  describe('dApp', () => {
    const dappSeed = 'dapp test seed phrase'
    const dappAddress = address(dappSeed, CHAIN_ID)

    it('Should set dapp account', async () => {
      // Fund acc
      const ttx = transfer({ amount: 100000000, recipient: dappAddress }, MASTER_SEED)
      await broadcast(ttx, API_BASE)
      await waitForTx(ttx.id, { timeout: TIMEOUT, apiBase: API_BASE })
      console.log('dApp account has been funded')
      // Set script
      // This script has one function 'foo'. It accepts integer and sends you this integer amount of waves
      const script = 'AAIDAAAAAAAAAAAAAAABAAAAAWkBAAAAA2ZvbwAAAAEAAAABYQkBAAAAC1RyYW5zZmVyU2V0AAAAAQkABEwAAAACCQEAAAAOU2NyaXB0VHJhbnNmZXIAAAADCAUAAAABaQAAAAZjYWxsZXIFAAAAAWEFAAAABHVuaXQFAAAAA25pbAAAAAAAAAAAArC/pA=='
      const txParams: ISetScriptParams = {
        chainId: CHAIN_ID,
        script,
        additionalFee: 400000
      }
      const tx = setScript(txParams, dappSeed)
      await broadcast(tx, API_BASE)
      await waitForTx(tx.id, { timeout: TIMEOUT, apiBase: API_BASE })
      console.log('dApp account script has been set')
    }, TIMEOUT)

    it('should call function', async () => {
      const invokeTx = invokeScript({
          chainId: CHAIN_ID,
          dApp: dappAddress,
          call: {
            function: 'foo', args: [{ type: 'integer', value: 90000000 }]
          }
        },
        MASTER_SEED)

      try {
        await broadcast(invokeTx, API_BASE)
      } catch (e) {
        console.log(e)
      }

    }, TIMEOUT)

  })
})
