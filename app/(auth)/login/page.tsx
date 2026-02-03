'use client'  // ← This tells Next.js: "This page must run in the browser (client-side)"
             //   Why? Because we use React hooks like useState, useForm — they only work on client
import Image from 'next/image';

import { useState } from 'react'  // ← React hook to remember if password is visible or hidden
import Link from 'next/link'       // ← Next.js fast link (no page reload when clicking "Sign up")
import { zodResolver } from '@hookform/resolvers/zod'   // ← Connects Zod validation to form
import { useForm } from 'react-hook-form'                // ← Main form manager (remembers values, errors, submit)
import * as z from 'zod'                                 // ← Library to define form rules (email valid, password long enough)
import { toast } from 'sonner'                           // ← Nice popup messages (success/error)
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'  // ← Icons from Lucide (free icon library)


import { Button } from '@/components/ui/button'          // ← shadcn/ui beautiful button
import { Checkbox } from '@/components/ui/checkbox'      // ← shadcn/ui checkbox for "Remember me"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'                             // ← shadcn/ui form helpers (makes inputs + errors nice)
import { Input } from '@/components/ui/input'             // ← shadcn/ui input field
import { Separator } from '@/components/ui/separator'     // ← thin line for "OR CONTINUE WITH"

const formSchema = z.object({  // ← These are the RULES for the form
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

export default function LoginPage() {
  // Local state to toggle show/hide password (eye icon)
  const [showPassword, setShowPassword] = useState(false)

  // Create form manager with our rules + empty starting values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),  // ← Connect Zod rules so errors show automatically
    defaultValues: { email: '', password: '' },
  })

  // This function runs ONLY when form is valid (all rules passed)
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Show nice popup message
    toast.success('Login Successful!', { description: 'Welcome back!' })
    console.log('Login submitted:', values)  // See data in browser console (F12)

    // Later here: real login (send to server, save token, redirect...)
  }

  // ────────────────────────────────────────────────────────────────
  // MAIN RETURN — this is what the user sees on screen
  // ────────────────────────────────────────────────────────────────
  return (
    // ─── Centered card layout ──────────────────────────────────────
    // min-h-screen → full height of screen
    // flex + items-center + justify-center → center child (the card) perfectly
    // bg-gray-50 → light gray background
    // px-4 → small padding on sides (good for mobile)
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      {/* The white card itself */}
      {/* w-full max-w-md → max width 448px, full on small screens */}
      {/* rounded-2xl → big rounded corners */}
      {/* shadow-xl → strong shadow for depth */}
      {/* p-8 → big inner padding */}
      {/* space-y-8 → vertical spacing between sections */}
      {/* border border-gray-200 → subtle gray border */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-gray-200">

        {/* ─── Avatar/user icon at the top ───────────────────────────── */}
        {/* flex justify-center → center horizontally */}
        <div className="flex justify-center">
          {/* Circle background + icon in center */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />  {/* User icon from Lucide */}
          </div>
        </div>

        {/* ─── Title section ──────────────────────────────────────────── */}
        {/* text-center → center text */}
        {/* space-y-2 → small gap between title and subtitle */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500">Please sign in to continue</p>
        </div>

        {/* ─── The form starts here ───────────────────────────────────── */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* ─── Email field with envelope icon ────────────────────── */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* sr-only → hidden label for screen readers (accessibility) */}
                  <FormLabel className="sr-only">Email address</FormLabel>
                  <FormControl>
                    {/* relative → lets us position icon inside input */}
                    <div className="relative">
                      {/* Icon on left inside input */}
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Email address"
                        className="pl-10 h-12 bg-gray-50 border-gray-300 rounded-lg focus-visible:ring-blue-500"
                        {...field}  // ← connects input to form state
                      />
                    </div>
                  </FormControl>
                  {/* FormMessage shows red error automatically if email invalid */}
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            {/* ─── Password field with lock + eye toggle ──────────────── */}
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
                        type={showPassword ? 'text' : 'password'}  // ← toggle type
                        placeholder="Password"
                        className="pl-10 pr-10 h-12 bg-gray-50 border-gray-300 rounded-lg focus-visible:ring-blue-500"
                        {...field}
                      />
                      {/* Eye button to show/hide password */}
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

            {/* ─── Remember me checkbox + Forgot password link ───────── */}
            {/* flex items-center justify-between → left & right layout */}
            <div className="flex items-center justify-between text-sm">
              {/* Checkbox + label */}
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-gray-300 data-[state=checked]:bg-blue-600" />
                <label htmlFor="remember" className="text-gray-600 cursor-pointer">
                  Remember me
                </label>
              </div>
              {/* Link to forgot page (you can create /forgot-password later) */}
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* ─── Big sign-in button ──────────────────────────────────── */}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md"
              disabled={form.formState.isSubmitting}  // ← disable while submitting
            >
              {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>

        {/* ─── Divider "OR CONTINUE WITH" ────────────────────────────── */}
        {/* relative my-6 → spacing around */}
        <div className="relative my-6">
          <Separator />  {/* horizontal line */}
          {/* Absolute positioned text on top of line */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">OR CONTINUE WITH</span>
          </div>
        </div>

        {/* ─── Google & Facebook buttons (real logos — no download needed) ──────────────── */}
        <div className="grid grid-cols-2 gap-4">
  {/* Google Button */}
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
        priority
      />
    </div>
    <span className="font-medium text-gray-700">Google</span>
  </Button>

  {/* Facebook Button */}
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
        priority
      />
    </div>
    <span className="font-medium text-gray-700">Facebook</span>
  </Button>
</div>

        {/* ─── Sign up link at bottom ────────────────────────────────── */}
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
