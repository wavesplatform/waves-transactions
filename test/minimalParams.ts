import { OrderParams } from '../src/transactions/order'
import { TRANSACTION_TYPE } from '../src/transactions'
import { SetScriptParams } from '../src/transactions/set-script'
import { TransferParams } from '../src/transactions/transfer'
import { SetAssetScriptParams } from "../src/transactions/set-asset-script";

export const aliasMinimalParams = {
  alias: 'MyTestAlias',
}

export const burnMinimalParams = {
  assetId: 'test',
  quantity: 10000,
}

export const leaseMinimalParams = {
  recipient: 'sssss',
  amount: 10000,
}

export const cancelLeaseMinimalParams = {
  leaseId: 'test',
}

export const massTransferMinimalParams = {
  transfers: [
    {
      recipient: 'aaa',
      amount: 10000,
    },
    {
      recipient: 'aab',
      amount: 10000,
    },
  ],
}

export const orderMinimalParams: OrderParams = {
  matcherPublicKey: 'aaaa',
  price: 10000,
  amount: 1233,
  orderType: 'buy',
}

export const dataMinimalParams = {
  data: [
    {
      key: 'someparam',
      value: Uint8Array.from([1, 2, 3, 4]),
    }, {
      key: 'someparam2',
      type: 'binary',
      value: 'base64:YXNkYQ==',
    }, {
      key: 'someparam3',
      value: true,
    },
  ],
}

export const reissueMinimalParams = {
  assetId: 'test',
  quantity: 10000,
  reissuable: false,
}

export const issueMinimalParams = {
  assetId: 'test',
  quantity: 10000,
  name: 'test',
  description: 'tratata',
}

export const transferMinimalParams: TransferParams = {
  recipient: 'aaaa',
  amount: 10000,
}

export const setScriptMinimalParams: SetScriptParams = {
  script: 'AQa3b8tH',
}

export const setAssetScriptMinimalParams: SetAssetScriptParams = {
  script: 'AQa3b8tH',
  assetId: ''
}

export const minimalParams = {
  [TRANSACTION_TYPE.ISSUE]: issueMinimalParams,
  [TRANSACTION_TYPE.TRANSFER]: transferMinimalParams,
  [TRANSACTION_TYPE.REISSUE]: reissueMinimalParams,
  [TRANSACTION_TYPE.BURN]: burnMinimalParams,
  [TRANSACTION_TYPE.LEASE]: leaseMinimalParams,
  [TRANSACTION_TYPE.CANCEL_LEASE]: cancelLeaseMinimalParams,
  [TRANSACTION_TYPE.ALIAS]: aliasMinimalParams,
  [TRANSACTION_TYPE.MASS_TRANSFER]: massTransferMinimalParams,
  [TRANSACTION_TYPE.DATA]: dataMinimalParams,
  [TRANSACTION_TYPE.SET_SCRIPT]: setScriptMinimalParams,
  [TRANSACTION_TYPE.SET_ASSET_SCRIPT]: setAssetScriptMinimalParams,
}