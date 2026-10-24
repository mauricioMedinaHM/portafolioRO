import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { PasswordForm } from "@/components/admin/password-form";
import { ProfileForm } from "@/components/admin/profile-form";
import { getAdminData } from "@/lib/data/queries";

export const metadata = { title: "Perfil · Admin" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const data = await getAdminData();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
      <h1 className="font-display text-3xl text-foreground">Perfil</h1>
      <ProfileForm profile={data.profile} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
