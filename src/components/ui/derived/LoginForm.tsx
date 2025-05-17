"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";

async function loginAction(formData: FormData) {
  "use server"
  const c = await cookies()
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: c.toString() },
    
   
    body: JSON.stringify({ email, password }),
  });
  console.log("logigi")
  if (res.ok) {
    console.log("Login successful");
    // Set cookies manually if needed
    const token = await res.json();
    console.log(token);
    // Server-side logging
    
    (await cookies()).set("token", token.token, { httpOnly: true, secure: true });
     console.log("Token set in cookies");
    redirect("/admin");
  }
  const token = await res.json();
  console.log("a",token)
  redirect(`/?error=${encodeURIComponent(token.err)}`);


}

export default async function LoginForm({ searchParams }: { searchParams?: { error?: string } }) {

  return (
    <AuroraBackground showRadialGradient={true}>
      <div className="flex flex-col justify-center h-screen md:w-full w-[90%] z-50">
        <h1 className="text-2xl md:text-4xl tracking-wider font-bold mb-4 text-center">
          Login to Admin Page
        </h1>
        <div className="bg-white p-8 rounded shadow-md w-full">
          {searchParams?.error && <p className="text-red-500 text-center mb-4">{searchParams.error}</p>}
          <form action={loginAction} className="space-y-4">
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
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
            <div className="text-center text-sm text-blue-950 hover:text-blue-500">
              <Link href="/register">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </AuroraBackground>
  );
}