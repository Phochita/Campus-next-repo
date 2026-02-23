'use client'

import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      toast.success('Login Successful!', {
        description: 'Welcome back!',
      })

      // Auto-redirect after success
      setTimeout(() => {
        window.location.href = '/profile'
      }, 1500)

      form.reset()
    } catch (error: any) {
      toast.error('Login failed', {
        description: error.message || 'Invalid email or password.',
      })
      console.error('Login error:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-200">
        {/* Avatar/user icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500">Please sign in to continue</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Email address"
                        className="pl-10 h-12 bg-gray-50 border-gray-300 rounded-lg focus-visible:ring-blue-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="pl-10 pr-10 h-12 bg-gray-50 border-gray-300 rounded-lg focus-visible:ring-blue-500"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-gray-300 data-[state=checked]:bg-blue-600" />
                <label htmlFor="remember" className="text-gray-600 cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Sign in button */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>

        {/* OR divider */}
        <div className="relative my-6">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">OR CONTINUE WITH</span>
          </div>
        </div>

        {/* Google & Facebook buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-12 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 transition-colors"
          >
            <div className="relative h-5 w-5 shrink-0">
              <Image
                src="/images/google-g.svg"
                alt="Google"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-medium text-gray-700">Google</span>
          </Button>

          <Button
            variant="outline"
            className="h-12 border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 transition-colors"
          >
            <div className="relative h-5 w-5 shrink-0">
              <Image
                src="/images/facebook-f.svg"
                alt="Facebook"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-medium text-gray-700">Facebook</span>
          </Button>
        </div>

        {/* Sign up link */}
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  )
}
