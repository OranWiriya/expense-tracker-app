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
import { useSignup } from "@/hooks/useSignup";
import { SignupFormValues, signupSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Resolver, Controller } from "react-hook-form";

interface RegisterFormProps {
  setSigninState?: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValues: SignupFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const welcomeText: string = "Don't have an account?";

const RegisterForm = (props: RegisterFormProps) => {
  const { setSigninState } = props;
  const signup = useSignup();
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema) as Resolver<SignupFormValues>,
    defaultValues,
  });

  const onSubmitRegister = signupForm.handleSubmit((values) => {
    signup.mutate(values, {
      onSuccess: () => {
        signupForm.reset();
        toast.add({
          title: "Success",
          description: "Account added successfully",
          type: "success",
          timeout: 3000,
        });
        if (setSigninState) {
          setSigninState(true);
        }
      },
      onError: (error) => {
        console.log(error);
        toast.add({
          title: "Error",
          description: error.message,
          type: "error",
        });
      },
    });
  });
  return (
    <>
      <form
        id="register-form"
        onSubmit={onSubmitRegister}
        className="p-6 md:p-8 md:py-14"
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="text-2xl font-bold">
              {welcomeText.slice(0, 11)}
              <span className="text-destructive">
                {welcomeText.slice(11, 13)}
              </span>
              <span className="text-primary">{welcomeText.slice(13)}</span>
            </div>
            <p className="text-balance text-muted-foreground">
              Enter your email below to create an account
            </p>
          </div>
          <Controller
            name="name"
            control={signupForm.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Display Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Enter your name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              );
            }}
          />
          <Controller
            name="email"
            control={signupForm.control}
            render={({ field, fieldState }) => {
              return (
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
              );
            }}
          />
          <Controller
            name="password"
            control={signupForm.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      if (signupForm.getValues("confirmPassword")) {
                        signupForm.trigger("confirmPassword");
                      }
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              );
            }}
          />
          <Controller
            name="confirmPassword"
            control={signupForm.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                  </div>
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
              );
            }}
          />
          <Field>
            <Button
              type="submit"
              form="register-form"
              className={"cursor-pointer"}
            >
              Sign up
            </Button>
          </Field>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Button
              variant="link"
              className={"cursor-pointer"}
              onClick={() => setSigninState?.((prev) => !prev)}
            >
              Sign in
            </Button>
          </FieldDescription>
        </FieldGroup>
      </form>
      <div className="relative hidden md:block from-destructive to-destructive/20 bg-linear-240"></div>
    </>
  );
};

export default RegisterForm;
