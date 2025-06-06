import { type NextRequest, NextResponse } from "next/server"
import admin from "firebase-admin"

export const runtime = "nodejs"

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.NEXT_PRIVATE_FIREBASE_PROJECT_ID,
    private_key_id: process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL,
    client_id: process.env.NEXT_PRIVATE_FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL}`,
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  })
}

export async function POST(request: NextRequest) {
  try {
    const { token, title, body, data } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "FCM token is required" }, { status: 400 })
    }

    // Prepare the message
    const message = {
      token,
      notification: {
        title: title || "Thank you for installing Zendo! 🎉",
        body: body || "Welcome to the Zendo experience! Consider supporting the project.",
      },
      data: {
        url: data?.url || "/kofi",
        action: data?.action || "support",
        tag: "install-thank-you",
        actions: JSON.stringify([
          {
            action: "support",
            title: "Support on Ko-fi ☕",
            icon: "/assets/icons/maskable-icon.png",
          },
          {
            action: "explore",
            title: "Explore App",
            icon: "/assets/icons/maskable-icon.png",
          },
        ]),
      },
      webpush: {
        notification: {
          icon: "/assets/icons/maskable-icon.png",
          badge: "/assets/icons/maskable-icon.png",
          tag: "install-thank-you",
          requireInteraction: true,
          actions: [
            {
              action: "support",
              title: "Support on Ko-fi ☕",
              icon: "/assets/icons/maskable-icon.png",
            },
            {
              action: "explore",
              title: "Explore App",
              icon: "/assets/icons/maskable-icon.png",
            },
          ],
        },
      },
    }

    // Send the message
    const response = await admin.messaging().send(message)

    console.log("Successfully sent FCM message:", response)

    return NextResponse.json({
      success: true,
      messageId: response,
      message: "Install thank you notification sent successfully",
    })
  } catch (error) {
    console.error("Error sending FCM message:", error)

    return NextResponse.json(
      {
        error: "Failed to send notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
