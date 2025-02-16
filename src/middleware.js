import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const response = await fetch("http://localhost:8080/auth/validate-token", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const res = NextResponse.redirect(new URL("/", req.url));
      res.cookies.set("token", "", { path: "/", expires: new Date(0) }); // ❌ Eliminar cookie
      return res;
    } 
  } catch (error) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set("token", "", { path: "/", expires: new Date(0) }); // ❌ Eliminar cookie
    return res;
  }
}

export const config = {
  matcher: ["/home/:path*", "/profile/:path*"], 
};
