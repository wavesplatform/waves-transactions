import {
  IAliasParams,
  IBurnParams,
  ICancelLeaseParams, IContractInvocationParams, IDataParams, IIssueParams,
  ILeaseParams,
  IMassTransferParams, IOrderParams, IReissueParams, ISetAssetScriptParams, ISetScriptParams, ITransferParams,
  TRANSACTION_TYPE
} from '../src/transactions'

export const aliasMinimalParams: IAliasParams = {
  alias: 'MyTestAlias',
}

export const burnMinimalParams: IBurnParams = {
  assetId: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
  quantity: 10000,
}

export const leaseMinimalParams: ILeaseParams = {
  recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  amount: 10000,
}

export const cancelLeaseMinimalParams: ICancelLeaseParams = {
  leaseId: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
}

export const contractInvocationMinimalParams: IContractInvocationParams = {
  contractAddress: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  function: {
    name: 'foo',
    args: [{
      type: 'binary',
      value: 'base64:AQa3b8tH'
    }]
  }
}

export const massTransferMinimalParams: IMassTransferParams = {
  transfers: [
    {
      recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
      amount: 10000,
    },
    {
      recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
      amount: 10000,
    },
  ],
}

export const orderMinimalParams: IOrderParams = {
  matcherPublicKey: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
  price: 10000,
  amount: 1233,
  orderType: 'buy',
}

export const dataMinimalParams: IDataParams = {
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

export const reissueMinimalParams: IReissueParams = {
  assetId: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
  quantity: 10000,
  reissuable: false,
}

export const issueMinimalParams: IIssueParams = {
  quantity: 10000,
  name: 'test',
  description: 'tratata',
}

export const transferMinimalParams: ITransferParams = {
  recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  amount: 10000,
}

export const setScriptMinimalParams: ISetScriptParams = {
  script: 'AQa3b8tH',
}

export const setAssetScriptMinimalParams: ISetAssetScriptParams = {
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
  [TRANSACTION_TYPE.CONTRACT_INVOCATION]: contractInvocationMinimalParams,
}