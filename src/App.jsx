import { useState, useEffect, useRef, useCallback } from "react";

// ─── NOTE ────────────────────────────────────────────────────────────────────
// Fonts, CSS variables, animations and global resets are defined in index.css
// which is imported via src/main.jsx. Nothing inline needed here.

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INIT_VENDORS = [
  { id:"v1", name:"Glam by Lekshmi", email:"glam_by_lekshmi@test.com", password:"artist123",
    category:"Hair & Makeup", district:"Kochi", price:15000, rating:4.9, reviews:142,
    bio:"Transforming brides into goddesses since 2015. Specialising in traditional Kerala bridal makeup with a modern editorial edge.",
    tags:["Bridal Makeup","Eye Art","Saree Draping Assist"], verified:"verified",
    whatsapp:"9876543210", portfolio:["#C9A84C","#D4899A","#8B6914"],
    clicks:1240, inquiries:89,
    reelIds:["r1","r3"] },
  { id:"v2", name:"Threads & Grace", email:"threads@test.com", password:"pass",
    category:"Draping", district:"Trivandrum", price:8000, rating:4.7, reviews:98,
    bio:"Kerala's most sought-after saree draping artiste. 12 styles across Kasavu, Kanjeevaram & Pattu.",
    tags:["Kasavu Draping","Kanjeevaram","Pattu Saree"], verified:"verified",
    whatsapp:"9876543211", portfolio:["#F2C4CE","#E8CB7A","#FAF6F0"],
    clicks:876, inquiries:54,
    reelIds:["r2"] },
  { id:"v3", name:"Blooms & Mandaps", email:"blooms@test.com", password:"pass",
    category:"Decoration", district:"Kozhikode", price:45000, rating:4.8, reviews:67,
    bio:"Transforming venues into floral dreamscapes. Expert in traditional Nirapaara setups and contemporary minimalist designs.",
    tags:["Floral Mandap","Nirapaara","Stage Decor"], verified:"verified",
    whatsapp:"9876543212", portfolio:["#B5536A","#C9A84C","#F2C4CE"],
    clicks:654, inquiries:41,
    reelIds:["r4"] },
  { id:"v4", name:"Golden Knot Draping", email:"goldenknot@test.com", password:"pass",
    category:"Draping", district:"Kochi", price:12000, rating:5.0, reviews:211,
    bio:"Top-rated draping studio. Pioneer of the 'Golden Kerala' draping technique that's taken the bridal scene by storm.",
    tags:["Golden Kerala Style","Bridal Draping","Pre-wedding"], verified:"top-rated",
    whatsapp:"9876543213", portfolio:["#8B6914","#E8CB7A","#C9A84C"],
    clicks:2100, inquiries:178,
    reelIds:["r5"] },
  { id:"v5", name:"Hamper House Kerala", email:"hamper@test.com", password:"pass",
    category:"Hampers", district:"Kozhikode", price:5000, rating:4.6, reviews:55,
    bio:"Curated luxury wedding hampers. From thalappoli sets to elegant gift baskets.",
    tags:["Bridal Hampers","Thalappoli","Gift Sets"], verified:"verified",
    whatsapp:"9876543214", portfolio:["#FAF6F0","#F5EDE0","#C9A84C"],
    clicks:320, inquiries:28,
    reelIds:[] },
  { id:"v6", name:"Radiance Bridal Studio", email:"radiance@test.com", password:"pass",
    category:"Hair & Makeup", district:"Kochi", price:25000, rating:0, reviews:0,
    bio:"Newly launched studio bringing Mumbai-style editorial bridal looks to Kerala.",
    tags:["Editorial Bridal","Airbrush Makeup","HD Bridal"], verified:"pending",
    whatsapp:"9876543215", portfolio:["#D4899A","#B5536A","#FAF6F0"],
    clicks:0, inquiries:0,
    reelIds:[] },
  { id:"v7", name:"Aswathy Drapes & Style", email:"aswathy@test.com", password:"pass",
    category:"Draping", district:"Trivandrum", price:9000, rating:0, reviews:0,
    bio:"Passionate saree draper with 8 years of experience in all South Indian styles.",
    tags:["South Indian Draping","Nair Bride","Christian Bridal"], verified:"pending",
    whatsapp:"9876543216", portfolio:["#E8CB7A","#FAF6F0","#D4899A"],
    clicks:0, inquiries:0,
    reelIds:[] },
  { id:"v8", name:"Mehndi by Sindhu", email:"sindhu@test.com", password:"pass",
    category:"Hair & Makeup", district:"Trivandrum", price:6000, rating:4.5, reviews:33,
    bio:"Intricate Kerala and Rajasthani mehndi designs. Specialising in bridal full-hand patterns.",
    tags:["Mehndi Art","Bridal Henna","Arabic Mehndi"], verified:"verified",
    whatsapp:"9876543217", portfolio:["#C9A84C","#8B6914","#FAF6F0"],
    clicks:445, inquiries:32,
    reelIds:["r6"] },
];

