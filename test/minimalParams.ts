import { OrderParams } from '../src/transactions/order'
import { TransactionType } from '../src/transactions'
import { SetScriptParams } from '../src/transactions/set-script'
import { TransferParams } from '../src/transactions/transfer'

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

export const minimalParams = {
  [TransactionType.Issue]: issueMinimalParams,
  [TransactionType.Transfer]: transferMinimalParams,
  [TransactionType.Reissue]: reissueMinimalParams,
  [TransactionType.Burn]: burnMinimalParams,
  [TransactionType.Lease]: leaseMinimalParams,
  [TransactionType.CancelLease]: cancelLeaseMinimalParams,
  [TransactionType.Alias]: aliasMinimalParams,
  [TransactionType.MassTransfer]: massTransferMinimalParams,
  [TransactionType.Data]: dataMinimalParams,
  [TransactionType.SetScript]: setScriptMinimalParams,
}