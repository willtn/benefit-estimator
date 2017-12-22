export declare class Price {
    currencyCode: string;
    currencySymbol: string;
    decimals: number;
    value: string;
    static US_DOLLAR_CODE: string;
    static US_DOLLAR_SYMBOL: string;
    static DECIMALS: number;
    static copy(source: Price, value?: string, currencyCode?: string, currencySymbol?: string, decimals?: number): Price;
    static zero(): Price;
    static fromNumber(value: number): Price;
    static fromString(value: string): Price;
    static times(source: Price, multiplier: number): Price;
    static add(...terms: Price[]): Price;
    constructor(currencyCode: string, currencySymbol: string, decimals: number, value: string);
    copy(value?: string, currencyCode?: string, currencySymbol?: string, decimals?: number): Price;
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
export declare class CreationParams implements HasPeriod, HasOffer, HasSale, HasSeller {
    offerPrice: OfferPrice;
    numOffers: number;
    commission: number;
    numSales: number;
    period: number;
    numSellers: number;
    constructor(offerPrice: OfferPrice, numOffers: number, commission: number, numSales: number, period: number, numSellers: number);
}
export declare class HostParams implements HasPeriod, HasOffer {
    offerPrice: OfferPrice;
    numOffers: number;
    commission: number;
    period: number;
    constructor(offerPrice: OfferPrice, numOffers: number, commission: number, period: number);
}
export declare class BuyerInvitationParams implements HasPeriod, HasOffer, HasInvitation, HasSeller {
    numInvites: number;
    offerPrice: OfferPrice;
    numOffers: number;
    commission: number;
    period: number;
    numSellers: number;
    constructor(numInvites: number, offerPrice: OfferPrice, numOffers: number, commission: number, period: number, numSellers: number);
}
export declare class SellerInvitationParams implements HasPeriod, HasOffer, HasInvitation {
    numInvites: number;
    offerPrice: OfferPrice;
    numOffers: number;
    commission: number;
    period: number;
    constructor(numInvites: number, offerPrice: OfferPrice, numOffers: number, commission: number, period: number);
}
export declare class RecommendParams implements HasPeriod, HasOffer, HasSeller {
    offerPrice: OfferPrice;
    numOffers: number;
    commission: number;
    period: number;
    numSellers: number;
    constructor(offerPrice: OfferPrice, numOffers: number, commission: number, period: number, numSellers: number);
}
export declare class QuickParams implements HasInvitation {
    numInvites: number;
    numHours: number;
    haveWebsite: boolean;
    /**
     * [constructor description]
     * @param {number}  public numInvites  [description]
     * @param {number}  public numHours    [description]
     * @param {boolean} public haveWebsite server send "yes" and "no"
     */
    constructor(numInvites: number, numHours: number, haveWebsite: boolean);
}
export interface EstimationParams {
    create: CreationParams;
    host: HostParams;
    inviteBuyer: BuyerInvitationParams;
    inviteSeller: SellerInvitationParams;
    recommend: RecommendParams;
}
export interface ImpactReport {
    quick: {
        haveWebsite: "yes" | "no";
        numInvites: number;
        numHours: number;
    };
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
