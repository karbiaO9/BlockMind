import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <>
      <Link href="/" className="inline-block m-4">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>
      <div className="min-h-screen flex items-center justify-center py-3 ">
        <div className="container max-w-4xl space-y-16">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-12">
            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Introduction</h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                At BlockMind, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our blockchain analytics platform.
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">
                Information We Collect
              </h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Personal Information</h3>
                  <ul className="space-y-2 list-none p-0">
                    <li>Email address</li>
                    <li>Wallet addresses</li>
                    <li>Usage data and preferences</li>
                    <li>Information provided through customer support</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Technical Information</h3>
                  <ul className="space-y-2 list-none p-0">
                    <li>IP addresses</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Usage statistics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">
                How We Use Your Information
              </h2>
              <ul className="space-y-2 list-none p-0 max-w-2xl mx-auto">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>
                  To gather analysis or valuable information to improve our
                  service
                </li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Data Security</h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                We implement appropriate security measures to protect against
                unauthorized access, alteration, disclosure, or destruction of
                your information. However, no method of transmission over the
                Internet is 100% secure.
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">
                Third-Party Services
              </h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                We may employ third-party companies and individuals to
                facilitate our service, provide service-related services, or
                assist us in analyzing how our service is used. These third
                parties have access to your personal information only to perform
                these tasks on our behalf.
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Your Rights</h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                You have the right to:
              </p>
              <ul className="space-y-2 list-none p-0 max-w-2xl mx-auto">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Cookies</h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                We use cookies and similar tracking technologies to track
                activity on our service and hold certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">
                Children's Privacy
              </h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                Our service does not address anyone under the age of 18. We do
                not knowingly collect personally identifiable information from
                anyone under the age of 18.
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">
                Changes to This Privacy Policy
              </h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="space-y-2 list-none p-0 max-w-2xl mx-auto">
                <li>By email: privacy@blockmind.com</li>
                <li>Through our support portal</li>
              </ul>
            </section>
          </div>

          <div className="border-t pt-8">
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              This privacy policy is effective as of{" "}
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>{" "}
              and will remain in effect except with respect to any changes in
              its provisions in the future.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
