import Hero from "@/components/hero"
import Features from "@/components/features"
import NewsletterFeature from "@/components/newsletter-feature"
import LatestVideos from "@/components/latest-videos"
import PopularTools from "@/components/popular-tools"
import CallToAction from "@/components/call-to-action"
import FeaturedArticle from "@/components/featured-article"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <Hero />
      <Features />
      <FeaturedArticle />
      <LatestVideos />
      <PopularTools />
      <NewsletterFeature />
      <CallToAction />
    </div>
  )
}
