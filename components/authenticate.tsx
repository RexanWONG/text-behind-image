import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
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
            redirectTo: 'https://textbehindimage.rexanwong.xyz/app'
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
    <AlertDialog defaultOpen>
      <AlertDialogTrigger asChild>
        <></>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Authenticate with Google</AlertDialogTitle>
          <AlertDialogDescription>To continue, please sign in with your Google account.</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
            <Button variant="outline" className="w-full gap-2" onClick={() => signInWithGoogle()}>
            <FcGoogle />
            Sign in with Google
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Authenticate
