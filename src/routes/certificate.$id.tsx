import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCertificatePublic } from "@/lib/certificates.functions";
import { Loader2, Download, Linkedin, Award } from "lucide-react";

export const Route = createFileRoute("/certificate/$id")({
  head: () => ({
    meta: [
      { title: "Certificate of Completion — DCPG Membership Portal" },
      { name: "description", content: "Certificate of Completion from Ryan Rieder's DCPG Membership Portal." },
    ],
  }),
  component: CertificatePage,
});

const BASE_URL = "https://learn.dcpracticegrowth.com";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function CertificatePage() {
  const { id } = Route.useParams();
  const fetchCert = useServerFn(getCertificatePublic);

  const certQ = useQuery({
    queryKey: ["certificate", id],
    queryFn: () => fetchCert({ data: { id } }),
    retry: false,
  });

  if (certQ.isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f6f0] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0f172a]" />
      </div>
    );
  }

  if (!certQ.data) {
    return (
      <div className="min-h-screen bg-[#f8f6f0] flex flex-col items-center justify-center gap-4 p-6 text-center">
        <Award className="h-16 w-16 text-[#c9a227]/40" />
        <h1 className="text-2xl font-bold text-[#0f172a]">Certificate not found</h1>
        <p className="text-[#6b7280] max-w-md">This certificate doesn't exist or may have been removed.</p>
        <Link to="/dashboard" className="text-[#c9a227] hover:underline text-sm">Back to dashboard →</Link>
      </div>
    );
  }

  const cert = certQ.data;
  const certUrl = `${BASE_URL}/certificate/${cert.id}`;
  const typeLabel = cert.type === "course" ? "Course" : "Category";
  const linkedInMsg = `I just earned a ${typeLabel} Certificate for "${cert.reference_name}" from Ryan Rieder's DC Practice Growth Membership Portal! 🎓 #Chiropractic #PracticeGrowth #DCPG`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}&summary=${encodeURIComponent(linkedInMsg)}`;

  return (
    <>
      {/* Print-specific CSS */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .cert-page { min-height: 100vh; background: white; display: flex; align-items: center; justify-content: center; }
          .cert-wrap { box-shadow: none !important; }
        }
        @page { size: A4 landscape; margin: 10mm; }
      `}</style>

      {/* Action buttons — hidden on print */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-[#0f172a] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#0f172a]/90 transition-colors shadow-lg"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
        <a
          href={linkedInHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#0077b5] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#0077b5]/90 transition-colors shadow-lg"
        >
          <Linkedin className="h-4 w-4" />
          Share on LinkedIn
        </a>
      </div>

      {/* Back link */}
      <div className="no-print fixed top-4 left-4 z-50">
        <Link
          to="/dashboard"
          className="text-sm text-[#6b7280] hover:text-[#0f172a] transition-colors"
        >
          ← Back to portal
        </Link>
      </div>

      {/* Certificate */}
      <div className="cert-page min-h-screen bg-[#f8f6f0] flex items-center justify-center px-4 py-16">
        <div
          className="cert-wrap w-full bg-white"
          style={{
            maxWidth: 860,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            border: "10px solid #0f172a",
            outline: "3px solid #c9a227",
            outlineOffset: "-18px",
            padding: "64px 72px 56px",
            fontFamily: "Georgia, 'Times New Roman', serif",
            position: "relative",
          }}
        >
          {/* Corner ornaments */}
          {(["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"] as const).map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-8 h-8 border-[3px] border-[#c9a227]`}
              style={{
                borderRadius: 0,
                borderTopWidth: pos.includes("top") ? 3 : 0,
                borderBottomWidth: pos.includes("bottom") ? 3 : 0,
                borderLeftWidth: pos.includes("left") ? 3 : 0,
                borderRightWidth: pos.includes("right") ? 3 : 0,
              }}
            />
          ))}

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/dcpg-logo.png"
              alt="DC Practice Growth"
              style={{ height: 52, objectFit: "contain" }}
            />
          </div>

          {/* Gold divider */}
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #c9a227, transparent)", marginBottom: 28 }} />

          {/* Heading */}
          <div className="text-center mb-8">
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 13,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#6b7280",
                marginBottom: 12,
              }}
            >
              DC Practice Growth
            </p>
            <h1
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 46,
                fontWeight: 700,
                color: "#c9a227",
                lineHeight: 1.1,
                marginBottom: 0,
                letterSpacing: "-0.5px",
              }}
            >
              Certificate of Completion
            </h1>
          </div>

          {/* Body text */}
          <div className="text-center" style={{ marginBottom: 32 }}>
            <p
              style={{
                fontStyle: "italic",
                color: "#9ca3af",
                fontSize: 18,
                marginBottom: 18,
              }}
            >
              This certifies that
            </p>

            {/* Member name */}
            <p
              style={{
                fontFamily: "Cambria, Georgia, serif",
                fontSize: 52,
                fontWeight: 700,
                color: "#0f172a",
                lineHeight: 1.1,
                marginBottom: 20,
                letterSpacing: "-1px",
              }}
            >
              {cert.user_name}
            </p>

            <p
              style={{
                fontStyle: "italic",
                color: "#9ca3af",
                fontSize: 18,
                marginBottom: 16,
              }}
            >
              has successfully completed
            </p>

            {/* Course/category name */}
            <p
              style={{
                fontFamily: "Cambria, Georgia, serif",
                fontSize: 32,
                fontWeight: 700,
                color: "#c9a227",
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              {cert.reference_name}
            </p>

            <p
              style={{
                fontSize: 14,
                color: "#9ca3af",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              {cert.type === "course" ? "Online Course" : "Category Curriculum"}
            </p>

            {/* Date */}
            <p
              style={{
                fontSize: 15,
                color: "#6b7280",
              }}
            >
              Issued on{" "}
              <span style={{ fontWeight: 600, color: "#0f172a" }}>{formatDate(cert.issued_at)}</span>
            </p>
          </div>

          {/* Gold divider */}
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #c9a227, transparent)", marginBottom: 28 }} />

          {/* Signature line */}
          <div className="flex items-end justify-between">
            <div>
              <div
                style={{
                  fontFamily: "Brush Script MT, cursive, Georgia, serif",
                  fontSize: 38,
                  color: "#0f172a",
                  lineHeight: 1,
                  marginBottom: 6,
                  letterSpacing: "-0.5px",
                }}
              >
                Dr Ryan Rieder
              </div>
              <div style={{ width: 200, height: 1, background: "#0f172a", marginBottom: 4 }} />
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Dr. Ryan Rieder</p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>DC Practice Growth</p>
            </div>

            <div className="text-right">
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  border: "3px solid #c9a227",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "auto",
                  marginBottom: 4,
                }}
              >
                <Award
                  style={{ width: 32, height: 32, color: "#c9a227" }}
                />
              </div>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>Certificate ID</p>
              <p style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace", margin: 0 }}>
                {cert.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
