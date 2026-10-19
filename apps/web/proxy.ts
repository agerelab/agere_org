import { NextResponse, type NextRequest } from "next/server";
import { safeReturnPath } from "@agere/contracts";
import { SESSION_COOKIE } from "~/lib/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const slug = pathname.split("/").filter(Boolean)[0];
  if (!slug || slug === "masuk") return NextResponse.next();

  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/masuk";
    url.search = "";
    url.searchParams.set("next", safeReturnPath(pathname));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
