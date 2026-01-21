import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Store, MapPin, User, Phone, Mail, Building, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { registerStore, StoreRegistration } from "@/services/storeService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const registrationSchema = z.object({
  owner_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  store_name: z.string().min(2, "Store name must be at least 2 characters").max(100),
  aadhaar_number: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
  pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format").optional().or(z.literal("")),
  phone_number: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(10, "Address must be at least 10 characters").max(500),
  city: z.string().min(2, "City must be at least 2 characters").max(100),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface StoreRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const StoreRegistrationForm = ({ open, onOpenChange, onSuccess }: StoreRegistrationFormProps) => {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const queryClient = useQueryClient();

  // Get location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus('granted');
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setLocationStatus('denied');
        }
      );
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
    getValues,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const registrationData: StoreRegistration = {
        owner_name: data.owner_name,
        store_name: data.store_name,
        aadhaar_number: data.aadhaar_number,
        phone_number: data.phone_number,
        email: data.email,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        pan_number: data.pan_number || undefined,
        latitude: userCoords?.lat,
        longitude: userCoords?.lng,
      };

      return registerStore(registrationData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      setShowSuccess(true);
      toast({
        title: "Registration Successful!",
        description: "Your store has been registered and is now visible to nearby sellers.",
      });
      reset();
      setStep(1);
      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
        onSuccess?.();
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    mutation.mutate(data);
  };

  const validateAndNextStep = async () => {
    let fieldsToValidate: (keyof RegistrationFormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ['owner_name', 'aadhaar_number'];
    } else if (step === 2) {
      fieldsToValidate = ['phone_number', 'email'];
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((s) => Math.min(s + 1, 3));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setShowSuccess(false);
    }
  }, [open]);

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Registration Successful!</h3>
            <p className="text-muted-foreground">Your store has been registered successfully.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Register Your Store
          </DialogTitle>
          <DialogDescription>
            Join our network of grocery stores in your area
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  s <= step
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 mx-1 rounded ${
                    s < step ? "gradient-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Personal Details
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="owner_name">Owner Name *</Label>
                <Input
                  id="owner_name"
                  placeholder="Enter your full name"
                  {...register("owner_name")}
                  className={errors.owner_name ? "border-destructive" : ""}
                />
                {errors.owner_name && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.owner_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaar_number">Aadhaar Number *</Label>
                <Input
                  id="aadhaar_number"
                  placeholder="12-digit Aadhaar number"
                  maxLength={12}
                  {...register("aadhaar_number")}
                  className={errors.aadhaar_number ? "border-destructive" : ""}
                />
                {errors.aadhaar_number && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.aadhaar_number.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pan_number">PAN Number (Optional)</Label>
                <Input
                  id="pan_number"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="uppercase"
                  {...register("pan_number")}
                />
                {errors.pan_number && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.pan_number.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Contact Details
              </h4>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  {...register("phone_number")}
                  className={errors.phone_number ? "border-destructive" : ""}
                />
                {errors.phone_number && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Store Details */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                Store Details
              </h4>

              <div className="space-y-2">
                <Label htmlFor="store_name">Store Name *</Label>
                <Input
                  id="store_name"
                  placeholder="Your store name"
                  {...register("store_name")}
                  className={errors.store_name ? "border-destructive" : ""}
                />
                {errors.store_name && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.store_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Store Address *</Label>
                <Input
                  id="address"
                  placeholder="Full store address"
                  {...register("address")}
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    {...register("city")}
                    className={errors.city ? "border-destructive" : ""}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    placeholder="6-digit pincode"
                    maxLength={6}
                    {...register("pincode")}
                    className={errors.pincode ? "border-destructive" : ""}
                  />
                  {errors.pincode && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.pincode.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Location Status */}
              <div className={`flex items-start gap-2 p-3 rounded-lg border ${
                locationStatus === 'granted' 
                  ? 'bg-accent/5 border-accent/20' 
                  : locationStatus === 'denied'
                    ? 'bg-chart-4/5 border-chart-4/20'
                    : 'bg-primary/5 border-primary/10'
              }`}>
                <MapPin className={`h-4 w-4 mt-0.5 ${
                  locationStatus === 'granted' 
                    ? 'text-accent' 
                    : locationStatus === 'denied'
                      ? 'text-chart-4'
                      : 'text-primary'
                }`} />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {locationStatus === 'granted' && 'Location detected successfully!'}
                    {locationStatus === 'denied' && 'Location access denied'}
                    {locationStatus === 'pending' && 'Detecting your location...'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locationStatus === 'granted' && `Coordinates: ${userCoords?.lat.toFixed(4)}, ${userCoords?.lng.toFixed(4)}`}
                    {locationStatus === 'denied' && 'Store will be registered without precise location.'}
                    {locationStatus === 'pending' && 'Please allow location access for better visibility.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Show all errors summary on step 3 */}
          {step === 3 && Object.keys(errors).length > 0 && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-medium mb-1">Please fix the following errors:</p>
              <ul className="text-xs text-destructive list-disc list-inside">
                {Object.entries(errors).map(([key, error]) => (
                  <li key={key}>{error?.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button type="button" onClick={validateAndNextStep} variant="gradient">
                Next Step
              </Button>
            ) : (
              <Button 
                type="submit" 
                variant="hero" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Submit Registration
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StoreRegistrationForm;
