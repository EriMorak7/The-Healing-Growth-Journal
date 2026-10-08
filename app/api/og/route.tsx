import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "The Healing and Growth Journal";
    const category = searchParams.get("category") || "Reflections & Letters";
    const isSundayLove = searchParams.get("isSundayLove") === "true";
    const author = searchParams.get("author") || "Glory";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#FAF7F2",
            padding: "60px 80px",
            fontFamily: "serif",
            border: "16px solid #283E2C",
            boxSizing: "border-box",
          }}
        >
          {/* Top Brand Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "2px solid #EAE0D1",
              paddingBottom: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "22px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  color: "#283E2C",
                  fontWeight: "bold",
                }}
              >
                The Healing & Growth Journal
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#866746",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginTop: "4px",
                  fontFamily: "sans-serif",
                }}
              >
                Words for when you are learning how to carry what changed you
              </span>
            </div>

            {isSundayLove ? (
              <div
                style={{
                  backgroundColor: "#E5EDE6",
                  color: "#283E2C",
                  padding: "8px 18px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontFamily: "sans-serif",
                  border: "1px solid #C4D9C6",
                }}
              >
                The Sunday Love Series
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#F4ECE0",
                  color: "#866746",
                  padding: "8px 18px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontFamily: "sans-serif",
                  border: "1px solid #D3BEA1",
                }}
              >
                {category}
              </div>
            )}
          </div>

          {/* Center Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              margin: "30px 0",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 60 ? "46px" : "56px",
                lineHeight: "1.2",
                color: "#22160D",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom Author Byline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "2px solid #EAE0D1",
              paddingTop: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  fontSize: "16px",
                  color: "#4F3925",
                  fontFamily: "sans-serif",
                  fontWeight: "600",
                }}
              >
                By {author} • Counselling Psychologist
              </span>
            </div>

            <span
              style={{
                fontSize: "14px",
                color: "#866746",
                letterSpacing: "1px",
                fontFamily: "sans-serif",
              }}
            >
              thehealingandgrowthjournal.com
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
