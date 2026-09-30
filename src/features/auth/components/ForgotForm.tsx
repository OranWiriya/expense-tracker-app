import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, Resolver, useForm } from "react-hook-form";

const welcomeText: string = "Forgot Password?";
const defaultValues: ForgotPasswordFormValues = {
  email: "",
};

const ForgotForm: React.FC = () => {
  const forgotPassword = useForgotPassword();
  const resetPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(
      forgotPasswordSchema,
    ) as Resolver<ForgotPasswordFormValues>,
    defaultValues,
  });

  const onSubmitForgotPassword = resetPasswordForm.handleSubmit((values) => {
    console.log(values);
    forgotPassword.mutate(values, {
      onSuccess: () => {
        resetPasswordForm.reset();
        toast.add({
          title: "Email Sent!",
          description: "Please check your email to reset your password.",
          type: "success",
        });
      },
      onError: (error) => {
        console.log(error);
        toast.add({
          title: "Error",
          description: "Could not send email. Please try again later.",
          type: "error",
        });
      },
    });
  });
  return (
    <>
      <form
        id="forgot-form"
        onSubmit={onSubmitForgotPassword}
        className="p-6 md:p-8 md:py-24"
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="text-2xl font-bold">{welcomeText}</div>
            <p className="text-balance text-muted-foreground">
              Enter your email below
            </p>
          </div>
          <Controller
            name="email"
            control={resetPasswordForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Field>
            <Button
              type="submit"
              form="forgot-form"
              className={"cursor-pointer"}
              disabled={forgotPassword.isPending}
            >
              {forgotPassword.isPending ? "Sending..." : "Continue"}
            </Button>
          </Field>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Button variant="link" className={"cursor-pointer"}>
              <Link href="/signin">Sign in</Link>
            </Button>
          </FieldDescription>
        </FieldGroup>
      </form>
      <div className="relative hidden md:block from-fuchsia-500 to-fuchsia-500/20 bg-linear-240"></div>
    </>
  );
};

export default ForgotForm;
