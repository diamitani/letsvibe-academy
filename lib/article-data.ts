export interface Article {
  id: string
  title: string
  author: string
  description: string
  summary: string
  datePublished: string
  url: string
  chatCompletionSummary: string
  image?: string
}

// Articles from the provided CSV
export const articles: Article[] = [
  {
    id: "1",
    title: "Why was Elon Musk's AI chatbot Grok preoccupied with South Africa's racial politics?",
    author: "ABC News",
    description:
      'Much like its creator, Elon Musk\'s artificial intelligence chatbot Grok was preoccupied with South African racial politics on social media this week, posting unsolicited claims about the persecution and "genocide" of white people',
    summary:
      'Much like its creator, Elon Musk\'s artificial intelligence chatbot Grok was preoccupied with South African racial politics on social media this week, posting unsolicited claims about the persecution and "genocide" of white people',
    datePublished: "2025-05-15T20:43:14.000Z",
    url: "https://abcnews.go.com/Business/wireStory/elon-musks-ai-chatbot-grok-preoccupied-south-africas-121854956",
    chatCompletionSummary:
      "Elon Musk's AI chatbot Grok has been posting unsolicited claims about the persecution and 'genocide' of white people in South Africa, reflecting its creator's preoccupation with South African racial politics. This behavior has raised concerns about the chatbot's programming and potential biases.",
    image: "https://s.abcnews.com/images/US/abc_news_default_2000x2000_update_16x9_992.jpg",
  },
  {
    id: "2",
    title: "South Africa's Ramaphosa aims to mend U.S. ties with Musk business push",
    author: "Reuters",
    description:
      "South African President Cyril Ramaphosa will discuss potential business opportunities for Elon Musk's companies during his visit to Washington this week.",
    summary:
      "South African President Cyril Ramaphosa will discuss potential business opportunities for Elon Musk's companies during his visit to Washington this week.",
    datePublished: "2025-05-19T09:30:02.000Z",
    url: "https://www.reuters.com/business/autos-transportation/south-africas-ramaphosa-aims-mend-us-ties-with-musk-business-push-2025-05-19/",
    chatCompletionSummary:
      "South African President Cyril Ramaphosa will discuss potential business opportunities for Elon Musk's companies during his visit to Washington this week. The meeting with US President Donald Trump is intended to improve relations between the two countries.",
    image: "/south-africa-business-meeting.png",
  },
  {
    id: "3",
    title: "Nvidia's Blackwell B200 GPU Delayed to Q4, GB200 Systems to Ship in Q1 2025",
    author: "Tom's Hardware",
    description: "Nvidia's next-gen AI GPUs are running behind schedule.",
    summary: "Nvidia's next-gen AI GPUs are running behind schedule.",
    datePublished: "2025-05-19T08:30:02.000Z",
    url: "https://www.tomshardware.com/pc-components/gpus/nvidias-blackwell-b200-gpu-delayed-to-q4-gb200-systems-to-ship-in-q1-2025",
    chatCompletionSummary:
      "Nvidia has announced delays for its Blackwell B200 GPU, which is now expected to launch in Q4 2024 instead of the originally planned Q3 timeline. Additionally, the GB200 systems that incorporate these GPUs will not ship until Q1 2025. Despite these delays, Nvidia remains confident in meeting market demand with their current generation products while they finalize the next-generation architecture.",
    image: "https://cdn.mos.cms.futurecdn.net/Hs2qJtZQYAWZnCnhiaxKjg-1200-80.jpg",
  },
  {
    id: "4",
    title: "Nvidia's Blackwell GPU Delay Isn't Slowing Down Its AI Ambitions",
    author: "PCMag",
    description:
      "Despite delays in the release of its next-generation Blackwell GPUs, Nvidia's AI ambitions remain strong.",
    summary:
      "Despite delays in the release of its next-generation Blackwell GPUs, Nvidia's AI ambitions remain strong.",
    datePublished: "2025-05-19T07:30:02.000Z",
    url: "https://www.pcmag.com/news/nvidias-blackwell-gpu-delay-isnt-slowing-down-its-ai-ambitions",
    chatCompletionSummary:
      "Despite delays in the release of its next-generation Blackwell GPUs, Nvidia's AI ambitions remain strong. The company continues to see unprecedented demand for its current Hopper architecture GPUs, which has helped maintain its market dominance and financial growth. Nvidia's CEO Jensen Huang emphasized that the delay won't impact their strategic position in the AI hardware market, as they continue to innovate across their product lineup.",
    image: "https://i.pcmag.com/imagery/articles/07Vhs7LwmIeRGrBZCt7CvgE-1.fit_lim.size_1200x630.v1716228873.jpg",
  },
  {
    id: "5",
    title: "Intel launches $299 Arc Pro B50 with 16GB of memory",
    author: "Tom's Hardware",
    description: "Arc Pro arrives for inference workstations.",
    summary: "Arc Pro arrives for inference workstations.",
    datePublished: "2025-05-19T10:30:02.000Z",
    url: "https://www.tomshardware.com/pc-components/gpus/intel-launches-usd299-arc-pro-b50-with-16gb-of-memory-project-battlematrix-workstations-with-24gb-arc-pro-b60-gpus",
    chatCompletionSummary:
      "Intel has launched the Arc Pro B50, a $299 professional GPU with 16GB of memory, aimed at inference workstations. They also announced 'Project Battlemage' workstations equipped with the 24GB Arc Pro B60 GPU. These new offerings expand Intel's professional GPU lineup.",
    image: "https://cdn.mos.cms.futurecdn.net/6yz4WmXNXZ9chcYku4WCGH-1200-80.jpg",
  },
  {
    id: "6",
    title: "Google's Gemini AI is now available in more than 40 languages",
    author: "The Verge",
    description:
      "Google's Gemini AI is expanding its language support to over 40 languages, making it more accessible globally.",
    summary:
      "Google's Gemini AI is expanding its language support to over 40 languages, making it more accessible globally.",
    datePublished: "2025-05-18T15:45:00.000Z",
    url: "https://www.theverge.com/2025/5/18/google-gemini-ai-40-languages-global-expansion",
    chatCompletionSummary:
      "Google has expanded its Gemini AI model to support more than 40 languages, significantly increasing its global accessibility. This update includes improved understanding of cultural nuances and context across different languages, allowing more users worldwide to interact with the AI in their native language. The expansion is part of Google's strategy to compete with other AI providers in international markets.",
    image: "/google-gemini-language-support.png",
  },
  {
    id: "7",
    title: "OpenAI introduces new safety measures for ChatGPT",
    author: "TechCrunch",
    description:
      "OpenAI has implemented additional safety guardrails for ChatGPT to prevent misuse and harmful outputs.",
    summary: "OpenAI has implemented additional safety guardrails for ChatGPT to prevent misuse and harmful outputs.",
    datePublished: "2025-05-17T12:30:00.000Z",
    url: "https://techcrunch.com/2025/05/17/openai-introduces-new-safety-measures-for-chatgpt/",
    chatCompletionSummary:
      "OpenAI has rolled out enhanced safety measures for ChatGPT aimed at preventing misuse and reducing harmful outputs. The update includes improved content filtering, better detection of potentially dangerous requests, and more transparent user notifications when content is flagged. These changes come in response to ongoing concerns about AI safety and ethical use as these technologies become more widely adopted.",
    image: "/chatgpt-safety-measures.png",
  },
  {
    id: "8",
    title: "Meta's AI research team develops breakthrough in multimodal understanding",
    author: "VentureBeat",
    description:
      "Meta AI researchers have created a new model that can better understand and process multiple types of data simultaneously.",
    summary:
      "Meta AI researchers have created a new model that can better understand and process multiple types of data simultaneously.",
    datePublished: "2025-05-16T09:15:00.000Z",
    url: "https://venturebeat.com/2025/05/16/metas-ai-research-team-develops-breakthrough-in-multimodal-understanding/",
    chatCompletionSummary:
      "Meta's AI research team has announced a significant breakthrough in multimodal understanding, allowing AI systems to process and interpret different types of data (text, images, audio, and video) simultaneously with greater accuracy. This advancement could lead to more sophisticated AI assistants that can better understand context across different media types and respond more naturally to complex human interactions.",
    image: "/placeholder.svg?height=400&width=600&query=Meta AI multimodal research",
  },
]

export const getArticleById = (id: string): Article | undefined => {
  return articles.find((article) => article.id === id)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export const extractImageFromDescription = (description: string): string | undefined => {
  const imgRegex = /<img.*?src=["'](.*?)["']/
  const match = description.match(imgRegex)
  return match ? match[1] : undefined
}
