"use client"

import * as React from "react"
import axios from 'axios'
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "./ui/button"
import { Profile } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

// Define a type for the plan
interface Plan {
  userDetails: Profile;
  userEmail: string;
  title: string;
  description: string;
  price: string;
  features: string[];
}

interface PayDialogProps {
    userDetails: Profile;
    userEmail: string;
    isOpen: boolean;
    onClose: () => void;
}

const PlanCard: React.FC<Plan> = ({ userDetails, userEmail, title, description, price, features }) => {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = React.useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
    const [isAnnual, setIsAnnual] = React.useState(false);
    
    const handleDirectToPaymentLink = async () => {
        setLoading(true); 
        try {
            const response = await axios.post('/api/create-checkout-session', {
                user_id: userDetails.id,
                email: userEmail,
                plan_name: "Text Behind Image Pro Plan",
                plan_type: isAnnual ? 'ANNUAL' : 'MONTHLY',
            });

            router.push(response.data.paymentLink);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create checkout session",
                variant: "destructive"
            });
        } finally {
            setLoading(false);   
        }
    }

    const handleCancelSubscription = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscription_id: userDetails.subscription_id }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            toast({
                title: "Your subscription has been cancelled",
            })
            window.location.reload()
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            toast({
                title: "Error",
                description: "Failed to cancel subscription",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
            setIsConfirmDialogOpen(false);
        }
    };

    return (
        <>
            <Card className={title.includes("Pro") ? "border border-emerald-400" : ""}>
                <CardHeader className="flex flex-col items-start space-y-2">
                    <div className="flex flex-col items-start space-y-2">
                        <CardTitle className="font-bold">{title}</CardTitle>
                        <CardDescription className="text-sm font-normal">{description}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-start space-y-4">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-semibold">{price}</span>
                        <span className="text-sm font-medium opacity-50">/month</span>
                    </div>
                    <ul className="grid gap-2 text-left">
                        {features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="flex justify-center">
                    {title.includes("Free") ? (
                        userDetails.paid ? (
                            <Button onClick={() => setIsConfirmDialogOpen(true)} disabled={false}>
                                {loading ? 'Please wait' : 'Cancel Subscription'}
                            </Button>
                        ) : (
                            <Button disabled={true}>
                                {loading ? 'Please wait' : 'Current Plan'}
                            </Button>
                        )
                    ) : title.includes("Pro") ? (
                        userDetails.paid ? (
                            <Button disabled={true}>
                                {loading ? 'Please wait' : 'Current Plan'}
                            </Button>
                        ) : (
                            <Button onClick={handleDirectToPaymentLink} disabled={loading}>
                                {loading ? 'Please wait' : 'Upgrade'}
                            </Button>
                        )
                    ) : null}
                </CardFooter>
            </Card>

            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader> 
                        <DialogTitle>Confirm Cancel Subscription</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel your plan? This will cancel your current subscription.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleCancelSubscription} disabled={loading} variant={'destructive'}>
                            {loading ? 'Please wait' : 'Confirm'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

// Define the PayDialog component
const PayDialog: React.FC<PayDialogProps> = ({ userDetails, userEmail, isOpen, onClose }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [isAnnual, setIsAnnual] = React.useState(true);

  const handleDirectToPaymentLink = async () => {
    setLoading(true); 
    try {
      const response = await axios.post('/api/create-checkout-session', {
        user_id: userDetails.id,
        email: userEmail,
        plan_name: "Text Behind Image Pro Plan",
        plan_type: isAnnual ? 'ANNUAL' : 'MONTHLY',
      });

      router.push(response.data.paymentLink);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);   
    }
  }

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription_id: userDetails.subscription_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      toast({
        title: "Your subscription has been cancelled",
      })
      window.location.reload()
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose your plan</DialogTitle>
          <DialogDescription>
            Simple, transparent pricing. Cancel anytime.
          </DialogDescription>
        </DialogHeader>
        
        {/* Toggle Section (using Switch component) */}
        <div className="flex justify-center items-center mb-6 mt-4">
          <Label htmlFor="payment-schedule" className={`me-3 ${!isAnnual ? "font-bold" : ""}`}>
            Monthly
          </Label>
          <Switch
            id="payment-schedule"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <Label htmlFor="payment-schedule" className={`relative ms-3 ${isAnnual ? "font-bold" : ""}`}>
            Annual
            <span className="absolute -top-10 start-auto -end-28">
              <span className="flex items-center">
                <svg
                  className="w-14 h-8 -me-5"
                  width={45}
                  height={25}
                  viewBox="0 0 45 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                    fill="currentColor"
                    className="text-muted-foreground"
                  />
                </svg>
                <Badge className="mt-3 uppercase">✨ Save 20%</Badge>
              </span>
            </span>
          </Label>
        </div>

        {/* Grid Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="flex flex-col justify-between">
            <div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="mb-2">Free</CardTitle>
                <span className="font-bold text-6xl">$0</span>
              </CardHeader>
              <CardDescription className="text-center text-base text-muted-foreground">
                Forever free
              </CardDescription>
              <CardContent>
                <ul className="mt-7 space-y-2.5 text-sm">
                  <li className="flex space-x-2">
                    <Check className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">2 free generations / account</span>
                  </li>
                  <li className="flex space-x-2">
                    <Check className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">Basic text editing features</span>
                  </li>
                  <li className="flex space-x-2">
                    <Check className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">Access to 6 free fonts</span>
                  </li>
                </ul>
              </CardContent>
            </div>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={userDetails.paid ? "destructive" : "outline"}
                disabled={!userDetails.paid}
                onClick={() => userDetails.paid && setIsConfirmDialogOpen(true)}
              >
                {userDetails.paid ? 'Downgrade' : 'Current Plan'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary flex flex-col justify-between">
            <div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="mb-2">Pro</CardTitle>
                <div className="flex items-center justify-center mb-2">
                  <span className="font-bold text-6xl">
                    ${isAnnual ? '7' : '9'}
                  </span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                {isAnnual && (
                  <Badge className="uppercase w-max self-center">
                    Most popular
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <ul className="mt-7 space-y-2.5 text-sm">
                  <li className="flex space-x-2">
                    <Check className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">Everything in Free</span>
                  </li>
                  <li className="flex space-x-2">
                    <Check className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">Unlimited generations / account</span>
                  </li>
                  <li className="flex space-x-2">
                    <Check className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">Access to all 250 fonts</span>
                  </li>
                  <li className="flex space-x-2">
                    <Check className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">Letter spacing control</span>
                  </li>
                  <li className="flex space-x-2">
                    <Check className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">3D tilt effects</span>
                  </li>
                  <li className="flex space-x-2">
                    <Check className="flex-shrink-0 mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">No ads</span>
                  </li>
                </ul>
              </CardContent>
            </div>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleDirectToPaymentLink}
                disabled={userDetails.paid || loading}
              >
                {loading ? 'Please wait...' : userDetails.paid ? 'Current Plan' : 'Upgrade to Pro'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Cancel Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your plan? This will cancel your current subscription.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                Keep subscription
              </Button>
              <Button 
                onClick={handleCancelSubscription} 
                disabled={loading} 
                variant="destructive"
              >
                {loading ? 'Please wait' : 'Yes, cancel subscription'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}

export default PayDialog
