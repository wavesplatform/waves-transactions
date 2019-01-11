import {seedUtils} from '../src'

describe('seed', () => {
  it('should decrypt seed', () => {
    const encrypted = 'U2FsdGVkX19tuxILcDC5gj/GecPmDGEc2l51pCwdBOdtVclJ5rMT4M3Ns9Q+G4rV8wzrVTkhc/nnne5iI9ki/5uEqkGDheAi8xjQTF+MY4Q='
    expect(seedUtils.decryptSeed(encrypted, 'asd')).toEqual('asd asd asd asd asd asd asd asd asd asd asd asd1')
  })

  it('should generate new seed', () => {
    const seed = seedUtils.generateNewSeed(15)
    expect(seed.split(' ').length).toEqual(15)
  })
})
