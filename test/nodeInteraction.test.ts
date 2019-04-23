import * as utilityF from '../src/nodeInteraction'
import { data } from '../src'
import { broadcast } from '../src/nodeInteraction'

const apiBase = 'https://testnodes.wavesnodes.com/'

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
    const result = data(dataParams, 'seed')

    await expect(broadcast(result, apiBase)).rejects.toMatchObject({ "error": 303})
  })

  it('Should get current height', async () => {
    return expect(utilityF.currentHeight(apiBase)).resolves.toBeGreaterThan(0)
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
    const resp = utilityF.assetBalance('3xdf6GESKGNP1oUyT8QXDgzTE11yi1sJGyVmjt7HHNEU', 'bad address', apiBase)
    await expect(resp).rejects.toMatchObject({error:102})
  }, 120000)

  it('Should get accountData ', async () => {
    await expect(utilityF.accountData('3MtXzccPrCAoKans9TD9sp3qoFHiajPA4Uu', apiBase)).resolves.not.toBeFalsy()
  }, 120000)

  it('Should get accountData by key ', async () => {
    const data = await utilityF.accountDataByKey( 'test','3MtXzccPrCAoKans9TD9sp3qoFHiajPA4Uu', apiBase)
    expect(data).not.toBeFalsy()
  }, 120000)

  it('Should get accountData by key and return null on no data', async () => {
    const data = await utilityF.accountDataByKey('test23', '3MtXzccPrCAoKans9TD9sp3qoFHiajPA4Uu', apiBase)
    expect(data).toBeNull()
  }, 120000)

  it('Should give correct error on invalid address', async () => {
    const data = utilityF.accountDataByKey('test23', '3MtXzccPrCAoKans9Tsp3qoFHiajPA4Uu', apiBase)
    await expect(data).rejects.toMatchObject({error:102})
  }, 120000)

})