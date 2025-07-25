import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    const docRef = doc(db, "shortUrls", slug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const data = docSnap.data();
    return NextResponse.json({ longUrl: data.longUrl });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
} 