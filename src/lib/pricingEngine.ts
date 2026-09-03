// src/lib/pricingEngine.ts

export async function calculateItemPrice(payload: any, userId?: string) {
  const MSRP = 2499
  const FOUNDER_PRICE = 1999 // 20% Off

  const batchStatus = await payload.findGlobal({
    slug: 'batch-status',
  })

  // Phase 1/2/3: If Founder slots are still available OR user is a verified Founder
  if (batchStatus.foundersClaimed < batchStatus.founderCap) {
    return {
      price: FOUNDER_PRICE,
      tier: 'FOUNDER_ALLOCATION',
      remainingKeys: batchStatus.founderCap - batchStatus.foundersClaimed,
    }
  }

  // If user has Lifetime Founder Access locked to account
  if (userId) {
    const user = await payload.findByID({ collection: 'users', id: userId })
    if (user?.isFounder && (user?.annualSpend || 0) < 100000) {
      return {
        price: FOUNDER_PRICE,
        tier: 'LIFETIME_FOUNDER_DISCOUNT',
      }
    }
  }

  // Phase 4: Standard Public Release Price
  return {
    price: MSRP,
    tier: 'STANDARD_RETAIL',
  }
}