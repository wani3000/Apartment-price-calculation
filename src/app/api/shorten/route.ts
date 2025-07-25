import { NextResponse } from "next/server";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export async function POST(req: Request) {
  const body = await req.json();
  const { slug, longUrl } = body;

  if (!slug || !longUrl) {
    return NextResponse.json({ error: "Missing slug or longUrl" }, { status: 400 });
  }

  try {
    const docRef = doc(collection(db, "shortUrls"), slug);
    await setDoc(docRef, { slug, longUrl });

    return NextResponse.json({ message: "URL saved", slug });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
} 