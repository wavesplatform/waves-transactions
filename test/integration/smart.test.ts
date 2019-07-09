import { broadcast, ISetScriptParams, massTransfer, setScript, waitForTx } from '../../src'
import { address, publicKey } from '@waves/waves-crypto'
import { MASTER_SEED, CHAIN_ID, TIMEOUT, API_BASE, randomHexString } from './config'
import { data, invokeScript } from '../../src'
import { DATA_FIELD_TYPE } from '../../src/transactions'

describe('Smart features', () => {
  let account1: string, account2: string
  const wvs = 10 ** 8

  beforeAll(async () => {
    const nonce = randomHexString(6)

    account1 = 'account1' + nonce
    account2 = 'account2' + nonce
    const mtt = massTransfer({
      transfers: [
        { recipient: address(account1, CHAIN_ID), amount: 1 * wvs },
        { recipient: address(account2, CHAIN_ID), amount: 1100000 }
      ]
    }, MASTER_SEED)
    await broadcast(mtt, API_BASE)
    await waitForTx(mtt.id, {apiBase: API_BASE, timeout: TIMEOUT})
    console.log('Smart test setup successful\n Accounts nonce = ' + nonce)
  }, TIMEOUT)

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
          type: DATA_FIELD_TYPE.BINARY,
          value: 'AwZd0cYf'
        }]
      }, account1)

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

      const tx = setScript(txParams, account1)

      const resp = await broadcast(tx, API_BASE)
      expect(resp.type).toEqual(13)

      await waitForTx(tx.id, { timeout: TIMEOUT, apiBase: API_BASE })

      const removeTxParams: ISetScriptParams = {
        senderPublicKey: publicKey(account1),
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


    it('Should set dapp account', async () => {
      // Set script
      // This script has one function 'foo'. It accepts integer and sends you this integer amount of waves
      /*
      {-# STDLIB_VERSION 3 #-}
      {-# CONTENT_TYPE DAPP #-}
      {-# SCRIPT_TYPE ACCOUNT #-}

      @Callable(i)
      func foo(a: Int) = {
          TransferSet([ScriptTransfer(i.caller, a, unit)])
      }
      */
      const script = 'AAIDAAAAAAAAAAAAAAABAAAAAAFhAAAAAAAAAAAKAAAAAQAAAAFpAQAAAANmb28AAAABAAAAAWEJAQAAAAtUcmFuc2ZlclNldAAAAAEJAARMAAAAAgkBAAAADlNjcmlwdFRyYW5zZmVyAAAAAwgFAAAAAWkAAAAGY2FsbGVyBQAAAAFhBQAAAAR1bml0BQAAAANuaWwAAAAAcF35+A=='
      const txParams: ISetScriptParams = {
        chainId: CHAIN_ID,
        script
      }
      const tx = setScript(txParams, account2)
      await broadcast(tx, API_BASE)
      await waitForTx(tx.id, { timeout: TIMEOUT, apiBase: API_BASE })
      console.log('dApp account script has been set')
    }, TIMEOUT)

    it('should call function', async () => {
      const dappAddress = address(account2, CHAIN_ID)

      const invokeTx = invokeScript({
          chainId: CHAIN_ID,
          dApp: dappAddress,
          call: {
            function: 'foo', args: [{ type: 'integer', value: 10000 }]
          }
        },
        account1)

        await broadcast(invokeTx, API_BASE)


    }, TIMEOUT)
  })

})
