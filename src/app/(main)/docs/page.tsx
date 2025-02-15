import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container max-w-3xl text-center space-y-8">
        <div className="rounded-full bg-primary/10 w-16 h-16 mx-auto flex items-center justify-center">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Documentation Coming Soon
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're working hard to create comprehensive documentation for BlockMind. Check back soon!
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground">
            Our documentation will include detailed guides, API references, and best practices for using BlockMind's analytics tools.
          </p>
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 