const REELS = [
  { id:"r1", vendorId:"v1", title:"Bride Unfiltered", caption:"Pure Kerala bridal look — Kasavu saree, temple jewels, and a glow that speaks volumes ✨", tags:["Hair & Makeup","Draping"], bg:"linear-gradient(160deg,#8B6914 0%,#C9A84C 40%,#F2C4CE 100%)" },
  { id:"r2", vendorId:"v2", title:"The Kasavu Drape", caption:"9 yards of heritage, draped to perfection. The traditional Kerala Mundum Neriyathum ❤️", tags:["Draping"], bg:"linear-gradient(160deg,#FAF6F0 0%,#E8CB7A 50%,#C9A84C 100%)" },
  { id:"r3", vendorId:"v1", title:"Evening Bride", caption:"From Nikah morning to reception night — one look, elevated for each moment 🌙", tags:["Hair & Makeup"], bg:"linear-gradient(160deg,#D4899A 0%,#B5536A 50%,#2C1A0E 100%)" },
  { id:"r4", vendorId:"v3", title:"Mandap Dreams", caption:"Jasmine, marigold, and the scent of new beginnings. Our signature Nirapaara setup 🌸", tags:["Decoration"], bg:"linear-gradient(160deg,#F2C4CE 0%,#D4899A 40%,#8B6914 100%)" },
  { id:"r5", vendorId:"v4", title:"The Golden Knot", caption:"Our signature Golden Kerala drape — where tradition meets couture ✨", tags:["Draping"], bg:"linear-gradient(160deg,#C9A84C 0%,#8B6914 50%,#2C1A0E 100%)" },
  { id:"r6", vendorId:"v8", title:"Mehndi Morning", caption:"Stories written in henna, fingers adorned with love 🤍", tags:["Hair & Makeup"], bg:"linear-gradient(160deg,#E8CB7A 0%,#C9A84C 40%,#6B4C35 100%)" },
];

const USERS = {
  "anupama.kerala@test.com": { password:"vows2026", role:"client", name:"Anupama", id:"u1" },
  "glam_by_lekshmi@test.com": { password:"artist123", role:"vendor", name:"Lekshmi", vendorId:"v1" },
  "admin_verify@vows.com": { password:"secure_vows_99", role:"admin", name:"Vows Admin" },
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size=20, color="currentColor", style={} }) => {
  const paths = {
    heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
    bookmark: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18M6 6l12 12",
    search: "M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM21 21l-4.35-4.35",
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    film: "M2 8h20M2 16h20M8 2v20M16 2v20M3 2h18a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",
    tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
    whatsapp: "M12 2C6.48 2 2 6.48 2 12c0 1.93.54 3.73 1.47 5.27L2 22l4.86-1.44C8.32 21.46 10.1 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z",
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    bar: "M18 20V10M12 20V4M6 20v-6",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    arrow_left: "M19 12H5M12 5l-7 7 7 7",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
    camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    check_circle: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3",
    clock: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
    sparkle: "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={paths[name] || ""} />
    </svg>
  );
};

