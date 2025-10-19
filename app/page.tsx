import { ThemeProvider } from '@/lib/theme/theme-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Shield, Zap, Smartphone, Laptop, Globe } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="minimind-theme">
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <div className="mr-4 flex">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-primary"></div>
                <span className="font-bold text-xl">Minimind</span>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="w-full flex-1 md:w-auto md:flex-none">
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    Features
                  </Link>
                  <Link href="#security" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    Security
                  </Link>
                  <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
                    Pricing
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Tired of{' '}
              <span className="text-primary">bloated</span>{' '}
              productivity apps?
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Minimind combines the power of Trello, task management, and encrypted notes 
              in one beautiful, secure, and offline-first app. No more switching between 
              a million different tools.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Start Building Your Mind
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">
                  See How It Works
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Everything you need, nothing you don't
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              One app to replace them all. Clean, fast, and secure.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Smart Boards</h3>
                  <p className="text-sm text-muted-foreground">
                    Organize projects with drag-and-drop boards. Cleaner than Trello, 
                    more powerful than sticky notes.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Lightning Tasks</h3>
                  <p className="text-sm text-muted-foreground">
                    Capture ideas instantly. Minimalist task management that 
                    actually helps you get things done.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Encrypted Notes</h3>
                  <p className="text-sm text-muted-foreground">
                    Your thoughts are private. End-to-end encryption ensures 
                    only you can read your notes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Your data, your control
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Built with privacy-first principles. Your data is encrypted, 
              and we can't even read it.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem]">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">End-to-End Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    All your data is encrypted on your device before it ever 
                    leaves your browser. We can't read your notes, tasks, or boards.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">Offline-First</h3>
                  <p className="text-sm text-muted-foreground">
                    Works everywhere, even without internet. Your data syncs 
                    automatically when you're back online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-Platform Section */}
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Works everywhere you do
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              One app, all your devices. Install on your phone, tablet, or desktop.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-3 md:max-w-[64rem]">
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6">
              <Smartphone className="h-12 w-12 text-primary" />
              <h3 className="font-bold">Mobile</h3>
              <p className="text-sm text-muted-foreground text-center">
                Install as a PWA on iOS and Android. 
                Works just like a native app.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6">
              <Laptop className="h-12 w-12 text-primary" />
              <h3 className="font-bold">Desktop</h3>
              <p className="text-sm text-muted-foreground text-center">
                Works on Windows, Mac, and Linux. 
                Install from your browser.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6">
              <Globe className="h-12 w-12 text-primary" />
              <h3 className="font-bold">Web</h3>
              <p className="text-sm text-muted-foreground text-center">
                Access from any modern browser. 
                No downloads required.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Ready to simplify your productivity?
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Join thousands of users who've ditched their bloated productivity apps 
              for something that actually works.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Start Building Your Mind
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-primary"></div>
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
    </ThemeProvider>
  );
}