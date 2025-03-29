
/**
 * Creator metrics used for valuation calculations
 */
export type CreatorMetrics = {
  followers: number
  engagementRate: number // 0 to 1
  sponsorships: number
  monthlyRevenue: number // in USD
  netWorth: number // in USD
  pressMentions: number
  streamViews: number // monthly average
  ticketSales: number // monthly
}

/**
 * Calculates a creator's valuation based on weighted metrics
 * @param metrics Various performance metrics for the creator
 * @returns The calculated valuation in USD
 */
export function calculateCreatorValuation(metrics: CreatorMetrics): number {
  const {
    followers,
    engagementRate,
    sponsorships,
    monthlyRevenue,
    netWorth,
    pressMentions,
    streamViews,
    ticketSales,
  } = metrics

  const valuation =
    followers * 0.05 +
    engagementRate * 10000 +
    sponsorships * 5000 +
    monthlyRevenue * 2 +
    netWorth * 0.1 +
    pressMentions * 200 +
    streamViews * 0.01 +
    ticketSales * 1.5

  return Math.round(valuation)
}
