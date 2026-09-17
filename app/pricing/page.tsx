import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Pricing — LVAI Academy",
  description:
    "Simple plans for learning AI building: Free to start, Pro for serious builders, Team for companies.",
};

type Tier = {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  cta: string;
  featured?: boolean;
  features: string[];
};

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Everything you need to start vibe coding.",
    cta: "Start free",
    features: [
      "All free courses & tool guides",
      "One-click enrollment",
      "Hands-on labs (fair use)",
      "The Weekly Vibe newsletter",
      "Verifiable certificates",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "per month",
    blurb: "For builders going from idea to launched.",
    cta: "Start free",
    featured: true,
    features: [
      "Everything in Free",
      "All Pro courses & advanced playbooks",
      "In-lesson AI tutor",
      "Priority lab sandbox + auto-grading",
      "LinkedIn-ready certificates (PDF)",
      "Email support",
    ],
  },
  {
    name: "Team",
    price: "$49",
    cadence: "per month",
    blurb: "Upskill your whole team on AI building.",
    cta: "Start free",
    features: [
      "Everything in Pro",
      "5 seats included (+$9/seat/mo)",
      "Team progress dashboard & reporting",
      "Assigned learning paths",
      "Admin roles & member management",
      "Priority support + onboarding call",
    ],
  },
];

const FAQS = [
  {
    q: "Is the Free plan really free?",
    a: "Yes. Courses, guides, labs, and certificates on the Free plan cost nothing — no credit card required. Paid plans unlock advanced courses, the AI tutor, and team features.",
  },
  {
    q: "When does paid billing start?",
    a: "Paid checkout is coming in Phase 2. Today you can create a free account and start learning immediately; we'll notify you when Pro and Team billing goes live.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. Upgrades and downgrades will be self-serve from your account once billing launches. Downgrading keeps your progress and certificates — you only lose access to Pro-only content.",
  },
  {
    q: "What counts as a Team seat?",
    a: "One seat is one learner on your team. The Team plan includes 5 seats; add more at $9/seat/month. Admins can reassign seats as people join or leave.",
  },
  {
    q: "Do you offer education or nonprofit pricing?",
    a: "Not yet, but it's on the roadmap. Contact us once billing launches and we'll work something out.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free. Upgrade when you're shipping."
          description="Learn the fundamentals for free, then unlock the advanced playbooks, AI tutor, and team tools when you're ready to go further."
        />

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-slate-400">
          Launch pricing shown — subject to change before paid billing goes live.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={`flex flex-col p-8 ${
                tier.featured
                  ? "border-navy-900 ring-2 ring-navy-900/10"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy-900">{tier.name}</h2>
                {tier.featured && (
                  <Badge className="bg-navy-900 text-white">Most popular</Badge>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight text-navy-900">
                  {tier.price}
                </span>
                <span className="text-sm text-slate-500">/ {tier.cadence}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{tier.blurb}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-bold text-navy-900"
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href="/signup"
                variant={tier.featured ? "primary" : "outline"}
                size="md"
                className="mt-8 w-full"
              >
                {tier.cta}
              </Button>
            </Card>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-500">
          Checkout arrives in Phase 2: create your free account now and we&apos;ll
          let you know when Pro and Team billing opens.
        </p>

        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-navy-900">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-4">
            {FAQS.map((faq) => (
              <Card key={faq.q} className="p-6">
                <h3 className="text-base font-semibold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
