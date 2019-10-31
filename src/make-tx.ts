import {
  IAliasParams,
  IAliasTransaction,
  IBurnParams,
  IBurnTransaction,
  ICancelLeaseParams,
  ICancelLeaseTransaction,
  IDataParams,
  IDataTransaction,
  IExchangeTransaction,
  IInvokeScriptParams,
  IInvokeScriptTransaction,
  IIssueParams,
  IIssueTransaction,
  ILeaseParams,
  ILeaseTransaction,
  IMassTransferParams,
  IMassTransferTransaction,
  IReissueParams,
  IReissueTransaction,
  ISetAssetScriptParams,
  ISetAssetScriptTransaction,
  ISetScriptTransaction,
  ISponsorshipParams,
  ISponsorshipTransaction,
  ITransferParams,
  ITransferTransaction,
  TRANSACTION_TYPE, WithId, WithSender
} from './transactions'
import { issue } from './transactions/issue'
import { transfer } from './transactions/transfer'
import { reissue } from './transactions/reissue'
import { burn } from './transactions/burn'
import { lease } from './transactions/lease'
import { cancelLease } from './transactions/cancel-lease'
import { alias } from './transactions/alias'
import { massTransfer } from './transactions/mass-transfer'
import { data } from './transactions/data'
import { setScript } from './transactions/set-script'
import { setAssetScript } from './transactions/set-asset-script'
import { sponsorship } from './transactions/sponsorship'
import { exchange } from './transactions/exchange'
import { invokeScript } from './transactions/invoke-script'

export type TransactionType<T> =
  T extends TRANSACTION_TYPE.ISSUE ? IIssueTransaction :
    T extends TRANSACTION_TYPE.TRANSFER ? ITransferTransaction :
      T extends TRANSACTION_TYPE.REISSUE ? IReissueTransaction :
        T extends TRANSACTION_TYPE.BURN ? IBurnTransaction :
          T extends TRANSACTION_TYPE.LEASE ? ILeaseTransaction :
            T extends TRANSACTION_TYPE.CANCEL_LEASE ? ICancelLeaseTransaction :
              T extends TRANSACTION_TYPE.ALIAS ? IAliasTransaction :
                T extends TRANSACTION_TYPE.MASS_TRANSFER ? IMassTransferTransaction :
                  T extends TRANSACTION_TYPE.DATA ? IDataTransaction :
                    T extends TRANSACTION_TYPE.SET_SCRIPT ? ISetScriptTransaction :
                      T extends TRANSACTION_TYPE.SET_ASSET_SCRIPT ? ISetAssetScriptTransaction :
                        T extends TRANSACTION_TYPE.SPONSORSHIP ? ISponsorshipTransaction :
                          T extends TRANSACTION_TYPE.EXCHANGE ? IExchangeTransaction :
                            T extends TRANSACTION_TYPE.INVOKE_SCRIPT ? IInvokeScriptTransaction :
                              never;
export type TransactionParamsType<T> =
  T extends TRANSACTION_TYPE.ISSUE ? IIssueParams & { type: T }:
    T extends TRANSACTION_TYPE.TRANSFER ? ITransferParams & { type: T }:
      T extends TRANSACTION_TYPE.REISSUE ? IReissueParams & { type: T }:
        T extends TRANSACTION_TYPE.BURN ? IBurnParams & { type: T }:
          T extends TRANSACTION_TYPE.LEASE ? ILeaseParams & { type: T }:
            T extends TRANSACTION_TYPE.CANCEL_LEASE ? ICancelLeaseParams & { type: T }:
              T extends TRANSACTION_TYPE.ALIAS ? IAliasParams & { type: T }:
                T extends TRANSACTION_TYPE.MASS_TRANSFER ? IMassTransferParams & { type: T }:
                  T extends TRANSACTION_TYPE.DATA ? IDataParams & { type: T }:
                    T extends TRANSACTION_TYPE.SET_SCRIPT ? ISetAssetScriptParams& { type: T } :
                      T extends TRANSACTION_TYPE.SET_ASSET_SCRIPT ? ISetAssetScriptParams & { type: T }:
                        T extends TRANSACTION_TYPE.SPONSORSHIP ? ISponsorshipParams & { type: T }:
                          T extends TRANSACTION_TYPE.EXCHANGE ? IExchangeTransaction& { type: T } :
                            T extends TRANSACTION_TYPE.INVOKE_SCRIPT ? IInvokeScriptParams & { type: T }:
                              never;

/**
 * Makes transaction from params. Validates all fields and calculates id
 */
export function makeTx<T extends TRANSACTION_TYPE>(params:( TransactionParamsType<T> & WithSender) | TransactionType<T>):TransactionType<T> & WithId {
  if (params.type === TRANSACTION_TYPE.ISSUE) {
    return issue(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.TRANSFER) {
    return transfer(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.REISSUE) {
    return reissue(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.BURN) {
    return burn(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.LEASE) {
    return lease(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.CANCEL_LEASE) {
    return cancelLease(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.ALIAS) {
    return alias(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.MASS_TRANSFER) {
    return massTransfer(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.DATA) {
    return data(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.SET_SCRIPT) {
    return setScript(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.SET_ASSET_SCRIPT) {
    return setAssetScript(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.SPONSORSHIP) {
    return sponsorship(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.EXCHANGE) {
    return exchange(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.INVOKE_SCRIPT) {
    return invokeScript(params as any) as any
  } else {
    throw new Error(`Unknown tx type: ${params.type}`)
  }
}
