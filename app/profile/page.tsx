"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormField } from "@/components/forms/form-field"
import { useFormik } from "formik"
import * as Yup from "yup"
import toast from "react-hot-toast"
import { useApi } from "@/hooks/use-api"
import { User, Settings, Bell } from "lucide-react"

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  bio: Yup.string(),
})

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const { put } = useApi()

  const formik = useFormik({
    initialValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      bio: "Frontend developer passionate about React and Next.js",
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        // In a real app, you would call your API here
        // await put(API_PATHS.UPDATE_PROFILE, values)
        toast.success("Profile updated successfully")
      } catch (error) {
        toast.error("Failed to update profile")
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          <Card>
            <CardHeader>
              <div className="mx-auto w-32 h-32 rounded-full overflow-hidden bg-muted">
                <img src="/placeholder.svg?height=128&width=128" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <CardTitle className="text-center mt-4">John Doe</CardTitle>
              <CardDescription className="text-center">Frontend Developer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
                <Button variant="outline" className="justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <FormField
                      name="name"
                      label="Name"
                      placeholder="Enter your name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && formik.errors.name}
                    />
                    <FormField
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.email && formik.errors.email}
                    />
                    <FormField
                      name="bio"
                      label="Bio"
                      placeholder="Tell us about yourself"
                      value={formik.values.bio}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.bio && formik.errors.bio}
                      textarea
                    />
                  </form>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => formik.handleSubmit()} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Account settings content would go here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage your notification settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Notification settings content would go here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}
