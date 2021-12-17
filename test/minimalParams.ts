import {
  IAliasParams,
  IBurnParams,
  ICancelLeaseParams, IInvokeScriptParams, IDataParams, IIssueParams,
  ILeaseParams,
  IMassTransferParams, IOrderParams, IReissueParams, ISetAssetScriptParams, ISetScriptParams, ITransferParams,
  ICancelOrderParams, ISponsorshipParams, IUpdateAssetInfoParams,
} from '../src/transactions'
import {TRANSACTION_TYPE} from '@waves/ts-types'

export const aliasMinimalParams: IAliasParams = {
  alias: 'mytestalias',
}

export const burnMinimalParams: IBurnParams = {
  assetId: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
  amount: 10000,
}

export const leaseMinimalParams: ILeaseParams = {
  recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  amount: 1,
}

export const cancelLeaseMinimalParams: ICancelLeaseParams = {
  leaseId: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
}

export const invokeScriptMinimalParams: IInvokeScriptParams = {
  dApp: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  call: {
    function: 'foo',
    args: [
      {
        type: 'binary',
        value: 'base64:AQa3b8tH',
      },
      {
        type: 'list',
        value: [
            {
              type: 'string',
              value: 'aaa',
            },
            {
              type: 'string',
              value: 'bbb',
            },
         ],
      },
    ],
  },
}

export const massTransferMinimalParams: IMassTransferParams = {
  transfers: [
    {
      recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
      amount: 0,
    },
  ],
};

export const orderMinimalParams: IOrderParams = {
  matcherPublicKey: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
  amountAsset: null,
  priceAsset: '474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
  price: 10000,
  amount: 1233,
  orderType: 'buy',
};

export const cancelOrderMinimalParams: ICancelOrderParams = {
  orderId: '47YGqHdHtNPjcjE69E9EX9aD9bpC8PRKr4kp5AcZKHFq',
};

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
} as any;

export const reissueMinimalParams: IReissueParams = {
  assetId: 'DT5bC1S6XfpH7s4hcQQkLj897xnnXQPNgYbohX7zZKcr',
  quantity: 1,
  reissuable: false,
};

export const issueMinimalParams: IIssueParams = {
  quantity: 1,
  name: 'test',
  description: '',
};

export const transferMinimalParams: ITransferParams = {
  recipient: '3N3Cn2pYtqzj7N9pviSesNe8KG9Cmb718Y1',
  amount: 1,
};

export const setScriptMinimalParams: ISetScriptParams = {
  script: 'AQa3b8tH',
};

export const setAssetScriptMinimalParams: ISetAssetScriptParams = {
  script: 'base64:AQa3b8tH',
  assetId: 'syXBywr2HVY7wxqkaci1jKY73KMpoLh46cp1peJAZNJ',
}

export const sponsorshipMinimalParams: ISponsorshipParams = {
  assetId: "syXBywr2HVY7wxqkaci1jKY73KMpoLh46cp1peJAZNJ",
  minSponsoredAssetFee: 100
}

export const updateAssetInfoMinimalParams: IUpdateAssetInfoParams = {
  name: "xxxx",
  description: "",
  assetId: "syXBywr2HVY7wxqkaci1jKY73KMpoLh46cp1peJAZNJ"
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
  [TRANSACTION_TYPE.INVOKE_SCRIPT]: invokeScriptMinimalParams,
  [TRANSACTION_TYPE.SPONSORSHIP]: sponsorshipMinimalParams,
  [TRANSACTION_TYPE.UPDATE_ASSET_INFO]: updateAssetInfoMinimalParams,
}
