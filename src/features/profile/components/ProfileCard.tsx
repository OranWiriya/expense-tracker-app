"use client";

import { Controller, Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import useUpdateProfile from "@/hooks/useUpdateProfile";

import { authClient } from "@/lib/auth-client";
import {
  updateProfileSchema,
  UpdateProfileFormValues,
} from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

const defaultValues: UpdateProfileFormValues = {
  name: "",
  image: "",
  password: "",
  confirmPassword: "",
};

const ProfileCard = () => {
  const { data, isPending, error } = authClient.useSession();
  const updateProfile = useUpdateProfile();
  const updateForm = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(
      updateProfileSchema,
    ) as Resolver<UpdateProfileFormValues>,
    defaultValues,
    values: {
      name: data?.user.name ?? "",
      image: data?.user.image ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRestoreForm = () => {
    updateForm.reset();
  };

  const handleSubmit = updateForm.handleSubmit((values) => {
    console.log(values);
    updateProfile.mutate(values, {
      onSuccess: () => {
        handleRestoreForm();
        toast.add({
          title: "Success",
          description: "Profile updated successfully",
          type: "success",
          timeout: 3000,
        });
      },
      onError: (error) => {
        toast.add({
          title: "Error",
          description: error.message,
          type: "error",
        });
      },
    });
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card className="justify-center w-full ">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile settings.</CardDescription>
      </CardHeader>
      <CardContent>
        {data && (
          <form id="update-form" onSubmit={handleSubmit}>
            <FieldGroup>
              <Controller
                name="name"
                control={updateForm.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">name</FieldLabel>
                      <Input
                        id="name"
                        type="name"
                        placeholder="John Doe"
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
              {/* NEED TO WORK THIS FEATURE*/}
              {/* <Controller
                name="image"
                control={updateForm.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="image">image</FieldLabel>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        placeholder="Choose image to upload"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        aria-invalid={fieldState.invalid}
                        className="hover:bg-accent hover:cursor-pointer"
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  );
                }}
              /> */}
              <Controller
                name="password"
                control={updateForm.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">password</FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
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
                name="confirmPassword"
                control={updateForm.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirmPassword">
                        confirmPassword
                      </FieldLabel>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Enter Confirm password"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <FieldGroup className="flex flex-row justify-between">
          <Field>
            <Button
              type="reset"
              variant={"secondary"}
              className={"cursor-pointer"}
              onClick={handleRestoreForm}
              disabled={!updateForm.formState.isDirty}
            >
              reset
            </Button>
          </Field>
          <Field>
            <Button
              type="submit"
              form="update-form"
              className={"cursor-pointer"}
              disabled={!updateForm.formState.isDirty}
            >
              Update
            </Button>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
