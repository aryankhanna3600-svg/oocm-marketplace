import client from './client'

export const requestEmailOtp = (phone: string, email: string) =>
  client.post('/auth/creator/request-email-otp', { phone, email })

export const verifyEmailOtp = (email: string, otp: string) =>
  client.post('/auth/creator/verify-email-otp', { email, otp })

export const brandLogin = (email: string, password: string) =>
  client.post('/login', { username: email, password, role: 'Brand' })

export const completeSignup = (data: {
  phone: string
  email?: string
  first_name: string
  last_name: string
  city: string
  state: string
  instagram_username?: string
  content_categories: string[]
  follower_range: string
}) => client.post('/auth/creator/complete-signup', data)
