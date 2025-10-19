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
          <div className="container mx-auto flex h-14 max-w-screen-2xl items-center">
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
          <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight">
              Tired of{' '}
              <span className="text-primary relative">
                bloated
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary/20 transform scale-x-0 hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              </span>{' '}
              productivity apps?
            </h1>
            <p className="max-w-[42rem] leading-relaxed text-muted-foreground sm:text-xl sm:leading-8 font-body">
              Minimind combines the power of Trello, task management, and encrypted notes 
              in one beautiful, secure, and offline-first app. No more switching between 
              a million different tools.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="premium" size="xl" asChild className="group">
                <Link href="/auth/signup">
                  Start Building Your Mind
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild className="group">
                <Link href="#features">
                  See How It Works
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl md:text-6xl tracking-tight">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="max-w-[85%] leading-relaxed text-muted-foreground sm:text-lg sm:leading-7 font-body">
              One app to replace them all. Clean, fast, and secure.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2 card-premium hover-lift group">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <CheckCircle className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold font-heading">Smart Boards</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    Organize projects with drag-and-drop boards. Cleaner than Trello, 
                    more powerful than sticky notes.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2 card-premium hover-lift group">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Zap className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold font-heading">Lightning Tasks</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    Capture ideas instantly. Minimalist task management that 
                    actually helps you get things done.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2 card-premium hover-lift group">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Shield className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold font-heading">Encrypted Notes</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    Your thoughts are private. End-to-end encryption ensures 
                    only you can read your notes.
                  </p>
                </div>
              </div>
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
              <Button variant="premium" size="xl" asChild className="group">
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