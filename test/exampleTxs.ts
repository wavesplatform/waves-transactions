export const issueTx = { type: 3,
  version: 2,
  decimals: 8,
  reissuable: false,
  fee: 100000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421434,
  chainId: 'W',
  proofs:
   [ 'TVMCuJAb52AqLZnJHsZoWhjmULk27hzbzy7n3LsrwivdsCQ6gQpn8TtVwYuYhAZVcCLkbm4yznGCgrV96spafcp' ],
  id: '3TZ1AWMeVskdy96rNo9AiyegimGyDyXr55MbDTQX4ZXM',
  assetId: 'DWgwcZTMhSvnyYCoWLRUXXSH1RSkzThXLJhww9gwkqdn',
  quantity: 10000,
  name: 'test',
  description: 'tratata' }

export const transferTx = { type: 4,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421461,
  proofs:
   [ '22J76sGhLRo3S5pkqGjCi9fijpEeGGRmnv7canxeon2n2MNx1HhvKaBz2gYTdpJQohmUusRKR3yoCAHptRnJ1Fwe' ],
  id: 'EG3WvPWWEU5DdJ7xfB3Y5TRJNzMpt6urgKoP7docipvW',
  recipient: 'alias:T:aaaa',
  amount: 10000 }

export const reissueTx = { type: 5,
  version: 2,
  chainId: 'W',
  fee: 100000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421477,
  proofs:
   [ 'mJ3F7io67rPTqQ6ATvcqNVau7CUvunB6iucxX5LcYJuxWkmoWnY59Yo4NtmCn53v5KhuhJVAZ9eqaznFCvJ1s1E' ],
  id: '3b5sU6YiYS1B3NrSR3der4hwxN4nqc6xpmNPiKXgeAhm',
  assetId: 'DWgwcZTMhSvnyYCoWLRUXXSH1RSkzThXLJhww9gwkqdn',
  quantity: 10000,
  reissuable: false }

export const burnTx = { type: 6,
  version: 2,
  chainId: 'W',
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421523,
  proofs:
   [ '3JYfajBS1KJFSu3cdkF3f3JpH9kGVPR1R1YEgV7LHCHJyQXa82k7SMu9rqwpMvAqCXoQeJa5rEQPF9NY9rnufUan' ],
  id: '6X7Fe82PcVeU9qMtscBA2fBzrSf96PtAwrynViR3zRjP',
  assetId: 'DWgwcZTMhSvnyYCoWLRUXXSH1RSkzThXLJhww9gwkqdn',
  amount: 10000 }

export const leaseTx = { type: 8,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421538,
  proofs:
   [ '26qYvpvh4fedfwbDB93VJDjhUsPQiHqnZuveFr5UtBpAwnStPjS95MgA92c72SRJdU3mPsHJc6SQAraVsu2SPMRc' ],
  id: '5xhvoX9caefDAiiRgUzZQSUHyKfjW5Wx2v2Vr8QR9e4d',
  recipient: 'alias:T:sssss',
  amount: 10000 }

export const cancelLeaseTx = { type: 9,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421556,
  chainId: 'W',
  proofs:
   [ '5yytwFhmSJhPoRViBKt8AjYkBLxHYxgrs9mSPs3khT4iFLzqbkyyAYu7qbPsJ4iut8BKFFADX2J6hfVwxNFkHTjo' ],
  id: '656pBWMAPfVMu1gbSZ5dd5WTRQzWNo2phfJsD2rDBKfh',
  leaseId: '656pBWMAPfVMu1gbSZ5dd5WTRQzWNo2phfJsD2rDBKfh' }

export const aliasTx = { type: 10,
  version: 2,
  fee: 100000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421565,
  id: '1bVuFdMbDAk6dhcQFfJFxpDjmm8DdFnnKesQ3wpxj7P',
  proofs:
   [ '5cW1Ej6wFRK1XpMm3daCWjiSXaKGYfL7bmspZjzATXrNYjRVxZJQVJsDU7ZVcxNXcKJ39fhjxv3rSu4ovPT3Fau8' ],
  alias: 'my_test_alias' }

export const massTransferTx = { type: 11,
  version: 1,
  fee: 200000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421576,
  proofs:
   [ '2Un2WpTiFBdhhh7nXd99ci3gAqonuz4xBkWrDS1MJ5fUo9AW12aiYXi3KvnRrmt3C7HqE3BrokzAnYAckd3ggu7D' ],
  id: '7mEAv8DgVgo9xgg4nSMNBeFjuKUsnnqanQgqFw2VEKmG',
  transfers:
   [ { recipient: 'alias:T:aaab', amount: 10000 },
     { recipient: 'alias:T:aabc', amount: 10000 } ] }

export const dataTx = { type: 12,
  version: 1,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  fee: 100000,
  timestamp: 1542539421605,
  proofs:
   [ '5AMn7DEwZ6VvDLkJNdP5EW1PPJQKeWjy8qp5HoCGWaWWEPYdr1Ewkqor6NfLPDrGQdHd5DFUoE7CtwSrfAUMKLAY' ],
  id: 'F7fkrYuJAsJfJRucwty7dcBoMS95xBufxBi7AXqCFgXg',
  data:
   [ { type: 'binary', key: 'someparam', value: 'base64:AQIDBA==' },
     { key: 'someparam2', type: 'binary', value: 'base64:YXNkYQ==' },
     { type: 'boolean', key: 'someparam3', value: true } ] }

export const setScriptTx = { type: 13,
  version: 1,
  fee: 1000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421635,
  chainId: 'W',
  proofs:
   [ '35x1Rphm1mr24ELJgpLP6dK3wMW7cG6nWsFUcMF3RvxKr3UjEuo4NfYnQf6MEanD7bxBdKDuYxbBJZYQQ495ax3w' ],
  id: 'J8SBGZzSLybdsgpFjDNxVwB8mixkZoEJkgHya3EiXXPc',
  script: 'base64:AQa3b8tH' }

export const setAssetScriptTx = { type: 15,
  version: 1,
  fee: 1000000,
  senderPublicKey: '7GGPvAPV3Gmxo4eswmBRLb6bXXEhAovPinfcwVkA2LJh',
  timestamp: 1542539421652,
  chainId: 'W',
  proofs:
   [ '4ffQFcfv9NG8GtNB5c1yamFvEFoixvgYBHPmfwSAkZeVRiCwZvB2HWWiMcbiujGhWGxXnho37bWqELnQ6DBPCaj4' ],
  id: '4ERUXALAziaWJ1Acsmpnfjgtv1ixHSWXRp5dBR837o4e',
  script: 'base64:AQa3b8tH',
  assetId: '' }

  export const exampleTxs = {3: issueTx,4: transferTx,5: reissueTx,6: burnTx,8: leaseTx,9: cancelLeaseTx,10: aliasTx,11: massTransferTx,12: dataTx,13: setScriptTx,15: setAssetScriptTx}
