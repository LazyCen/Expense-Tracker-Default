import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Label, cn } from '../components/ui';
import { useExpenseStore } from '../store/ExpenseContext';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, signUp } = useExpenseStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);

  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from?: string }).from !== '/login'
      ? (location.state as { from: string }).from
      : '/';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = isSignUp
      ? signUp(email, password, displayName)
      : login(email, password);
    if (!result.ok) {
      setError(result.message ?? 'Something went wrong.');
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left Panel (Branding) */}
      <div className="relative hidden w-1/2 lg:flex flex-col justify-between overflow-hidden bg-gray-900 px-12 pt-12 pb-24">
        {/* Background Gradient Image */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
          <img
            src="https://images.unsplash.com/photo-1679193559894-5e27935d00c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1pbmltYWwlMjBncmFkaWVudCUyMGJsdWV8ZW58MXx8fHwxNzc0OTE1MzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Abstract minimal gradient blue"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Abstract Overlays */}
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-[120px]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Smart Expense
          </span>
        </div>

        <div className="relative z-10 max-w-md mt-auto">
          <h1 className="text-4xl font-bold tracking-tight text-white leading-tight mb-4">
            Track your money smartly
          </h1>
          <p className="text-lg text-gray-300 font-medium">
            Take control of your finances with intelligent insights and beautiful analytics.
          </p>
        </div>
      </div>

      {/* Right Panel (Form Card) */}

      <div className="flex w-full flex-col items-center justify-center px-4 sm:px-12 lg:w-1/2 bg-gray-50 lg:bg-white">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-8 left-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Smart Expense</span>
        </div>

        <div className="w-full max-w-[400px] space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-gray-200/50 lg:shadow-none lg:bg-transparent lg:p-0 border border-gray-100 lg:border-none">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {isSignUp ? 'Create account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {isSignUp
                ? 'Your data stays on this device in your browser.'
                : 'Enter your credentials to access your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? (
              <p
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <div className="space-y-4">
              {isSignUp ? (
                <div className="space-y-1">
                  <Label htmlFor="name">Display name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jhon Vincent "
                    autoComplete="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
              ) : null}
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cenpogi@example.com"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>

                 <div className="relative w-full">
              <Input
                type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="pr-10"
                />

                <button
                 type="button"
                 onClick={toggleVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            </div>
          </div>
            </div>

            {!isSignUp ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 block"
                  >
                    Remember me
                  </label>
                </div>
              </div>
            ) : null}

            <Button type="submit" className="w-full" size="lg">
              {isSignUp ? 'Create account' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 font-medium">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              className={cn(
                'font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all',
              )}
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
            >
              {isSignUp ? 'Login' : 'Create Account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
