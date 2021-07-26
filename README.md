# waves-transactions  [![npm version](https://badge.fury.io/js/%40waves%2Fwaves-transactions.svg)](https://badge.fury.io/js/%40waves%2Fwaves-transactions)

[![License][license-image]][license-url]

[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/make-coverage-badge.svg

Using this library you can easily create and sign transactions for Waves blockchain.
It also allows you to multi-sign existing transactions or create them without signature at all.

- [Transactions](#Transactions) 
  - [Creation](#Creation)
  - [Signing](#Signing)
  - [Params](#Params)
- [Orders](#Orders)
- [Broadcast](#Broadcast)
- [Dependencies](#Dependencies)
## Transactions

### Creation

Transactions are created via transaction creating functions. There are 15 of them:
```typescript
const {
 alias, burn, cancelLease, data, exchange,
 invokeScript, issue, lease, massTransfer, reissue,
 setAssetScript, setScript, sponsorship, transfer, updateAssetInfo
} = require('@waves/waves-transactions')
```
Example:
```typescript
const issueTx = issue({
  name: 'foo',
  description: 'bar',
  quantity: 10000,
  senderPublicKey: 'GucCLYU7aqzcVUwVXX4nosceDisky9UpbmpFK39tVYom',
  chainId: 'T'
})
const burnTx = burn({
  assetId: '6toKooURvF3CpRQV8hzhNbHjK3Rb3L9Krd7TFnzcoe8L',
  senderPublicKey: 'GucCLYU7aqzcVUwVXX4nosceDisky9UpbmpFK39tVYom',
  chainId: 'T'
})
```
### Signing
You can provide seed or private key to transaction creating function to sign it. If you do, senderPublicKey can be omitted.
```typescript
const signedTranfer = transfer({
    recipient:'3N4mLCaHq2twRKnbUjdvAHyXjoccQE9KDRE',
    amount: 100000}, 'secret seed phraze'
)
const signedTranferViaPrivateKey = transfer({
    recipient:'3N4mLCaHq2twRKnbUjdvAHyXjoccQE9KDRE',
    amount: 100000}, {privateKey: 'GucCLYU7aqzcVUwVXX4nosceDisky9UpbmpFK39tVYom'}
)
```

### Params
Type LONG represents string or number. Strings are allowed since max js int is 2**53
#### Common params:
Present in all transactions
```typescript
interface IBasicParams<LONG = string | number> {
  /**
   * Transaction fee. If not set, fee will be calculated automatically
   */
  fee?: LONG
  /**
   * If fee is not set, this value will be added to automatically calculated fee. E.x.:
   * Account is scripted and 400000 fee more is required.
   */
  additionalFee?: number
  /**
   * If not set, public key will be derived from seed phrase. You should provide senderPublicKey in two cases:
   * 1. Account, from which this tx should be sent, differs from tx signer. E.g., we have smart account that requires 2 signatures.
   * 2. You to create tx without proof. Therefore no seed is provided.
   */
  senderPublicKey?: string
  /**
   * Transaction timestamp. If not set current timestamp will be used. Date.now()
   */
  timestamp?: number
  /**
   * Network byte. Could be set as number or as char.
   * If set as char(string), charCodeAt(0) will be used. E.g.,
   * 'W' will be converted to '87'
   * If not set, 87 will be used as default
   */
  chainId?: string | number
}
```

#### Issue transaction. Type 3
```typescript
export interface IIssueParams<LONG = string | number> extends IBasicParams<LONG> {
  name: string
  description: string
  quantity: LONG
  decimals?: number
  reissuable?: boolean
  script?: string
}
```
#### Transfer transaction. Type 4
```typescript
export interface ITransferParams<LONG = string | number> extends IBasicParams<LONG> {
  /**
   * Can be either address(base58 encoded 24 byte address) or alias.
   * Alias should be used like 'alias:{chainId}:{alias}>'. E.g.:
   * If we have alias 'foo', and we want TESTNET transaction, recipient should be 'alias:T:foo'
   */
  recipient: string
  amount: LONG
  assetId?: string | null
  /**
   * Fee can be paid in custom token if sponsorship has been set for this token
   */
  feeAssetId?: string | null
  /**
   * Bytearray encoded as base58 string
   */
  attachment?: string | TTypedData
}
```
#### Reissue transaction. Type 5
```typescript
export interface IReissueParams<LONG = string | number> extends IBasicParams<LONG> {
  assetId: string
  quantity: LONG
  reissuable: boolean
}
```
#### Burn transaction. Type 6
```typescript
export interface IBurnParams<LONG = string | number> extends IBasicParams<LONG> {
  assetId: string
  quantity: LONG
}
```
#### Exchange transaction. Type 7
Exchange transactions are used by DEX mather. If you want to create your own exchange transaction,
 there is no params. You need to construct it by hand(see interface below, IOrder is described in Order section) 
```typescript
export interface IExchangeTransaction<LONG = string | number> extends ITransaction<LONG> {
  type: 7
  order1: IOrder
  order2: IOrder
  price: LONG
  amount: LONG
  buyMatcherFee: LONG
  sellMatcherFee: LONG
}
```
#### Lease transaction. Type 8
```typescript
export interface ILeaseParams<LONG = string | number> extends IBasicParams<LONG> {
  recipient: string
  amount: LONG
}
```
#### CancelLease transaction. Type 9
```typescript
export interface ICancelLeaseParams<LONG = string | number> extends IBasicParams<LONG> {
  leaseId: string
}
```
#### Alias transaction. Type 10
```typescript
export interface IAliasParams<LONG = string | number> extends IBasicParams<LONG> {
  alias: string
}
```
#### MassTransfer transaction. Type 11
```typescript
export interface IMassTransferParams<LONG = string | number> extends IBasicParams<LONG> {
  transfers: IMassTransferItem[]
  /**
   * Bytearray encoded as base string
   */
  attachment?: string | TTypedData
  assetId?: string | null
}

export interface IMassTransferItem<LONG = string | number> {
  recipient: string
  amount: LONG
}
```
#### Data transaction. Type 12
```typescript
export interface IDataParams<LONG = string | number> extends IBasicParams<LONG> {
  data: Array<IBooleanData | IIntegerData | IStringData | IBinaryData| TDeleteRequest>
}
export type TDeleteRequest = {
  type?: null
  value?: null
  key: string
}

export interface IBooleanData {
  key: string
  type: 'boolean'
  value: boolean
}
export interface IIntegerData<LONG = string | number> {
  key: string
  type: 'integer'
  value: LONG
}
export interface IStringData {
  key: string
  type: 'string'
  value: string
}
export interface IBinaryData {
  key: string
  type: 'binary'
  value: string
}


```
#### SetScript transaction. Type 13
```typescript
export interface ISetScriptParams<LONG = string | number> extends IBasicParams<LONG> {
  /**
   * Compiled script encoded as base64 string
   */
  script: string | null
}
```
#### Sponsorship transaction. Type 14
```typescript
export interface ISponsorshipParams<LONG = string | number> extends IBasicParams<LONG> {
  /**
   * AssetID of sponsored token
   */
  assetId: string
  /**
   * Minimal fee amount in sponsored asset. To disable sponsorship set it to 0
   */
  minSponsoredAssetFee: LONG
}
```
#### SetAssetScript transaction. Type 15
```typescript
export interface ISetAssetScriptParams<LONG = string | number> extends IBasicParams<LONG> {
  /**
   * Compiled script encoded as base64 string
   */
  script: string
  assetId: string
}
```
#### InvokeScript transaction. Type 16
```typescript
export interface IInvokeScriptParams<LONG = string | number> extends IBasicParams<LONG> {
  dApp: string
  feeAssetId?: string | null
  call?: {
    function: string
    args?: {
      type: 'binary' | 'integer' | 'boolean' | 'string',
      value: string | LONG | boolean
    }[]
  },
  payment?: {
    assetId?: string | null
    amount: LONG
  }[]
}
```
#### UpdateAssetInfo transaction. Type 17
```typescript
export interface IUpdateAssetInfoParams<LONG = string | number> extends IBasicParams<LONG> {
  /**
   * Id of previously issued asset
   */
  assetId: string
  /**
   * New asset name
   */
  name: string
  /**
   * New asset description
   */
  description: string
}
```































If you want to create  the minimum you need to provide is **amount** and **recipient** as defined in Transfer params:
```js

const { transfer } = require('@waves/waves-transactions')
const seed = 'some example seed phrase'
const signedTranserTx = transfer({ 
  amount: 1,
  recipient: '3N4mLCaHq2twRKnbUjdvAHyXjoccQE9KDRE',
  //Timestamp is optional but it was overrided, in case timestamp is not provided it will fallback to Date.now(). You can set any oftional params yourself. go check full docs
  timestamp: 1536917842558 
}, seed)

// or using alias

const signedTranserTx = transfer({ 
  amount: 1,
  recipient: 'alias:W:aliasForMyAddress'
}, seed)
```

Output will be a signed transfer transaction:
```js
{
  id: '8NrUwgKRCMFbUbqXKQAHkGnspmWHEjKUSi5opEC6Havq',
  type: 4,
  version: 2,
  recipient: '3N4mLCaHq2twRKnbUjdvAHyXjoccQE9KDRE',
  attachment: undefined,
  feeAssetId: undefined,
  assetId: undefined,
  amount: 1,
  fee: 100000,
  senderPublicKey: '6nR7CXVV7Zmt9ew11BsNzSvVmuyM5PF6VPbWHW9BHgPq',
  timestamp: 1536917842558,
  proofs: [
    '25kyX6HGjS3rkPTJRj5NVH6LLuZe6SzCzFtoJ8GDkojY9U5oPfVrnwBgrCHXZicfsmLthPUjTrfT9TQL2ciYrPGE'
  ]
}
```

You can also create transaction, but not sign it:
```javascript
const unsignedTransferTx = transfer({ 
  amount: 1,
  recipient: '3N4mLCaHq2twRKnbUjdvAHyXjoccQE9KDRE',
  //senderPublicKey is required if you omit seed
  senderPublicKey: '6nR7CXVV7Zmt9ew11BsNzSvVmuyM5PF6VPbWHW9BHgPq' 
})
```

Now you are able to POST it to Waves API or store for future purpose or you can add another signature from other party:
```js
const otherPartySeed = 'other party seed phrase'
const transferSignedWithTwoParties = transfer(signedTranserTx, seed)
```

So now there are two proofs:
```js
{
  id: '8NrUwgKRCMFbUbqXKQAHkGnspmWHEjKUSi5opEC6Havq',
  type: 4,
  version: 2,
  recipient: '3N4mLCaHq2twRKnbUjdvAHyXjoccQE9KDRE',
  attachment: undefined,
  feeAssetId: undefined,
  assetId: undefined,
  amount: 1,
  fee: 100000,
  senderPublicKey: '6nR7CXVV7Zmt9ew11BsNzSvVmuyM5PF6VPbWHW9BHgPq',
  timestamp: 1536917842558,
  proofs: [
    '25kyX6HGjS3rkPTJRj5NVH6LLuZe6SzCzFtoJ8GDkojY9U5oPfVrnwBgrCHXZicfsmLthPUjTrfT9TQL2ciYrPGE',
    'CM9emPzpe6Ram7ZxcYax6s7Hkw6698wXCMPSckveFAS2Yh9vqJpy1X9nL7p4RKgU3UEa8c9RGXfUK6mFFq4dL9z'
  ]
}
```

### Orders
Order is created the same way as transaction
```typescript
const { order } = require('@waves/waves-transactions')
const params = {
    amount: 100000000, //1 waves
    price: 10, //for 0.00000010 BTC
    priceAsset: '8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS',
    matcherPublicKey: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',
    orderType: 'buy'
}
  
const signedOrder = order(params, 'Some seed ')
```
### Broadcast
To send transaction you can use either node [REST API](https://nodes.wavesplatform.com/api-docs/index.html#!/transactions/broadcast) or [broadcast](https://wavesplatform.github.io/waves-transactions/globals.html#broadcast) helper function:
```javascript
const {broadcast} =  require('@waves/waves-transactions');
const nodeUrl = 'https://nodes.wavesplatform.com';

broadcast(signedTx, nodeUrl).then(resp => console.log(resp))
```
You can send tx to any waves node you like:. E.g.:
* https://nodes-testnet.wavesnodes.com - waves TESTNET nodes hosted by Wavesplatform
* https://nodes.wavesplatform.com - waves MAINNET nodes hosted by Wavesplatform
#### Important!!!
Most transactions require chainId as parameter, e.g: [IBurnParams](https://wavesplatform.github.io/waves-transactions/interfaces/_transactions_.iburnparams.html). By default chainId is 'W', which means MAINNET. To make transaction in TESTNET be sure to pass chainId if it is present in params interface and then send it to TESTNET node

### Dependencies
This library uses `@waves/ts-lib-crypto` for cryptography and `@waves/node-api-js` for interacting with node. 
You can access them this way:
```typescript
const libCrypto = require('@waves/waves-transactions').libs.crypto
const libApi = require('@waves/waves-transactions').libs.nodeApiJs
```
