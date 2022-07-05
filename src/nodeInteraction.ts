import { WithId } from './transactions'
import * as tx_route from '@waves/node-api-js/cjs/api-node/transactions'
import * as blocks_route from '@waves/node-api-js/cjs/api-node/blocks'
import * as addresses_route from '@waves/node-api-js/cjs/api-node/addresses'
import * as assets_route from '@waves/node-api-js/cjs/api-node/assets'
import * as rewards_route from '@waves/node-api-js/cjs/api-node/rewards'
import * as debug_route from '@waves/node-api-js/cjs/api-node/debug'
import { RequestInit } from '@waves/node-api-js/cjs/tools/request'
import {DataTransactionEntry, SignedTransaction, Transaction, WithApiMixin} from '@waves/ts-types'
import {TLong} from '@waves/node-api-js/cjs/interface'

export type CancellablePromise<T> = Promise<T> & { cancel: () => void }

const delay = (timeout: number): CancellablePromise<{}> => {
  const t: any = {}

  const p = new Promise((resolve, _) => {
    t.resolve = resolve
    t.id = setTimeout(resolve, timeout)
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
  apiBase: string
}

const DEFAULT_NODE_REQUEST_OPTIONS = {
  timeout: 120000,
  apiBase: 'https://nodes.wavesplatform.com',
}

export const currentHeight = async (apiBase: string): Promise<number> => {
  return blocks_route.fetchHeight(apiBase).then(({height}) => height)
}

export async function waitForHeight(height: number, options: INodeRequestOptions) {
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

type PropApplicationStatus = {
  applicationStatus?: 'succeeded' | 'script_execution_failed'
}

type TxStatus = Transaction & PropApplicationStatus

/**
 * Resolves when specified txId is mined into block
 * @param txId - waves address as base58 string
 * @param options
 */
export async function waitForTx(txId: string, options: INodeRequestOptions, requestOptions?: RequestInit): Promise<TxStatus> {
  const { timeout, apiBase } = { ...DEFAULT_NODE_REQUEST_OPTIONS, ...options }

  let expired = false
  const to = delay(timeout)
  to.then(() => expired = true)

  const promise = (): Promise<TxStatus> =>
      tx_route.fetchInfo(apiBase, txId, requestOptions)
    .then(x => {
      to.cancel()
      return x as any //todo: fix types
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

export async function waitForTxWithNConfirmations(
  txId: string,
  confirmations: number,
  options: INodeRequestOptions,
  requestOptions?: RequestInit
): Promise<TxStatus> {

  const { timeout } = { ...DEFAULT_NODE_REQUEST_OPTIONS, ...options }

  let expired = false
  const to = delay(timeout)
  to.then(() => expired = true)

  let tx = await waitForTx(txId, options, requestOptions)

  let txHeight = (tx as any).height
  let currentHeight = (tx as any).height

  while (txHeight + confirmations > currentHeight) {
    if (expired) throw new Error('Tx wait stopped: timeout')
    await waitForHeight(txHeight + confirmations, options)
    tx = await waitForTx(txId, options, requestOptions)
    txHeight = (tx as any).height
  }

  return tx
}

export async function waitNBlocks(blocksCount: number, options: INodeRequestOptions = DEFAULT_NODE_REQUEST_OPTIONS, requestOptions?: RequestInit) {
  const { apiBase } = { ...DEFAULT_NODE_REQUEST_OPTIONS, ...options }
  const height = await currentHeight(apiBase)
  const target = height + blocksCount
  // console.log(`current height: ${height} target: ${target}`)
  return await waitForHeight(target, options)
}

/**
 * Get account effective balance
 * @param txId - transaction ID as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
export async function transactionById(txId: string, nodeUrl: string, requestOptions?: RequestInit): Promise<Transaction & WithId & { height: number }> {
  return tx_route.fetchInfo(nodeUrl, txId, requestOptions) as any //todo: fix types
}

/**
 * Get account effective balance
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
export async function balance(address: string, nodeUrl: string, requestOptions?: RequestInit): Promise<number> {
  return addresses_route.fetchBalance(nodeUrl, address, requestOptions).then(d => +d.balance)
}

/**
 * Retrieve full information about waves account balance. Effective, generating etc
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
export async function balanceDetails(address: string, nodeUrl: string, requestOptions?: RequestInit) {
  return addresses_route.fetchBalanceDetails(nodeUrl, address, requestOptions)
}

/**
 * Retrieve information about specific asset account balance
 * @param assetId - id of asset
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
export async function assetBalance(assetId: string, address: string, nodeUrl: string, requestOptions?: RequestInit) {
  return assets_route.fetchBalanceAddressAssetId(nodeUrl, address, assetId, requestOptions)
    .then(x => x.balance)
}

export interface IAccountDataRequestOptions {
  address: string
  match?: string | RegExp
}

/**
 * Get full account dictionary
 * @param options - waves address and optional match regular expression. If match is present keys will be filtered by this regexp
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
export async function accountData(options: IAccountDataRequestOptions, nodeUrl: string, requestOptions?: RequestInit): Promise<Record<string, DataTransactionEntry>>
export async function accountData(address: string, nodeUrl: string, requestOptions?: RequestInit): Promise<Record<string, DataTransactionEntry>>
export async function accountData(options: string | IAccountDataRequestOptions, nodeUrl: string, requestOptions?: RequestInit): Promise<Record<string, DataTransactionEntry>> {
  let address
  let match
  if (typeof options === 'string') {
    address = options
    match = undefined
  } else {
    address = options.address
    match = options.match && encodeURIComponent(typeof options.match === 'string'
      ? options.match
      : options.match.source)
  }

  const data: DataTransactionEntry[] =  await addresses_route.data(
    nodeUrl,
    address,
    { matches: match },
    requestOptions
    ) as any //todo fix type

  return data.reduce((acc, item) => ({ ...acc, [item.key]: item }), {})
}


/**
 * Get data from account dictionary by key
 * @param address - waves address as base58 string
 * @param key - dictionary key
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
export async function accountDataByKey(key: string, address: string, nodeUrl: string, requestOptions?: RequestInit): Promise<DataTransactionEntry<TLong> | null> {
  return addresses_route.fetchDataKey(nodeUrl, address, key, requestOptions).catch((e) => {
    if (e.error === 304) return null
    else throw e
  })
}


/**
 * Get account script info
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
export async function scriptInfo(address: string, nodeUrl: string, requestOptions?: RequestInit): Promise<any> {
  return addresses_route.fetchScriptInfo(nodeUrl, address, requestOptions)
}

/**
 * Get account script meta, i.e., available callable functions
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
export async function scriptMeta(address: string, nodeUrl: string): Promise<any> {
  return addresses_route.fetchScriptInfoMeta(nodeUrl, address)
}

/**
 * Get miner’s reward status and total supply
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
export async function rewards(nodeUrl: string): Promise<any>
/**
 * Get miner’s reward status at height and total supply
 * @param height - block number to get info
 * @param nodeUrl - node address to ask data from. E.g. https://nodes.wavesplatform.com/
 */
export async function rewards(height: number, nodeUrl: string): Promise<any>
export async function rewards(...args: [number, string] | [string]): Promise<any> {//TODO add requestOptions argument
  let nodeUrl: string
  let _height: number | undefined = undefined
  if (args[1] !== undefined) {
    nodeUrl = args[1]
    _height = args[0] as number
  } else {
    nodeUrl = args[0] as string
  }

  return rewards_route.fetchRewards(nodeUrl, _height)
}

export interface IStateChangeResponse {
  data: DataTransactionEntry[],
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
export async function stateChanges(transactionId: string, nodeUrl: string, requestOptions?: RequestInit): Promise<IStateChangeResponse> {
  return debug_route.fetchStateChangesByTxId(nodeUrl, transactionId, requestOptions).then((t: any) => t.stateChanges) as any //todo: fix types
}

/**
 * Sends transaction to waves node
 * IMPORTANT: You cannot broadcast order. Orders should be sent to matcher via submitOrder method
 * @param tx - transaction to send
 * @param nodeUrl - node address to send tx to. E.g. https://nodes.wavesplatform.com/
 */
export function broadcast<T extends SignedTransaction<Transaction<TLong>>>(tx: T, nodeUrl: string, requestOptions?: RequestInit ): Promise<T & WithApiMixin> {
  return tx_route.broadcast(nodeUrl, tx as any, requestOptions)
}
