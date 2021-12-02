import {checkSerializeDeserialize, validateTxSignature} from '../../test/utils'
import {reissueMinimalParams, sponsorshipMinimalParams} from "../minimalParams";
import {sponsorship} from "../../src/transactions/sponsorship";
import {sponsorshipTx} from "./expected/sponsorship.tx";

describe('setSponsorship', () => {

    const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

    it('Should create sponsorship transaction', () => {
      const tx = sponsorship({ ...sponsorshipMinimalParams}, stringSeed)
      expect(tx).toMatchObject({...sponsorshipMinimalParams})
    })

    it('Should create sponsorship transaction with specified sponsor fee', () => {
        const tx = sponsorship({ ...sponsorshipMinimalParams, minSponsoredAssetFee: 150 }, stringSeed)
        expect(tx.minSponsoredAssetFee).toEqual(150)
    })

    it('Should create sponsorship transaction with zero sponsor fee', () => {
        const tx = sponsorship({ ...sponsorshipMinimalParams, minSponsoredAssetFee: 0 }, stringSeed)
        expect(tx.minSponsoredAssetFee).toEqual(0)
    })

    it('Should create sponsorship transaction with negative sponsor fee', () => {
        const tx = sponsorship({ ...sponsorshipMinimalParams, minSponsoredAssetFee: -1 }, stringSeed)
        expect(tx.minSponsoredAssetFee).toEqual(-1)
    })

    it('Should create sponsorship transaction with minimal fee', () => {
        const tx = sponsorship({ ...sponsorshipMinimalParams }, stringSeed)
        expect(tx.fee).toEqual(100000)
    })

    it('Should create sponsorship transaction with zero fee', () => {
        const tx = sponsorship({ ...sponsorshipMinimalParams, fee: 0 }, stringSeed)
        expect(tx.fee).toEqual(0)
    })

    it('Should create sponsorship transaction with negative fee', () => {
        const tx = sponsorship({ ...sponsorshipMinimalParams, fee: -1 }, stringSeed)
        expect(tx.fee).toEqual(-1)
    })

});

describe('serialize/deserialize sponsorship tx', () => {

    Object.entries(sponsorshipTx).forEach(([name, {Bytes, Json}]) =>
        it(name, () => {
            checkSerializeDeserialize({Json: Json, Bytes: Bytes});
        }))

});