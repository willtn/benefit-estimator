import { EstimationParams } from "./model";
/**
 * Main purpose: converting quick estimation params into detailed estimation params
 */
export declare class QuickEstimator {
    private static config;
    convert(numInvites: number, dailyHours: number, haveWebsite: boolean): EstimationParams;
    private totalTime(dailyHour);
    private invitationTime(dailyHour);
    private creationTime(dailyHour);
    private recommendationTime(dailyHour);
    private time(invitations, dailyHours);
    private invitations(numInvites, dailyHours);
    private common(numInvites);
    /**
     * [inviteBuyer description]
     * @param {number} invitations total number of invitations
     */
    private inviteBuyer(invitations);
    /**
     * [inviteSeller description]
     * @param {number} sellers number of seller invitations
     */
    private inviteSeller(sellers, offers);
    private createOffer(time);
    private recommendOffer(time);
    private host(hasWebsite, invitations);
    private creations(time);
    private creationToRecommendationRatio();
    private sellers(invitations);
}
