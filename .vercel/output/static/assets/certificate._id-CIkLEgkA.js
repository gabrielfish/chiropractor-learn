import{d as x,j as t,L as a}from"./index-Br4Ff7Z7.js";import{u as b}from"./useQuery-Dzb2WM6n.js";import{u as y}from"./createServerFn-DQds9kfB.js";import{g as u}from"./certificates.functions-BiEOI2gm.js";import{L as j}from"./loader-circle-xnbuhUnU.js";import{A as o}from"./award-9jIAeg6C.js";import{D as w,L as N}from"./linkedin-B9b1bFS6.js";import"./auth-middleware-DY6sOHY8.js";import"./createLucideIcon-DrrNwGKi.js";const v="https://learn.dcpracticegrowth.com";function z(i){return new Date(i).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}function P(){const{id:i}=x.useParams(),n=y(u),r=b({queryKey:["certificate",i],queryFn:()=>n({data:{id:i}}),retry:!1});if(r.isLoading)return t.jsx("div",{className:"min-h-screen bg-[#f8f6f0] flex items-center justify-center",children:t.jsx(j,{className:"h-8 w-8 animate-spin text-[#0f172a]"})});if(!r.data)return t.jsxs("div",{className:"min-h-screen bg-[#f8f6f0] flex flex-col items-center justify-center gap-4 p-6 text-center",children:[t.jsx(o,{className:"h-16 w-16 text-[#c9a227]/40"}),t.jsx("h1",{className:"text-2xl font-bold text-[#0f172a]",children:"Certificate not found"}),t.jsx("p",{className:"text-[#6b7280] max-w-md",children:"This certificate doesn't exist or may have been removed."}),t.jsx(a,{to:"/dashboard",className:"text-[#c9a227] hover:underline text-sm",children:"Back to dashboard →"})]});const e=r.data,s=`${v}/certificate/${e.id}`,c=`Excited to share that I just completed "${e.reference_name}" with Dr Ryan Rieder at DC Practice Growth! 🎓 Highly recommend for any chiropractor looking to grow their practice. #Chiropractic #PracticeGrowth #DCPracticeGrowth`,m=`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(s)}&summary=${encodeURIComponent(c)}`;return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
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
      `}),t.jsxs("div",{className:"no-print fixed top-4 right-4 z-50 flex gap-2",children:[t.jsxs("button",{onClick:()=>window.print(),className:"inline-flex items-center gap-2 bg-[#0f172a] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#0f172a]/90 transition-colors shadow-lg",children:[t.jsx(w,{className:"h-4 w-4"}),"Download PDF"]}),t.jsxs("a",{href:m,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-2 bg-[#0077b5] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#0077b5]/90 transition-colors shadow-lg",children:[t.jsx(N,{className:"h-4 w-4"}),"Share on LinkedIn"]})]}),t.jsx("div",{className:"no-print fixed top-4 left-4 z-50",children:t.jsx(a,{to:"/dashboard",className:"text-sm text-[#6b7280] hover:text-[#0f172a] transition-colors",children:"← Back to portal"})}),t.jsx("div",{className:"cert-page min-h-screen bg-[#f8f6f0] flex items-center justify-center px-4 py-16",children:t.jsxs("div",{className:"cert-wrap w-full bg-white",style:{maxWidth:880,boxShadow:"0 24px 80px rgba(0,0,0,0.18)",border:"12px solid #0f172a",outline:"3px solid #c9a227",outlineOffset:"-20px",padding:"56px 68px 48px",fontFamily:"Georgia, 'Times New Roman', serif",position:"relative"},children:[[{cls:"top-4 left-4",t:3,b:0,l:3,r:0},{cls:"top-4 right-4",t:3,b:0,l:0,r:3},{cls:"bottom-4 left-4",t:0,b:3,l:3,r:0},{cls:"bottom-4 right-4",t:0,b:3,l:0,r:3}].map(({cls:l,t:p,b:d,l:h,r:f},g)=>t.jsx("div",{className:`cert-corner absolute ${l} w-9 h-9`,style:{borderColor:"#c9a227",borderStyle:"solid",borderTopWidth:p,borderBottomWidth:d,borderLeftWidth:h,borderRightWidth:f}},g)),t.jsx("div",{className:"flex justify-center mb-5",children:t.jsx("img",{className:"cert-logo",src:"/dcpg-logo.png",alt:"DC Practice Growth",style:{height:52,objectFit:"contain"}})}),t.jsx("div",{className:"cert-divider",style:{height:2,background:"linear-gradient(90deg, transparent, #c9a227, transparent)",marginBottom:22}}),t.jsxs("div",{className:"text-center mb-5",children:[t.jsx("p",{className:"cert-label",style:{fontFamily:"Georgia, serif",fontSize:12,letterSpacing:"0.3em",textTransform:"uppercase",color:"#9ca3af",marginBottom:10},children:"DC Practice Growth"}),t.jsx("h1",{className:"cert-heading",style:{fontFamily:"Georgia, 'Times New Roman', serif",fontSize:48,fontWeight:800,color:"#c9a227",lineHeight:1.05,margin:0,letterSpacing:"-0.5px"},children:"Certificate of Completion"})]}),t.jsxs("div",{className:"cert-body text-center",style:{marginBottom:24},children:[t.jsx("p",{className:"cert-certifies",style:{fontStyle:"italic",color:"#9ca3af",fontSize:16,marginBottom:12},children:"This certifies that"}),t.jsx("p",{className:"cert-name",style:{fontFamily:"Cambria, Georgia, serif",fontSize:52,fontWeight:900,color:"#0f172a",lineHeight:1.05,marginBottom:16,letterSpacing:"-1.5px"},children:e.user_name}),t.jsx("p",{className:"cert-completed",style:{fontStyle:"italic",color:"#9ca3af",fontSize:16,marginBottom:12},children:"has successfully completed"}),t.jsx("p",{className:"cert-course",style:{fontFamily:"Cambria, Georgia, serif",fontSize:30,fontWeight:700,color:"#c9a227",lineHeight:1.2,marginBottom:5},children:e.reference_name}),t.jsx("p",{className:"cert-type",style:{fontSize:12,color:"#9ca3af",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:16},children:e.type==="course"?"Online Course":"Category Curriculum"}),t.jsxs("p",{className:"cert-date",style:{fontSize:14,color:"#6b7280"},children:["Issued on"," ",t.jsx("span",{style:{fontWeight:700,color:"#0f172a"},children:z(e.issued_at)})]})]}),t.jsx("div",{className:"cert-divider",style:{height:2,background:"linear-gradient(90deg, transparent, #c9a227, transparent)",marginBottom:22}}),t.jsxs("div",{className:"flex items-end justify-between",children:[t.jsxs("div",{children:[t.jsx("div",{className:"cert-sig-name",style:{fontFamily:"Brush Script MT, cursive, Georgia, serif",fontSize:40,color:"#0f172a",lineHeight:1,marginBottom:6},children:"Dr Ryan Rieder"}),t.jsx("div",{className:"cert-sig-line",style:{width:200,height:1,background:"#0f172a",marginBottom:4}}),t.jsx("p",{className:"cert-sig-label",style:{fontSize:12,color:"#6b7280",margin:0},children:"Dr. Ryan Rieder"}),t.jsx("p",{className:"cert-sig-label",style:{fontSize:12,color:"#6b7280",margin:0},children:"DC Practice Growth"})]}),t.jsxs("div",{className:"text-right",children:[t.jsx("div",{className:"cert-badge",style:{width:72,height:72,borderRadius:"50%",border:"3px solid #c9a227",display:"flex",alignItems:"center",justifyContent:"center",marginLeft:"auto",marginBottom:4},children:t.jsx(o,{style:{width:32,height:32,color:"#c9a227"}})}),t.jsx("p",{className:"cert-id-label",style:{fontSize:11,color:"#9ca3af",margin:0},children:"Certificate ID"}),t.jsx("p",{className:"cert-id-value",style:{fontSize:10,color:"#9ca3af",fontFamily:"monospace",margin:0},children:e.id.slice(0,8).toUpperCase()})]})]})]})})]})}export{P as component};
