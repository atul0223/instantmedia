import { useContext } from "react"
import UserContext from "../context/UserContext"

export default function Loading() {
    const{ loading} =useContext(UserContext)
 if (loading)  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>

  )
}
