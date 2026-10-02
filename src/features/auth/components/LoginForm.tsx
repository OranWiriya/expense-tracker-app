import { Controller, Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SigninFormValues, signinSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSignin } from "@/hooks/useSignin";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  setSigninState?: React.Dispatch<React.SetStateAction<boolean>>;
}
const welcomeText: string = "Welcome to Expense Tracker";
const defaultValues: SigninFormValues = {
  email: "",
  password: "",
};

const LoginForm = (props: LoginFormProps) => {
  const { setSigninState } = props;
  const router = useRouter();
  const signin = useSignin();
  const signinForm = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema) as Resolver<SigninFormValues>,
    defaultValues,
  });

  const onSubmitRegister = signinForm.handleSubmit((values) => {
    console.log(values);
    signin.mutate(values, {
      onSuccess: () => {
        signinForm.reset();
        toast.add({
          title: "Success",
          description: "Account signed in successfully",
          type: "success",
          timeout: 3000,
        });
        router.push("/overview");
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
        id="signin-form"
        onSubmit={onSubmitRegister}
        className="p-6 md:p-8 md:py-24"
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="text-2xl font-bold">
              {welcomeText.slice(0, 11)}
              <span className="text-destructive">
                {welcomeText.slice(11, 18)}
              </span>
              <span className="text-primary">{welcomeText.slice(18)}</span>
            </div>
            <p className="text-balance text-muted-foreground">
              Login to your account
            </p>
          </div>
          <Controller
            name="email"
            control={signinForm.control}
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
            control={signinForm.control}
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Button
                      variant="link"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      <Link href="/forgot-password">
                        Forgot your password?{" "}
                      </Link>
                    </Button>
                  </div>
                  <Input
                    id="password"
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
              form="signin-form"
              className={"cursor-pointer"}
            >
              Login
            </Button>
          </Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className={"cursor-pointer"}
              onClick={() => setSigninState?.((prev) => !prev)}
            >
              Sign up
            </Button>
          </FieldDescription>
        </FieldGroup>
      </form>
      <div className="relative hidden md:block from-primary to-primary/20 bg-linear-240"></div>
    </>
  );
};

export default LoginForm;