// ─── BADGE COMPONENT ─────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const cfg = {
    verified: { label:"✦ Verified", bg:"#E8F5E9", color:"#2E7D32", border:"#A5D6A7" },
    "top-rated": { label:"★ Top Rated", bg:"#FFF8E1", color:"#8B6914", border:"#FFD54F" },
    pending: { label:"⏳ Pending", bg:"#FFF3E0", color:"#BF360C", border:"#FFAB91" },
    rejected: { label:"✕ Rejected", bg:"#FFEBEE", color:"#B71C1C", border:"#EF9A9A" },
  };
  const c = cfg[status] || cfg.pending;
  return (
    <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, letterSpacing:"0.05em",
      background:c.bg, color:c.color, border:`1px solid ${c.border}`, fontFamily:"'Jost',sans-serif" }}>
      {c.label}
    </span>
  );
};

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const demo = [
    { label:"Client", e:"anupama.kerala@test.com", p:"vows2026" },
    { label:"Vendor", e:"glam_by_lekshmi@test.com", p:"artist123" },
    { label:"Admin", e:"admin_verify@vows.com", p:"secure_vows_99" },
  ];

  const submit = () => {
    setLoading(true); setErr("");
    setTimeout(() => {
      const u = USERS[email.toLowerCase().trim()];
      if (u && u.password === pass) { onLogin({ ...u, email }); }
      else { setErr("Invalid credentials. Try the demo buttons below."); }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 40%, #F2C4CE 100%)", position:"relative", overflow:"hidden" }}>
      {/* Decorative */}
      <div style={{ position:"absolute", top:-100, right:-100, width:400, height:400, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)" }} />
      <div style={{ position:"absolute", bottom:-80, left:-80, width:300, height:300, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(242,196,206,0.3) 0%, transparent 70%)" }} />

      <div className="fade-up" style={{ width:"100%", maxWidth:420, padding:"0 24px" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontSize:11, letterSpacing:"0.3em", color:"var(--gold)", fontWeight:600, marginBottom:8 }}>KERALA'S FINEST</div>
          <h1 style={{ fontSize:52, fontWeight:300, lineHeight:1, color:"var(--text-dark)", marginBottom:4 }}>Vows</h1>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
            <div style={{ height:1, flex:1, background:"linear-gradient(to right, transparent, var(--gold))" }} />
            <span style={{ fontSize:18, color:"var(--gold)" }}>✦</span>
            <div style={{ height:1, flex:1, background:"linear-gradient(to left, transparent, var(--gold))" }} />
          </div>
          <h1 style={{ fontSize:52, fontWeight:300, lineHeight:1, color:"var(--text-dark)" }}>& Veils</h1>
          <p style={{ fontSize:13, color:"var(--text-light)", marginTop:12, letterSpacing:"0.05em" }}>Your bridal journey, beautifully curated</p>
        </div>

        {/* Card */}
        <div style={{ background:"rgba(255,253,249,0.9)", backdropFilter:"blur(20px)", borderRadius:20,
          padding:32, boxShadow:"0 20px 60px rgba(44,26,14,0.12), 0 0 0 1px rgba(201,168,76,0.15)" }}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address"
            onKeyDown={e=>e.key==="Enter"&&submit()}
            style={{ width:"100%", padding:"13px 16px", borderRadius:10, border:"1.5px solid var(--cream-2)",
              background:"var(--cream)", fontSize:14, color:"var(--text-dark)", outline:"none",
              fontFamily:"'Jost',sans-serif", marginBottom:12, transition:"border-color 0.2s" }}
            onFocus={e=>e.target.style.borderColor="var(--gold)"}
            onBlur={e=>e.target.style.borderColor="var(--cream-2)"} />
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password"
            onKeyDown={e=>e.key==="Enter"&&submit()}
            style={{ width:"100%", padding:"13px 16px", borderRadius:10, border:"1.5px solid var(--cream-2)",
              background:"var(--cream)", fontSize:14, color:"var(--text-dark)", outline:"none",
              fontFamily:"'Jost',sans-serif", marginBottom:16, transition:"border-color 0.2s" }}
            onFocus={e=>e.target.style.borderColor="var(--gold)"}
            onBlur={e=>e.target.style.borderColor="var(--cream-2)"} />

          {err && <p style={{ fontSize:12, color:"var(--rose)", marginBottom:12, textAlign:"center" }}>{err}</p>}

          <button onClick={submit} disabled={loading}
            style={{ width:"100%", padding:"14px", borderRadius:10, border:"none", cursor:"pointer",
              background:"linear-gradient(135deg, #C9A84C, #8B6914)", color:"white",
              fontSize:14, fontWeight:600, letterSpacing:"0.08em", fontFamily:"'Jost',sans-serif",
              boxShadow:"0 4px 16px rgba(201,168,76,0.4)", transition:"all 0.2s",
              opacity: loading ? 0.7 : 1 }}>
            {loading ? "✦ Signing In..." : "ENTER THE EXPERIENCE"}
          </button>

          <div style={{ marginTop:20 }}>
            <p style={{ fontSize:11, color:"var(--text-light)", textAlign:"center", marginBottom:10, letterSpacing:"0.05em" }}>QUICK DEMO ACCESS</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              {demo.map(d=>(
                <button key={d.label} onClick={()=>{ setEmail(d.e); setPass(d.p); }}
                  style={{ padding:"8px 4px", borderRadius:8, border:"1.5px solid var(--cream-2)",
                    background:"var(--cream)", fontSize:12, color:"var(--text-mid)", cursor:"pointer",
                    fontFamily:"'Jost',sans-serif", fontWeight:500, transition:"all 0.2s" }}
                  onMouseEnter={e=>{e.target.style.borderColor="var(--gold)";e.target.style.color="var(--gold-dark)"}}
                  onMouseLeave={e=>{e.target.style.borderColor="var(--cream-2)";e.target.style.color="var(--text-mid)"}}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── GET THE LOOK DRAWER ──────────────────────────────────────────────────────
const GetTheLookDrawer = ({ reel, vendors, onClose, onVendorClick }) => {
  const rVendors = vendors.filter(v => reel.tags.some(t => v.category.includes(t.split(" ")[0])) || v.reelIds?.includes(reel.id));
  return (
    <div style={{ position:"fixed", inset:0, zIndex:200 }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)" }} />
      <div className="slide-up" style={{ position:"absolute", bottom:0, left:0, right:0,
        background:"var(--white)", borderRadius:"24px 24px 0 0", padding:"24px 20px 40px",
        boxShadow:"0 -20px 60px rgba(44,26,14,0.2)" }}>
        <div style={{ width:40, height:3, borderRadius:2, background:"var(--cream-2)", margin:"0 auto 20px" }} />
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <Icon name="tag" size={18} color="var(--gold)" />
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:500 }}>Get the Look</span>
        </div>
        <p style={{ fontSize:13, color:"var(--text-light)", marginBottom:16 }}>Professionals featured in <em>"{reel.title}"</em></p>
        {rVendors.map(v=>(
          <div key={v.id} onClick={()=>onVendorClick(v)}
            style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:12,
              background:"var(--cream)", marginBottom:8, cursor:"pointer", border:"1.5px solid transparent",
              transition:"all 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}>
            <div style={{ width:48, height:48, borderRadius:12, background:v.portfolio[0], flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:14, color:"var(--text-dark)" }}>{v.name}</div>
              <div style={{ fontSize:12, color:"var(--text-light)" }}>{v.category} · {v.district}</div>
            </div>
            <Badge status={v.verified} />
          </div>
        ))}
        {rVendors.length===0 && <p style={{ textAlign:"center", color:"var(--text-light)", padding:20 }}>No tagged professionals</p>}
      </div>
    </div>
  );
};

// ─── VENDOR PROFILE MODAL ────────────────────────────────────────────────────
const VendorProfileModal = ({ vendor, onClose }) => {
  const [liked, setLiked] = useState(false);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", alignItems:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(44,26,14,0.6)", backdropFilter:"blur(4px)" }} />
      <div className="slide-in" style={{ position:"absolute", right:0, top:0, bottom:0, width:"100%", maxWidth:480,
        background:"var(--white)", overflowY:"auto", boxShadow:"-20px 0 60px rgba(44,26,14,0.15)" }}>
        {/* Header */}
        <div style={{ height:220, background:`linear-gradient(to bottom, ${vendor.portfolio[0]}, ${vendor.portfolio[1]})`, 
          position:"relative", flexShrink:0 }}>
          <button onClick={onClose} style={{ position:"absolute", top:16, left:16, width:36, height:36, borderRadius:"50%",
            background:"rgba(255,253,249,0.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="arrow_left" size={18} color="var(--text-dark)" />
          </button>
          <button onClick={()=>setLiked(!liked)} style={{ position:"absolute", top:16, right:16, width:36, height:36, borderRadius:"50%",
            background:"rgba(255,253,249,0.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="heart" size={18} color={liked?"var(--rose)":"var(--text-mid)"} />
          </button>
          <div style={{ position:"absolute", bottom:-30, left:20, width:64, height:64, borderRadius:16,
            background:vendor.portfolio[0], border:"3px solid var(--white)", boxShadow:"var(--shadow-gold)" }} />
        </div>

        <div style={{ padding:"44px 24px 40px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
            <div>
              <h2 style={{ fontSize:26, fontWeight:400 }}>{vendor.name}</h2>
              <p style={{ fontSize:13, color:"var(--text-light)" }}>{vendor.category} · {vendor.district}</p>
            </div>
            <Badge status={vendor.verified} />
          </div>

          {vendor.rating > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:6, margin:"10px 0" }}>
              {[1,2,3,4,5].map(s=>(
                <Icon key={s} name="star" size={14} color={s<=Math.floor(vendor.rating)?"var(--gold)":"var(--cream-2)"}
                  style={{ fill: s<=Math.floor(vendor.rating)?"var(--gold)":"none" }} />
              ))}
              <span style={{ fontSize:13, fontWeight:600, color:"var(--gold-dark)" }}>{vendor.rating}</span>
              <span style={{ fontSize:12, color:"var(--text-light)" }}>({vendor.reviews} reviews)</span>
            </div>
          )}

          <p style={{ fontSize:14, color:"var(--text-mid)", lineHeight:1.7, margin:"16px 0 20px" }}>{vendor.bio}</p>

          {/* Tags */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
            {vendor.tags.map(t=>(
              <span key={t} style={{ padding:"5px 12px", borderRadius:20, background:"var(--cream)", border:"1px solid var(--cream-2)",
                fontSize:12, color:"var(--text-mid)", fontWeight:500 }}>{t}</span>
            ))}
          </div>

          {/* Portfolio swatches */}
          <div style={{ marginBottom:24 }}>
            <p style={{ fontSize:11, letterSpacing:"0.1em", color:"var(--text-light)", fontWeight:600, marginBottom:10 }}>PORTFOLIO PALETTE</p>
            <div style={{ display:"flex", gap:10 }}>
              {vendor.portfolio.map((c,i)=>(
                <div key={i} style={{ height:80, flex:1, borderRadius:12, background:c,
                  boxShadow:"0 4px 12px rgba(44,26,14,0.1)" }} />
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{ padding:"16px 20px", borderRadius:12, background:"var(--cream-2)", marginBottom:20,
            border:"1px solid var(--cream-2)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ fontSize:11, color:"var(--text-light)", letterSpacing:"0.1em" }}>STARTING FROM</p>
              <p style={{ fontSize:28, fontFamily:"'Cormorant Garamond',serif", fontWeight:500, color:"var(--text-dark)" }}>
                ₹{vendor.price.toLocaleString()}
              </p>
            </div>
            <Icon name="sparkle" size={28} color="var(--gold)" />
          </div>

          {/* WhatsApp CTA */}
          <a href={`https://wa.me/91${vendor.whatsapp}?text=Hi%20${encodeURIComponent(vendor.name)}%2C%20I%20found%20you%20on%20Vows%20%26%20Veils%20and%20would%20love%20to%20discuss%20your%20services!`}
            target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"16px",
              borderRadius:14, background:"linear-gradient(135deg, #25D366, #128C7E)", color:"white",
              textDecoration:"none", fontWeight:600, fontSize:15, letterSpacing:"0.05em",
              boxShadow:"0 8px 24px rgba(37,211,102,0.35)", marginBottom:12 }}>
            <Icon name="whatsapp" size={22} color="white" />
            Connect on WhatsApp
          </a>

          <button style={{ width:"100%", padding:"14px", borderRadius:14, border:"1.5px solid var(--gold)",
            background:"transparent", color:"var(--gold-dark)", fontWeight:600, fontSize:14, cursor:"pointer",
            fontFamily:"'Jost',sans-serif", letterSpacing:"0.05em" }}>
            Save to Wishlist
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── REEL CARD ────────────────────────────────────────────────────────────────
const ReelCard = ({ reel, vendors, onGetLook, onVendorClick }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const vendor = vendors.find(v=>v.reelIds?.includes(reel.id));

  return (
    <div style={{ width:"100%", height:"100%", position:"relative", background:reel.bg, flexShrink:0,
      display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
      {/* Overlay gradient */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(44,26,14,0.8) 0%, transparent 60%)" }} />

      {/* Right actions */}
      <div style={{ position:"absolute", right:16, bottom:160, display:"flex", flexDirection:"column", gap:18, alignItems:"center" }}>
        {[
          { icon:"heart", active:liked, activeColor:"var(--rose)", action:()=>setLiked(!liked), label:"Like" },
          { icon:"bookmark", active:saved, activeColor:"var(--gold)", action:()=>setSaved(!saved), label:"Save" },
          { icon:"share", active:false, activeColor:"white", action:()=>{}, label:"Share" },
        ].map(b=>(
          <button key={b.icon} onClick={b.action}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(255,253,249,0.15)",
              backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center",
              border:"1px solid rgba(255,253,249,0.2)" }}>
              <Icon name={b.icon} size={20} color={b.active?b.activeColor:"white"} />
            </div>
            <span style={{ fontSize:10, color:"rgba(255,255,255,0.8)", letterSpacing:"0.05em" }}>{b.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom content */}
      <div style={{ position:"relative", padding:"0 16px 20px" }}>
        {vendor && (
          <div onClick={()=>onVendorClick(vendor)}
            style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, cursor:"pointer" }}>
            <div style={{ width:36, height:36, borderRadius:10, background:vendor.portfolio[0],
              border:"2px solid rgba(255,253,249,0.4)" }} />
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:"white" }}>{vendor.name}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>{vendor.category}</div>
            </div>
            <Badge status={vendor.verified} />
          </div>
        )}
        <h3 style={{ fontSize:26, fontFamily:"'Cormorant Garamond',serif", color:"white", fontWeight:400, marginBottom:6 }}>{reel.title}</h3>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.5, marginBottom:16 }}>{reel.caption}</p>

        {/* Get the Look button */}
        <button onClick={onGetLook}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:24,
            background:"linear-gradient(135deg, rgba(201,168,76,0.9), rgba(139,105,20,0.9))",
            backdropFilter:"blur(10px)", border:"1px solid rgba(201,168,76,0.5)",
            color:"white", fontSize:13, fontWeight:600, cursor:"pointer",
            letterSpacing:"0.05em", boxShadow:"0 4px 16px rgba(201,168,76,0.3)",
            fontFamily:"'Jost',sans-serif" }}>
          <Icon name="sparkle" size={16} color="white" />
          Get the Look
        </button>
      </div>
    </div>
  );
};

// ─── REEL FEED ────────────────────────────────────────────────────────────────
const ReelFeed = ({ vendors, onVendorClick }) => {
  const [current, setCurrent] = useState(0);
  const [drawer, setDrawer] = useState(null);
  const containerRef = useRef(null);

  const approvedReels = REELS.filter(r => {
    const v = vendors.find(v2=>v2.reelIds?.includes(r.id));
    return !v || v.verified !== "pending";
  });

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const idx = Math.round(containerRef.current.scrollTop / containerRef.current.clientHeight);
    setCurrent(idx);
  }, []);

  return (
    <div style={{ position:"relative", height:"100%", overflow:"hidden" }}>
      <div ref={containerRef} onScroll={handleScroll}
        style={{ height:"100%", overflowY:"scroll", scrollSnapType:"y mandatory", WebkitOverflowScrolling:"touch" }}>
        {approvedReels.map((reel,i)=>(
          <div key={reel.id} style={{ height:"100%", scrollSnapAlign:"start", scrollSnapStop:"always" }}>
            <ReelCard reel={reel} vendors={vendors}
              onGetLook={()=>setDrawer(reel)}
              onVendorClick={onVendorClick} />
          </div>
        ))}
      </div>

      {/* Dot indicator */}
      <div style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:6 }}>
        {approvedReels.map((_,i)=>(
          <div key={i} style={{ width:4, height:i===current?20:4, borderRadius:2,
            background:i===current?"var(--gold)":"rgba(255,255,255,0.4)", transition:"all 0.3s" }} />
        ))}
      </div>

      {drawer && (
        <GetTheLookDrawer reel={drawer} vendors={vendors}
          onClose={()=>setDrawer(null)} onVendorClick={v=>{setDrawer(null);onVendorClick(v);}} />
      )}
    </div>
  );
};

// ─── DIRECTORY ────────────────────────────────────────────────────────────────
const Directory = ({ vendors, onVendorClick }) => {
  const [budget, setBudget] = useState(100000);
  const [category, setCategory] = useState("All");
  const [district, setDistrict] = useState("All");

  const cats = ["All","Hair & Makeup","Draping","Decoration","Hampers"];
  const dists = ["All","Kochi","Trivandrum","Kozhikode"];

  const filtered = vendors.filter(v =>
    v.verified !== "pending" &&
    v.price <= budget &&
    (category==="All" || v.category===category) &&
    (district==="All" || v.district===district)
  );

  const pct = ((budget-5000)/95000*100).toFixed(1);

  return (
    <div style={{ height:"100%", overflowY:"auto", background:"var(--cream)" }}>
      {/* Filters */}
      <div style={{ padding:"20px 16px", background:"var(--white)", borderBottom:"1px solid var(--cream-2)", boxShadow:"0 2px 12px rgba(44,26,14,0.05)" }}>
        <h2 style={{ fontSize:22, marginBottom:16, color:"var(--text-dark)" }}>Find Your Artist</h2>

        {/* Budget Slider */}
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:12, color:"var(--text-light)", letterSpacing:"0.08em" }}>BUDGET</span>
            <span style={{ fontSize:14, fontWeight:600, color:"var(--gold-dark)" }}>₹{budget>=100000?"1,00,000+":budget.toLocaleString()}</span>
          </div>
          <input type="range" min={5000} max={100000} step={1000} value={budget}
            onChange={e=>setBudget(Number(e.target.value))}
            style={{ width:"100%", "--pct":`${pct}%` }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            <span style={{ fontSize:10, color:"var(--text-light)" }}>₹5,000</span>
            <span style={{ fontSize:10, color:"var(--text-light)" }}>₹1,00,000+</span>
          </div>
        </div>

        {/* Category */}
        <div style={{ marginBottom:12 }}>
          <p style={{ fontSize:11, letterSpacing:"0.08em", color:"var(--text-light)", marginBottom:8 }}>CATEGORY</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCategory(c)}
                style={{ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:500, cursor:"pointer",
                  border:`1.5px solid ${category===c?"var(--gold)":"var(--cream-2)"}`,
                  background: category===c?"linear-gradient(135deg,#C9A84C,#8B6914)":"var(--cream)",
                  color: category===c?"white":"var(--text-mid)", fontFamily:"'Jost',sans-serif",
                  transition:"all 0.2s" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* District */}
        <div>
          <p style={{ fontSize:11, letterSpacing:"0.08em", color:"var(--text-light)", marginBottom:8 }}>DISTRICT</p>
          <div style={{ display:"flex", gap:8 }}>
            {dists.map(d=>(
              <button key={d} onClick={()=>setDistrict(d)}
                style={{ padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:500, cursor:"pointer",
                  border:`1.5px solid ${district===d?"var(--blush-deep)":"var(--cream-2)"}`,
                  background: district===d?"var(--blush)":"var(--cream)",
                  color: district===d?"var(--rose)":"var(--text-mid)", fontFamily:"'Jost',sans-serif",
                  transition:"all 0.2s" }}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ padding:"16px" }}>
        <p style={{ fontSize:12, color:"var(--text-light)", marginBottom:16 }}>{filtered.length} professionals found</p>
        {filtered.map(v=>(
          <div key={v.id} onClick={()=>onVendorClick(v)}
            style={{ display:"flex", gap:14, padding:"16px", borderRadius:16, background:"var(--white)",
              marginBottom:12, cursor:"pointer", boxShadow:"0 2px 12px rgba(44,26,14,0.06)",
              border:"1.5px solid transparent", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.boxShadow="var(--shadow-gold)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.boxShadow="0 2px 12px rgba(44,26,14,0.06)"}}>
            <div style={{ width:64, height:64, borderRadius:14, background:`linear-gradient(135deg,${v.portfolio[0]},${v.portfolio[1]})`, flexShrink:0 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <span style={{ fontWeight:600, fontSize:15 }}>{v.name}</span>
                <Badge status={v.verified} />
              </div>
              <p style={{ fontSize:12, color:"var(--text-light)", marginBottom:6 }}>{v.category} · {v.district}</p>
              {v.rating > 0 && (
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <Icon name="star" size={12} color="var(--gold)" style={{ fill:"var(--gold)" }} />
                  <span style={{ fontSize:12, fontWeight:600, color:"var(--text-mid)" }}>{v.rating}</span>
                  <span style={{ fontSize:11, color:"var(--text-light)" }}>({v.reviews})</span>
                </div>
              )}
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <p style={{ fontSize:11, color:"var(--text-light)" }}>from</p>
              <p style={{ fontSize:16, fontFamily:"'Cormorant Garamond',serif", fontWeight:600, color:"var(--gold-dark)" }}>₹{(v.price/1000).toFixed(0)}k</p>
            </div>
          </div>
        ))}
        {filtered.length===0 && (
          <div style={{ textAlign:"center", padding:40, color:"var(--text-light)" }}>
            <Icon name="search" size={40} color="var(--cream-2)" />
            <p style={{ marginTop:12, fontSize:14 }}>No professionals match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CLIENT PORTAL ────────────────────────────────────────────────────────────
const ClientPortal = ({ user, vendors, onLogout }) => {
  const [tab, setTab] = useState("reels");
  const [selectedVendor, setSelectedVendor] = useState(null);

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:"var(--text-dark)" }}>
      {/* Top bar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px",
        background:"rgba(255,253,249,0.95)", backdropFilter:"blur(10px)",
        borderBottom:"1px solid var(--cream-2)", flexShrink:0, zIndex:10 }}>
        <div>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:500, color:"var(--text-dark)" }}>Vows & Veils</span>
          <span style={{ fontSize:11, color:"var(--gold)", marginLeft:8 }}>✦</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:12, color:"var(--text-mid)" }}>Hi, {user.name}</span>
          <button onClick={onLogout} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
            <Icon name="logout" size={18} color="var(--text-light)" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflow:"hidden" }}>
        {tab==="reels" ? (
          <ReelFeed vendors={vendors} onVendorClick={setSelectedVendor} />
        ) : (
          <Directory vendors={vendors} onVendorClick={setSelectedVendor} />
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ display:"flex", background:"rgba(255,253,249,0.97)", backdropFilter:"blur(10px)",
        borderTop:"1px solid var(--cream-2)", flexShrink:0 }}>
        {[
          { id:"reels", icon:"film", label:"Discover" },
          { id:"directory", icon:"grid", label:"Directory" },
          { id:"wishlist", icon:"heart", label:"Wishlist" },
          { id:"profile", icon:"user", label:"Profile" },
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ flex:1, padding:"12px 4px", display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              background:"none", border:"none", cursor:"pointer" }}>
            <Icon name={t.icon} size={20} color={tab===t.id?"var(--gold)":"var(--text-light)"} />
            <span style={{ fontSize:10, letterSpacing:"0.05em", fontWeight:600,
              color:tab===t.id?"var(--gold)":"var(--text-light)", fontFamily:"'Jost',sans-serif" }}>
              {t.label.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {selectedVendor && <VendorProfileModal vendor={selectedVendor} onClose={()=>setSelectedVendor(null)} />}
    </div>
  );
};

// ─── VENDOR PORTAL ────────────────────────────────────────────────────────────
const VendorPortal = ({ user, vendors, onLogout }) => {
  const vendor = vendors.find(v=>v.id===user.vendorId);
  if (!vendor) return <div>Vendor not found</div>;

  const stats = [
    { label:"Profile Views", value:vendor.clicks.toLocaleString(), icon:"eye", color:"var(--gold)" },
    { label:"WhatsApp Leads", value:vendor.inquiries.toLocaleString(), icon:"whatsapp", color:"#25D366" },
    { label:"Reel Tags", value:vendor.reelIds?.length||0, icon:"film", color:"var(--blush-deep)" },
    { label:"Reviews", value:vendor.reviews, icon:"star", color:"var(--rose)" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", overflowY:"auto" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#2C1A0E,#6B4C35)", padding:"40px 20px 60px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%",
          background:"radial-gradient(circle,rgba(201,168,76,0.2) 0%,transparent 70%)" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ fontSize:11, color:"rgba(201,168,76,0.8)", letterSpacing:"0.2em", marginBottom:8 }}>VENDOR STUDIO</p>
            <h1 style={{ fontSize:32, fontWeight:300, color:"white", marginBottom:4 }}>{vendor.name}</h1>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginBottom:12 }}>{vendor.category} · {vendor.district}</p>
            <Badge status={vendor.verified} />
          </div>
          <button onClick={onLogout} style={{ background:"rgba(255,253,249,0.1)", border:"1px solid rgba(255,253,249,0.2)",
            borderRadius:10, padding:"8px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            <Icon name="logout" size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontFamily:"'Jost',sans-serif" }}>Logout</span>
          </button>
        </div>
      </div>

      <div style={{ padding:"0 16px", marginTop:-24 }}>
        {/* Stats Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
          {stats.map(s=>(
            <div key={s.label} style={{ background:"var(--white)", borderRadius:16, padding:"18px 16px",
              boxShadow:"0 4px 16px rgba(44,26,14,0.08)", border:"1px solid var(--cream-2)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <p style={{ fontSize:11, color:"var(--text-light)", letterSpacing:"0.05em", marginBottom:6 }}>{s.label.toUpperCase()}</p>
                  <p style={{ fontSize:28, fontFamily:"'Cormorant Garamond',serif", fontWeight:500, color:"var(--text-dark)" }}>{s.value}</p>
                </div>
                <div style={{ width:36, height:36, borderRadius:10, background:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name={s.icon} size={18} color={s.color} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Verification Status Card */}
        {vendor.verified==="pending" && (
          <div style={{ background:"linear-gradient(135deg,#FFF8E1,#FFF3C4)", borderRadius:16, padding:20,
            marginBottom:20, border:"1px solid #FFD54F" }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <Icon name="clock" size={24} color="#8B6914" />
              <div>
                <p style={{ fontWeight:600, color:"#8B6914", marginBottom:4 }}>Verification Pending</p>
                <p style={{ fontSize:13, color:"#6B4C35", lineHeight:1.6 }}>Your profile is under review by our team. You'll receive a notification once approved. Verified vendors appear in the public directory and reel feed.</p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio */}
        <div style={{ background:"var(--white)", borderRadius:16, padding:20, marginBottom:20, boxShadow:"0 4px 16px rgba(44,26,14,0.08)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={{ fontSize:20, fontWeight:400 }}>Portfolio Preview</h3>
            <button style={{ fontSize:12, color:"var(--gold)", background:"none", border:"none", cursor:"pointer", fontFamily:"'Jost',sans-serif", fontWeight:600 }}>
              + Upload Work
            </button>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {vendor.portfolio.map((c,i)=>(
              <div key={i} style={{ flex:1, aspectRatio:"3/4", borderRadius:12, background:`linear-gradient(160deg,${c},${vendor.portfolio[(i+1)%3]})`,
                display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom:8 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,253,249,0.3)",
                  backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon name="camera" size={14} color="white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Reels */}
        {vendor.reelIds?.length > 0 && (
          <div style={{ background:"var(--white)", borderRadius:16, padding:20, marginBottom:20, boxShadow:"0 4px 16px rgba(44,26,14,0.08)" }}>
            <h3 style={{ fontSize:20, fontWeight:400, marginBottom:14 }}>Your Reels</h3>
            {vendor.reelIds.map(rid=>{
              const r = REELS.find(r2=>r2.id===rid);
              if (!r) return null;
              return (
                <div key={rid} style={{ display:"flex", gap:12, alignItems:"center", marginBottom:10 }}>
                  <div style={{ width:48, height:48, borderRadius:10, background:r.bg }} />
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600, fontSize:14 }}>{r.title}</p>
                    <p style={{ fontSize:12, color:"var(--text-light)" }}>{r.caption.slice(0,50)}…</p>
                  </div>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#25D366" }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ADMIN PORTAL ─────────────────────────────────────────────────────────────
const AdminPortal = ({ user, vendors, onUpdateVendor, onLogout }) => {
  const [tab, setTab] = useState("queue");
  const pending = vendors.filter(v=>v.verified==="pending");
  const approved = vendors.filter(v=>v.verified==="verified"||v.verified==="top-rated");

  const action = (vendorId, status) => onUpdateVendor(vendorId, status);

  const VendorRow = ({ v, showActions=false }) => (
    <div style={{ background:"var(--white)", borderRadius:14, padding:"16px", marginBottom:10,
      boxShadow:"0 2px 12px rgba(44,26,14,0.06)", border:"1px solid var(--cream-2)" }}>
      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        <div style={{ width:52, height:52, borderRadius:12, background:`linear-gradient(135deg,${v.portfolio[0]},${v.portfolio[1]})`, flexShrink:0 }} />
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
            <h4 style={{ fontWeight:600, fontSize:15 }}>{v.name}</h4>
            <Badge status={v.verified} />
          </div>
          <p style={{ fontSize:12, color:"var(--text-light)", marginBottom:4 }}>{v.category} · {v.district}</p>
          <p style={{ fontSize:11, color:"var(--text-light)" }}>{v.email}</p>
          {v.bio && <p style={{ fontSize:12, color:"var(--text-mid)", marginTop:8, lineHeight:1.5 }}>{v.bio.slice(0,100)}…</p>}
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
            {v.tags.map(t=>(
              <span key={t} style={{ padding:"3px 10px", borderRadius:12, background:"var(--cream)",
                fontSize:11, color:"var(--text-mid)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      {showActions && (
        <div style={{ display:"flex", gap:10, marginTop:14 }}>
          <button onClick={()=>action(v.id,"verified")}
            style={{ flex:1, padding:"11px", borderRadius:10, border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#C9A84C,#8B6914)", color:"white",
              fontWeight:600, fontSize:13, fontFamily:"'Jost',sans-serif",
              boxShadow:"0 4px 12px rgba(201,168,76,0.3)" }}>
            ✓ Approve & Verify
          </button>
          <button onClick={()=>action(v.id,"top-rated")}
            style={{ flex:1, padding:"11px", borderRadius:10, border:"none", cursor:"pointer",
              background:"linear-gradient(135deg,#E8CB7A,#C9A84C)", color:"var(--text-dark)",
              fontWeight:600, fontSize:13, fontFamily:"'Jost',sans-serif" }}>
            ★ Top Rated
          </button>
          <button onClick={()=>action(v.id,"rejected")}
            style={{ padding:"11px 16px", borderRadius:10, border:"1.5px solid var(--cream-2)",
              background:"var(--cream)", cursor:"pointer", color:"var(--rose)",
              fontWeight:600, fontSize:13, fontFamily:"'Jost',sans-serif" }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#2C1A0E 0%,#4A2C1A 100%)", padding:"40px 20px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <Icon name="shield" size={20} color="var(--gold)" />
              <span style={{ fontSize:11, color:"var(--gold)", letterSpacing:"0.2em" }}>ADMIN CONTROL</span>
            </div>
            <h1 style={{ fontSize:30, fontWeight:300, color:"white" }}>Vows & Veils</h1>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>Quality & Trust Dashboard</p>
          </div>
          <button onClick={onLogout} style={{ background:"rgba(255,253,249,0.1)", border:"1px solid rgba(255,253,249,0.2)",
            borderRadius:10, padding:"8px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            <Icon name="logout" size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontFamily:"'Jost',sans-serif" }}>Logout</span>
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, marginTop:20 }}>
          {["queue","approved","all"].map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ padding:"8px 18px", borderRadius:20, border:"none", cursor:"pointer", fontFamily:"'Jost',sans-serif",
                fontSize:12, fontWeight:600, letterSpacing:"0.05em",
                background: tab===t?"var(--gold)":"rgba(255,253,249,0.1)",
                color: tab===t?"var(--text-dark)":"rgba(255,255,255,0.7)" }}>
              {t==="queue" ? `Queue (${pending.length})` : t==="approved" ? `Approved (${approved.length})` : "All Vendors"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"16px" }}>
        {tab==="queue" && (
          <>
            {pending.length===0 ? (
              <div style={{ textAlign:"center", padding:48, color:"var(--text-light)" }}>
                <Icon name="check_circle" size={48} color="var(--cream-2)" />
                <p style={{ marginTop:12, fontSize:14 }}>All caught up! No pending applications.</p>
              </div>
            ) : pending.map(v=><VendorRow key={v.id} v={v} showActions />)}
          </>
        )}
        {tab==="approved" && approved.map(v=>(
          <div key={v.id}>
            <VendorRow v={v} />
            <div style={{ display:"flex", gap:8, marginTop:-4, marginBottom:10, paddingLeft:64 }}>
              <button onClick={()=>action(v.id,"pending")}
                style={{ fontSize:11, color:"var(--text-light)", background:"none", border:"1px solid var(--cream-2)",
                  borderRadius:8, padding:"4px 10px", cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>
                Move to Queue
              </button>
              <button onClick={()=>action(v.id,"rejected")}
                style={{ fontSize:11, color:"var(--rose)", background:"none", border:"1px solid var(--blush)",
                  borderRadius:8, padding:"4px 10px", cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>
                Revoke
              </button>
            </div>
          </div>
        ))}
        {tab==="all" && vendors.map(v=><VendorRow key={v.id} v={v} showActions={v.verified==="pending"} />)}
      </div>
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [vendors, setVendors] = useState(() => {
    try {
      const saved = localStorage.getItem("vows_vendors");
      return saved ? JSON.parse(saved) : INIT_VENDORS;
    } catch { return INIT_VENDORS; }
  });

  useEffect(() => {
    try { localStorage.setItem("vows_vendors", JSON.stringify(vendors)); } catch {}
  }, [vendors]);

  const updateVendor = (vendorId, status) => {
    setVendors(prev => prev.map(v => v.id===vendorId ? {...v, verified:status} : v));
  };

  const logout = () => setCurrentUser(null);

  if (!currentUser) return <LoginScreen onLogin={setCurrentUser} />;

  return (
    <>
      {currentUser.role==="client" && <ClientPortal user={currentUser} vendors={vendors} onLogout={logout} />}
      {currentUser.role==="vendor" && <VendorPortal user={currentUser} vendors={vendors} onLogout={logout} />}
      {currentUser.role==="admin" && <AdminPortal user={currentUser} vendors={vendors} onUpdateVendor={updateVendor} onLogout={logout} />}
    </>
  );
}
