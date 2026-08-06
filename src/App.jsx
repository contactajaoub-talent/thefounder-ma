import { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";

const C = {
  navy: "#0A1628",
  navyLight: "#132240",
  navyMid: "#1A2D4A",
  accent: "#2E6BCC",
  accentLight: "#4A8AE5",
  accentGlow: "rgba(46,107,204,0.25)",
  white: "#FFFFFF",
  off: "#DEE4EF",
  muted: "#7E92B5",
  dark: "#060D18",
  card: "rgba(19,34,64,0.55)",
  border: "rgba(46,107,204,0.12)",
  borderH: "rgba(46,107,204,0.35)",
};

/* ── SVG Icons ── */
const I = {
  Diag: () => (<svg width="38" height="38" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="16" stroke={C.accent} strokeWidth="1.2" opacity=".25"/><path d="M10 19h4l3-7 4 14 3-7h4" stroke={C.accentLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Struct: () => (<svg width="38" height="38" viewBox="0 0 38 38" fill="none"><rect x="13" y="6" width="12" height="7" rx="2" stroke={C.accentLight} strokeWidth="1.3"/><rect x="4" y="25" width="11" height="7" rx="2" stroke={C.accentLight} strokeWidth="1.3"/><rect x="23" y="25" width="11" height="7" rx="2" stroke={C.accentLight} strokeWidth="1.3"/><path d="M19 13v5m0 3v4m-9.5 0v-3h19v3" stroke={C.accent} strokeWidth="1.2" strokeLinecap="round"/></svg>),
  Sys: () => (<svg width="38" height="38" viewBox="0 0 38 38" fill="none"><circle cx="19" cy="19" r="5.5" stroke={C.accentLight} strokeWidth="1.3"/><circle cx="19" cy="19" r="11" stroke={C.accent} strokeWidth=".8" opacity=".35"/><circle cx="19" cy="8" r="2.2" fill={C.accent}/><circle cx="28.5" cy="24.5" r="2.2" fill={C.accent}/><circle cx="9.5" cy="24.5" r="2.2" fill={C.accent}/><path d="M19 13.5V10.5M24 22l3 1.8M14 22l-3 1.8" stroke={C.accentLight} strokeWidth="1.3"/></svg>),
  Stab: () => (<svg width="38" height="38" viewBox="0 0 38 38" fill="none"><path d="M8 30L19 9l11 21H8z" stroke={C.accentLight} strokeWidth="1.3" strokeLinejoin="round"/><path d="M13.5 23L19 14l5.5 9h-11z" stroke={C.accent} strokeWidth=".8" opacity=".4"/><line x1="19" y1="17" x2="19" y2="22" stroke={C.accentLight} strokeWidth="1.3" strokeLinecap="round"/><circle cx="19" cy="25" r="1.3" fill={C.accentLight}/></svg>),
  Auto: () => (<svg width="38" height="38" viewBox="0 0 38 38" fill="none"><path d="M19 6v5m0 16v5M6 19h5m16 0h5" stroke={C.accent} strokeWidth="1.2" strokeLinecap="round"/><circle cx="19" cy="19" r="7.5" stroke={C.accentLight} strokeWidth="1.3"/><path d="M15 19l3 3 5-6" stroke={C.accentLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Arch: () => (<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><rect x="5" y="5" width="24" height="24" rx="3" stroke={C.accentLight} strokeWidth="1.3"/><line x1="5" y1="13" x2="29" y2="13" stroke={C.accent} strokeWidth=".8" opacity=".4"/><line x1="13" y1="13" x2="13" y2="29" stroke={C.accent} strokeWidth=".8" opacity=".4"/><circle cx="9" cy="9" r="1.5" fill={C.accentLight}/><rect x="17" y="17" width="8" height="4" rx="1" stroke={C.accentLight} strokeWidth="1"/><rect x="17" y="24" width="8" height="2" rx="1" stroke={C.accent} strokeWidth=".8" opacity=".5"/></svg>),
  Pres: () => (<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><circle cx="17" cy="13" r="5.5" stroke={C.accentLight} strokeWidth="1.3"/><path d="M7.5 28c0-5.25 4.25-9.5 9.5-9.5s9.5 4.25 9.5 9.5" stroke={C.accentLight} strokeWidth="1.3" strokeLinecap="round"/><path d="M23 11l3.5-3.5m0 0H23m3.5 0v3.5" stroke={C.accent} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Grow: () => (<svg width="34" height="34" viewBox="0 0 34 34" fill="none"><path d="M5 27l7.5-9.5 5.5 5.5L28 10" stroke={C.accentLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 10h6v6" stroke={C.accent} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Arr: () => (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9h10m-3-3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Chk: () => (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 8l3.5 3.5 5.5-7" stroke={C.accentLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  Cal: () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.3"/><line x1="3" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.3"/><line x1="7" y1="3" x2="7" y2="6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><line x1="13" y1="3" x2="13" y2="6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>),
  Dl: () => (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v10m0 0l-3.5-3.5M10 13l3.5-3.5M4 16h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

/* ── Intersection Observer ── */
function useInView(t = 0.12) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = r.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    o.observe(el); return () => o.disconnect();
  }, [t]);
  return [r, v];
}

function Anim({ children, d = 0, y = 28, cls = "" }) {
  const [r, v] = useInView();
  return <div ref={r} className={cls} style={{ opacity: v ? 1 : 0, transform: v ? "none" : `translateY(${y}px)`, transition: `opacity 0.7s cubic-bezier(.25,.46,.45,.94) ${d}s, transform 0.7s cubic-bezier(.25,.46,.45,.94) ${d}s` }}>{children}</div>;
}

/* ── Logo ── */
function Logo({ size = "sm" }) {
  const f = size === "lg" ? "30px" : "18px";
  return (
    <div style={{ lineHeight: 1, userSelect: "none" }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: f, color: C.white, letterSpacing: "1px" }}>thefounder.ma</span>
    </div>
  );
}

/* ── Label ── */
function Label({ t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
      <div style={{ width: "28px", height: "1px", background: C.accent }} />
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "3.5px", textTransform: "uppercase", color: C.accent }}>{t}</span>
    </div>
  );
}

/* ══════════════════════════════ */
/* MAIN APP                     */
/* ══════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [menu, setMenu] = useState(false);
  const [fd, setFd] = useState({ nom:"", prenom:"", email:"", tel:"", entreprise:"", secteur:"", ca:"", equipe:"", probleme:"", budget:"", creneau:"" });
  const [step, setStep] = useState(1);
  const [scrolled, setSc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(""); // <-- Erreur réparée ici

  // ── Validation des étapes ──
  const handleNext = () => {
    setError(""); // On réinitialise l'erreur
    
    // Vérification Étape 1
    if (step === 1) {
      if (!fd.prenom || !fd.nom || !fd.email || !fd.tel) {
        setError("Veuillez remplir tous les champs pour continuer.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(fd.email)) {
        setError("Veuillez entrer une adresse email valide.");
        return;
      }
    }
    
    // Vérification Étape 2
    if (step === 2) {
      if (!fd.entreprise || !fd.secteur || !fd.ca || !fd.equipe) {
        setError("Veuillez remplir tous les champs pour continuer.");
        return;
      }
    }
    
    setStep(s => s + 1);
  };

  const handleFinalSubmit = () => {
    setError("");
    // Vérification Étape 3
    if (step === 3) {
      if (!fd.probleme || !fd.budget) {
        setError("Veuillez remplir tous les champs pour continuer.");
        return;
      }
    }
    // Si tout est bon, on lance l'envoi
    submitToSalesforce();
  };

  useEffect(() => { const f = () => setSc(window.scrollY > 50); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);

  // ── Scroll auto quand on arrive au calendrier ──
  useEffect(() => {
    if (step === 4) {
      setTimeout(() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, [step]);

  // ── Salesforce Web-to-Lead (direct POST via hidden iframe) ──
  const SF_OID = "00Dd3000008Bhcw";
  const submitToSalesforce = async () => {
    setSubmitting(true);
    try {
      const iframe = document.createElement("iframe");
      iframe.name = "sf_target";
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8";
      form.target = "sf_target";

      const fields = {
        oid: SF_OID,
        retURL: "https://thefounder.ma",
        first_name: fd.prenom,
        last_name: fd.nom,
        email: fd.email,
        phone: fd.tel,
        company: fd.entreprise,

        // Standard Salesforce field
        lead_source: "Web",

        // Custom Salesforce fields
        "00Nd300000AmvSr": "The Founder",              // Brand
        "00Nd300000AmgIY": "Strategic Diagnostic",     // Request Type
        "00Nd300000Amve9": "90-Day Program",           // Requested Offer
        "00Nd300000AmvmD": "New",                      // Qualification Stage
        "00Nd300000Amvsf": fd.secteur || "",           // Business Sector
        "00Nd300000Amvnp": fd.ca || "",                // Monthly Revenue
        "00Nd300000AmvpR": fd.equipe || "",            // Team Size
        "00Nd300000Amvr3": fd.probleme || "",          // Main Challenge
        "00Nd300000AmvhN": "Custom Quote",             // Estimated Budget
        "00Nd300000Amvkb": window.location.href,       // Website Page URL

        // Backup summary for fast review in Salesforce
        description: [
          "Brand: The Founder",
          "Request Type: Strategic Diagnostic",
          `Company: ${fd.entreprise || ""}`,
          `Business Sector: ${fd.secteur || ""}`,
          `Monthly Revenue: ${fd.ca || ""}`,
          `Team Size: ${fd.equipe || ""}`,
          `Main Challenge: ${fd.probleme || ""}`,
          `Investment Budget: ${fd.budget || ""}`,
          `Website Page: ${window.location.href}`,
        ].join("\n"),
      };

      Object.entries(fields).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v || "";
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
      }, 2000);

      setSubmitted(true);
      setStep(4);
    } catch (err) {
      console.error("Salesforce submission error:", err);
      setSubmitted(true);
      setStep(4);
    } finally {
      setSubmitting(false);
    }
  };

  const go = id => { setMenu(false); if (page !== "home") { setPage("home"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 120); return; } document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const uf = (k, v) => setFd(p => ({ ...p, [k]: v }));

  const S = {
    wrap: { minHeight: "100vh", background: C.dark, color: C.white, fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" },
    nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: scrolled ? "12px 0" : "20px 0", background: scrolled ? "rgba(6,13,24,0.94)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent", transition: "all 0.35s ease" },
    con: { maxWidth: "1100px", margin: "0 auto", padding: "0 20px" },
    h2: { fontFamily: "'Instrument Serif', serif", fontSize: "clamp(26px, 4.5vw, 46px)", fontWeight: 400, lineHeight: 1.15, color: C.white, margin: 0 },
    p: { fontSize: "15px", lineHeight: 1.75, color: C.muted, margin: 0, fontWeight: 400 },
    card: { background: C.card, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "28px", backdropFilter: "blur(8px)", transition: "border-color 0.3s, transform 0.3s" },
    btn: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", background: C.accent, color: C.white, border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s", fontFamily: "'DM Sans', sans-serif" },
    btnO: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 28px", background: "transparent", color: C.white, border: `1px solid ${C.border}`, borderRadius: "8px", fontSize: "13px", fontWeight: 500, cursor: "pointer", transition: "all 0.3s", fontFamily: "'DM Sans', sans-serif" },
    inp: { width: "100%", padding: "13px 16px", background: "rgba(10,22,40,0.85)", border: `1px solid ${C.border}`, borderRadius: "8px", color: C.white, fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" },
    sec: { padding: "clamp(80px, 12vw, 120px) 0" },
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:${C.dark}}
    ::selection{background:${C.accent};color:#fff}
    .nl{color:${C.muted};font-size:12px;font-weight:500;letter-spacing:1.2px;text-transform:uppercase;cursor:pointer;border:none;background:none;font-family:'DM Sans',sans-serif;transition:color .3s;padding:8px 0}
    .nl:hover{color:${C.white}}
    .ch:hover{border-color:${C.borderH}!important;transform:translateY(-3px)!important}
    .approach-card{transition:border-color .4s,transform .4s,box-shadow .4s}
    .approach-card:hover{border-color:${C.borderH}!important;transform:translateY(-6px)!important;box-shadow:0 12px 40px rgba(46,107,204,0.15)!important}
    .approach-card:hover .ac-icon{transform:scale(1.1);background:rgba(46,107,204,0.14)!important}
    .ac-icon{transition:transform .4s,background .4s}
    .phase-card-anim{transition:border-color .4s,transform .4s,box-shadow .4s}
    .phase-card-anim:hover{border-color:${C.borderH}!important;transform:translateY(-5px)!important;box-shadow:0 10px 32px rgba(46,107,204,0.12)!important}
    .phase-card-anim:hover .pc-icon{transform:scale(1.1);background:rgba(46,107,204,0.14)!important}
    .pc-icon{transition:transform .4s,background .4s}
    .cb:hover{background:${C.accentLight}!important;transform:translateY(-1px);box-shadow:0 6px 24px ${C.accentGlow}}
    .ob:hover{border-color:${C.accentLight}!important;color:${C.accentLight}!important}
    .if:focus{border-color:${C.accent}!important}
    .ph:hover{border-color:${C.borderH}!important}
    .ph:hover .pn{color:${C.accentLight}!important}
    .rb:hover{background:${C.accent}!important;border-color:${C.accent}!important;color:#fff!important}
    @keyframes hf{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
    .ht{animation:hf .85s cubic-bezier(.25,.46,.45,.94) .15s both}
    .hs{animation:hf .85s cubic-bezier(.25,.46,.45,.94) .4s both}
    .hc{animation:hf .85s cubic-bezier(.25,.46,.45,.94) .65s both}
    @keyframes pulse{0%,100%{opacity:.3}50%{opacity:.6}}
    .mm{display:none;background:none;border:none;color:#fff;font-size:22px;cursor:pointer;padding:8px}
    @media(min-width:1101px){
      .con-wide{max-width:900px!important}
    }
    @media(max-width:1100px) and (min-width:821px){
      .pg{grid-template-columns:repeat(3,1fr)!important}
      .dg{grid-template-columns:repeat(3,1fr)!important}
      .hg{gap:36px!important}
      .fg{gap:36px!important}
    }
    @media(max-width:820px){
      .nd{display:none!important}
      .mm{display:block!important}
      .hg{grid-template-columns:1fr!important;gap:40px!important}
      .tg{grid-template-columns:1fr!important;gap:16px!important}
      .dg{grid-template-columns:1fr!important;gap:16px!important}
      .pg{grid-template-columns:1fr 1fr!important;gap:14px!important}
      .fg{grid-template-columns:1fr!important;gap:36px!important}
      .fmg{grid-template-columns:1fr!important}
      .arrow-mid{display:none!important}
      .sec-p{padding:60px 0!important}
      .hero-wrap{padding-top:100px!important;min-height:auto!important;padding-bottom:60px!important}
      .hero-h1{font-size:32px!important}
      .hero-cta-wrap{flex-direction:column!important}
      .hero-cta-wrap button{width:100%!important;justify-content:center!important}
      .quote-text{font-size:22px!important;padding:0 8px!important}
      .booking-card{padding:24px!important}
      .booking-section{max-width:100%!important}
      .footer-copy{flex-direction:column!important;text-align:center!important}
      .calendly-frame{height:580px!important;min-height:580px!important}
    }
    @media(max-width:480px){
      .fmg{grid-template-columns:1fr!important}
      .pg{grid-template-columns:1fr!important}
      .hero-h1{font-size:26px!important}
      .step-labels{display:none!important}
      .booking-card{padding:18px!important}
      .calendly-frame{height:520px!important;min-height:520px!important}
    }
  `;

  // ══════════════════════════
  //  RESOURCES PAGE
  // ══════════════════════════
  if (page === "resources") {
    const res = [
      { title: "Guide : Structurer votre activité en 7 étapes", desc: "Un framework actionnable pour passer d'une activité désorganisée à un système clair. Adapté au marché marocain.", type: "PDF", icon: I.Struct },
      { title: "Checklist : Audit de votre business en 15 minutes", desc: "Identifiez vos points de friction, vos leviers cachés et vos priorités d'action immédiates.", type: "Checklist", icon: I.Diag },
      { title: "Template : Pipeline de prospection structurée", desc: "Un modèle prêt à l'emploi pour organiser votre acquisition client de manière prévisible.", type: "Template", icon: I.Grow },
      { title: "Masterclass : Les 3 piliers d'un business autonome", desc: "Vidéo exclusive sur l'architecture interne, la présence digitale et les systèmes de croissance.", type: "Vidéo", icon: I.Sys },
      { title: "Calculateur de ROI structuration", desc: "Estimez le gain en temps, en revenus et en stabilité qu'une structuration peut vous apporter.", type: "Outil", icon: I.Stab },
      { title: "Guide : Automatisation intelligente", desc: "Découvrez comment mettre en place des mécanismes automatisés sans complexifier votre organisation.", type: "PDF", icon: I.Auto },
    ];
    return (
      <div style={S.wrap}><style>{css}</style>
        <nav style={S.nav}><div style={{ ...S.con, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ cursor: "pointer" }} onClick={() => { setPage("home"); window.scrollTo(0,0); }}><Logo /></div>
          <button className="ob" onClick={() => { setPage("home"); window.scrollTo(0,0); }} style={{ ...S.btnO, padding: "9px 22px", fontSize: "12px" }}>Retour</button>
        </div></nav>

        <div style={{ paddingTop: "140px", paddingBottom: "60px", background: `linear-gradient(180deg,${C.navy} 0%,${C.dark} 100%)` }}>
          <div style={S.con}><Anim>
            <Label t="Ressources gratuites" />
            <h1 style={{ ...S.h2, fontSize: "clamp(28px, 5vw, 48px)", marginBottom: "16px" }}>Accélérez votre <span style={{ color: C.accentLight, fontStyle: "italic" }}>structuration</span></h1>
            <p style={{ ...S.p, maxWidth: "550px", fontSize: "16px" }}>Des outils et frameworks conçus pour les entrepreneurs qui veulent passer au niveau supérieur.</p>
          </Anim></div>
        </div>

        <div style={{ ...S.sec, paddingTop: "20px" }} className="sec-p"><div style={S.con}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(320px,100%),1fr))", gap: "20px" }}>
            {res.map((r, i) => { const Ic = r.icon; return (
              <Anim key={i} d={i * 0.08}>
                <div className="ch" style={{ ...S.card, display: "flex", flexDirection: "column", gap: "18px", height: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ padding: "9px", background: "rgba(46,107,204,0.08)", borderRadius: "10px" }}><Ic /></div>
                    <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: C.accent, padding: "5px 10px", background: "rgba(46,107,204,0.07)", borderRadius: "16px" }}>{r.type}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "19px", fontWeight: 400, color: C.white, lineHeight: 1.35 }}>{r.title}</h3>
                  <p style={{ fontSize: "13px", lineHeight: 1.65, color: C.muted }}>{r.desc}</p>
                  <div style={{ marginTop: "auto", paddingTop: "6px" }}>
                    <button className="rb" style={{ ...S.btnO, padding: "11px 20px", fontSize: "12px", width: "100%", justifyContent: "center" }}><I.Dl /> Télécharger</button>
                  </div>
                </div>
              </Anim>
            ); })}
          </div>
        </div></div>

        <div style={{ padding: "40px 0 100px" }}><div style={S.con}><Anim>
          <div style={{ ...S.card, textAlign: "center", padding: "50px 30px", background: `linear-gradient(135deg,${C.navyLight},${C.navyMid})`, border: `1px solid ${C.borderH}` }}>
            <h3 style={{ ...S.h2, fontSize: "clamp(22px,3vw,28px)", marginBottom: "14px" }}>Prêt pour une transformation complète ?</h3>
            <p style={{ ...S.p, maxWidth: "460px", margin: "0 auto 28px" }}>Ces ressources sont un aperçu. Le vrai changement commence avec un accompagnement structuré.</p>
            <button className="cb" onClick={() => { setPage("home"); setTimeout(() => go("booking"), 200); }} style={S.btn}><I.Cal /> Réserver votre diagnostic</button>
          </div>
        </Anim></div></div>
      </div>
    );
  }

  // ══════════════════════════
  //  HOME PAGE
  // ══════════════════════════
  const navItems = [
    { l: "Programme", id: "programme" },
    { l: "Transformation", id: "transformation" },
    { l: "Méthodologie", id: "methodologie" },
    { l: "Ressources", fn: () => { setPage("resources"); window.scrollTo(0,0); } },
  ];

  return (
    <div style={S.wrap}><style>{css}</style>

      {/* ─── NAV ─── */}
      <nav style={S.nav}><div style={{ ...S.con, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Logo /></div>
        <div className="nd" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {navItems.map((n, i) => <button key={i} className="nl" onClick={n.fn || (() => go(n.id))}>{n.l}</button>)}
          <button className="cb" onClick={() => go("booking")} style={{ ...S.btn, padding: "10px 24px", fontSize: "11px" }}>Réserver</button>
        </div>
        <button className="mm" onClick={() => setMenu(!menu)}>{menu ? "\u2715" : "\u2630"}</button>
      </div>
      {menu && <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px", background: C.navy, borderTop: `1px solid ${C.border}` }}>
        {navItems.map((n, i) => <button key={i} className="nl" style={{ textAlign: "left" }} onClick={() => { setMenu(false); n.fn ? n.fn() : go(n.id); }}>{n.l}</button>)}
        <button className="cb" onClick={() => { setMenu(false); go("booking"); }} style={{ ...S.btn, justifyContent: "center", width: "100%" }}>Réserver</button>
      </div>}
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero-wrap" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", background: `linear-gradient(168deg,${C.navy} 0%,${C.dark} 55%)`, overflow: "hidden", paddingTop: "120px", paddingBottom: "40px" }}>
        <div style={{ position: "absolute", top: "15%", right: "8%", width: "350px", height: "350px", background: `radial-gradient(circle,${C.accentGlow},transparent 70%)`, animation: "pulse 7s ease infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "25%", left: "12%", width: "250px", height: "250px", background: "radial-gradient(circle,rgba(46,107,204,0.08),transparent 70%)", animation: "pulse 9s ease 3s infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "700px", border: "1px solid rgba(46,107,204,0.04)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ ...S.con, position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: "680px" }}>
            <h1 className="hs hero-h1" style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 6vw, 60px)", fontWeight: 400, lineHeight: 1.1, color: C.white }}>
              En 90 jours, nous transformons<br />
              votre activité en un <span style={{ color: C.accentLight, fontStyle: "italic" }}>système<br />
              structuré, stable</span> et autonome.
            </h1>
            <div className="hc hero-cta-wrap" style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "40px" }}>
              <button className="cb" onClick={() => go("booking")} style={S.btn}><I.Cal /> Réserver votre diagnostic</button>
              <button className="ob" onClick={() => go("programme")} style={S.btnO}>Découvrir le programme <I.Arr /></button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRANSFORMATION ─── */}
      <section id="programme" />
      <section id="transformation" style={{ ...S.sec, background: `linear-gradient(180deg,${C.dark} 0%,${C.navy} 50%,${C.dark} 100%)` }} className="sec-p">
        <div style={S.con}>
          <Anim><Label t="La transformation" />
            <h2 style={{ ...S.h2, marginBottom: "50px" }}>D'une activité qui tourne,<br /><span style={{ color: C.accentLight, fontStyle: "italic" }}>vers un système qui performe.</span></h2>
          </Anim>

          <div className="tg" style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", gap: "20px", alignItems: "start" }}>
            <Anim d={0.1}>
              <div style={{ ...S.card, borderColor: "rgba(224,82,82,0.12)" }}>
                <div style={{ marginBottom: "24px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#E05252", padding: "4px 12px", background: "rgba(224,82,82,0.08)", borderRadius: "4px" }}>Avant</span>
                </div>
                {["Activité active mais peu structurée", "Effort élevé pour maintenir le niveau", "Visibilité et positionnement sous-exploités", "Systèmes dispersés sans cohérence", "Croissance imprévisible et instable"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "14px" }}>
                    <div style={{ minWidth: "5px", height: "5px", borderRadius: "50%", background: "#E05252", marginTop: "8px", opacity: .5 }} />
                    <span style={{ fontSize: "13.5px", color: C.muted, lineHeight: 1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
            </Anim>

            <Anim d={0.25} cls="arrow-mid">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", paddingTop: "70px" }}>
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M7 18h22M22 11l7 7-7 7" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </Anim>

            <Anim d={0.15}>
              <div style={{ ...S.card, borderColor: "rgba(46,107,204,0.2)" }}>
                <div style={{ marginBottom: "24px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: C.accentLight, padding: "4px 12px", background: "rgba(46,107,204,0.1)", borderRadius: "4px" }}>Après</span>
                </div>
                {["Activité structurée avec des fondations solides", "Systèmes clairs, cohérents et autonomes", "Présence alignée avec le niveau du business", "Opérations lisibles et flux maîtrisés", "Capacité à absorber et soutenir la croissance"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "14px" }}>
                    <div style={{ minWidth: "16px" }}><I.Chk /></div>
                    <span style={{ fontSize: "13.5px", color: C.off, lineHeight: 1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
            </Anim>
          </div>
        </div>
      </section>

      {/* ─── 3 NIVEAUX ─── */}
      <section style={{ ...S.sec, background: C.dark }} className="sec-p">
        <div style={S.con}>
          <Anim><Label t="Notre approche" />
            <h2 style={{ ...S.h2, marginBottom: "12px" }}>Trois niveaux d'intervention.<br /><span style={{ color: C.muted, fontWeight: 400, fontStyle: "italic" }}>Simultanément.</span></h2>
            <p style={{ ...S.p, maxWidth: "520px", marginBottom: "50px" }}>Ce n'est pas une prestation isolée. Nous intervenons sur l'ensemble du système pour garantir une cohérence globale.</p>
          </Anim>
          <div className="dg" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }}>
            {[
              { icon: I.Arch, title: "Architecture Interne", desc: "Structuration des opérations, clarification des flux de travail, organisation des processus clés pour un business lisible et pilotable." },
              { icon: I.Pres, title: "Présence & Positionnement", desc: "Alignement de votre image avec votre niveau réel. Parcours client, points de contact et mécanismes de conversion." },
              { icon: I.Grow, title: "Systèmes de Croissance", desc: "Mise en place de leviers intelligents — automatisation, acquisition maîtrisée, outils rationalisés — pour une croissance prévisible." },
            ].map((item, i) => { const Ic = item.icon; return (
              <Anim key={i} d={i * 0.12}>
                <div className="approach-card" style={{ ...S.card, height: "100%", display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div className="ac-icon" style={{ padding: "12px", background: "rgba(46,107,204,0.07)", borderRadius: "11px", width: "fit-content" }}><Ic /></div>
                  <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "21px", fontWeight: 400, color: C.white }}>{item.title}</h3>
                  <p style={{ fontSize: "13.5px", lineHeight: 1.7, color: C.muted }}>{item.desc}</p>
                </div>
              </Anim>
            ); })}
          </div>
        </div>
      </section>

      {/* ─── MÉTHODOLOGIE ─── */}
      <section id="methodologie" style={{ ...S.sec, background: `linear-gradient(180deg,${C.dark} 0%,${C.navy} 100%)` }} className="sec-p">
        <div style={S.con}>
          <Anim><Label t="Méthodologie" />
            <h2 style={{ ...S.h2, marginBottom: "12px" }}>Founder System <span style={{ fontStyle: "italic", color: C.accentLight }}>Transformation</span></h2>
            <p style={{ ...S.p, maxWidth: "560px", marginBottom: "60px" }}>Un programme de 90 jours. Intensif les 2 premières semaines, puis un accompagnement stratégique continu vers l'autonomie complète.</p>
          </Anim>
          <div className="pg" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "14px" }}>
            {[
              { n: "01", t: "Diagnostic & Clarté", d: "Analyse globale de votre activité. Flux, frictions et leviers existants.", dur: "Semaine 1", ic: I.Diag },
              { n: "02", t: "Structuration", d: "Organisation des processus, clarification des rôles, base opérationnelle cohérente.", dur: "Semaine 1-2", ic: I.Struct },
              { n: "03", t: "Systèmes Intelligents", d: "Parcours clients, conversion, présence digitale, automatisation.", dur: "Semaines 3-6", ic: I.Sys },
              { n: "04", t: "Stabilisation", d: "Qualité des interactions, suivi structuré, maîtrise des flux.", dur: "Semaines 6-10", ic: I.Stab },
              { n: "05", t: "Autonomie", d: "Documentation, logique maîtrisée, capacité d'évolution autonome.", dur: "Semaines 10-13", ic: I.Auto },
            ].map((ph, i) => { const Ic = ph.ic; return (
              <Anim key={i} d={i * 0.08}>
                <div className="phase-card-anim ph" style={{ ...S.card, height: "100%", display: "flex", flexDirection: "column", gap: "14px", padding: "24px 20px", position: "relative", overflow: "hidden" }}>
                  <span className="pn" style={{ fontFamily: "'Instrument Serif', serif", fontSize: "44px", fontWeight: 400, color: "rgba(46,107,204,0.1)", position: "absolute", top: "10px", right: "14px", lineHeight: 1, transition: "color .3s" }}>{ph.n}</span>
                  <div className="pc-icon" style={{ padding: "9px", background: "rgba(46,107,204,0.07)", borderRadius: "10px", width: "fit-content" }}><Ic /></div>
                  <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "2.5px", textTransform: "uppercase", color: C.accent }}>{ph.dur}</span>
                  <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "18px", fontWeight: 400, color: C.white, lineHeight: 1.3 }}>{ph.t}</h3>
                  <p style={{ fontSize: "12.5px", lineHeight: 1.6, color: C.muted, marginTop: "auto" }}>{ph.d}</p>
                </div>
              </Anim>
            ); })}
          </div>
        </div>
      </section>

      {/* ─── POUR QUI ─── */}
      <section style={{ ...S.sec, background: C.navy }} className="sec-p">
        <div style={S.con}>
          <div className="hg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", alignItems: "center" }}>
            <Anim>
              <Label t="Pour qui" />
              <h2 style={{ ...S.h2, marginBottom: "18px" }}>Ce programme est conçu pour ceux <span style={{ color: C.accentLight, fontStyle: "italic" }}>qui ont déjà construit.</span></h2>
              <p style={{ ...S.p, marginBottom: "32px" }}>Vous n'êtes pas un débutant. Vous avez une activité, des clients, une expérience. Mais le prochain palier exige une autre approche.</p>
              <button className="cb" onClick={() => go("booking")} style={S.btn}>C'est mon cas <I.Arr /></button>
            </Anim>
            <Anim d={0.15}>
              <div>
                {["Vous avez déjà une activité qui génère des revenus", "Vous sentez que votre organisation freine votre potentiel", "Vous voulez passer au niveau supérieur sans tout complexifier", "Vous cherchez un partenaire stratégique, pas un exécutant", "Vous êtes prêt à investir 90 jours pour transformer votre système"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ minWidth: "16px", marginTop: "2px" }}><I.Chk /></div>
                    <span style={{ fontSize: "14px", color: C.off, lineHeight: 1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
            </Anim>
          </div>
        </div>
      </section>

      {/* ─── QUOTE ─── */}
      <section style={{ padding: "clamp(60px,10vw,90px) 0", background: C.dark, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center,${C.accentGlow},transparent 60%)`, opacity: .12, pointerEvents: "none" }} />
        <div style={{ ...S.con, position: "relative", textAlign: "center" }}><Anim>
          <p className="quote-text" style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(20px, 3.2vw, 34px)", fontWeight: 400, lineHeight: 1.55, color: C.white, maxWidth: "750px", margin: "0 auto", fontStyle: "italic" }}>
            "Votre activité fonctionne déjà. Nous la structurons, l'alignons et la renforçons pour en faire un système stable, lisible et capable de soutenir votre croissance."
          </p>
        </Anim></div>
      </section>

      {/* ─── BOOKING ─── */}
      <section id="booking" style={{ ...S.sec, background: `linear-gradient(180deg,${C.dark} 0%,${C.navy} 100%)` }} className="sec-p">
        <div className="booking-section" style={{ ...S.con, maxWidth: step === 4 ? "900px" : "760px", transition: "max-width 0.4s ease" }}>
          <Anim>
            <div style={{ textAlign: "center", marginBottom: "44px" }}>
              <Label t="Commencer" />
              <h2 style={{ ...S.h2, marginBottom: "14px" }}>Réservez votre <span style={{ color: C.accentLight, fontStyle: "italic" }}>diagnostic stratégique</span></h2>
              <p style={{ ...S.p, maxWidth: "500px", margin: "0 auto" }}>Chaque programme est sur sur mesure. Partagez votre situation pour un accompagnement parfaitement adapté.</p>
            </div>
          </Anim>
          <Anim d={0.15}>
            <div className="booking-card" style={{ ...S.card, padding: "36px", border: `1px solid ${C.borderH}` }}>
              {/* Progress */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "28px" }}>
                {[1,2,3,4].map(s => <div key={s} style={{ flex: 1, height: "2.5px", borderRadius: "2px", background: step >= s ? C.accent : "rgba(46,107,204,0.12)", transition: "background .4s" }} />)}
              </div>
              <div className="step-labels" style={{ display: "flex", justifyContent: "space-between", marginBottom: "28px" }}>
                {["Coordonnées", "Votre activité", "Votre projet", "Réservation"].map((l, i) => (
                  <span key={i} style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: step === i+1 ? C.accentLight : C.muted, transition: "color .3s" }}>{l}</span>
                ))}
              </div>

              {/* Step 1 */}
              {step === 1 && <div>
                <div className="fmg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                  <div><label style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "7px" }}>Prénom</label>
                  <input className="if" style={S.inp} value={fd.prenom} onChange={e => uf("prenom", e.target.value)} placeholder="Votre prénom" /></div>
                  <div><label style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "7px" }}>Nom</label>
                  <input className="if" style={S.inp} value={fd.nom} onChange={e => uf("nom", e.target.value)} placeholder="Votre nom" /></div>
                </div>
                <div style={{ marginBottom: "14px" }}><label style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "7px" }}>Email professionnel</label>
                <input className="if" style={S.inp} type="email" value={fd.email} onChange={e => uf("email", e.target.value)} placeholder="votre@email.com" /></div>
                <div><label style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "7px" }}>Téléphone</label>
                <input className="if" style={S.inp} type="tel" value={fd.tel} onChange={e => uf("tel", e.target.value)} placeholder="+212 6XX XXX XXX" /></div>
              </div>}

              {/* Step 2 */}
              {step === 2 && <div>
                <div className="fmg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                  <div><label style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "7px" }}>Entreprise</label>
                  <input className="if" style={S.inp} value={fd.entreprise} onChange={e => uf("entreprise", e.target.value)} placeholder="Nom de votre entreprise" /></div>
                  <div><label style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "7px" }}>Secteur</label>
                  <input className="if" style={S.inp} value={fd.secteur} onChange={e => uf("secteur", e.target.value)} placeholder="E-commerce, Services, Tech..." /></div>
                </div>
                <div className="fmg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div><label style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "7px" }}>CA mensuel</label>
                  <select className="if" style={{ ...S.inp, cursor: "pointer", appearance: "none" }} value={fd.ca} onChange={e => uf("ca", e.target.value)}>
                    <option value="" style={{ background: C.navy }}>Sélectionner</option>
                    <option value="<20k" style={{ background: C.navy }}>Moins de 20 000 MAD</option>
                    <option value="20-50k" style={{ background: C.navy }}>20 000 - 50 000 MAD</option>
                    <option value="50-100k" style={{ background: C.navy }}>50 000 - 100 000 MAD</option>
                    <option value="100-500k" style={{ background: C.navy }}>100 000 - 500 000 MAD</option>
                    <option value=">500k" style={{ background: C.navy }}>Plus de 500 000 MAD</option>
                  </select></div>
                  <div><label style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "7px" }}>Taille équipe</label>
                  <select className="if" style={{ ...S.inp, cursor: "pointer", appearance: "none" }} value={fd.equipe} onChange={e => uf("equipe", e.target.value)}>
                    <option value="" style={{ background: C.navy }}>Sélectionner</option>
                    <option value="Solo Founder" style={{ background: C.navy }}>Solo / Fondateur seul</option>
                    <option value="2–5 people" style={{ background: C.navy }}>2 à 5 personnes</option>
                    <option value="6–10 people" style={{ background: C.navy }}>6 à 10 personnes</option>
                    <option value="11–25 people" style={{ background: C.navy }}>11 à 25 personnes</option>
                    <option value="More than 25 people" style={{ background: C.navy }}>Plus de 25 personnes</option>
                  </select></div>
                </div>
              </div>}

              {/* Step 3 */}
              {step === 3 && <div>
                <div style={{ marginBottom: "14px" }}><label style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "7px" }}>Principal défi actuel</label>
                <textarea className="if" style={{ ...S.inp, minHeight: "90px", resize: "vertical" }} value={fd.probleme} onChange={e => uf("probleme", e.target.value)} placeholder="Quel est le plus gros frein à votre croissance ?" /></div>
                <div style={{ marginBottom: "14px" }}><label style={{ fontSize: "11px", fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "7px" }}>Budget d'investissement</label>
                <select className="if" style={{ ...S.inp, cursor: "pointer", appearance: "none" }} value={fd.budget} onChange={e => uf("budget", e.target.value)}>
                  <option value="" style={{ background: C.navy }}>Sélectionner votre fourchette</option>
                  <option value="1-5k" style={{ background: C.navy }}>1 000 - 5 000 MAD</option>
                  <option value="5-10k" style={{ background: C.navy }}>5 000 - 10 000 MAD</option>
                  <option value="10-20k" style={{ background: C.navy }}>10 000 - 20 000 MAD</option>
                  <option value="20-50k" style={{ background: C.navy }}>20 000 - 50 000 MAD</option>
                  <option value="50k+" style={{ background: C.navy }}>Plus de 50 000 MAD</option>
                </select></div>
              </div>}

              {/* Step 4 - Google Agenda */}
              {step === 4 && <div>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "rgba(46,107,204,0.1)", borderRadius: "8px", marginBottom: "16px" }}>
                    <I.Chk />
                    <span style={{ fontSize: "13px", fontWeight: 500, color: C.accentLight }}>Informations enregistrées avec succès</span>
                  </div>
                  <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.6 }}>Choisissez maintenant le créneau qui vous convient pour votre diagnostic stratégique.</p>
                </div>
                
                <div 
                  className="google-calendar-frame" 
                  style={{ minHeight: "660px", borderRadius: "8px", overflow: "hidden", background: C.white }}
                >
                  <iframe
                    src="https://calendar.app.google/2rQEaXEthDjFJ2bg8"
                    width="100%"
                    height="660"
                    frameBorder="0"
                    title="Google Agenda"
                    style={{ borderRadius: "8px", border: "none" }}
                  />
                </div>
              </div>}

              {/* Affichage de l'erreur */}
              {error && (
                <div style={{ padding: "10px 14px", background: "rgba(224,82,82,0.1)", borderLeft: "3px solid #E05252", color: "#E05252", fontSize: "13px", marginTop: "20px", borderRadius: "4px" }}>
                  {error}
                </div>
              )}

              {/* Nav buttons (Corrigés et uniques) */}
              {step < 4 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px", gap: "12px", flexWrap: "wrap" }}>
                  {step > 1 ? (
                    <button className="ob" onClick={() => { setError(""); setStep(s => s-1); }} style={S.btnO}>Retour</button>
                  ) : <div />}
                  
                  {step < 3 ? (
                    <button className="cb" onClick={handleNext} style={S.btn}>Continuer <I.Arr /></button>
                  ) : (
                    <button className="cb" disabled={submitting} onClick={handleFinalSubmit} style={{ ...S.btn, opacity: submitting ? 0.7 : 1, pointerEvents: submitting ? "none" : "auto" }}>
                      {submitting ? "Envoi en cours..." : <><I.Cal /> Valider et réserver</>}
                    </button>
                  )}
                </div>
              )}

            </div>
          </Anim>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: "70px 0 36px", background: C.navy, borderTop: `1px solid ${C.border}` }}>
        <div style={S.con}>
          <div className="fg" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "50px", marginBottom: "50px" }}>
            <div>
              <p style={{ ...S.p, fontSize: "13px", maxWidth: "320px", lineHeight: 1.8 }}>Programme opérationnel de 90 jours pour entrepreneurs et dirigeants.</p>
              <p style={{ ...S.p, fontSize: "13px", marginTop: "8px", letterSpacing: "0.5px" }}>Structuration. Performance. Autonomie.</p>
            </div>
            <div>
              <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.white, marginBottom: "18px" }}>Programme</h4>
              {["Diagnostic", "Structuration", "Systèmes", "Stabilisation", "Autonomie"].map((l, i) => <p key={i} style={{ fontSize: "13px", color: C.muted, marginBottom: "10px", cursor: "pointer" }}>{l}</p>)}
            </div>
            <div>
              <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: C.white, marginBottom: "18px" }}>Contact</h4>
              <p style={{ fontSize: "13px", color: C.muted, marginBottom: "10px" }}>contact@thefounder.ma</p>
              <p style={{ fontSize: "13px", color: C.muted, marginBottom: "10px" }}>Rabat, Maroc</p>
              <button className="ob" onClick={() => go("booking")} style={{ ...S.btnO, padding: "9px 18px", fontSize: "11px", marginTop: "6px" }}>Réserver un appel</button>
            </div>
          </div>
          <div className="footer-copy" style={{ borderTop: `1px solid ${C.border}`, paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: C.muted }}>2026 thefounder.ma — Tous droits réservés</span>
          </div>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}
