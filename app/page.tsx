import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
              <Link href="/sign-up">
                 <Button size="lg">
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="container mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Organize Your Applications</h2>
              <p>
                Create a centralized hub for all your job applications. Easily add new applications, update their status, and keep track of important details like company name, position, and application date.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Track Application Status</h2>
              <p>
                Stay on top of your job search by tracking the status of each application. Whether it's "Applied," "Interviewing," or "Offer Received," you'll always know where you stand with each opportunity.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Never Miss a Follow-Up</h2>
              <p>
                Set reminders for follow-ups and important dates. Whether it's sending a thank-you email after an interview or following up on an application, our app helps you stay organized and proactive in your job search.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
