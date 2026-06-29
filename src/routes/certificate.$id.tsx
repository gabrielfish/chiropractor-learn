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
  const linkedInMsg = `Excited to share that I just completed "${cert.reference_name}" with Dr Ryan Rieder at DC Practice Growth! 🎓 Highly recommend for any chiropractor looking to grow their practice. #Chiropractic #PracticeGrowth #DCPracticeGrowth`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}&summary=${encodeURIComponent(linkedInMsg)}`;

  return (
    <>
      {/*
        PRINT CSS STRATEGY
        ─────────────────
        @page margin: 0  →  full 297×210mm available
        html/body fixed to 297×210mm, overflow hidden  →  exactly one page
        .cert-page fills the viewport exactly
        .cert-wrap uses mm widths + reduced padding in print
        Class-named text elements have smaller font-sizes in print
        page-break-inside: avoid prevents any split across pages
      */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }

          .no-print {
            display: none !important;
          }

          html, body {
            width: 297mm !important;
            height: 210mm !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .cert-page {
            width: 297mm !important;
            height: 210mm !important;
            min-height: unset !important;
            background: white !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .cert-wrap {
            width: 275mm !important;
            max-width: 275mm !important;
            height: 194mm !important;
            box-shadow: none !important;
            border: 6px solid #0f172a !important;
            outline: 2px solid #c9a227 !important;
            outline-offset: -10px !important;
            padding: 14mm 18mm 12mm !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }

          /* Scale down fonts so everything fits in 194mm height */
          .cert-logo       { height: 34px !important; }
          .cert-divider    { margin-bottom: 10px !important; }
          .cert-label      { font-size: 9px !important; margin-bottom: 6px !important; }
          .cert-heading    { font-size: 32px !important; }
          .cert-body       { margin-bottom: 14px !important; }
          .cert-certifies  { font-size: 13px !important; margin-bottom: 8px !important; }
          .cert-name       { font-size: 44px !important; margin-bottom: 10px !important; letter-spacing: -1px !important; }
          .cert-completed  { font-size: 13px !important; margin-bottom: 8px !important; }
          .cert-course     { font-size: 24px !important; margin-bottom: 4px !important; }
          .cert-type       { font-size: 10px !important; margin-bottom: 10px !important; }
          .cert-date       { font-size: 12px !important; }
          .cert-sig-name   { font-size: 28px !important; }
          .cert-sig-line   { width: 140px !important; }
          .cert-sig-label  { font-size: 10px !important; }
          .cert-badge      { width: 50px !important; height: 50px !important; }
          .cert-badge svg  { width: 22px !important; height: 22px !important; }
          .cert-id-label   { font-size: 9px !important; }
          .cert-id-value   { font-size: 8px !important; }
          .cert-corner     { width: 24px !important; height: 24px !important; }
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
            padding: "56px 68px 48px",
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
              className={`cert-corner absolute ${cls} w-9 h-9`}
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
              className="cert-logo"
              src="/dcpg-logo.png"
              alt="DC Practice Growth"
              style={{ height: 52, objectFit: "contain" }}
            />
          </div>

          {/* Gold divider */}
          <div
            className="cert-divider"
            style={{ height: 2, background: "linear-gradient(90deg, transparent, #c9a227, transparent)", marginBottom: 22 }}
          />

          {/* Heading */}
          <div className="text-center mb-5">
            <p
              className="cert-label"
              style={{ fontFamily: "Georgia, serif", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 10 }}
            >
              DC Practice Growth
            </p>
            <h1
              className="cert-heading"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 48, fontWeight: 800, color: "#c9a227", lineHeight: 1.05, margin: 0, letterSpacing: "-0.5px" }}
            >
              Certificate of Completion
            </h1>
          </div>

          {/* Body */}
          <div className="cert-body text-center" style={{ marginBottom: 24 }}>
            <p
              className="cert-certifies"
              style={{ fontStyle: "italic", color: "#9ca3af", fontSize: 16, marginBottom: 12 }}
            >
              This certifies that
            </p>

            {/* Member name */}
            <p
              className="cert-name"
              style={{ fontFamily: "Cambria, Georgia, serif", fontSize: 52, fontWeight: 900, color: "#0f172a", lineHeight: 1.05, marginBottom: 16, letterSpacing: "-1.5px" }}
            >
              {cert.user_name}
            </p>

            <p
              className="cert-completed"
              style={{ fontStyle: "italic", color: "#9ca3af", fontSize: 16, marginBottom: 12 }}
            >
              has successfully completed
            </p>

            {/* Course/category name */}
            <p
              className="cert-course"
              style={{ fontFamily: "Cambria, Georgia, serif", fontSize: 30, fontWeight: 700, color: "#c9a227", lineHeight: 1.2, marginBottom: 5 }}
            >
              {cert.reference_name}
            </p>

            <p
              className="cert-type"
              style={{ fontSize: 12, color: "#9ca3af", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}
            >
              {cert.type === "course" ? "Online Course" : "Category Curriculum"}
            </p>

            <p
              className="cert-date"
              style={{ fontSize: 14, color: "#6b7280" }}
            >
              Issued on{" "}
              <span style={{ fontWeight: 700, color: "#0f172a" }}>{formatDate(cert.issued_at)}</span>
            </p>
          </div>

          {/* Gold divider */}
          <div
            className="cert-divider"
            style={{ height: 2, background: "linear-gradient(90deg, transparent, #c9a227, transparent)", marginBottom: 22 }}
          />

          {/* Signature line */}
          <div className="flex items-end justify-between">
            <div>
              <div
                className="cert-sig-name"
                style={{ fontFamily: "Brush Script MT, cursive, Georgia, serif", fontSize: 40, color: "#0f172a", lineHeight: 1, marginBottom: 6 }}
              >
                Dr Ryan Rieder
              </div>
              <div
                className="cert-sig-line"
                style={{ width: 200, height: 1, background: "#0f172a", marginBottom: 4 }}
              />
              <p className="cert-sig-label" style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Dr. Ryan Rieder</p>
              <p className="cert-sig-label" style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>DC Practice Growth</p>
            </div>

            <div className="text-right">
              <div
                className="cert-badge"
                style={{ width: 72, height: 72, borderRadius: "50%", border: "3px solid #c9a227", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", marginBottom: 4 }}
              >
                <Award style={{ width: 32, height: 32, color: "#c9a227" }} />
              </div>
              <p className="cert-id-label" style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>Certificate ID</p>
              <p className="cert-id-value" style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace", margin: 0 }}>
                {cert.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
