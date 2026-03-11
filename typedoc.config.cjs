const { OptionDefaults } = require('typedoc');

const schemaTags = [
  '@minItems',
  '@maxItems',
  '@minLength',
  '@maxLength',
  '@minimum',
  '@maximum',
];

module.exports = {
  blockTags: [...OptionDefaults.blockTags, ...schemaTags],
  intentionallyNotExported: [
    'TPrivateKey',
    'IIndexSeedMap',
    'TTransaction',
    'IAuth',
    'TSignedData',
    'IWavesAuth',
    'WithChainId',
    'IAuthParams',
    'TCustomData',
    'TxParamsTypeMap',
    'TTransactionType',
    'IWavesAuthParams',
  ],
};
