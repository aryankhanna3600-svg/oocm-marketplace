import client from './client'

export const getCreatorHome = () => client.get('/marketplace/creator/home')
export const seedCampaigns = () => client.post('/marketplace/seed/campaigns')

export interface CampaignFilters {
  category?: string
  platform?: string
  search?: string
  page?: number
}

export const getCampaigns = (filters: CampaignFilters = {}) => {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.platform) params.set('platform', filters.platform)
  if (filters.search) params.set('search', filters.search)
  if (filters.page) params.set('page', String(filters.page))
  return client.get(`/marketplace/campaigns?${params.toString()}`)
}
