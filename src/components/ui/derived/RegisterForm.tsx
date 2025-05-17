import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";


async function registerAction(formData: FormData) {
  "use server";
  const c = await cookies()
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: c.toString() },
    
    body: JSON.stringify({ name, email, password, phoneNumber, isAdmin: true }),
  });

  if (res.ok) {
    const { token } = await res.json();

    // Store JWT in HTTP-only cookie
   ( await cookies()).set("token", token, { httpOnly: true, secure: true });

    redirect("/admin");
  } else {
    throw new Error("Login failed");
  }
}

export default async function RegisterForm() {
  return (
    <AuroraBackground showRadialGradient={true}>
      <div className="flex flex-col items-center justify-center h-screen w-full z-50">
        <h1 className="text-2xl md:text-4xl tracking-wider font-bold mb-4 text-center">
          Register
        </h1>
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <form action={registerAction} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="block w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="block w-full p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="block w-full p-2 border rounded"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              required
              className="block w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Register
            </button>
            <div className="text-center text-sm text-blue-900 hover:text-blue-400">
              <Link href="/login">Already an admin?</Link>
            </div>
          </form>
        </div>
      </div>
    </AuroraBackground>
  );
}
