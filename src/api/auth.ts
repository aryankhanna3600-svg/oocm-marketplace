import client from './client'

export const requestOtp = (phone: string) =>
  client.post('/auth/creator/request-otp', { phone })

export const verifyOtp = (phone: string, otp: string) =>
  client.post('/auth/creator/verify-otp', { phone, otp })

export const completeSignup = (data: {
  phone: string
  first_name: string
  last_name: string
  city: string
  state: string
  instagram_username?: string
  content_categories: string[]
  follower_range: string
}) => client.post('/auth/creator/complete-signup', data)
