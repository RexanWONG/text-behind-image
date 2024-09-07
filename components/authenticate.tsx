import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"

const Authenticate = () => {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <></>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Authenticate with Google</DialogTitle>
          <DialogDescription>To continue, please sign in with your Google account.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <Button variant="outline" className="w-full gap-2">
            <FcGoogle />
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Authenticate
