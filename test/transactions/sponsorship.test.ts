import { publicKey, } from '@waves/ts-lib-crypto'
import {reissue, setScript} from '../../src'
import { validateTxSignature } from '../../test/utils'
import {reissueMinimalParams, sponsorshipMinimalParams} from "../minimalParams";
import {sponsorship} from "../../src/transactions/sponsorship";

describe('setSponsorship', () => {

    const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

    it('Should create sponsorship transaction', () => {
      const tx = sponsorship({ ...sponsorshipMinimalParams}, stringSeed)
      expect(tx).toMatchObject({...sponsorshipMinimalParams})
    })

    it('Should create sponsorship transaction with specified fee', () => {
        const tx = sponsorship({ ...sponsorshipMinimalParams, minSponsoredAssetFee: 150 }, stringSeed)
        expect(tx.minSponsoredAssetFee).toEqual(150)
    })

    it('Should create sponsorship transaction with zero fee', () => {
        const tx = sponsorship({ ...sponsorshipMinimalParams, minSponsoredAssetFee: 0 }, stringSeed)
        expect(tx.minSponsoredAssetFee).toEqual(0)
    })

    it('Should create sponsorship transaction with negative fee', () => {
        const tx = sponsorship({ ...sponsorshipMinimalParams, minSponsoredAssetFee: -1 }, stringSeed)
        expect(tx.minSponsoredAssetFee).toEqual(-1)
    })

})