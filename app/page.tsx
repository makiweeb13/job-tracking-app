import { Button } from "@/components/ui/button";
import { Activity, ArrowRight, Bell, Layout } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
          {/* Subtle Background Glow */}
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75" />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Track your job applications <span className="text-primary">seamlessly</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Stop using messy spreadsheets. Keep all your applications organized in one place, 
              track statuses in real-time, and land your dream job faster.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/sign-up">
                <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                  Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features" className="text-sm font-semibold leading-6 text-slate-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layout className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Organize Everything</h2>
              <p className="text-slate-600 leading-relaxed">
                Create a centralized hub for all your applications. Add details like salary, 
                company notes, and position links in seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Activity className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Visual Pipelines</h2>
              <p className="text-slate-600 leading-relaxed">
                Stay on top of your search with status tracking. Move applications from 
                "Applied" to "Interviewing" with one click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Bell className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Smart Reminders</h2>
              <p className="text-slate-600 leading-relaxed">
                Never miss a follow-up. Set reminders for thank-you emails and interview 
                dates to stay proactive and professional.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
