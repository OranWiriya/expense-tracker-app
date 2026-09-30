"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import LoginForm from "./LoginForm";
import { FieldDescription } from "@/components/ui/field";
import RegisterForm from "./RegisterForm";
import { usePathname } from "next/navigation";
import ForgotForm from "./ForgotForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AuthCard = ({ className, ...props }: React.ComponentProps<"div">) => {
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
            <ForgotForm />
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
