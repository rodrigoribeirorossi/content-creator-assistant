export interface Idea {
  id: string
  title: string
  description?: string | null
  niche: string
  keywords: string[]
  status: string
  createdAt: Date | string
  updatedAt: Date | string
  scripts?: Script[]
}

export interface Script {
  id: string
  title: string
  content: string
  ideaId?: string | null
  idea?: Idea | null
  status: string
  duration?: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface AffiliateLink {
  id: string
  productName: string
  platform: string
  originalUrl: string
  shortUrl?: string | null
  commission?: number | null
  category?: string | null
  clicks: number
  conversions: number
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ContentCalendar {
  id: string
  title: string
  description?: string | null
  platform: string
  status: string
  scheduledAt?: Date | string | null
  publishedAt?: Date | string | null
  videoUrl?: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface SeoOptimization {
  id: string
  videoTitle: string
  description?: string | null
  tags: string[]
  thumbnail?: string | null
  score?: number | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface DashboardStats {
  totalIdeas: number
  totalScripts: number
  totalLinks: number
  scheduledContent: number
}
