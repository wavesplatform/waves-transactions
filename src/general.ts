import { Order, TransactionType, Tx, IssueTransaction, TransferTransaction, ReissueTransaction, BurnTransaction, LeaseTransaction, CancelLeaseTransaction, AliasTransaction, MassTransferTransaction, DataTransaction, SetScriptTransaction } from './transactions'
import { SeedTypes, Params } from './types'
import { issue, issueToBytes } from './transactions/issue'
import { transfer, transferToBytes } from './transactions/transfer'
import { reissue, reissueToBytes } from './transactions/reissue'
import { burn, burnToBytes } from './transactions/burn'
import { lease, leaseToBytes } from './transactions/lease'
import { cancelLease, cancelLeaseToBytes } from './transactions/cancel-lease'
import { data, dataToBytes } from './transactions/data'
import { massTransfer, massTransferToBytes } from './transactions/mass-transfer'
import { alias, aliasToBytes } from './transactions/alias'
import { setScript, setScriptToBytes } from './transactions/set-script'
import { isOrder, orderToBytes } from './transactions/order'
import axios from 'axios'
import { txToJson } from './txToJson'

export type CancellablePromise<T> = Promise<T> & { cancel: () => void }

export const txTypeMap: { [type: number]: { sign: (tx: Tx | Params, seed: SeedTypes) => Tx, serialize: (obj: Tx | Order) => Uint8Array } } = {
  [TransactionType.Issue]: { sign: (x, seed) => issue(x as IssueTransaction, seed), serialize: (x) => issueToBytes(x as IssueTransaction) },
  [TransactionType.Transfer]: { sign: (x, seed) => transfer(x as TransferTransaction, seed), serialize: (x) => transferToBytes(x as TransferTransaction) },
  [TransactionType.Reissue]: { sign: (x, seed) => reissue(x as ReissueTransaction, seed), serialize: (x) => reissueToBytes(x as ReissueTransaction) },
  [TransactionType.Burn]: { sign: (x, seed) => burn(x as BurnTransaction, seed), serialize: (x) => burnToBytes(x as BurnTransaction) },
  [TransactionType.Lease]: { sign: (x, seed) => lease(x as LeaseTransaction, seed), serialize: (x) => leaseToBytes(x as LeaseTransaction) },
  [TransactionType.CancelLease]: { sign: (x, seed) => cancelLease(x as CancelLeaseTransaction, seed), serialize: (x) => cancelLeaseToBytes(x as CancelLeaseTransaction) },
  [TransactionType.Alias]: { sign: (x, seed) => alias(x as AliasTransaction, seed), serialize: (x) => aliasToBytes(x as AliasTransaction) },
  [TransactionType.MassTransfer]: { sign: (x, seed) => massTransfer(x as MassTransferTransaction, seed), serialize: (x) => massTransferToBytes(x as MassTransferTransaction) },
  [TransactionType.Data]: { sign: (x, seed) => data(x as DataTransaction, seed), serialize: (x) => dataToBytes(x as DataTransaction) },
  [TransactionType.SetScript]: { sign: (x, seed) => setScript(x as SetScriptTransaction, seed), serialize: (x) => setScriptToBytes(x as SetScriptTransaction) },
}

export const signTx = (tx: Tx, seed: SeedTypes): Tx => {
  if (!txTypeMap[tx.type]) throw new Error(`Unknown tx type: ${tx!.type}`)

  return txTypeMap[tx.type].sign(tx, seed)
}

export const serialize = (obj: Tx | Order): Uint8Array => {
  if (isOrder(obj)) return orderToBytes(obj)
  if (!txTypeMap[obj.type]) throw new Error(`Unknown tx type: ${obj!.type}`)

  return txTypeMap[obj.type].serialize(obj)
}

export const broadcast = (tx: Tx, apiBase: string) =>
  axios.post('transactions/broadcast', txToJson(tx), { baseURL: apiBase, headers: { 'content-type': 'application/json' } })
    .then(x => x.data)
    .catch(e => Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))


export const delay = (timeout: number): CancellablePromise<{}> => {
  const t: any = {}
  const p = new Promise((resolve, _) => {
    t.resolve = resolve
    t.id = setTimeout(() => resolve(), timeout)
  }) as any
  (<any>p).cancel = () => { t.resolve(); clearTimeout(t.id) }
  return p
}

export const waitForTx = async (txId: string, timeout: number, apiBase: string): Promise<Tx> => {
  const promise = (): Promise<Tx> => axios.get(`transactions/info/${txId}`, { baseURL: apiBase })
    .then(x => x.data).catch(_ => delay(1000).then(_ => promise()))

  const t = delay(timeout)
  const r = await Promise.race([t.then(x => Promise.reject('timeout')), promise()]) as Tx
  t.cancel()
  return r
}
