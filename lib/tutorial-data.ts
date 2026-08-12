// AUTO-GENERATED from the legacy vibe-coding-course repo
// 10 article-based lessons
// Regenerate with: python3 scripts/migrate-legacy-content.py
import type { CurriculumSection } from "./curriculum-data"

export interface Tutorial {
  id: string
  title: string
  type: string
  duration: string
  prerequisites: string
  sections: CurriculumSection[]
}

export const  tutorials: Tutorial[] = [
  {
    "id": "01-ai-today-whats-moving",
    "title": "AI Today — What's Moving",
    "type": ":",
    "duration": ":",
    "prerequisites": ":",
    "sections": [
      {
        "heading": "Overview",
        "items": [
          "**Source:** AI Today (September 30, 2025)",
          "**Type:** News Briefing + Analysis",
          "**Duration:** 45-60 minutes",
          "**Prerequisites:** Module 1 — What Is AI",
          "---"
        ]
      },
      {
        "heading": "Learning Objectives",
        "items": [
          "• Analyze real-world AI news through a strategic lens",
          "• Identify market trends: pricing wars, regulation, hardware, and agents",
          "• Connect current events to foundational AI concepts",
          "---"
        ]
      },
      {
        "heading": "Stories",
        "items": [
          "**1. DeepSeek Launches V3.2-Exp with Sparse Attention**",
          "DeepSeek released V3.2-Exp, featuring Sparse Attention that slashes API costs significantly. This is a direct signal that an AI inference pricing war has begun.",
          "**Implications:**",
          "• Open-weight models are driving costs toward zero",
          "• Smaller players can now access frontier-level capabilities",
          "• Incumbents (OpenAI, Anthropic) must justify premium pricing",
          "**2. US Senators Propose the AI Risk Evaluation Act**",
          "A bipartisan bill requiring mandatory risk assessments for advanced AI models before deployment.",
          "**Implications:**",
          "• Federal regulation is taking shape, potentially preempting state-level patchwork",
          "• Compliance costs will become a factor in AI development",
          "• May slow down releases but increase trust in deployed systems",
          "**3. Google Launches Search Live**",
          "Google merged voice, camera, and conversational AI into a single search interface — \"Search Live.\" Point your camera at something, speak a question, and get an AI-generated answer.",
          "**Implications:**",
          "• Search is no longer text-only — multimodal input is the new norm",
          "• Traditional SEO will need to adapt to voice + visual queries",
          "• AI-native interfaces are becoming the default",
          "**4. Humain Horizon Pro — AI-Native Laptop**",
          "A dedicated AI laptop with a local model runtime built in, allowing users to run LLMs without cloud dependency.",
          "**Implications:**",
          "• Hardware is being rebuilt for AI-native workflows",
          "• Local inference eliminates privacy concerns and latency",
          "• May reshape the PC market if adoption scales",
          "**5. States Scramble to Regulate AI Therapy Apps**",
          "Illinois and Nevada have banned AI therapy apps outright, while other states are developing frameworks for AI mental health tools.",
          "**Implications:**",
          "• The regulatory landscape is fragmenting (state by state)",
          "• AI in high-stakes domains faces the toughest scrutiny",
          "• Builders must be aware of jurisdiction-specific rules",
          "---"
        ]
      },
      {
        "heading": "Key Themes",
        "items": [
          "• **Cost collapse:** Open-weight models are driving inference costs toward zero",
          "• **Regulatory fragmentation:** Federal vs. state regulation creates compliance complexity",
          "• **Hardware evolution:** Devices are being rebuilt for AI-native experiences",
          "• **Agentic shift:** The next paradigm is agents that act, not just chat",
          "---"
        ]
      },
      {
        "heading": "Discussion Questions",
        "items": [
          "• How does DeepSeek's pricing strategy affect the broader AI tool landscape?",
          "• What are the implications of fragmented state-level AI regulation for startups?",
          "• How does \"Search Live\" change the way users interact with information?",
          "• Would you use an AI therapist? What safeguards would you need?"
        ]
      }
    ]
  },
  {
    "id": "02-livebuildai-october-6",
    "title": "LiveBuildAI: The Week AI Grew Up",
    "type": ":",
    "duration": ":",
    "prerequisites": ":",
    "sections": [
      {
        "heading": "Overview",
        "items": [
          "**Source:** LiveBuildAI (October 6, 2025)",
          "**Type:** News Briefing + Market Analysis",
          "**Duration:** 45-60 minutes",
          "**Prerequisites:** Module 1 — What Is AI",
          "---"
        ]
      },
      {
        "heading": "Learning Objectives",
        "items": [
          "• Understand how hardware strategy shapes the AI landscape",
          "• Analyze global power shifts in AI infrastructure",
          "• Evaluate competing narratives about AI timelines and capability",
          "---"
        ]
      },
      {
        "heading": "Stories",
        "items": [
          "**1. OpenAI Signs Multi-Year AMD GPU Deal**",
          "OpenAI committed to a multi-year AMD GPU deal (6GW capacity), with an option to acquire up to 10% of AMD equity. This is a direct challenge to Nvidia's dominance in AI compute.",
          "**Implications:**",
          "• Nvidia's near-monopoly on AI training hardware is being challenged",
          "• AMD's software ecosystem (ROCm) gains credibility with OpenAI's backing",
          "• OpenAI reduces dependency on a single hardware supplier",
          "• 6GW of compute signals massive scaling ambitions",
          "**2. Europe Reclaims Leadership in AI Mobility**",
          "European companies are taking the lead in AI-powered mobility — autonomous vehicles, logistics, and smart infrastructure.",
          "**Implications:**",
          "• Regulatory frameworks in Europe (GDPR, AI Act) may be creating trust advantages",
          "• Mobility is becoming a stronghold for European AI competitiveness",
          "• Startups in this space may find favorable funding conditions",
          "**3. Zhipu AI Pushes Back Against Superintelligence Hype**",
          "China's Zhipu AI published a measured response to the \"superintelligence is imminent\" narrative, arguing that current AI capabilities are still narrow and brittle.",
          "**Implications:**",
          "• There is significant disagreement about AI timelines even among leading labs",
          "• Hype management is becoming a strategic tool",
          "• A sober assessment of current limitations is valuable for builders",
          "**4. Sam Altman's Global Infrastructure Tour**",
          "Altman is traveling the world meeting with governments and infrastructure partners, signaling that AI infrastructure is as much a geopolitical project as a technical one.",
          "**Implications:**",
          "• AI compute is becoming a matter of national strategy",
          "• Data center locations, energy policy, and chip supply chains are front-page news",
          "• Global infrastructure investment will shape which countries lead in AI",
          "**5. Citigroup Raises AI Infrastructure Spending Projections**",
          "Citigroup significantly increased its AI infrastructure spend forecasts, citing demand across cloud, enterprise, and defense sectors.",
          "**Implications:**",
          "• Institutional capital is flowing into AI infrastructure at unprecedented scale",
          "• The build-out is not a bubble — demand is real and growing",
          "• Talent with infrastructure skills (MLOps, cloud architecture, hardware) will be in high demand",
          "---"
        ]
      },
      {
        "heading": "Key Takeaway",
        "items": [
          "The AI hardware race is reshaping the global balance of power. Strategic bets on compute infrastructure are now as important as model capabilities. Where and how AI is trained will determine who controls AI's future.",
          "---"
        ]
      },
      {
        "heading": "Discussion Questions",
        "items": [
          "• How does OpenAI's AMD deal change the competitive dynamics of AI hardware?",
          "• Is Europe's regulatory approach a competitive advantage or disadvantage in AI?",
          "• Who benefits from the \"superintelligence is imminent\" narrative — and who loses?",
          "• What does Citigroup's spending forecast mean for someone learning AI today?"
        ]
      }
    ]
  },
  {
    "id": "03-livebuildai-september-9",
    "title": "LiveBuildAI: September 9, 2025",
    "type": ":",
    "duration": ":",
    "prerequisites": ":",
    "sections": [
      {
        "heading": "Overview",
        "items": [
          "**Source:** LiveBuildAI (September 9, 2025)",
          "**Type:** News Briefing",
          "**Duration:** 30-45 minutes",
          "**Prerequisites:** None",
          "---"
        ]
      },
      {
        "heading": "Learning Objectives",
        "items": [
          "• Track the bifurcation of AI into infrastructure and consumer lifestyle",
          "• Identify tools and platforms reshaping specific industries",
          "• Recognize how hardware, defense, and consumer AI evolve in parallel",
          "---"
        ]
      },
      {
        "heading": "Stories",
        "items": [
          "**1. Nebius Delivers Major AI Compute Deal with Microsoft**",
          "Nebius (formerly Yandex's cloud spin-off) secured a large-scale AI compute deal with Microsoft, further expanding the infrastructure ecosystem beyond the big three cloud providers.",
          "**Implications:**",
          "• AI compute is diversifying beyond AWS, GCP, and Azure's own capacity",
          "• Specialized AI cloud providers are finding their market",
          "• Geopolitical routing of compute (Europe vs. US vs. Asia) becomes strategic",
          "**2. ASML Fuels Mistral AI and Europe's Chip Ambition**",
          "ASML, the Dutch lithography giant critical to chip manufacturing, is backing Mistral AI as part of Europe's push to build sovereign AI capabilities.",
          "**Implications:**",
          "• Europe is investing in the entire AI stack — from chip manufacturing to model development",
          "• Sovereign AI is a growing theme outside the US and China",
          "• Hardware supply chains are deeply connected to AI strategy",
          "**3. Nvidia Teases Rubin CPX — A Chip for Creators**",
          "Nvidia previewed \"Rubin CPX,\" a chip positioned for creators rather than data centers — targeting video editors, 3D artists, and AI-native workflows on personal workstations.",
          "**Implications:**",
          "• Nvidia is expanding beyond enterprise into the creator economy",
          "• Local AI processing for creative work is becoming viable",
          "• May compete with Apple's silicon in the creative professional market",
          "**4. Ukrainian AI Tool Clarity Slashes Military Intel Turnaround**",
          "Clarity, a Ukrainian AI startup, dramatically reduced military intelligence analysis turnaround times, demonstrating AI's real-world impact in defense.",
          "**Implications:**",
          "• AI is being deployed in high-stakes, real-time environments",
          "• Defense tech is a growing AI application space",
          "• Speed of analysis is a key differentiator in time-sensitive domains",
          "**5. Google Pulls Pixel 10's AI \"Daily Hub\" for Fine-Tuning**",
          "Google delayed the Pixel 10's AI \"Daily Hub\" feature, pulling it back for refinement before launch.",
          "**Implications:**",
          "• Even the largest AI companies struggle with AI product quality",
          "• Shipping AI features is harder than demos suggest",
          "• A pull-for-quality decision builds long-term trust",
          "---"
        ]
      },
      {
        "heading": "Tools to Watch",
        "items": [
          "---"
        ]
      },
      {
        "heading": "Pattern: Consumer AI Bifurcation",
        "items": [
          "AI is splitting into two tracks:",
          "• **Infrastructure AI** — Compute, chips, data centers, defense (high capex, B2B)",
          "• **Lifestyle AI** — Shopping, fashion, content creation (low barrier, consumer-facing)",
          "Builders should choose which track aligns with their skills and risk tolerance.",
          "---"
        ]
      },
      {
        "heading": "Discussion Questions",
        "items": [
          "• How does the Nebius-Microsoft deal affect the cost of AI compute for developers?",
          "• Why is sovereign AI important for Europe? For other regions?",
          "• What does the Pixel 10 feature pullback teach us about shipping AI products?",
          "• Which track — infrastructure or lifestyle — is more interesting to you as a builder?"
        ]
      }
    ]
  },
  {
    "id": "04-livebuildai-september-8",
    "title": "LiveBuildAI: September 8, 2025",
    "type": ":",
    "duration": ":",
    "prerequisites": ":",
    "sections": [
      {
        "heading": "Overview",
        "items": [
          "**Source:** LiveBuildAI Newsletter (September 8, 2025)",
          "**Type:** News Briefing + Ethics Discussion",
          "**Duration:** 30-45 minutes",
          "**Prerequisites:** None"
        ]
      },
      {
        "heading": "Learning Objectives",
        "items": [
          "• Understand the legal and ethical dimensions of AI development",
          "• Analyze how copyright law interacts with AI training data",
          "• Recognize the real-world psychological impact of AI systems",
          "---"
        ]
      },
      {
        "heading": "Stories",
        "items": [
          "**1. Anthropic Settles Copyright Lawsuit for $1.5 Billion**",
          "Anthropic agreed to a $1.5 billion settlement after authors sued over alleged misuse of their books as training data. This is one of the largest AI copyright settlements to date.",
          "**Implications:**",
          "• Sets expectations for data consent and compensation in AI training",
          "• Establishes a precedent for future copyright lawsuits against AI companies",
          "• Increases the cost of doing business for AI model developers",
          "• May accelerate licensed training data agreements",
          "**What this means for builders:** AI tools you use may change how they handle training data. Open-weight models and local inference become more attractive as legal uncertainties persist around cloud APIs.",
          "**2. AI Chatbots Linked to Teen Death — Expert Calls for Global Treaty**",
          "Nate Soares, a leading AI safety researcher, urged international regulation after a teenager's suicide was linked to interactions with a chatbot. The case highlights AI's psychological footprint.",
          "**Implications:**",
          "• AI safety is not just about AGI risk — current systems have real-world psychological impact",
          "• The mental health AI space faces urgent regulatory attention",
          "• Design choices (empathetic vs. clinical tone, user retention loops) have ethical weight",
          "**What this means for builders:** If you build conversational AI, consider:",
          "• What happens when users form emotional attachments?",
          "• How do you handle crisis/suicide detection?",
          "• Should your AI disclose it's not human?",
          "---"
        ]
      },
      {
        "heading": "Key Takeaways",
        "items": [
          "• Copyright litigation is becoming a material cost for AI development",
          "• AI safety regulation is moving beyond theory into urgent policy action",
          "• Builders of conversational AI have a responsibility to design for psychological safety",
          "• The era of unregulated AI development is ending",
          "---"
        ]
      },
      {
        "heading": "Discussion Questions",
        "items": [
          "• Should AI companies be required to disclose all training data sources?",
          "• At what point does AI chatbot interaction cross the line into needing regulation?",
          "• How would you design a safety system for a mental health chatbot?"
        ]
      }
    ]
  },
  {
    "id": "05-gtm-email-automation",
    "title": "GTM Email Automation with Make.com",
    "type": ":",
    "duration": ":",
    "prerequisites": ":",
    "sections": [
      {
        "heading": "Overview",
        "items": [
          "**Source:** LiveBuildAI Sales Automation Guide",
          "**Type:** How-To Lab (Beginner)",
          "**Duration:** 1.5-2 hours",
          "**Prerequisites:** Module 3 — The Toolkit, basic Google Sheets",
          "---"
        ]
      },
      {
        "heading": "Learning Objectives",
        "items": [
          "• Understand GTM engineering as a practice — building AI and automation for sales and marketing",
          "• Build an automated email outreach pipeline with Make.com",
          "• Implement proper email deliverability (SPF, DKIM, DMARC)",
          "• Track outreach status in Google Sheets",
          "---"
        ]
      },
      {
        "heading": "What Is GTM Engineering?",
        "items": [
          "GTM (Go-to-Market) engineering is the practice of building AI-powered automations for sales and marketing. It represents a fundamental shift:",
          "---"
        ]
      },
      {
        "heading": "What You'll Build",
        "items": [
          "A Make.com scenario that:",
          "```",
          "Google Sheet (leads)",
          "→ Filter (not contacted yet)",
          "→ Send personalized email (Resend)",
          "→ Wait (3 seconds)",
          "→ Update sheet with timestamp",
          "```",
          "**What You'll Need**",
          "• Google account with a leads sheet",
          "• Resend account with a verified sending domain",
          "• Make.com account (free tier: 1,000 operations/month)",
          "---"
        ]
      },
      {
        "heading": "Step-by-Step",
        "items": [
          "**Step 1: Set Up Your Leads Sheet**",
          "Create a Google Sheet named \"Leads\" with columns:",
          "Add rows of prospect data. Leave \"Email 1 Date\" blank for new leads.",
          "**Step 2: Create the Make.com Scenario**",
          "• **Google Sheets → Search Rows**",
          "• Connect your Google account",
          "• Select your spreadsheet and \"Leads\" sheet",
          "• **Filter**",
          "• Condition: Email column exists AND Email 1 Date does not exist",
          "• This ensures you only contact leads who haven't been emailed yet",
          "• **Resend → Send Email**",
          "• Connect your Resend account (add API key)",
          "• To: `{{email}}`",
          "• From: your verified sending domain",
          "• Subject: a template with personalization",
          "• Body: plain text (better deliverability than HTML)",
          "• **Tools → Sleep**",
          "• Duration: 3 seconds",
          "• Prevents email throttling and protects sender reputation",
          "• **Google Sheets → Update Row**",
          "• Map to the original row number",
          "• Find \"Email 1 Date\" column",
          "• Value: `{{now}}` (current timestamp)",
          "**Step 3: Schedule the Scenario**",
          "• Set to run on a schedule (daily or hourly)",
          "• Respect sending limits: start with 10-20 emails/day",
          "• Gradually increase as your domain warms up",
          "---"
        ]
      },
      {
        "heading": "Email Deliverability Essentials",
        "items": [
          "**Best practice:** Use a subdomain for cold outreach (e.g., `mail.yourdomain.com`) to protect your primary domain's reputation.",
          "---"
        ]
      },
      {
        "heading": "Extension Ideas",
        "items": [
          "Once the basic pipeline works, add:",
          "• **Personalization** — Use an LLM module to generate personalized subject lines based on company info",
          "• **Multi-step sequences** — Add follow-up emails at 3-day, 7-day, and 14-day intervals",
          "• **Tracking** — Use Resend's webhooks to track opens and clicks",
          "• **LinkedIn enrichment** — Add a module to look up prospect LinkedIn profiles",
          "• **AI research** — Before sending, use Perplexity to research the company and generate a personalized reference",
          "---"
        ]
      },
      {
        "heading": "Key Takeaways",
        "items": [
          "• GTM engineering is a new skillset: building systems, not just using tools",
          "• A simple email automation pipeline is achievable in under an hour with Make.com",
          "• Email deliverability depends on proper DNS configuration (SPF, DKIM, DMARC)",
          "• Start small, warm up your domain, then scale",
          "---"
        ]
      },
      {
        "heading": "Troubleshooting",
        "items": []
      }
    ]
  },
  {
    "id": "06-linkedin-content-automation",
    "title": "LinkedIn Content Automation with ChatGPT & Make.com",
    "type": ":",
    "duration": ":",
    "prerequisites": ":",
    "sections": [
      {
        "heading": "Overview",
        "items": [
          "**Source:** LinkedIn Marketing Automation Guide",
          "**Type:** How-To Lab",
          "**Duration:** 1.5-2 hours",
          "**Prerequisites:** Module 3 — The Toolkit, basic Google Sheets",
          "---"
        ]
      },
      {
        "heading": "Learning Objectives",
        "items": [
          "• Build a complete content pipeline from ideation to posting",
          "• Automate LinkedIn post generation using AI + no-code automation",
          "• Implement a review-and-post workflow with safety checks",
          "• Scale content production without sacrificing quality",
          "---"
        ]
      },
      {
        "heading": "What You'll Build",
        "items": [
          "A content automation pipeline:",
          "```",
          "ChatGPT → 30-Day Content Calendar → Google Sheets → Make.com → LinkedIn Post",
          "```",
          "---"
        ]
      },
      {
        "heading": "Step-by-Step",
        "items": [
          "**Step 1: Generate a 30-Day Content Calendar in ChatGPT**",
          "Prompt ChatGPT:",
          "> \"Generate a 30-day LinkedIn content calendar for [your niche/topic]. Each day should include: date, topic, post draft (within 2700 characters), 3-5 relevant hashtags. Format as a table.\"",
          "Review and customize the output for your voice and audience.",
          "**Step 2: Set Up Google Sheets**",
          "Create a folder in Google Drive (e.g., \"Content Automation\").",
          "Create a spreadsheet with columns:",
          "Paste your 30-day calendar into the sheet.",
          "**Step 3: Build the Make.com Scenario**",
          "**Modules:**",
          "• **Schedule** — Set to run daily at 9:00 AM",
          "• **Google Sheets → Search Rows** — Find rows where Date = today AND Status is empty",
          "• **Filter** — Ensure content hasn't been posted yet",
          "• **LinkedIn → Create Post** — Connect LinkedIn account, map Post Draft to content",
          "• **Google Sheets → Update Row** — Set Status to \"Posted\" and Date Posted to `{{now}}`",
          "**Step 4: Test and Refine**",
          "Run a manual test with a single row. Check:",
          "• Does the post format correctly on LinkedIn?",
          "• Is the character count under 2700?",
          "• Are hashtags included?",
          "**Step 5: Add AI Content Generation (Optional)**",
          "Instead of pre-writing all 30 posts, add an AI module between Sheets and LinkedIn:",
          "```",
          "Sheet (topic only) → ChatGPT/Claude → Generate Post → LinkedIn",
          "```",
          "This gives you fresh content daily with the latest context.",
          "---"
        ]
      },
      {
        "heading": "Best Practices",
        "items": [
          "---"
        ]
      },
      {
        "heading": "Troubleshooting",
        "items": [
          "---"
        ]
      },
      {
        "heading": "Key Takeaways",
        "items": [
          "• A content automation pipeline removes the daily \"what do I post?\" friction",
          "• Pre-generating a calendar gives you consistency; AI daily generation gives you freshness",
          "• The review step remains critical — AI-generated content should never post without oversight",
          "• This same pattern works for Twitter/X, Instagram, and other platforms",
          "---"
        ]
      },
      {
        "heading": "Extension Ideas",
        "items": [
          "• Multi-platform distribution (LinkedIn + Twitter + blog)",
          "• Performance tracking (engagement metrics back to the sheet)",
          "• A/B testing different post styles",
          "• Comment reply automation for engagement",
          "• Content repurposing (long-form → thread → post → carousel)"
        ]
      }
    ]
  },
  {
    "id": "07-personalized-email-outreach-engine",
    "title": "Personalized Email Outreach Engine",
    "type": ":",
    "duration": ":",
    "prerequisites": ":",
    "sections": [
      {
        "heading": "Overview",
        "items": [
          "**Source:** Email Outreach Engine Guide",
          "**Type:** How-To Lab (Advanced)",
          "**Duration:** 2-3 hours",
          "**Prerequisites:** Lesson 05 (GTM Email Automation), Perplexity account, DeepSeek or OpenAI API key",
          "---"
        ]
      },
      {
        "heading": "Learning Objectives",
        "items": [
          "• Build an AI-powered outreach system that researches and personalizes every email",
          "• Integrate multiple AI services (Perplexity + DeepSeek) into a single automation",
          "• Understand the architecture of a research-driven cold email pipeline",
          "• Implement deliverability best practices for cold outreach",
          "---"
        ]
      },
      {
        "heading": "The Architecture",
        "items": [
          "```",
          "Google Sheet (leads)",
          "→ Perplexity: Research prospect company",
          "→ Perplexity: Research YOUR own products",
          "→ DeepSeek: Draft personalized email",
          "→ Resend: Send email",
          "→ Google Sheet: Update status + timestamp",
          "```",
          "Cost to run: ~$5/month using free tiers and minimum credit purchases.",
          "---"
        ]
      },
      {
        "heading": "Step-by-Step",
        "items": [
          "**Step 1: Set Up Your Lead Sheet**",
          "Create a Google Sheet named \"Leads\" with these exact column headers:",
          "Leave `email_1_date` and `email_1_message_id` blank for new leads — these act as sentinel columns.",
          "**Step 2: Configure Make.com Modules**",
          "**Module 1 — Google Sheets: Search Rows**",
          "• Query: `email_1_date` is empty",
          "• Limit: 5-10 leads per run (to manage API costs)",
          "• Add an Iterator to process rows one by one",
          "**Module 2 — Perplexity: Company Research**",
          "Prompt template for Perplexity API:",
          "```",
          "Research the company:",
          "• Company: {{company_name}}",
          "• Domain: {{company_domain}}",
          "• Prospect LinkedIn (if provided): {{prospect_linkedin}}",
          "Deliver a concise, factual brief:",
          "• What they do",
          "• ICP and segments",
          "• Recent news (last 90 days)",
          "• Competitive context",
          "• Potential pain points related to [your industry]",
          "```",
          "Output: Save to a `company_research_summary` variable.",
          "**Module 3 — Perplexity: Your Product Knowledge Snapshot**",
          "Run a second research call so the writer model knows what you sell.",
          "Inputs: your primary domain and product pages (or a brief about what your company does).",
          "Prompt:",
          "```",
          "Analyze this product/service:",
          "[your product description]",
          "Deliver:",
          "• Key value propositions",
          "• Target customer profile",
          "• Features most relevant to [target industry]",
          "• Case study or success story snippets",
          "```",
          "Output: Save to a `product_snapshot` variable.",
          "**Alternative:** If you don't want to use Perplexity twice, replace one call with:",
          "• Gemini with web search enabled",
          "• OpenAI with web search (browsing mode)",
          "• Simple HTTP module to scrape the company homepage",
          "**Module 4 — DeepSeek: Draft Personalized Email**",
          "Combine the research outputs:",
          "```",
          "You are a sales email writer. Using the following research, write a short cold email body.",
          "Company Research:",
          "{{company_research_summary}}",
          "Our Product:",
          "{{product_snapshot}}",
          "Prospect Name: {{first_name}} {{last_name}}",
          "Prospect Title: {{title}}",
          "Rules:",
          "• No subject line — body only",
          "• Max 150 words",
          "• Reference something specific from the company research",
          "• Clear, low-pressure call to action",
          "• Professional but conversational tone",
          "```",
          "**Module 5 — Resend: Send Email**",
          "• To: `{{email}}`",
          "• From: your verified domain",
          "• Subject: `{{first_name}}, quick question about [topic from research]`",
          "• Body: DeepSeek output (plain text)",
          "**Module 6 — Google Sheets: Update Row**",
          "• Map to the original row",
          "• Set `email_1_date` to `{{now}}`",
          "• Set `email_1_message_id` to the Resend message ID",
          "**Step 3: Schedule and Monitor**",
          "• Run as a scheduled scenario (once daily)",
          "• Start at 5-10 emails/day, gradually increase",
          "• Monitor open rates and adjust subject line patterns",
          "---"
        ]
      },
      {
        "heading": "Alternative Providers",
        "items": [
          "If Perplexity or DeepSeek aren't available:",
          "---"
        ]
      },
      {
        "heading": "Deliverability Considerations",
        "items": [
          "Cold email is a high-risk channel. Protect your domain:",
          "---"
        ]
      },
      {
        "heading": "Key Takeaways",
        "items": [
          "• A personalized outreach engine can be built for ~$5/month using free tiers",
          "• The three-step research-draft-send pipeline produces higher-quality outreach than batch-and-blast",
          "• Two research calls (company + product) gives the writer everything it needs",
          "• Plain text emails with genuine personalization outperform HTML templates",
          "• Domain warming and deliverability are the hardest part — not the automation",
          "---"
        ]
      },
      {
        "heading": "Extension Ideas",
        "items": [
          "• Add Perplexity research on the specific prospect (not just company)",
          "• Multi-step sequences: Day 1 email, Day 4 follow-up, Day 10 break-up",
          "• A/B test subject lines across different lead segments",
          "• Track replies via Gmail/Outlook webhook and auto-tag as \"Replied\"",
          "• Add LinkedIn outreach as a parallel channel"
        ]
      }
    ]
  },
  {
    "id": "08-free-perplexity-pro-comet",
    "title": "Free Perplexity Pro + Comet Access for 1 Year",
    "type": ":",
    "duration": ":",
    "prerequisites": ":",
    "sections": [
      {
        "heading": "Overview",
        "items": [
          "**Source:** Perplexity Pro Guide",
          "**Type:** Tool Guide",
          "**Duration:** 15-20 minutes",
          "**Prerequisites:** None",
          "---"
        ]
      },
      {
        "heading": "What This Guide Covers",
        "items": [
          "How to get a free year of Perplexity Pro ($200 value) including Comet browser beta access, through a PayPal/Venmo promotional offer.",
          "---"
        ]
      },
      {
        "heading": "The Offer",
        "items": [
          "PayPal and Venmo US users can activate Perplexity Pro at no cost for 12 months. This includes:",
          "• Unlimited Pro Search with GPT-4, Claude, Grok, and other frontier models",
          "• Comet browser beta — AI assistant with cross-tab context",
          "• File upload and code/document analysis",
          "• Ad-free experience, no model training from user data",
          "At the end of 12 months, billing kicks in at the then-current rate. Cancel anytime before the renewal date.",
          "---"
        ]
      },
      {
        "heading": "Step-by-Step",
        "items": [
          "**Step 1: Set Up PayPal**",
          "If you don't have a PayPal account:",
          "• Visit paypal.com",
          "• Click \"Sign Up\"",
          "• Choose \"Personal\" account",
          "• Enter email, verify phone",
          "• Link a bank account or debit card",
          "**Step 2: Find the Perplexity Offer**",
          "• Open the PayPal mobile app",
          "• Navigate to \"Offers\" or \"Subscriptions\"",
          "• Look for the Perplexity Pro banner (may be under \"Promotions\" or \"Partner Deals\")",
          "• Tap to start the sign-up flow",
          "**Step 3: Activate Perplexity Pro**",
          "• You'll be prompted to create a new Perplexity account or log into an existing one",
          "• The account must never have had Pro before",
          "• When asked for payment method, select PayPal",
          "• No upfront charge during the promotional period",
          "**Step 4: Verify Activation**",
          "• Go to Perplexity settings → \"Plan\" tab",
          "• You should see: \"Perplexity Pro – Trial (12 months)\"",
          "• Start using Pro Search immediately",
          "---"
        ]
      },
      {
        "heading": "What You Get",
        "items": [
          "**Comet Browser Features**",
          "The Comet beta includes:",
          "• AI assistant throughout your browser",
          "• Cross-tab context and intelligence",
          "• Code explanation and technical documentation analysis",
          "• Developer-focused tools for debugging and research",
          "---"
        ]
      },
      {
        "heading": "Why This Matters for Builders",
        "items": [
          "One year of frontier model access at zero cost means:",
          "• Experiment with multiple models without per-use costs",
          "• Use Pro Search for research-backed development",
          "• Analyze codebases with file upload and document analysis",
          "• Test Comet's agentic browsing capabilities",
          "• No pressure to optimize for token usage",
          "---"
        ]
      },
      {
        "heading": "Caveats",
        "items": [
          "• Offer is for US PayPal/Venmo users only (as of publication)",
          "• Promotional details may change — verify current terms at signup",
          "• Auto-renews at the then-current rate after 12 months",
          "• One Perplexity Pro trial per account",
          "---"
        ]
      },
      {
        "heading": "Key Takeaways",
        "items": [
          "• A full year of Perplexity Pro + Comet is available at no cost through the PayPal offer",
          "• Perplexity Pro provides unlimited access to multiple frontier LLMs",
          "• Comet is an early look at AI-native browsing",
          "• Set a calendar reminder to cancel before renewal if you don't want to continue",
          "---"
        ]
      },
      {
        "heading": "Next Steps",
        "items": [
          "• Activate your Perplexity Pro account",
          "• Try Pro Search vs. regular search — compare the depth of research results",
          "• Install the Comet browser extension and test it on a development task",
          "• Use Perplexity Pro's API credits ($5/month free) for your automation projects (Lesson 07)",
          "• Explore using Perplexity as a research engine for your vibe coding projects"
        ]
      }
    ]
  },
  {
    "id": "L01_GTM_Email_Automation_Make",
    "title": "Lesson: GTM Email Automation with Make.com",
    "type": "Lesson",
    "duration": ":",
    "prerequisites": ":",
    "sections": [
      {
        "heading": "Overview",
        "items": []
      },
      {
        "heading": "Overview",
        "items": [
          "Build a simple \"Go-to-Market\" email automation using Make.com. This lesson introduces GTM engineering — the practice of building AI-powered automations for sales and marketing — and walks through setting up a cold email outreach engine.",
          "**Source Article:** LiveBuildAI - Sales Automation Guide",
          "**Duration:** 1.5-2 hours",
          "**Difficulty:** Beginner-Intermediate",
          "**Prerequisites:** Google account, basic spreadsheet skills"
        ]
      },
      {
        "heading": "Learning Objectives",
        "items": [
          "• Understand GTM engineering as a discipline",
          "• Build an automated email outreach pipeline using Make.com",
          "• Implement proper email deliverability (SPF, DKIM, DMARC)",
          "• Track outreach status systematically in Google Sheets",
          "• Design scalable cold outreach workflows"
        ]
      },
      {
        "heading": "What Is GTM Engineering?",
        "items": [
          "GTM (Go-to-Market) engineering is the practice of building AI and automation systems for sales and marketing activities. Unlike most buzzwords, this one has real substance: it describes a fundamental shift in how sales professionals work. People are no longer just salespeople — they are Go-to-Market Engineers. They develop systems, whether through prompts or code, to accomplish their goals in increasingly competitive and saturated markets."
        ]
      },
      {
        "heading": "Architecture",
        "items": [
          "```",
          "Google Sheet (leads)",
          "↓",
          "Make.com → Search Rows (find uncontacted leads)",
          "↓",
          "Make.com → Filter (email exists, date sent is empty)",
          "↓",
          "Make.com → Resend API (send personalized email)",
          "↓",
          "Make.com → Sleep (3s delay to avoid throttling)",
          "↓",
          "Google Sheet → Update Row (timestamp + status)",
          "```"
        ]
      },
      {
        "heading": "Step-by-Step Build",
        "items": [
          "**Step 1: Prepare Your Lead Sheet**",
          "Create a Google Sheet with these columns:",
          "Populate with your prospect data. The \"Email X Date\" columns will track which messages have been sent.",
          "**Step 2: Create Make.com Scenario**",
          "• **Google Sheets → Search Rows**",
          "• Connect your Google account",
          "• Select your spreadsheet and sheet",
          "• Leave query empty (we'll filter next)",
          "• **Tools → Filter**",
          "• Condition: `email` exists AND `email 1 date` does not exist",
          "• This ensures you only contact prospects who haven't received the first email",
          "• **Resend → Send Email**",
          "• Connect your Resend API key (free tier: 100 emails/day)",
          "• Map recipient email from sheet row",
          "• Set sender address (use your domain)",
          "• Write subject line (can be personalized with {{first_name}})",
          "• Write email body (keep it plain text for deliverability)",
          "• Configure tracking (open/click tracking optional)",
          "• **Tools → Sleep**",
          "• Duration: 3 seconds",
          "• Prevents bulk sending and outbox throttling",
          "• **Google Sheets → Update Row**",
          "• Map the row number",
          "• Find the \"email 1 date\" column",
          "• Set value: `{{now}}` (current timestamp)",
          "**Step 3: Schedule the Scenario**",
          "Set your scenario to run on a schedule:",
          "• Every 30-60 minutes during business hours",
          "• Respect sending limits (start with 20-50 emails/day)",
          "• Gradually increase volume as domain warms up"
        ]
      },
      {
        "heading": "Email Deliverability Essentials",
        "items": [
          "**Critical:** Use a subdomain for cold outreach (e.g., `outreach.yourdomain.com`) to protect your primary domain's reputation."
        ]
      },
      {
        "heading": "Extensions",
        "items": [
          "Once the basic pipeline works, extend it:",
          "• **Personalization:** Add an HTTP module to fetch prospect LinkedIn data, then use an LLM (Claude, GPT) to generate personalized email body",
          "• **Multi-touch sequences:** Add follow-up emails at day 3, day 7, day 14",
          "• **Reply detection:** Monitor for replies and automatically remove responders from the sequence",
          "• **Analytics dashboard:** Sync send data to a visualization tool"
        ]
      },
      {
        "heading": "Key Takeaways",
        "items": [
          "• GTM engineering combines AI, automation, and sales strategy",
          "• A simple email outreach engine can be built in under an hour with Make.com + Resend",
          "• Domain reputation management is critical for email deliverability",
          "• Start simple, then layer on personalization and multi-touch sequences",
          "• Always include tracking and status columns in your lead sheet"
        ]
      },
      {
        "heading": "Resources",
        "items": [
          "• Make.com — Integration platform (free tier available)",
          "• Resend.com — Email API (free tier: 100 emails/day)",
          "• Claude/GPT — Email body personalization",
          "• LinkedIn Sales Navigator — Lead sourcing"
        ]
      },
      {
        "heading": "Further Practice",
        "items": [
          "• Add an LLM call to personalize each email body based on prospect company info",
          "• Build a 3-email follow-up sequence",
          "• Add reply detection and auto-remove responders",
          "• Create a dashboard showing outreach metrics"
        ]
      }
    ]
  },
  {
    "id": "L02_LinkedIn_Content_Automation",
    "title": "Lesson: LinkedIn Content Automation with ChatGPT & Make.com",
    "type": "Lesson",
    "duration": ":",
    "prerequisites": ":",
    "sections": [
      {
        "heading": "Overview",
        "items": []
      },
      {
        "heading": "Overview",
        "items": [
          "Build a custom marketing automation that generates and publishes LinkedIn (or any social media) content using AI. This lesson covers the full pipeline: content ideation with ChatGPT, scheduling with Google Sheets, and auto-posting with Make.com.",
          "**Source Article:** How to Build a Custom LinkedIn Marketing Automation with ChatGPT & Make.com",
          "**Duration:** 1.5-2 hours",
          "**Difficulty:** Beginner-Intermediate",
          "**Prerequisites:** Google account, ChatGPT account"
        ]
      },
      {
        "heading": "Learning Objectives",
        "items": [
          "• Build a 30-day content calendar using AI",
          "• Automate social media post generation and publishing",
          "• Implement a review workflow before auto-posting",
          "• Schedule recurring content pipelines"
        ]
      },
      {
        "heading": "Architecture",
        "items": [
          "```",
          "ChatGPT → 30-day content calendar",
          "↓",
          "Google Sheets (content storage + status tracking)",
          "↓",
          "Make.com (scheduled daily check)",
          "↓",
          "Post generation (ChatGPT or other LLM)",
          "↓",
          "LinkedIn API (auto-publish)",
          "↓",
          "Google Sheets (mark as posted)",
          "```"
        ]
      },
      {
        "heading": "Step-by-Step Build",
        "items": [
          "**Step 1: Generate a 30-Day Content Calendar**",
          "**Prompt for ChatGPT:**",
          "```",
          "Create a 30-day LinkedIn content calendar for [your niche/topic].",
          "For each day, provide:",
          "• Date",
          "• Topic/theme",
          "• Post angle",
          "• Target audience insight",
          "• 3-5 key points to cover",
          "Tone: [professional, educational, conversational, thought leadership]",
          "Goal: [build authority, drive engagement, generate leads]",
          "Format: table",
          "```",
          "Review the output. Adjust topics, tone, or frequency as needed.",
          "**Step 2: Set Up Google Sheets**",
          "Create a spreadsheet with these columns:",
          "• **Date:** The scheduled posting date",
          "• **Topic:** From ChatGPT calendar",
          "• **Post Draft:** Will be filled by the automation",
          "• **Status:** Ready / Posted / Skipped",
          "• **Date Posted:** Auto-filled on publish",
          "**Step 3: Create the Make.com Scenario**",
          "**Scenario trigger:** Schedule (daily at 9:00 AM)",
          "**Module 1 — Google Sheets: Search Rows**",
          "• Select your spreadsheet",
          "• Filter: Date equals today, Status is empty",
          "• Limit: 1 row (one post per day)",
          "**Module 2 — AI Post Generator**",
          "Option A: Use ChatGPT module (make.com's OpenAI connector)",
          "Option B: Use HTTP module to call any LLM API",
          "**Draft Prompt:**",
          "```",
          "Generate a LinkedIn post based on:",
          "Topic: {{topic}}",
          "Key points: {{key_points}}",
          "Tone: professional, educational",
          "Length: under 2700 characters",
          "Include:",
          "• Hook (first line)",
          "• Value/insight",
          "• Call to action",
          "• 3-5 relevant hashtags",
          "```",
          "**Module 3 — LinkedIn: Create Post**",
          "• Connect your LinkedIn account (via Make.com LinkedIn app)",
          "• Map the generated post text",
          "• Attach media if applicable (image, document)",
          "**Module 4 — Google Sheets: Update Row**",
          "• Mark Status as \"Posted\"",
          "• Set Date Posted to `{{now}}`",
          "**Step 4: Add Review Workflow (Optional but Recommended)**",
          "Instead of auto-posting, add an approval step:",
          "• Send draft via email/Slack for review",
          "• Add a \"Approved\" column in Google Sheets",
          "• Only post when Status = \"Reviewed\" AND Approved = \"Yes\""
        ]
      },
      {
        "heading": "LinkedIn Post Best Practices",
        "items": []
      },
      {
        "heading": "Common Issues and Fixes",
        "items": []
      },
      {
        "heading": "Extensions",
        "items": [
          "• **Multi-platform:** Add modules for Twitter/X, Threads, or Mastodon",
          "• **Image generation:** Add DALL-E or Stable Diffusion to create post visuals",
          "• **Analytics:** Track engagement per post and feed data back to improve prompts",
          "• **Content batching:** Generate a week of posts in one run, review together",
          "• **A/B testing:** Generate two variants per topic, test different hooks"
        ]
      },
      {
        "heading": "Key Takeaways",
        "items": [
          "• AI-generated content calendars save hours of planning",
          "• Make.com can bridge AI generation and social media APIs",
          "• Always include human review for brand-appropriate content",
          "• Start with LinkedIn, extend to other platforms",
          "• Track what works and iterate your prompts"
        ]
      },
      {
        "heading": "Resources",
        "items": [
          "• ChatGPT — Content ideation and drafting",
          "• Make.com — Automation workflow",
          "• Google Sheets — Content management",
          "• LinkedIn API — Publishing"
        ]
      },
      {
        "heading": "Further Practice",
        "items": [
          "• Generate a 30-day calendar for your personal brand or company",
          "• Build the auto-posting workflow",
          "• Add multi-platform support",
          "• Track engagement and build a feedback loop to improve content"
        ]
      }
    ]
  }
]

export const getTutorialById = (id: string): Tutorial | undefined =>
  tutorials.find((t) => t.id === id)
