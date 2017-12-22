import { BuyerInvitationParams, EstimationParams, CreationParams, HostParams, RecommendParams, OfferPrice, Price, SellerInvitationParams } from "./model";

/**
 * Main purpose: converting quick estimation params into detailed estimation params
 */
export class QuickEstimator {
  private static config = {
    buyerSellerRatio: 12, // 12 buyers : 1 seller
    offerPrice: {
      absCommission: null,
      commission: "rel",
      cost: Price.fromNumber(7),
      msrp: Price.fromNumber(7),
      relCommission: null,
      taxRate: null
    }, // $7.00
    period: 365, // 365 days
    relCom: 0.05, // 5%
    sales: {
      buyer: 1, // each invited buyer buys an offer
      creation: 1, // an offer is sold everyday
      host: 0.03
    },
    timePerCreation: 15 * 5,
    timePerInvitation: 2 * 4,
    timePerRecommendation: 4,
    timePercentage: {
      creation: 0.60,
      invitation: 0.35,
      recommendation: 0.05
    },
  };

  public convert(numInvites: number, dailyHours: number, haveWebsite: boolean): EstimationParams {
    // The actual number of invitation
    const invitations = this.invitations(numInvites, dailyHours);

    // Calculate time for each type of small actions: invitation, recommendation, offer creation
    const { creation, invitation, recommendation } = this.time(invitations, dailyHours);

    const common = this.common(invitations);

    const inviteBuyer = this.inviteBuyer(invitations)(common);
    const createOffer = this.createOffer(creation)(common);
    const recommendOffer = this.recommendOffer(recommendation)(common);
    const inviteSeller = this.inviteSeller(common.numSellers, createOffer.numOffers)(common);
    const host = this.host(haveWebsite, invitations)(common);

    return {
      create: createOffer,
      host,
      inviteBuyer,
      inviteSeller,
      recommend: recommendOffer
    };
  }

  private totalTime(dailyHour: number) {
    return QuickEstimator.config.period * dailyHour;
  };

  private invitationTime(dailyHour: number) {
    return this.totalTime(dailyHour) * QuickEstimator.config.timePercentage.invitation;
  }

  private creationTime(dailyHour: number) {
    return this.totalTime(dailyHour) * QuickEstimator.config.timePercentage.creation;
  }

  private recommendationTime(dailyHour: number) {
    return this.totalTime(dailyHour) * QuickEstimator.config.timePercentage.recommendation;
  }

  private time(invitations: number, dailyHours: number) {
    const total = this.totalTime(dailyHours);
    const invitation = invitations * QuickEstimator.config.timePerInvitation;
    const remains = total - invitation;
    const ratio = this.creationToRecommendationRatio();
    const recommendation = remains > 0 ? remains / (ratio + 1) : 0;
    const creation = recommendation * ratio;
    return {
      creation,
      invitation,
      recommendation
    };
  }

  private invitations(numInvites: number, dailyHours: number): number {
    const fromDailyHours = (dailyHours * QuickEstimator.config.period) * QuickEstimator.config.timePercentage.invitation;
    const fromNumInvites = numInvites * QuickEstimator.config.timePerInvitation;
    return fromNumInvites > fromDailyHours ?
      Math.floor(fromDailyHours / QuickEstimator.config.timePerInvitation) :
      numInvites;
  }

  private common(numInvites: number): CommonParams {
    return {
      commission: QuickEstimator.config.relCom,
      numSellers: this.sellers(numInvites),
      offerPrice: QuickEstimator.config.offerPrice,
    };
  }

  /**
   * [inviteBuyer description]
   * @param {number} invitations total number of invitations
   */
  private inviteBuyer(invitations: number) {
    return (common: CommonParams): BuyerInvitationParams => new BuyerInvitationParams(
      invitations,
      common.offerPrice,
      QuickEstimator.config.sales.buyer,
      common.commission,
      QuickEstimator.config.period,
      common.numSellers);
  }

  /**
   * [inviteSeller description]
   * @param {number} sellers number of seller invitations
   */
  private inviteSeller(sellers: number, offers: number) {
    return (common: CommonParams): SellerInvitationParams => sellers > 0 ?
      new SellerInvitationParams(
        sellers,
        common.offerPrice,
        Math.floor(QuickEstimator.config.sales.creation * offers / sellers),
        common.commission,
        QuickEstimator.config.period) :
      undefined;
  }

  private createOffer(time: number) {
    const quantity = this.creations(time);
    const core = quantity > 0 ?
      {
        numOffers: quantity,
        numSales: QuickEstimator.config.sales.creation,
        period: QuickEstimator.config.period
      } : null;

    return (common: CommonParams): CreationParams => quantity > 0 ?
      new CreationParams(
        common.offerPrice,
        quantity,
        common.commission,
        QuickEstimator.config.sales.creation,
        QuickEstimator.config.period,
        common.numSellers) :
      undefined;
  }

  private recommendOffer(time: number) {
    return (common: CommonParams): RecommendParams => time > 0 ?
      (function() {
        const quantity = Math.floor(time / QuickEstimator.config.timePerRecommendation);
        const core = quantity < 365 ?
          {
            numOffers: quantity,
            period: 1
          } : {
            numOffers: Math.floor(quantity / QuickEstimator.config.period),
            period: QuickEstimator.config.period
          };
        return new RecommendParams(
          common.offerPrice,
          core.numOffers,
          common.commission,
          core.period,
          common.numSellers);
      })() :
      undefined;
  }

  private host(hasWebsite: boolean, invitations: number) {
    const sales = Math.floor(invitations * QuickEstimator.config.sales.host);
    return (common: CommonParams): HostParams => hasWebsite && sales > 0 ?
      new HostParams(
        common.offerPrice,
        sales,
        common.commission,
        QuickEstimator.config.period) :
      undefined;
  }

  private creations(time: number) {
    return Math.floor(time / QuickEstimator.config.timePerCreation);
  }

  private creationToRecommendationRatio() {
    return QuickEstimator.config.timePercentage.creation / QuickEstimator.config.timePercentage.recommendation;
  }

  private sellers(invitations: number) {
    return Math.floor(invitations / (QuickEstimator.config.buyerSellerRatio + 1));
  }
}

interface CommonParams {
  offerPrice: OfferPrice;
  commission: number;
  numSellers: number;
}
