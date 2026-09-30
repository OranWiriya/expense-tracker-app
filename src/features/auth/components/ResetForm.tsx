import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useResetPassword } from "@/hooks/useResetPassword";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, Resolver, useForm } from "react-hook-form";

interface ResetFormProps extends React.ComponentProps<"div"> {
  token: string;
}

const welcomeText: string = "Reset Password here";
const defaultValues: ResetPasswordFormValues = {
  password: "",
  confirmPassword: "",
};

const ResetForm = (props: ResetFormProps) => {
  const { token } = props;
  const router = useRouter();
  const resetPassword = useResetPassword();
  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(
      resetPasswordSchema,
    ) as Resolver<ResetPasswordFormValues>,
    defaultValues,
  });

  const onSubmitResetPassword = resetPasswordForm.handleSubmit((values) => {
    console.log(values);
    resetPassword.mutate(
      { newPassword: values.password, token },
      {
        onSuccess: () => {
          toast.add({
            title: "success",
            description: "reset password successfully",
            type: "success",
          });
          router.push("/signin");
        },
        onError: () => {
          toast.add({
            title: "Error",
            description:
              "reset password failed or token expired, please try again",
            type: "error",
          });
        },
      },
    );
  });
  return (
    <>
      <form
        id="reset-form"
        onSubmit={onSubmitResetPassword}
        className="p-6 md:p-8 md:py-24"
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="text-2xl font-bold">{welcomeText}</div>
            <p className="text-balance text-muted-foreground">
              Enter your new password below
            </p>
          </div>
          <Controller
            name="password"
            control={resetPasswordForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (resetPasswordForm.getValues("confirmPassword")) {
                      resetPasswordForm.trigger("confirmPassword");
                    }
                  }}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={resetPasswordForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
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
              form="reset-form"
              variant="destructive"
              className={"cursor-pointer"}
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending ? "processing..." : "Reset the password"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <div className="relative hidden md:block from-fuchsia-500 to-fuchsia-500/20 bg-linear-240"></div>
    </>
  );
};

export default ResetForm;
