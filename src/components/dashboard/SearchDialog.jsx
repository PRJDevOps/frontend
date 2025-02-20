
import * as React from "react"
import { Search, ArrowRightToLine } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"  // Add this import

export function SearchCommand() {
  const navigate = useNavigate()  // Add this hook
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <>
      <Button
        variant="outline"
        className="h-9 w-60 px-3 ml-5 border border-gray-300 dark:border-gray-700 focus:outline-none text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 rounded-md flex items-center gap-2 justify-start font-normal"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">Search</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] p-0">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">
            Search through available commands and pages
          </DialogDescription>
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                className="flex-1 outline-none bg-transparent placeholder:text-gray-400 placeholder:text-sm"
                placeholder="Type a command or search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              
            </div>
          </div>
          <div className=" max-h-[300px] pb-3 overflow-auto">
            {filteredItems.length > 0 ? (
              <>
                <div className="px-4 ">
                  <p className="text-sm font-medium text-gray-500">General</p>
                </div>
                {filteredItems.map((item, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 flex text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:text-gray-900 items-center gap-2"
                    onClick={() => {
                      setOpen(false)
                      setSearchQuery("")
                      navigate(`/${item.name.toLowerCase()}`)  // Add navigation
                    }}
                  >
                     <ArrowRightToLine className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="flex-1 ">{item.name}</span>
                 </button>
                ))}
              </>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500">No results found.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

const items = [
  {
    name: "Dashboard",
  },
  {
    name: "Tasks",
  },
  {
    name: "Users",
  },
  {
    name: "Profile",
  },
  {
    name: "Account",
  },
]

