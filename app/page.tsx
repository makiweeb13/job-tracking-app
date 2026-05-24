import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <main className="flex-1">
        <section className="container mx-auto">
          <div>
            <h1 className="text-4xl font-bold">Track your job applications</h1>
            <p className="mt-4 text-accent-foreground">
              Keep all your job applications organized in one place. Easily track
              the status of each application and never miss a follow-up.
            </p>
            <div className="mt-6">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
