"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ForgotForm from "./ForgotForm";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import ResetForm from "./ResetForm";

interface AuthCardProps extends React.ComponentProps<"div"> {
  token?: string;
}

const switchCard = (pathname: string, token?: string) => {
  switch (pathname) {
    case "/forgot-password":
      return <ForgotForm />;
    case "/reset-password":
      if (!token) return <p>Token not found or invalid</p>;
      return <ResetForm token={token} />;
    default:
      <>no info</>;
  }
};

const AuthCard = ({ className, ...props }: AuthCardProps) => {
  const { token } = props;
  const [signinState, setSigninState] = useState(true);
  const pathname = usePathname();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {pathname === "/signin" ? (
            signinState ? (
              <LoginForm setSigninState={setSigninState} />
            ) : (
              <RegisterForm setSigninState={setSigninState} />
            )
          ) : (
            switchCard(pathname, token)
          )}
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Button
          variant="link"
          size="sm"
          className="underline text-muted-foreground hover:text-primary"
        >
          <Link href="#">Terms of Service</Link>
        </Button>{" "}
        and{" "}
        <Button
          variant="link"
          className="ml-auto underline text-muted-foreground hover:text-primary"
        >
          <Link href="#">Privacy Policy</Link>
        </Button>
        .
      </FieldDescription>
    </div>
  );
};

export default AuthCard;
