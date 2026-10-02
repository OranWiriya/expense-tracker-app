import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSignout from "@/hooks/useSignout";
import Link from "next/link";

interface AppAvatarProps {
  img?: string;
  username?: string;
}

const AppAvatar = (props: AppAvatarProps) => {
  const { img, username = "" } = props;
  const signOut = useSignout();

  const avatarName = username[0].toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full cursor-pointer"
          >
            <Avatar size="lg">
              {img && <AvatarImage src={img} />}
              <AvatarFallback
                className={
                  "font-bold text-lg bg-background text-secondary-foreground"
                }
              >
                {avatarName}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className="w-32 **:cursor-pointer">
        <DropdownMenuGroup>
          <Link href={"/profile"}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => signOut.mutate()}
            disabled={signOut.isPending}
          >
            {signOut.isPending ? "Signing out..." : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppAvatar;
