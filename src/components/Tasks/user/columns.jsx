"use client"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical, AlertCircle, FileText, Wrench } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from 'axios'

// Add these imports at the top
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

// Move helper functions outside of columns
const getTypeIcon = (type) => {
  switch (type) {
    case "Bug":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case "Feature":
      return <Wrench className="h-4 w-4 text-blue-500" />
    case "Documentation":
      return <FileText className="h-4 w-4 text-yellow-500" />
    default:
      return null
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "Done":
      return "bg-emerald-500/15 border border-emerald-500 text-emerald-500"
    case "IN_PROGRESS":
      return "bg-blue-500/15 border border-blue-500 text-blue-500"
    case "TODO":
      return "bg-yellow-500/15 border border-yellow-500 text-yellow-500"
    case "Backlog":
      return "bg-gray-500/15 border border-gray-500 text-gray-500"
    case "Canceled":
      return "bg-red-500/15 border border-red-500 text-red-500"
    default:
      return "bg-gray-500/15 border border-gray-300 text-gray-300"
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case "HIGH":
      return "text-red-500"
    case "MEDIUM":
      return "text-yellow-500"
    case "LOW":
      return "text-green-500"
    default:
      return "text-gray-500"
  }
}

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-1">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type")
      const getTypeIcon = (type) => {
        switch (type) {
          case "Bug":
            return <AlertCircle className="h-4 w-4 text-red-500" />
          case "Feature":
            return <Wrench className="h-4 w-4 text-blue-500" />
          case "Documentation":
            return <FileText className="h-4 w-4 text-yellow-500" />
          default:
            return null
        }
      }
      return (
        <div className="flex items-center gap-2">
          {getTypeIcon(type)}
          {type}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      const getStatusColor = (status) => {
        switch (status) {
          case "Done":
            return "bg-emerald-500/15 border border-emerald-500 text-emerald-500"
          case "IN_PROGRESS":
            return "bg-blue-500/15 border border-blue-500 text-blue-500"
          case "TODO":
            return "bg-yellow-500/15 border border-yellow-500 text-yellow-500"
          case "Backlog":
            return "bg-gray-500/15 border border-gray-500 text-gray-500"
          case "Canceled":
            return "bg-red-500/15 border border-red-500 text-red-500"
          default:
            return "bg-gray-500/15 border border-gray-300 text-gray-300"
        }
      }

      return (
        <Badge variant="secondary" className={`${getStatusColor(status)} px-1.5 py-0.5 text-xs`}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority")
      const getPriorityColor = (priority) => {
        switch (priority) {
          case "HIGH":
            return "text-red-500"
          case "MEDIUM":
            return "text-yellow-500"
          case "LOW":
            return "text-green-500"
          default:
            return "text-gray-500"
        }
      }

      return (
        <span className={`font-medium ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isViewOpen, setIsViewOpen] = useState(false)
      const [taskDetails, setTaskDetails] = useState(null)

      const handleView = async () => {
        try {
          const token = localStorage.getItem('authToken')
          const taskId = row.getValue("id")
          
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setTaskDetails(response.data.data)
          setIsViewOpen(true)
        } catch (error) {
          console.error('Error fetching task details:', error)
        }
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-gray-600 dark:text-gray-400"
                onClick={handleView}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {taskDetails && (
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
              <DialogContent className="sm:max-w-[600px] w-full">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{taskDetails.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-semibold mb-2">Type:</p>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(taskDetails.type)}
                            {taskDetails.type}
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Priority:</p>
                          <p className={`font-medium ${getPriorityColor(taskDetails.priority)}`}>
                            {taskDetails.priority}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Team:</p>
                          <p>{taskDetails.team}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold mb-2">Message:</h3>
                      <p className="text-sm">{taskDetails.task}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-semibold mb-2">Status:</p>
                          <Badge variant="secondary" className={`${getStatusColor(taskDetails.status)} px-1.5 py-0.5 text-xs`}>
                            {taskDetails.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Created:</p>
                          <p>{new Date(taskDetails.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Updated:</p>
                          <p>{new Date(taskDetails.updatedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )
    },
  }
]

