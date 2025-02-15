import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TermsPage() {
  return (
    <>
      <Link href="/" className="inline-block m-4">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>
      <div className="min-h-screen flex items-center justify-center py-3">
        <div className="container max-w-4xl space-y-16">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-12">
            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">
                Agreement to Terms
              </h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                By accessing or using BlockMind's services, you agree to be
                bound by these Terms of Service. If you disagree with any part
                of the terms, you may not access our services.
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Use of Services</h2>
              <div className="space-y-6 max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed">
                  Our services are provided "as is" and are intended to be used
                  for blockchain analytics and market analysis purposes only.
                </p>
                <ul className="space-y-2 list-none p-0 text-lg">
                  <li>You must be at least 18 years old to use our services</li>
                  <li>
                    You are responsible for maintaining the security of your
                    account
                  </li>
                  <li>
                    You agree not to misuse or attempt to disrupt our services
                  </li>
                  <li>
                    You must not use our services for any illegal purposes
                  </li>
                </ul>
              </div>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">
                Account Registration
              </h2>
              <div className="space-y-4 max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed">
                  To access certain features, you may need to register for an
                  account. You agree to:
                </p>
                <ul className="space-y-2 list-none p-0 text-lg">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain and update your information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us of any unauthorized account access</li>
                </ul>
              </div>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">
                Intellectual Property
              </h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                The service and its original content, features, and
                functionality are owned by BlockMind and are protected by
                international copyright, trademark, and other intellectual
                property laws.
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Payment Terms</h2>
              <div className="space-y-4 max-w-3xl mx-auto">
                <p className="text-lg leading-relaxed">For paid services:</p>
                <ul className="space-y-2 list-none p-0 text-lg">
                  <li>
                    Payments are processed securely through our payment
                    providers
                  </li>
                  <li>
                    Subscriptions will automatically renew unless cancelled
                  </li>
                  <li>Refunds are handled according to our refund policy</li>
                  <li>Prices may be subject to change with notice</li>
                </ul>
              </div>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">
                Limitation of Liability
              </h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                BlockMind shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use or inability to use the service.
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Termination</h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                We may terminate or suspend your account and access to the
                service immediately, without prior notice, for conduct that we
                believe violates these Terms or is harmful to other users, us,
                or third parties, or for any other reason.
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Changes to Terms</h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                We reserve the right to modify or replace these Terms at any
                time. If a revision is material, we will provide at least 30
                days' notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="space-y-2 list-none p-0 max-w-2xl mx-auto text-lg">
                <li>By email: legal@blockmind.com</li>
                <li>Through our support portal</li>
              </ul>
            </section>
          </div>

          <div className="border-t pt-8">
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              These terms of service are effective as of{" "}
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
