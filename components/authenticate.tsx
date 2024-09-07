import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { FcGoogle } from "react-icons/fc"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

const Authenticate = () => {
  const supabase = useSupabaseClient()
  const { toast } = useToast()
  
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
            redirectTo: 'http://localhost:3000'
        },
    })

    if (error) {
        toast({
            title: "🔴 Something went wrong",
            description: "Please try again.",
        })
    }
  }

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
            <Button variant="outline" className="w-full gap-2" onClick={() => signInWithGoogle()}>
            <FcGoogle />
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Authenticate
