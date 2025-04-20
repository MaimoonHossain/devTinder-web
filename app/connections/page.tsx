"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApi } from "@/hooks/use-api"
import { API_PATHS } from "@/constants/api-paths"
import { UserPlus, UserX } from "lucide-react"
import toast from "react-hot-toast"

interface Connection {
  id: string
  name: string
  avatar: string
  isConnected: boolean
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { get, post } = useApi()

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await get(API_PATHS.CONNECTIONS)
        setConnections(data)
      } catch (error) {
        toast.error("Failed to load connections")
      } finally {
        setIsLoading(false)
      }
    }

    // Mock data for demonstration
    setTimeout(() => {
      setConnections([
        { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=50&width=50", isConnected: false },
        { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=50&width=50", isConnected: true },
        { id: "3", name: "Alex Johnson", avatar: "/placeholder.svg?height=50&width=50", isConnected: false },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const toggleConnection = async (id: string, isConnected: boolean) => {
    try {
      // In a real app, you would call your API here
      // await post(API_PATHS.TOGGLE_CONNECTION, { id, isConnected: !isConnected })

      setConnections(connections.map((conn) => (conn.id === id ? { ...conn, isConnected: !isConnected } : conn)))

      toast.success(isConnected ? "Connection removed" : "Connection added")
    } catch (error) {
      toast.error("Failed to update connection")
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading connections...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">Your Connections</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <img
                      src={connection.avatar || "/placeholder.svg"}
                      alt={connection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle>{connection.name}</CardTitle>
                    <CardDescription>{connection.isConnected ? "Connected" : "Not connected"}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={connection.isConnected ? "destructive" : "default"}
                    className="w-full"
                    onClick={() => toggleConnection(connection.id, connection.isConnected)}
                  >
                    {connection.isConnected ? (
                      <>
                        <UserX className="mr-2 h-4 w-4" />
                        Remove Connection
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Connection
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
