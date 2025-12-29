import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createToken, setAdminCookie } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "שם משתמש וסיסמה נדרשים" },
        { status: 400 }
      );
    }

    const isValid = await verifyCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: "שם משתמש או סיסמה שגויים" },
        { status: 401 }
      );
    }

    const token = await createToken();
    await setAdminCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "שגיאה בהתחברות" },
      { status: 500 }
    );
  }
}
