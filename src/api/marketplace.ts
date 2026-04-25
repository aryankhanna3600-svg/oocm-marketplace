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
export const uploadCreatorScreenshots = (formData: FormData) =>
  client.post('/marketplace/creator/upload-screenshots', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
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
export const submitDraft = (id: number, data: { draft_url: string; draft_notes?: string }) =>
  client.post(`/marketplace/campaigns/${id}/submit-draft`, data)
export const submitContent = (id: number, data: { content_url: string; submission_notes?: string; reach?: number; views?: number; likes?: number }) =>
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
export const getAdminDashboard = (adminKey: string) =>
  client.get('/marketplace/admin/dashboard', { headers: { 'x-admin-key': adminKey } })

// ── Feed + Posts ──
export const getFeed = (page = 1) => client.get(`/marketplace/feed?page=${page}`)
export const createPost = (data: { url: string; link_type: string; preview_title?: string; preview_thumbnail?: string; caption?: string }) =>
  client.post('/marketplace/creator/posts', data)
export const likePost = (id: number, liked: boolean) =>
  client.post(`/marketplace/posts/${id}/like`, { liked })
