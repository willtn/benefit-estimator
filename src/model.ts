export class Price {
  public static US_DOLLAR_CODE = "USD";
  public static US_DOLLAR_SYMBOL = "$";
  public static DECIMALS = 2;

  public static copy(
    source: Price,
    value: string = undefined,
    currencyCode: string = undefined,
    currencySymbol: string = undefined,
    decimals: number = undefined) {
    return new Price(
      currencyCode || source.currencyCode,
      currencySymbol || source.currencySymbol,
      decimals || source.decimals,
      value || source.value);
  }

  public static zero() {
    return new Price(Price.US_DOLLAR_CODE, Price.US_DOLLAR_SYMBOL, Price.DECIMALS, (0).toFixed(Price.DECIMALS));
  }

  public static fromNumber(value: number) {
    return new Price(Price.US_DOLLAR_CODE, Price.US_DOLLAR_SYMBOL, Price.DECIMALS, value.toFixed(Price.DECIMALS));
  }

  public static fromString(value: string) {
    return Price.fromNumber(parseFloat(value));
  }

  public static times(source: Price, multiplier: number) {
    return multiplier >= 0 ?
      Price.copy(source, (parseFloat(source.value) * multiplier).toFixed(source.decimals)) :
      undefined;
  }

  // Assuming all share the same currency
  public static add(...terms: Price[]) {
    return terms.reduce((sum, term) => {
      const value = (parseFloat(sum.value) + parseFloat(term.value)).toFixed(term.decimals);
      return term.copy(value);
    }, Price.zero());
  }

  constructor(
    public currencyCode: string,
    public currencySymbol: string,
    public decimals: number,
    public value: string) { }

  public copy(
    value: string = this.value,
    currencyCode: string = this.currencyCode,
    currencySymbol: string = this.currencySymbol,
    decimals: number = this.decimals) {
    return new Price(currencyCode, currencySymbol, decimals, value);
  }
}

export interface OfferPrice {
  cost: Price;
  msrp: Price;
  taxRate: number;
  absCommission?: Price;
  relCommission?: number;
}

export interface HasPeriod {
  period: number;
}

export interface HasOffer {
  offerPrice: OfferPrice;
  numOffers: number;
  commission: number;
}

export interface HasSale {
  numSales: number;
}

export interface HasInvitation {
  numInvites: number;
}

export interface HasSeller {
  numSellers: number;
}

export class CreationParams implements HasPeriod, HasOffer, HasSale, HasSeller {
  constructor(
    public offerPrice: OfferPrice,
    public numOffers: number,
    public commission: number,
    public numSales: number,
    public period: number,
    public numSellers: number) { }
}

export class HostParams implements HasPeriod, HasOffer {
  constructor(
    public offerPrice: OfferPrice,
    public numOffers: number,
    public commission: number,
    public period: number) { }

  // require: ['offerPrice', 'numOffers', 'period', 'commission']
}

export class BuyerInvitationParams implements HasPeriod, HasOffer, HasInvitation, HasSeller {
  constructor(
    public numInvites: number,
    public offerPrice: OfferPrice,
    public numOffers: number,
    public commission: number,
    public period: number,
    public numSellers: number) { }

  // ['numInvites', 'offerPrice', 'numOffers', 'period', 'commission']
}

export class SellerInvitationParams implements HasPeriod, HasOffer, HasInvitation {
  constructor(
    public numInvites: number,
    public offerPrice: OfferPrice,
    public numOffers: number,
    public commission: number,
    public period: number) { }

  // require: ['numInvites', 'offerPrice', 'numOffers', 'period', 'commission']
}

export class RecommendParams implements HasPeriod, HasOffer, HasSeller {
  constructor(
    public offerPrice: OfferPrice,
    public numOffers: number,
    public commission: number,
    public period: number,
    public numSellers: number) { }
  // ['offerPrice', 'numOffers', 'period', 'commission']
}

export class QuickParams implements HasInvitation {
  /**
   * [constructor description]
   * @param {number}  public numInvites  [description]
   * @param {number}  public numHours    [description]
   * @param {boolean} public haveWebsite server send "yes" and "no"
   */
  constructor(
    public numInvites: number,
    public numHours: number,
    public haveWebsite: boolean) { }
}

export interface EstimationParams {
  create: CreationParams;
  host: HostParams;
  inviteBuyer: BuyerInvitationParams;
  inviteSeller: SellerInvitationParams;
  recommend: RecommendParams;
}

export interface ImpactReport {
  // create;
  // host;
  // inviteBuyer;
  // inviteSeller;
  quick: {
    haveWebsite: "yes" | "no";
    numInvites: number;
    numHours: number;
  };
  // recommend;
  stateParams: object;
}

export interface ImpactEstimation {
  price: OfferPrice;
  recommendOffer: Price;
  createOffer: Price;
  inviteBuyer: Price;
  inviteSeller: Price;
  bonus: Price;
}

export interface PromiseLike<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseLike<TResult1 | TResult2>;
}