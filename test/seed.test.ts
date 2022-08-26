import {broadcast, seedUtils} from '../src'
import {transfer} from '../src'
import {Seed} from "../src/seedUtils";
//import {Seed} from '../src'

describe('seed', () => {
  it('should decrypt seed', () => {
    const encrypted = 'U2FsdGVkX19tuxILcDC5gj/GecPmDGEc2l51pCwdBOdtVclJ5rMT4M3Ns9Q+G4rV8wzrVTkhc/nnne5iI9ki/5uEqkGDheAi8xjQTF+MY4Q='
    expect(seedUtils.decryptSeed(encrypted, 'asd')).toEqual('asd asd asd asd asd asd asd asd asd asd asd asd1')
  })

  it('should generate new seed', () => {
    const seed = seedUtils.generateNewSeed(15)
    expect(seed.split(' ').length).toEqual(15)
  })

  it('should generate new seed for test', async () => {
    const richSeed = 'waves private node seed with waves tokens'
    const mySeed = 'my account 01'
    const account = new Seed(mySeed, 'R');
    const tx = transfer({  recipient: account.address, amount: 10000000000}, richSeed);
    console.log(account.address)
    const  nodeUrl = 'http://localhost:6869';
    await broadcast(tx, nodeUrl);
  })


})
