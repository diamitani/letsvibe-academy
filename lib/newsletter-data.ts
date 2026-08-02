export interface NewsletterArticle {
  id: string
  title: string
  date: string
  description: string
  url: string
  image?: string
}

export const newsletterArticles: NewsletterArticle[] = [
  {
    id: "1",
    title: "LetsVibeAI Daily News - 5.19.25",
    date: "2025-05-19",
    description: "The latest daily roundup of AI news and developments from around the web.",
    url: "https://www.linkedin.com/pulse/livebuildai-daily-news-51925-patrick-diamitani-nhp2c",
    image: "/newsletter-images/daily-news-5-19.png",
  },
  {
    id: "2",
    title: "Interview with Sebastian Mertens, Head of Applied AI, Make.com",
    date: "2025-05-16",
    description:
      "Learn from Sebastian Mertens' journey and insights, from selling two companies to building automation for a dairy farmer with 10,000 cows.",
    url: "https://www.linkedin.com/pulse/interview-sebastian-mertens-head-applied-ai-makecom-patrick-diamitani-rsftc",
    image: "/newsletter-images/sebastian-mertens.png",
  },
  {
    id: "3",
    title: "LetsVibeAI Weekly Update - May 5, 2025",
    date: "2025-05-05",
    description: "A comprehensive weekly roundup of the most important AI developments and news from the past week.",
    url: "https://www.linkedin.com/pulse/livebuildai-weekly-update-may-5-2025-patrick-diamitani-c8lic",
    image: "/newsletter-images/weekly-update.png",
  },
  {
    id: "4",
    title: "Custom GPT Training Guide: Chain Prompting Method & Action Items",
    date: "2025-04-28",
    description:
      "A detailed guide on how to train custom GPTs using the Chain Prompting Method with practical action items.",
    url: "https://www.linkedin.com/pulse/custom-gpt-training-guide-chain-prompting-method-action-diamitani-jdg6c",
    image: "/newsletter-images/gpt-training.png",
  },
  {
    id: "5",
    title: "LetsVibeAI News Bulletin - 4.30.25",
    date: "2025-04-30",
    description: "The latest news bulletin covering important AI developments and announcements.",
    url: "https://www.linkedin.com/pulse/livebuildai-news-bulletin-43025-patrick-diamitani-2dbgc",
    image: "/newsletter-images/news-bulletin.png",
  },
  {
    id: "6",
    title: "How to Build a Custom Assistant Using the Chain Prompting Method",
    date: "2025-04-20",
    description: "A step-by-step guide to building effective custom assistants with the Chain Prompting Method.",
    url: "https://www.linkedin.com/pulse/how-build-custom-assistant-using-chain-prompting-method-diamitani-5a3pc",
    image: "/newsletter-images/custom-assistant.png",
  },
]

export const getNewsletterArticleById = (id: string): NewsletterArticle | undefined => {
  return newsletterArticles.find((article) => article.id === id)
}

export const getNewsletterArticlesByYear = (year: string): NewsletterArticle[] => {
  return newsletterArticles.filter((article) => {
    const articleYear = article.date.split("-")[0]
    return articleYear === year
  })
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}
