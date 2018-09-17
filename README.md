# waves-transactions  [![npm version](https://badge.fury.io/js/waves-transactions.svg)](https://www.npmjs.com/package/waves-transactions)

Using this library you can easily create and sign transactions for Waves blockchain.
It also allows you to multi-sign existing transactions.

Check full documentation on [GitHub Pages](https://ebceu4.github.io/waves-transactions/index.html).

### Transfer

Transaction creation is really simple:
```js
const seed = '19875c31fa594035bd9a2473c2c33d3ff468c0f4befd4beeb981b8c1ea6def4a'
const signedTranserTx = transfer(seed, { amount: 1, recipient: '3P6fVra21KmTfWHBdib45iYV6aFduh4WwC2' })
```

In return you have signed transfer transaction:
```js
{
  id: '8NrUwgKRCMFbUbqXKQAHkGnspmWHEjKUSi5opEC6Havq',
  type: 4,
  version: 2,
  recipient: '3P6fVra21KmTfWHBdib45iYV6aFduh4WwC2',
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

Now you are able to POST it to Waves API or store for future purpose or you can add another signature from other party:
```js
const otherPartySeed = '18f6edd4c8d647b4ba5ed366093ef5b8d0c4d8b3a6154a2b876f54773a678781'
const transferSidnedWithTwoParties = transfer(seed, signedTranserTx /*Tx from first example*/)
```

So now there are two proofs:
```js
{
  id: '8NrUwgKRCMFbUbqXKQAHkGnspmWHEjKUSi5opEC6Havq',
  type: 4,
  version: 2,
  recipient: '3P6fVra21KmTfWHBdib45iYV6aFduh4WwC2',
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
