"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Eye, EyeOff} from 'lucide-react'
import { useToast } from "@/components/ui/use-toast" // Add this import
import axios from "axios" // Add this import if not already present

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function AddUserDialog({ open, onOpenChange }) {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPasswordFilled, setIsPasswordFilled] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values) {
    try {
      const token = localStorage.getItem('authToken')
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        username: values.username,
        email: values.email,
        password: values.password,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      toast({
        title: "Success!",
        description: "User created successfully.",
        variant: "default",
      })

      form.reset()
      onOpenChange(false)
      window.location.reload()
      
    } catch (error) {
      console.error('Error creating user:', error)
      toast({
        title: "Error!",
        description: error.response?.data?.message || "Failed to create user. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const password = form.watch("password")
    setIsPasswordFilled(password.length >= 1)
  }, [form.watch("password")])


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto  border-gray-800  p-0">
        <DialogHeader className="relative px-6 py-4">
        
          <DialogTitle className="text-xl font-semibold">Add New User</DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Create new user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6">
            <div className="space-y-3 py-2">
          
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <FormLabel className=" text-sm text-right">Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="john_doe" 
                        {...field}
                        className=" border border-gray-200 dark:border-gray-800 h-9 text-sm  placeholder:text-gray-500" 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <FormLabel className=" text-sm text-right">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="john.doe@gmail.com" 
                        type="email" 
                        {...field}
                        className="border border-gray-200 dark:border-gray-800 h-9 text-sm  placeholder:text-gray-500" 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
      
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <FormLabel className="text-sm text-right">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="e.g., S3cur3P@ssw0rd"
                          {...field}
                          className="border border-gray-200 dark:border-gray-800 h-9 text-sm  placeholder:text-gray-500 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-2 py-1 hover:bg-transparent text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <FormLabel className=" text-sm text-right">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="e.g., S3cur3P@ssw0rd"
                          {...field}
                          disabled={!isPasswordFilled}
                          className={`  h-9 text-sm border border-gray-200 dark:border-gray-800 placeholder:text-gray-500 pr-10 ${
                            !isPasswordFilled ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-2 py-1 hover:bg-transparent text-gray-400"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={!isPasswordFilled}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4 flex justify-end py-4 bg-opacity-20">
              <Button 
                type="submit" 
                className="h-9 px-4 text-sm dark:bg-white dark:text-black hover:bg-gray-800 bg-black text-white dark:hover:bg-gray-200"
              >
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

