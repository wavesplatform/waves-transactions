import * as utilityF from '../src/nodeInteraction'
import { data } from '../src'
import { broadcast } from '../src/nodeInteraction'

const apiBase = 'https://nodes-testnet.wavesnodes.com/'

describe('Node interaction utility functions', () => {

  it('should send tx to node', async () => {
    const dataParams = {
      data: [
        {
          key: 'oneTwo',
          value: false,
        },
        {
          key: 'twoThree',
          value: 2,
        },
        {
          key: 'three',
          value: Uint8Array.from([1, 2, 3, 4, 5, 6]),
        },
      ],
      timestamp: 100000,
    }
    const result = data(dataParams, 'seed seed')

    await expect(broadcast(result, apiBase)).rejects.toMatchObject({ "error": 303})
  })

  it('Should get current height', async () => {
    return expect(utilityF.currentHeight(apiBase)).resolves.toBeGreaterThan(0)
  })

  it('Should get transaction by id', async () => {
    const id = 'EdhLuhUMX22gKxGxKZxLcVsygMC9nBCBbSuAxFhbZumQ'
    const tx = await utilityF.transactionById(id, apiBase)
    expect(tx.id).toEqual(id)
  })

  it('Should return null on not existing tx', async () => {
    const id = 'EdhLuhUMX22gKxGxKZxLcVsygMC9nBCBbSuAxFbZumQ'
    const tx = await utilityF.transactionById(id, apiBase)
    expect(tx).toEqual(null)
  })

  it('Should wait 1 Block', async () => {
    await utilityF.waitNBlocks(1, { apiBase })
  }, 120000)

  it('Should fail to wait 2 blocks by timeout', async () => {
    await expect(utilityF.waitNBlocks(2, { apiBase, timeout: 5000 })).rejects.toEqual(new Error('Tx wait stopped: timeout'))
  }, 120000)


  it('Should get balance', async () => {
    await expect(utilityF.balance('3MtXzccPrCAoKans9TD9sp3qoFHiajPA4Uu', apiBase)).resolves.not.toBeNaN()
    await expect(utilityF.balance('bad address', apiBase)).rejects.toMatchObject({error:102})
  }, 120000)

  it('Should get balanceDetails', async () => {
    await expect(utilityF.balanceDetails('3MtXzccPrCAoKans9TD9sp3qoFHiajPA4Uu', apiBase)).resolves.not.toBeFalsy()
  }, 120000)

  it('Should get asset balance', async () => {
    await expect(utilityF.assetBalance('3xdf6GESKGNP1oUyT8QXDgzTE11yi1sJGyVmjt7HHNEU', '3MtXzccPrCAoKans9TD9sp3qoFHiajPA4Uu', apiBase)).resolves.not.toBeFalsy()
  }, 120000)

  it('Should return correct error on invalid address for asset balance', async () => {
    const resp = utilityF.assetBalance('invalidAddress', 'bad address', apiBase)
    await expect(resp).rejects.toMatchObject({error:102})
  }, 120000)

  it('Should get accountData ', async () => {
    await expect(utilityF.accountData('3MtXzccPrCAoKans9TD9sp3qoFHiajPA4Uu', apiBase)).resolves.not.toBeFalsy()
  }, 120000)

  it('Should get accountData and filter it by regexp', async () => {
    const data = await utilityF.accountData({
      address: '3MtXzccPrCAoKans9TD9sp3qoFHiajPA4Uu',
      match: 'binary.*'
    }, apiBase)
    expect(Object.keys(data).length).toEqual(2)
  }, 120000)

  it('Should get accountData by key ', async () => {
    const data = await utilityF.accountDataByKey( 'string_value','3MtXzccPrCAoKans9TD9sp3qoFHiajPA4Uu', apiBase)
    expect(data).not.toBeFalsy()
  }, 120000)

  it('Should get accountData by key and return null on no data', async () => {
    const data = await utilityF.accountDataByKey('test23', '3MtXzccPrCAoKans9TD9sp3qoFHiajPA4Uu', apiBase)
    expect(data).toBeNull()
  }, 120000)

  it('Should give correct error on invalid address', async () => {
    const data = utilityF.accountDataByKey('test23', 'invalidAddress', apiBase)
    await expect(data).rejects.toMatchObject({error:102})
  }, 120000)

  it('Should get account script info', async () => {
    const data = await utilityF.scriptInfo( '3N749utyWVhhnCqWh6hbqsq5zMvqVSanamR', apiBase)
    expect(data).toMatchObject({extraFee:0})
  }, 120000)

  it('Should get account script meta', async () => {
    const data = await utilityF.scriptMeta( '3N749utyWVhhnCqWh6hbqsq5zMvqVSanamR', apiBase)
    console.log(data)
    expect(data).toMatchObject({address:'3N749utyWVhhnCqWh6hbqsq5zMvqVSanamR'})
  }, 120000)

  it('Should reward info', async () => {
    const data = await utilityF.rewards('https://nodes-stagenet.wavesnodes.com')
    expect(data).toHaveProperty('currentReward')
  }, 120000)

  it('Should get invokeTx state changes', async () => {
    const data = await utilityF.stateChanges( 'CNo4Zy72KEAo4pnpVL5FQrBujwhqhYgBogwQ1RS8uWkD', apiBase)
    expect(Array.isArray(data.data)).toBe(true)
  }, 120000)
})
