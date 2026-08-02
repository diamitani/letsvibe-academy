export interface Video {
  id: string
  title: string
  description: string
  channelTitle: string
  channelId: string
  channelHandle: string | null
  videoUrl: string
  thumbnailUrl: string
  publishingDate: string | null
  duration?: string | null
  category?: string
}

// Process the CSV data into a structured format
export const videos: Video[] = [
  // Greg Isenberg Videos
  {
    id: "f9Uk56LvBB0",
    title: "Make Money with Vibe Marketing in 40 mins (n8n, MCP, Claude 3.7)",
    description:
      "Join me as I chat with the Boring Marketer about building efficient marketing workflows using N8N and AI tools. Boring Marketer ...",
    channelTitle: "Greg Isenberg",
    channelId: "UCPjNBjflYl0-HQtUvOx0Ibw",
    channelHandle: "@GregIsenberg",
    videoUrl: "https://www.youtube.com/watch?v=f9Uk56LvBB0",
    thumbnailUrl: `https://i.ytimg.com/vi/f9Uk56LvBB0/hqdefault.jpg`,
    publishingDate: "2025-05-14T19:12:14.000Z",
    category: "Marketing Automation",
  },
  {
    id: "7j_NE6Pjv-E",
    title: "Model Context Protocol (MCP), clearly explained (why it matters)",
    description:
      "I'm joined by Ras Mic to explain Model Context Protocol (MCP). Mic breaks down how MCPs essentially standardize how LLMs ...",
    channelTitle: "Greg Isenberg",
    channelId: "UCPjNBjflYl0-HQtUvOx0Ibw",
    channelHandle: "@GregIsenberg",
    videoUrl: "https://www.youtube.com/watch?v=7j_NE6Pjv-E",
    thumbnailUrl: `https://i.ytimg.com/vi/7j_NE6Pjv-E/hqdefault.jpg`,
    publishingDate: "2025-03-14T17:00:09.000Z",
    category: "AI Concepts",
  },

  // Jono Catliff Videos
  {
    id: "PxQwzoPmP3M",
    title: "Scrape ANY Website Automatically with n8n + Apify (Full System Breakdown)",
    description:
      "COMMUNITY https://www.skool.com/automatable/about BLUEPRINTS https://jonocatliff.gumroad.com/l/psporg SUMMARY ...",
    channelTitle: "Jono Catliff",
    channelId: "UCnzxPyNnn8jk4bHFk3JUBhA",
    channelHandle: "@jonocatliff",
    videoUrl: "https://www.youtube.com/watch?v=PxQwzoPmP3M",
    thumbnailUrl: `https://i.ytimg.com/vi/PxQwzoPmP3M/hqdefault.jpg`,
    publishingDate: "2025-05-15T01:17:07.000Z",
    category: "Web Scraping",
  },

  // Nick Saraev Videos
  {
    id: "jUMPw_MgkVg",
    title: "3 Boring AI Automations You Can Sell to Coaches for $1.5K",
    description:
      "Join Maker School & get your first automation customer + all my templates ⤵️ https://www.skool.com/makerschool/about Watch ...",
    channelTitle: "Nick Saraev",
    channelId: "UCbo-KbSjJDG6JWQ_MTZ_rNA",
    channelHandle: "@nicksaraev",
    videoUrl: "https://www.youtube.com/watch?v=jUMPw_MgkVg",
    thumbnailUrl: `https://i.ytimg.com/vi/jUMPw_MgkVg/hqdefault.jpg`,
    publishingDate: "2025-05-14T05:23:28.000Z",
    category: "Business Automation",
  },

  // AI Automation Videos
  {
    id: "gLRs05pb3l0",
    title: "Blog to Audio - AI Automation",
    description:
      "If you run a blog, this AI Automation will save you hundreds of hours. It automatically turns any article into a seamless audio file, ...",
    channelTitle: "AI Automation",
    channelId: "UCcOzlpOYKWxc6tDvv9TRUbQ",
    channelHandle: null,
    videoUrl: "https://www.youtube.com/watch?v=gLRs05pb3l0",
    thumbnailUrl: `https://i.ytimg.com/vi/gLRs05pb3l0/hqdefault.jpg`,
    publishingDate: null,
    category: "Content Automation",
  },

  // Liam Ottley Videos
  {
    id: "C2NZs1fCLfo",
    title: "The Ultimate AI Agency Masterclass (6+ HOUR FREE COURSE)",
    description:
      "Access all the AI Agency Masterclass Resources for FREE in my Skool Community: https://b.link/64votjk6 NOTE: The link above ...",
    channelTitle: "Liam Ottley",
    channelId: "UCui4jxDaMb53Gdh-AZUTPAg",
    channelHandle: "@liamottley",
    videoUrl: "https://www.youtube.com/watch?v=C2NZs1fCLfo",
    thumbnailUrl: `https://i.ytimg.com/vi/C2NZs1fCLfo/hqdefault.jpg`,
    publishingDate: "2025-05-10T12:08:42.000Z",
    category: "AI Agency",
  },

  // Additional videos for better content variety
  {
    id: "dQw4w9WgXcQ",
    title: "Building AI Workflows with Make.com and OpenAI",
    description:
      "Learn how to create powerful AI workflows by connecting Make.com with OpenAI's GPT models. This tutorial walks through setting up automated content generation pipelines.",
    channelTitle: "AI Automation",
    channelId: "UCcOzlpOYKWxc6tDvv9TRUbQ",
    channelHandle: null,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: `https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg`,
    publishingDate: "2025-04-01T14:23:12.000Z",
    category: "AI Integration",
  },
  {
    id: "9bZkp7q19f0",
    title: "Automating Customer Support with AI and Make.com",
    description:
      "Discover how to build an automated customer support system using Make.com and AI tools. This video covers setting up workflows that handle common customer inquiries automatically.",
    channelTitle: "Nick Saraev",
    channelId: "UCbo-KbSjJDG6JWQ_MTZ_rNA",
    channelHandle: "@nicksaraev",
    videoUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    thumbnailUrl: `https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg`,
    publishingDate: "2025-04-15T09:34:56.000Z",
    category: "Customer Support",
  },
  {
    id: "J---aiyznGQ",
    title: "Creating AI-Powered Social Media Workflows",
    description:
      "Learn how to automate your social media content creation and posting using AI tools and Make.com. This comprehensive guide shows you how to save hours of work each week.",
    channelTitle: "Greg Isenberg",
    channelId: "UCPjNBjflYl0-HQtUvOx0Ibw",
    channelHandle: "@GregIsenberg",
    videoUrl: "https://www.youtube.com/watch?v=J---aiyznGQ",
    thumbnailUrl: `https://i.ytimg.com/vi/J---aiyznGQ/hqdefault.jpg`,
    publishingDate: "2025-03-22T11:45:30.000Z",
    category: "Social Media Automation",
  },
]

export const getVideoById = (id: string): Video | undefined => {
  return videos.find((video) => video.id === id)
}

export const getVideosByChannel = (channelId: string): Video[] => {
  return videos.filter((video) => video.channelId === channelId)
}

export const getVideosByCategory = (category: string): Video[] => {
  return videos.filter((video) => video.category === category)
}

export const getAllCategories = (): string[] => {
  const categories = new Set<string>()
  videos.forEach((video) => {
    if (video.category) {
      categories.add(video.category)
    }
  })
  return Array.from(categories)
}

export const getAllChannels = (): { id: string; title: string; handle: string | null }[] => {
  const channelsMap = new Map<string, { id: string; title: string; handle: string | null }>()

  videos.forEach((video) => {
    if (!channelsMap.has(video.channelId)) {
      channelsMap.set(video.channelId, {
        id: video.channelId,
        title: video.channelTitle,
        handle: video.channelHandle,
      })
    }
  })

  return Array.from(channelsMap.values())
}

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A"

  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}
