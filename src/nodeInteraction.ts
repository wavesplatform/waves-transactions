import { TTx } from './transactions'
import axios from 'axios'

export type CancellablePromise<T> = Promise<T> & { cancel: () => void }

const delay = (timeout: number): CancellablePromise<{}> => {
  const t: any = {}

  const p = new Promise((resolve, _) => {
    t.resolve = resolve
    t.id = setTimeout(() => resolve(), timeout)
  }) as any

  (<any>p).cancel = () => {
    t.resolve()
    clearTimeout(t.id)
  }

  return p
}

const rerun = (f: () => Promise<any>, expired: boolean, t = 1000) => delay(t).then(_ => expired ?
  Promise.reject(new Error('Tx wait stopped: timeout')) :
  f()
)

export interface INodeRequestOptions {
  timeout?: number,
  apiBase?: string
}

const DEFAULT_NODE_REQUEST_OPTIONS = {
  timeout: 120000,
  apiBase: "https://nodes.wavesplatform.com"
}

export const currentHeight = async (apiBase: string): Promise<number> => {
  return await axios.get('/blocks/height', { baseURL: apiBase })
    .then(res => res.data && res.data.height)
}

export async function waitForHeight(height: number, options?: INodeRequestOptions) {
  const { timeout, apiBase } = {...DEFAULT_NODE_REQUEST_OPTIONS, ...options}

  let expired = false
  const to = delay(timeout)
  to.then(() => expired = true)

  const promise = (): Promise<number> => currentHeight(apiBase)
    .then(x => {
      if (x >= height) {
        to.cancel()
        return x
      } else {
        return rerun(promise, expired, 10000)
      }
    }).catch(_ => rerun(promise, expired))

  return promise()
}

export async function waitForTx(txId: string, options?: INodeRequestOptions): Promise<TTx> {
  const { timeout, apiBase } = {...DEFAULT_NODE_REQUEST_OPTIONS, ...options}

  let expired = false
  const to = delay(timeout)
  to.then(() => expired = true)

  const promise = (): Promise<TTx> => axios.get(`transactions/info/${txId}`, { baseURL: apiBase })
    .then(x => {
        to.cancel()
        return x.data
    })
    .catch(_ => delay(1000)
      .then(_ => expired ?
        Promise.reject(new Error('Tx wait stopped: timeout')) :
        promise()))

  return promise()
}

export async function waitForTxWithNConfirmations(txId: string, confirmations: number,
                                                  options: INodeRequestOptions ): Promise<TTx> {


  const { timeout } = {...DEFAULT_NODE_REQUEST_OPTIONS, ...options}

  let expired = false
  const to = delay(timeout)
  to.then(() => expired = true)

  let tx = await waitForTx(txId, options);

  let txHeight = (tx as any).height
  let currentHeight = (tx as any).height

  while (txHeight + confirmations > currentHeight){
    if (expired) throw new Error('Tx wait stopped: timeout')
    await waitForHeight(txHeight + confirmations, options);
    tx = await waitForTx(txId, options);
    txHeight = (tx as any).height
  }

  return tx
}

export async function waitNBlocks(blocksCount: number,options: INodeRequestOptions = DEFAULT_NODE_REQUEST_OPTIONS){
  const { apiBase } = {...DEFAULT_NODE_REQUEST_OPTIONS, ...options}
  const height = await currentHeight(apiBase)
  const target = height + blocksCount;
  // console.log(`current height: ${height} target: ${target}`)
  return await waitForHeight(target, options)
}

export async function balance(address: string, apiBase: string) {
  return axios.get(`addresses/balance/${address}`, { baseURL: apiBase }).then(x => x.data.balance)
}