import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCertificatePublic } from "@/lib/certificates.functions";
import { Loader2, Download, Linkedin, Award } from "lucide-react";

export const Route = createFileRoute("/certificate/$id")({
  head: () => ({
    meta: [
      { title: "Certificate of Completion — DCPG Membership Portal" },
      { name: "description", content: "Certificate of Completion from Dr Ryan Rieder's DC Practice Growth Membership Portal." },
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

  const descPart = cert.reference_description
    ? ` This course covers ${cert.reference_description}.`
    : "";
  const linkedInMsg = `Excited to share that I just completed "${cert.reference_name}" with Dr Ryan Rieder at DC Practice Growth! 🎓${descPart} Highly recommend for any chiropractor looking to grow their practice. #Chiropractic #PracticeGrowth #DCPracticeGrowth`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}&summary=${encodeURIComponent(linkedInMsg)}`;

  return (
    <>
      {/* Print / PDF CSS — hides all UI chrome, prints only the certificate */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          html, body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .cert-page {
            min-height: unset !important;
            background: white !important;
            padding: 0 !important;
            display: block !important;
          }
          .cert-wrap {
            box-shadow: none !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            border-width: 8px !important;
          }
        }
        @page {
          size: A4 landscape;
          margin: 8mm;
        }
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
            maxWidth: 880,
            boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
            border: "12px solid #0f172a",
            outline: "3px solid #c9a227",
            outlineOffset: "-20px",
            padding: "60px 72px 52px",
            fontFamily: "Georgia, 'Times New Roman', serif",
            position: "relative",
          }}
        >
          {/* Corner ornaments */}
          {([
            { cls: "top-4 left-4", t: 3, b: 0, l: 3, r: 0 },
            { cls: "top-4 right-4", t: 3, b: 0, l: 0, r: 3 },
            { cls: "bottom-4 left-4", t: 0, b: 3, l: 3, r: 0 },
            { cls: "bottom-4 right-4", t: 0, b: 3, l: 0, r: 3 },
          ]).map(({ cls, t, b, l, r }, i) => (
            <div
              key={i}
              className={`absolute ${cls} w-9 h-9`}
              style={{
                borderColor: "#c9a227",
                borderStyle: "solid",
                borderTopWidth: t,
                borderBottomWidth: b,
                borderLeftWidth: l,
                borderRightWidth: r,
              }}
            />
          ))}

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <img
              src="/dcpg-logo.png"
              alt="DC Practice Growth"
              style={{ height: 54, objectFit: "contain" }}
            />
          </div>

          {/* Gold divider */}
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #c9a227, transparent)", marginBottom: 24 }} />

          {/* Heading */}
          <div className="text-center mb-6">
            <p style={{ fontFamily: "Georgia, serif", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 10 }}>
              DC Practice Growth
            </p>
            <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 52, fontWeight: 800, color: "#c9a227", lineHeight: 1.05, margin: 0, letterSpacing: "-0.5px" }}>
              Certificate of Completion
            </h1>
          </div>

          {/* Body */}
          <div className="text-center" style={{ marginBottom: 28 }}>
            <p style={{ fontStyle: "italic", color: "#9ca3af", fontSize: 17, marginBottom: 14 }}>
              This certifies that
            </p>

            {/* Member name — larger, bolder, more impressive */}
            <p style={{ fontFamily: "Cambria, Georgia, serif", fontSize: 64, fontWeight: 900, color: "#0f172a", lineHeight: 1.05, marginBottom: 18, letterSpacing: "-2px" }}>
              {cert.user_name}
            </p>

            <p style={{ fontStyle: "italic", color: "#9ca3af", fontSize: 17, marginBottom: 14 }}>
              has successfully completed
            </p>

            {/* Course/category name */}
            <p style={{ fontFamily: "Cambria, Georgia, serif", fontSize: 34, fontWeight: 700, color: "#c9a227", lineHeight: 1.2, marginBottom: 6 }}>
              {cert.reference_name}
            </p>

            <p style={{ fontSize: 13, color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
              {cert.type === "course" ? "Online Course" : "Category Curriculum"}
            </p>

            <p style={{ fontSize: 15, color: "#6b7280" }}>
              Issued on{" "}
              <span style={{ fontWeight: 700, color: "#0f172a" }}>{formatDate(cert.issued_at)}</span>
            </p>
          </div>

          {/* Gold divider */}
          <div style={{ height: 2, background: "linear-gradient(90deg, transparent, #c9a227, transparent)", marginBottom: 24 }} />

          {/* Signature line */}
          <div className="flex items-end justify-between">
            <div>
              <div style={{ fontFamily: "Brush Script MT, cursive, Georgia, serif", fontSize: 40, color: "#0f172a", lineHeight: 1, marginBottom: 6 }}>
                Dr Ryan Rieder
              </div>
              <div style={{ width: 220, height: 1, background: "#0f172a", marginBottom: 4 }} />
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Dr. Ryan Rieder</p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>DC Practice Growth</p>
            </div>

            <div className="text-right">
              <div style={{ width: 76, height: 76, borderRadius: "50%", border: "3px solid #c9a227", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginBottom: 4 }}>
                <Award style={{ width: 34, height: 34, color: "#c9a227" }} />
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
