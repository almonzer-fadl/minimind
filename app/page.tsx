import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Shield, Zap, Smartphone, Laptop, Globe } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gray-200/30 rounded-full filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-gray-300/20 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-gray-200/25 rounded-full filter blur-3xl opacity-35 animate-blob animation-delay-4000"></div>
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/20 to-transparent animate-pulse"></div>
        </div>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/90 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
            <div className="mr-4 flex">
              <Link href="/" className="mr-6 flex items-center group relative">
                <span className="font-bold text-xl text-gray-900 group-hover:text-gray-700 transition-all duration-300 group-hover:scale-105">
                  Minimind
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></div>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="w-full flex-1 md:w-auto md:flex-none">
                <nav className="flex items-center space-x-8 text-sm font-medium">
                  <Link href="#features" className="relative transition-all duration-300 hover:text-gray-900 text-gray-500 hover:scale-105 group">
                    <span>Features</span>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></div>
                  </Link>
                  <Link href="#security" className="relative transition-all duration-300 hover:text-gray-900 text-gray-500 hover:scale-105 group">
                    <span>Security</span>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></div>
                  </Link>
                  <Link href="#pricing" className="relative transition-all duration-300 hover:text-gray-900 text-gray-500 hover:scale-105 group">
                    <span>Pricing</span>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></div>
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild className="hover:bg-gray-100 text-gray-600 transition-all duration-300 hover:scale-105">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative space-y-12 pb-16 pt-12 md:pb-20 md:pt-16 lg:py-32 overflow-hidden">
          <div className="container mx-auto flex max-w-5xl flex-col items-center gap-10 text-center px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in-up">
              <span className="mr-3 h-2 w-2 rounded-full bg-gray-400 animate-pulse"></span>
              Available on all platforms
            </div>
            
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-gray-900 animate-fade-in-up animation-delay-200">
              Tired of{' '}
              <span className="relative inline-block group">
                <span className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent transition-all duration-500 group-hover:from-gray-900 group-hover:to-gray-700">
                  bloated
                </span>
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-700 ease-out rounded-full"></span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700/10 to-gray-900/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </span>{' '}
              productivity apps?
            </h1>
            <p className="max-w-3xl leading-relaxed text-gray-600 sm:text-xl sm:leading-9 font-body animate-fade-in-up animation-delay-400">
              Minimind combines the power of Trello, task management, and encrypted notes 
              in one beautiful, secure, and offline-first app. No more switching between 
              a million different tools.
            </p>
            <div className="flex flex-col gap-6 sm:flex-row sm:justify-center animate-fade-in-up animation-delay-600">
              <Button size="lg" asChild className="group bg-gray-900 hover:bg-gray-800 text-white shadow-xl hover:shadow-2xl px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <Link href="/auth/signup">
                  Start Building Your Mind
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="group border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 px-10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <Link href="#features">
                  See How It Works
                  <span className="ml-3 text-lg group-hover:translate-x-2 transition-transform duration-300">→</span>
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Hero Background Animation */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-gray-200/20 via-gray-300/10 to-gray-200/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto space-y-12 py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center space-y-8 text-center">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in-up">
              ✨ Features
            </div>
            <h2 className="font-heading text-4xl leading-[1.1] sm:text-5xl md:text-6xl tracking-tight text-gray-900 animate-fade-in-up animation-delay-200">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="max-w-3xl leading-relaxed text-gray-600 sm:text-xl sm:leading-8 font-body animate-fade-in-up animation-delay-400">
              One app to replace them all. Clean, fast, and secure.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl">
            <div className="relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 group animate-fade-in-up animation-delay-600">
              <div className="flex h-[200px] flex-col justify-between p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <CheckCircle className="h-8 w-8 text-gray-700 group-hover:text-gray-900 transition-all duration-300 group-hover:scale-110" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold font-heading text-xl text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Smart Boards</h3>
                  <p className="text-sm text-gray-600 font-body leading-relaxed group-hover:text-gray-500 transition-colors duration-300">
                    Organize projects with drag-and-drop boards. Cleaner than Trello, 
                    more powerful than sticky notes.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 group animate-fade-in-up animation-delay-800">
              <div className="flex h-[200px] flex-col justify-between p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Zap className="h-8 w-8 text-gray-700 group-hover:text-gray-900 transition-all duration-300 group-hover:scale-110" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold font-heading text-xl text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Lightning Tasks</h3>
                  <p className="text-sm text-gray-600 font-body leading-relaxed group-hover:text-gray-500 transition-colors duration-300">
                    Capture ideas instantly. Minimalist task management that 
                    actually helps you get things done.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 group animate-fade-in-up animation-delay-1000">
              <div className="flex h-[200px] flex-col justify-between p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Shield className="h-8 w-8 text-gray-700 group-hover:text-gray-900 transition-all duration-300 group-hover:scale-110" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold font-heading text-xl text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Encrypted Notes</h3>
                  <p className="text-sm text-gray-600 font-body leading-relaxed group-hover:text-gray-500 transition-colors duration-300">
                    Your thoughts are private. End-to-end encryption ensures 
                    only you can read your notes.
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl md:text-6xl tracking-tight">
              Your data, your control
            </h2>
            <p className="max-w-[85%] leading-relaxed text-muted-foreground sm:text-lg sm:leading-7 font-body">
              Built with privacy-first principles. Your data is encrypted, 
              and we can&apos;t even read it.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem]">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2 card-premium hover-lift group">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors duration-300">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold font-heading">End-to-End Encryption</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    All your data is encrypted on your device before it ever 
                    leaves your browser. We can&apos;t read your notes, tasks, or boards.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2 card-premium hover-lift group">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold font-heading">Offline-First</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    Works everywhere, even without internet. Your data syncs 
                    automatically when you&apos;re back online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-Platform Section */}
        <section className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl md:text-6xl tracking-tight">
              Works everywhere you do
            </h2>
            <p className="max-w-[85%] leading-relaxed text-muted-foreground sm:text-lg sm:leading-7 font-body">
              One app, all your devices. Install on your phone, tablet, or desktop.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-3 md:max-w-[64rem]">
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 card-premium hover-lift group">
              <Smartphone className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-bold font-heading">Mobile</h3>
              <p className="text-sm text-muted-foreground text-center font-body leading-relaxed">
                Install as a PWA on iOS and Android. 
                Works just like a native app.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 card-premium hover-lift group">
              <Laptop className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-bold font-heading">Desktop</h3>
              <p className="text-sm text-muted-foreground text-center font-body leading-relaxed">
                Works on Windows, Mac, and Linux. 
                Install from your browser.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 card-premium hover-lift group">
              <Globe className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-bold font-heading">Web</h3>
              <p className="text-sm text-muted-foreground text-center font-body leading-relaxed">
                Access from any modern browser. 
                No downloads required.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl md:text-6xl tracking-tight">
              Ready to simplify your productivity?
            </h2>
            <p className="max-w-[85%] leading-relaxed text-muted-foreground sm:text-lg sm:leading-7 font-body">
              Join thousands of users who&apos;ve ditched their bloated productivity apps 
              for something that actually works.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="default" size="lg" asChild className="group">
                <Link href="/auth/signup">
                  Start Building Your Mind
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-6 md:py-0">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold">Minimind</span>
              </div>
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built with privacy-first principles. Your data, your control.
              </p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/support" className="hover:text-foreground">
                Support
              </Link>
            </div>
        </div>
      </footer>
    </div>
  );
}