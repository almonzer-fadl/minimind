"use client";

import { useAuth, AuthGuard } from '@/lib/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, encryptData, decryptData } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const testEncryption = async () => {
    try {
      const testData = "This is a test message to encrypt";
      const encrypted = await encryptData(testData);
      const decrypted = await decryptData(encrypted);
      
      console.log('Original:', testData);
      console.log('Encrypted:', encrypted);
      console.log('Decrypted:', decrypted);
      
      alert(`Encryption test successful!\nOriginal: ${testData}\nDecrypted: ${decrypted}`);
    } catch (error) {
      console.error('Encryption test failed:', error);
      alert('Encryption test failed. Check console for details.');
    }
  };

  return (
    <AuthGuard>
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
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/90 backdrop-blur-xl shadow-sm">
          <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
            <div className="mr-4 flex">
              <Link href="/dashboard" className="mr-6 flex items-center group relative">
                <span className="font-bold text-xl text-gray-900 group-hover:text-gray-700 transition-colors duration-300 group-hover:scale-105">
                  Minimind
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></div>
              </Link>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  className="hover:bg-gray-100 text-gray-600 transition-all duration-300 hover:scale-105"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-tight text-gray-900 mb-6">
                Welcome back, {user?.name || user?.email?.split('@')[0]}
              </h1>
              <p className="text-xl text-gray-600 font-body max-w-2xl mx-auto">
                Your secure, encrypted productivity workspace is ready. 
                All your data is protected with end-to-end encryption.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {/* Boards Card */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 group animate-fade-in-up">
                <div className="flex h-[200px] flex-col justify-between p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Shield className="h-8 w-8 text-gray-700 group-hover:text-gray-900 transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold font-heading text-xl text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Boards</h3>
                    <p className="text-sm text-gray-600 font-body leading-relaxed group-hover:text-gray-500 transition-colors duration-300">
                      Organize your projects with secure, encrypted boards. 
                      Coming soon.
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Tasks Card */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 group animate-fade-in-up animation-delay-200">
                <div className="flex h-[200px] flex-col justify-between p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Zap className="h-8 w-8 text-gray-700 group-hover:text-gray-900 transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold font-heading text-xl text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Tasks</h3>
                    <p className="text-sm text-gray-600 font-body leading-relaxed group-hover:text-gray-500 transition-colors duration-300">
                      Lightning-fast task management with encryption. 
                      Coming soon.
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Notes Card */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 group animate-fade-in-up animation-delay-400">
                <div className="flex h-[200px] flex-col justify-between p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <Shield className="h-8 w-8 text-gray-700 group-hover:text-gray-900 transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold font-heading text-xl text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Notes</h3>
                    <p className="text-sm text-gray-600 font-body leading-relaxed group-hover:text-gray-500 transition-colors duration-300">
                      Private notes with end-to-end encryption. 
                      Coming soon.
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Encryption Test Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-8 shadow-lg">
              <h2 className="font-heading text-2xl text-gray-900 mb-4">Security Features</h2>
              <p className="text-gray-600 font-body mb-6">
                Your data is protected with client-side encryption. Test the encryption functionality:
              </p>
              <Button 
                onClick={testEncryption}
                className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Shield className="h-4 w-4 mr-2" />
                Test Encryption
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}