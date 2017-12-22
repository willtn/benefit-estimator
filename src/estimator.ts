import { ImpactReport, Price, CreationParams, HostParams, BuyerInvitationParams, SellerInvitationParams, RecommendParams, OfferPrice, ImpactEstimation, HasOffer, PromiseLike } from "./model";
import { EstimationParser } from "./parser";

export class Estimator {
  private parser = new EstimationParser();

  constructor(private estimate: Estimation, private all: (promises: PromiseLike<Price>[]) => PromiseLike<Price[]>) { }

  public total(report: ImpactReport): PromiseLike<Price> {
    const params = this.parser.parseReport(report);
    const promises = [
      this.create(params.create),
      this.host(params.host),
      this.inviteBuyer(params.inviteBuyer),
      this.inviteSeller(params.inviteSeller),
      this.recommend(params.recommend)
    ].filter((promise) => promise !== undefined);

    return this.all(promises)
      .then((values) => Price.add(...values));
  }

  private create(params: CreationParams) {
    return this.nonEmpty(params) ?
      this.estimate(params.offerPrice, params.numSellers || 0)
        .then((estimation) => {
          const multiplier = params.numOffers * params.numSales * params.period * params.commission / estimation.price.relCommission;
          return Price.times(estimation.createOffer, multiplier);
        }) :
      undefined;
  }

  private host(params: HostParams) {
    return this.nonEmpty(params) ?
      this.estimate(params.offerPrice, 0)
        .then((estimation) => {
          const multiplier = params.numOffers * params.period * params.commission / estimation.price.relCommission;
          return Price.times(estimation.recommendOffer, multiplier);
        }) :
      undefined;
  }

  private inviteBuyer(params: BuyerInvitationParams) {
    return this.nonEmpty(params) ?
      this.estimate(params.offerPrice, params.numSellers || 0)
        .then((estimation) => {
          const multiplier = params.numInvites * params.numOffers * params.period * params.commission / estimation.price.relCommission;
          return Price.times(estimation.inviteBuyer, multiplier);
        }) :
      undefined;
  }

  private inviteSeller(params: SellerInvitationParams) {
    return this.nonEmpty(params) ?
      this.estimate(params.offerPrice, params.numInvites)
        .then((estimation) => {
          const multiplier = params.numInvites * params.numOffers * params.period * params.commission / estimation.price.relCommission;
          const main = Price.times(estimation.inviteSeller, multiplier);
          const bonus = Price.times(estimation.bonus, multiplier);
          return Price.add(main, bonus);
        }) :
      undefined;
  }

  private recommend(params: RecommendParams) {
    return this.nonEmpty(params) ?
      this.estimate(params.offerPrice, params.numSellers || 0)
        .then((estimation) => {
          const multiplier = params.numOffers * params.period * params.commission / estimation.price.relCommission;
          return Price.times(estimation.recommendOffer, multiplier);
        }) :
      undefined;
  }

  private nonEmpty(params: HasOffer) {
    return !!params && !!params.offerPrice;
  }
}

export type Estimation = (price: OfferPrice, storeOwners: number) => PromiseLike<ImpactEstimation>;
