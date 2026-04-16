import client from './client'

export const getCreatorHome = () => client.get('/marketplace/creator/home')
export const seedCampaigns = () => client.post('/marketplace/seed/campaigns')
