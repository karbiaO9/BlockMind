import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  History,
  Target,
  Code,
  Cpu,
  LineChart,
  Network,
} from "lucide-react";

const teamMembers = [
  {
    name: "Bilel Bzeouich",
    role: "Founder & CEO",
    bio: "Full Stack Developer | Next.js | Blockchain | API Integration | Smart Contract Developer",
    image:
      "https://media.licdn.com/dms/image/v2/D4E03AQEDejyKR_UvSA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723943774314?e=1744848000&v=beta&t=9Q_QQ7FGJrjzQNXgq2rAu6iuDgVtk4d3FzF_J2W1w-g",
  },
  {
    name: "Aziz Sayadi",
    role: "Lead Data Scientist",
    bio: "AI & Data Science Student | Google Developer Groups On Campus Organizer | DataCamp Student Ambassador",
    image:
      "https://media.licdn.com/dms/image/v2/D4E03AQEHyzWN3KaPKw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707949144881?e=1744848000&v=beta&t=irG19w1CxIEPEH9s2mjN-qnSK9aRixSxDBtdRChZbbg",
  },
  {
    name: "Wessim Meddeb",
    role: "Head of Engineering",
    bio: "Experienced software architect specializing in scalable blockchain solutions.",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQFxaZbe1f9Puw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1705833327296?e=1744848000&v=beta&t=Bim0iYOeJf6OJyroBQRmViF2WmmlZuxSuDFexq119mQ",
  },
  {
    name: "karbia oussema",
    role: "social media manager & content creator & community manager",
    bio: "Software engineering student at EPI DIGITAL School",
    image:
      "https://media.licdn.com/dms/image/v2/C4E03AQHg4_71vuWt8w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1661261865657?e=1744848000&v=beta&t=wBKHMtwA5moxKwgd5zgIYOJxlaEDfmEvL4zh1e3fG_c",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="mb-20">
        <Badge className="mb-4" variant="secondary">
          About Us
        </Badge>
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
          Building the Future of{" "}
          <span className="text-primary">Blockchain Analytics</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
          We're a team of blockchain enthusiasts, data scientists, and
          developers working to make cryptocurrency analysis accessible and
          insightful.
        </p>
      </section>

      {/* Services Section */}
      <section className="mb-20">
        <h2 className="mb-8 text-3xl font-bold">Our Services</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <ServiceCard
            icon={Network}
            title="Transaction Analysis"
            description="Advanced blockchain transaction monitoring and analysis to track fund flows and identify patterns."
            features={[
              "Real-time transaction monitoring",
              "Pattern recognition",
              "Wallet profiling",
              "Flow visualization",
            ]}
          />
          <ServiceCard
            icon={LineChart}
            title="Price Prediction"
            description="AI-powered price forecasting using advanced machine learning models and market data."
            features={[
              "Machine learning models",
              "Market trend analysis",
              "Historical data processing",
              "Accuracy metrics",
            ]}
          />
          <ServiceCard
            icon={Code}
            title="API Integration"
            description="Robust API solutions for integrating our analytics into your existing systems."
            features={[
              "RESTful API access",
              "WebSocket support",
              "Custom endpoints",
              "Developer documentation",
            ]}
          />
          <ServiceCard
            icon={Cpu}
            title="AI Solutions"
            description="Custom AI solutions for blockchain analysis and market prediction."
            features={[
              "Custom model training",
              "Pattern detection",
              "Anomaly detection",
              "Predictive analytics",
            ]}
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-20">
        <h2 className="mb-8 text-3xl font-bold">Our Mission</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <MissionCard
            icon={Shield}
            title="Security First"
            description="Ensuring the highest standards of security in blockchain analysis"
          />
          <MissionCard
            icon={Users}
            title="Community Driven"
            description="Building tools that serve the needs of our diverse user base"
          />
          <MissionCard
            icon={History}
            title="Innovation"
            description="Constantly evolving our technology to stay ahead of the curve"
          />
          <MissionCard
            icon={Target}
            title="Accuracy"
            description="Delivering precise and reliable analytics you can trust"
          />
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Team</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <TeamMember
              key={member.name}
              name={member.name}
              role={member.role}
              bio={member.bio}
              image={member.image}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="rounded-2xl bg-muted/50 py-16">
        <div className="container">
          <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            <StatCard number="10M+" label="Transactions Analyzed" />
            <StatCard number="50k+" label="Active Users" />
            <StatCard number="99.9%" label="Uptime" />
            <StatCard number="24/7" label="Support" />
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({
  icon: Icon,
  title,
  description,
  features,
}: {
  icon: any;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col pt-6">
        <Icon className="mb-4 h-8 w-8 text-primary" />
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="mb-4 text-muted-foreground">{description}</p>
        <ul className="mt-auto space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center text-sm">
              <Shield className="mr-2 h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function MissionCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Icon className="mb-4 h-8 w-8 text-primary" />
        <h3 className="mb-2 font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function TeamMember({
  name,
  role,
  bio,
  image,
}: {
  name: string;
  role: string;
  bio: string;
  image: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-background p-6 shadow-md transition-all hover:shadow-lg">
      <div className="mb-4 aspect-square overflow-hidden rounded-full">
        <Image
          src={image}
          alt={name}
          width={300}
          height={300}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <h3 className="mb-1 text-xl font-semibold">{name}</h3>
      <p className="mb-3 text-sm font-medium text-primary">{role}</p>
      <p className="text-sm text-muted-foreground">{bio}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="mb-2 text-3xl font-bold text-primary">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
