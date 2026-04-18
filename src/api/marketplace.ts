import client from './client'

export interface CampaignFilters {
  category?: string
  platform?: string
  search?: string
  page?: number
}

// ── Creator ──
export const getCreatorProfile = () => client.get('/marketplace/creator/profile')
export const updateCreatorProfile = (data: object) => client.patch('/marketplace/creator/profile', data)
export const completeCreatorProfile = (data: object) => client.patch('/marketplace/creator/complete-profile', data)
export const getCreatorHome = () => client.get('/marketplace/creator/home')
export const getMyWork = () => client.get('/marketplace/creator/my-campaigns')
export const getCampaigns = (filters: CampaignFilters = {}) => {
  const params = new URLSearchParams()
  if (filters.category) params.set('category', filters.category)
  if (filters.platform) params.set('platform', filters.platform)
  if (filters.search) params.set('search', filters.search)
  if (filters.page) params.set('page', String(filters.page))
  return client.get(`/marketplace/campaigns?${params.toString()}`)
}
export const getCampaignById = (id: number) => client.get(`/marketplace/campaigns/${id}`)
export const applyToCampaign = (id: number, data: object) => client.post(`/marketplace/campaigns/${id}/apply`, data)
export const submitContent = (id: number, data: { content_url: string; submission_notes?: string }) =>
  client.post(`/marketplace/campaigns/${id}/submit`, data)
export const getMySubmission = (id: number) => client.get(`/marketplace/campaigns/${id}/my-submission`)

// ── Brand ──
export const getBrandProfile = () => client.get('/marketplace/brand/profile')
export const updateBrandProfile = (data: object) => client.patch('/marketplace/brand/profile', data)
export const getBrandHome = () => client.get('/marketplace/brand/home')
export const getBrandCampaigns = () => client.get('/marketplace/brand/campaigns')
export const createBrandCampaign = (data: object) => client.post('/marketplace/brand/campaigns', data)
export const getBrandCampaignDetail = (id: number) => client.get(`/marketplace/brand/campaigns/${id}`)
export const updateApplicationStatus = (appId: number, status: string) =>
  client.patch(`/marketplace/brand/applications/${appId}/status`, { status })
export const reviewCreatorContent = (appId: number, content_status: string) =>
  client.patch(`/marketplace/brand/applications/${appId}/content`, { content_status })
export const rateCreator = (appId: number, rating: number, rating_note?: string) =>
  client.post(`/marketplace/brand/applications/${appId}/rate`, { rating, rating_note })
export const getCreatorList = (params?: { search?: string; tier?: string; category?: string; page?: number }) =>
  client.get('/marketplace/brand/creators', { params })
export const seedCampaigns = () => client.post('/marketplace/seed/campaigns')
