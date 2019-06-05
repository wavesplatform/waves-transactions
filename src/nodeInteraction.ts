import { IDataEntry, TTx } from './transactions'
import axios from 'axios'
import { json } from '@waves/marshall'

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
  const { timeout, apiBase } = { ...DEFAULT_NODE_REQUEST_OPTIONS, ...options }

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

/**
 * Resolves when specified txId is mined into block
 * @param txId - waves address as base58 string
 * @param options
 */
export async function waitForTx(txId: string, options?: INodeRequestOptions): Promise<TTx> {
  const { timeout, apiBase } = { ...DEFAULT_NODE_REQUEST_OPTIONS, ...options }

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

const process400 = (resp: any) => resp.status === 400
  ? Promise.reject(Object.assign(new Error(), resp.data))
  : resp

const validateStatus = (status: number) => status === 400 || status >= 200 && status < 300

export async function waitForTxWithNConfirmations(txId: string, confirmations: number,
                                                  options: INodeRequestOptions): Promise<TTx> {


  const { timeout } = { ...DEFAULT_NODE_REQUEST_OPTIONS, ...options }

  let expired = false
  const to = delay(timeout)
  to.then(() => expired = true)

  let tx = await waitForTx(txId, options)

  let txHeight = (tx as any).height
  let currentHeight = (tx as any).height

  while (txHeight + confirmations > currentHeight) {
    if (expired) throw new Error('Tx wait stopped: timeout')
    await waitForHeight(txHeight + confirmations, options)
    tx = await waitForTx(txId, options)
    txHeight = (tx as any).height
  }

  return tx
}

export async function waitNBlocks(blocksCount: number, options: INodeRequestOptions = DEFAULT_NODE_REQUEST_OPTIONS) {
  const { apiBase } = { ...DEFAULT_NODE_REQUEST_OPTIONS, ...options }
  const height = await currentHeight(apiBase)
  const target = height + blocksCount
  // console.log(`current height: ${height} target: ${target}`)
  return await waitForHeight(target, options)
}

/**
 * Get account effective balance
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
export async function balance(address: string, nodeUrl: string): Promise<number> {
  return axios.get(`addresses/balance/${address}`, { baseURL: nodeUrl, validateStatus })
    .then(process400)
    .then(x => x.data.balance)
}

/**
 * Retrieve full information about waves account balance. Effective, generating etc
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
export async function balanceDetails(address: string, nodeUrl: string) {
  return axios.get(`addresses/balance/details/${address}`, { baseURL: nodeUrl, validateStatus })
    .then(process400)
    .then(x => x.data)
}

/**
 * Retrieve information about specific asset account balance
 * @param assetId - id of asset
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
export async function assetBalance(assetId: string, address: string, nodeUrl: string) {
  return axios.get(`assets/balance/${address}/${assetId}`, { baseURL: nodeUrl, validateStatus })
    .then(process400)
    .then(x => x.data.balance)
}

/**
 * Get full account dictionary
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
export async function accountData(address: string, nodeUrl: string): Promise<Record<string, IDataEntry>> {
  const data: IDataEntry[] = await axios.get(`addresses/data/${address}`, { baseURL: nodeUrl, validateStatus })
    .then(process400)
    .then(x => x.data)
  return data.reduce((acc, item) => ({ ...acc, [item.key]: item }), {})
}


/**
 * Get data from account dictionary by key
 * @param address - waves address as base58 string
 * @param key - dictionary key
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
export async function accountDataByKey(key: string, address: string, nodeUrl: string): Promise<IDataEntry> {
  return axios.get(`addresses/data/${address}/${key}`,
    { baseURL: nodeUrl, validateStatus: (status) => status === 404 || validateStatus(status) })
    .then(process400)
    .then(resp => resp.status === 404 ? null : resp.data)
}


/**
 * Get account script info
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
export async function scriptInfo(address: string, nodeUrl: string): Promise<any> {
  return axios.get(`addresses/scriptInfo/${address}`,
    { baseURL: nodeUrl, validateStatus: (status) => validateStatus(status) })
    .then(process400)
    .then(resp => resp.data)
}


export interface IStateChangeResponse {
  data: IDataEntry[],
  transfers: {
    address: string,
    amount: number,
    assetId: string | null
  }[]
}

/**
 * Get invokeScript tx state changes
 * @param transactionId - invokeScript transaction id as base58 string
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
export async function stateChanges(transactionId: string, nodeUrl: string): Promise<IStateChangeResponse> {
  return axios.get(`debug/stateChanges/info/${transactionId}`,
    { baseURL: nodeUrl, validateStatus: (status) => validateStatus(status) })
    .then(process400)
    .then(resp => resp.data && resp.data.stateChanges)
}

/**
 * Sends transaction to waves node
 * @param tx - transaction to send
 * @param nodeUrl - node address to send tx to. E.g. https://nodes.wavesplatform.com/
 */
export function broadcast(tx: TTx, nodeUrl: string) {
  return axios.post('transactions/broadcast', json.stringifyTx(tx), {
    baseURL: nodeUrl,
    headers: { 'content-type': 'application/json' },
    validateStatus,
  }).then(process400)
    .then(x => x.data)
}