import { auth } from "@/lib/auth";
import { supabaseStorage } from "@/lib/supabase-storage";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const avatarFile = formData.get("avatar") as File | null;
  if (!avatarFile)
    return Response.json({ error: "Missing avatar file" }, { status: 400 });

  const fileExt = avatarFile.name.split(".").pop();
  const fileName = `${session.user.id}.${fileExt}`;

  const { error: uploadError } = await supabaseStorage.storage
    .from("avatars")
    .upload(fileName, avatarFile, { upsert: true });

  if (uploadError)
    return Response.json({ error: uploadError.message }, { status: 500 });

  const { data: urlData } = supabaseStorage.storage
    .from("avatars")
    .getPublicUrl(fileName);

  const imageUrl = `${urlData.publicUrl}?v=${Date.now()}`;

  const { status } = await auth.api.updateUser({
    body: { image: imageUrl },
    headers: req.headers,
  });

  if (!status)
    return Response.json(
      { error: "Update avatar image failed" },
      { status: 500 },
    );

  return Response.json({ url: urlData.publicUrl });
}
