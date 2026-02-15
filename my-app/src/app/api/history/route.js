import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/database/db";
import Chat from "@/database/chat";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    await connectDB();

    // Fetch the chat document for this user
    const chatDoc = await Chat.findOne({ userId })
      .select({ messages: { $slice: -40 } }) // Get last 40 messages (20 conversations)
      .lean();

    if (!chatDoc || !Array.isArray(chatDoc.messages) || chatDoc.messages.length === 0) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    // Return the messages in chronological order
    return NextResponse.json({ messages: chatDoc.messages }, { status: 200 });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}
