import { publicKey, verifySignature } from '@waves/ts-lib-crypto';
import { broadcast, updateAssetInfo } from '../../src';
import { updateAssetInfoMinimalParams } from '../minimalParams';
import { binary } from '@waves/marshall';
import { issue } from '../../src/transactions/issue';

describe('update-asset-info', () => {

    const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8';

    const privateKey = {privateKey: 'YkoCJDT4eLtCv5ynNAc4gmZo8ELM9bEbBXsEtGTWrCc'};
    it('should build from minimal set of params', () => {
        const tx = updateAssetInfo({...updateAssetInfoMinimalParams}, stringSeed);
        expect(tx).toMatchObject({...updateAssetInfoMinimalParams});
    });


    it('Should get correct signature', () => {
        const tx = updateAssetInfo({...updateAssetInfoMinimalParams}, stringSeed);
        expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy();
    });

    it('Should get correct signature via private key', () => {
        const tx = updateAssetInfo({...updateAssetInfoMinimalParams}, privateKey);
        expect(verifySignature(publicKey(privateKey), binary.serializeTx(tx), tx.proofs[0]!)).toBeTruthy();
    });

    it('Should get correct multiSignature', () => {
        const stringSeed2 = 'example seed 2';
        const tx = updateAssetInfo({...updateAssetInfoMinimalParams}, [null, stringSeed, null, stringSeed2]);
        expect(verifySignature(publicKey(stringSeed), binary.serializeTx(tx), tx.proofs[1]!)).toBeTruthy();
        expect(verifySignature(publicKey(stringSeed2), binary.serializeTx(tx), tx.proofs[3]!)).toBeTruthy();
    });
});

const nodeUrl = 'http://localhost:32772';


it('issue', async () => {
    const tx = issue({
        name: 'test',
        description: 'test',
        quantity: 1,
        chainId: 73,
        fee: 100000000
    }, 'node10');
    console.log(await broadcast(tx, nodeUrl));
});


it('updateAssetInfo', async () => {
    const tx = updateAssetInfo({
        name: 'myCoin',
        description: 'description for myCoin',
        assetId: '3Frm9dudVRA4enrefQ6TBvahEqPWFUu2ugm59Lf4h7b2',
        chainId: 73,
    }, 'node10');
    console.log(JSON.stringify(tx, null, 4));
    console.log(await broadcast(tx, nodeUrl));
});
