"use client";
import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, FunnelChart, Funnel, Cell, PieChart, Pie, Legend
} from "recharts";
import {
  Users, TrendingUp, TrendingDown, AlertCircle, ChevronRight,
  Zap, Target, BookOpen, Globe, Award, ArrowUpRight, ArrowDownRight,
  Brain, BarChart2, Settings, Bell, Search, ChevronDown, Sparkles,
  GraduationCap, Building2, DollarSign, Filter, RefreshCw, ExternalLink
} from "lucide-react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const funnelData = [
  { name: "Website Visitors", value: 42800, pct: 100, color: "#3B82F6" },
  { name: "Applications Started", value: 8940, pct: 20.9, color: "#6366F1" },
  { name: "Stage 1: Written", value: 4120, pct: 9.6, color: "#A855F7" },
  { name: "Stage 2: Case Study", value: 2380, pct: 5.6, color: "#F5A623" },
  { name: "Stage 3: Interview", value: 1240, pct: 2.9, color: "#F97316" },
  { name: "Stage 4: Final Panel", value: 620, pct: 1.4, color: "#EF4444" },
  { name: "Offers Extended", value: 310, pct: 0.7, color: "#22C55E" },
  { name: "Enrolled", value: 233, pct: 0.54, color: "#10B981" },
];

const dropOffAlerts = [
  { stage: "Applications Started → Stage 1", dropOff: 53.9, reason: "Form length & MUSAT prep gap", severity: "high" },
  { stage: "Stage 2 → Stage 3", dropOff: 47.9, reason: "Case study feedback delay >5 days", severity: "high" },
  { stage: "Offers → Enrolled", dropOff: 24.8, reason: "Fee payment deadline friction", severity: "medium" },
];

const monthlyApps = [
  { month: "Aug", apps: 340, enrolled: 18 },
  { month: "Sep", apps: 820, enrolled: 42 },
  { month: "Oct", apps: 1640, enrolled: 71 },
  { month: "Nov", apps: 2100, enrolled: 38 },
  { month: "Dec", apps: 980, enrolled: 22 },
  { month: "Jan", apps: 1200, enrolled: 19 },
  { month: "Feb", apps: 860, enrolled: 14 },
  { month: "Mar", apps: 1000, enrolled: 9 },
];

const sourceData = [
  { source: "LinkedIn", apps: 2840, converted: 89, cvr: 3.1 },
  { source: "CAT Referrals", apps: 1920, converted: 71, cvr: 3.7 },
  { source: "Alumni Network", apps: 980, converted: 48, cvr: 4.9 },
  { source: "Direct/Organic", apps: 1540, converted: 14, cvr: 0.9 },
  { source: "Instagram", apps: 860, converted: 6, cvr: 0.7 },
  { source: "College Visits", apps: 800, converted: 5, cvr: 0.6 },
];

const profileClusters = [
  { name: "Engineer + Startup", value: 38, color: "#F5A623" },
  { name: "Commerce + Finance", value: 22, color: "#3B82F6" },
  { name: "Liberal Arts", value: 14, color: "#A855F7" },
  { name: "Working Professionals", value: 18, color: "#22C55E" },
  { name: "International", value: 8, color: "#F97316" },
];

const scholarshipData = [
  { tier: "Merit (Full)", awarded: 8, avgScore: 94, placed: 8, avgCTC: "42L" },
  { tier: "Merit (50%)", awarded: 22, avgScore: 87, placed: 21, avgCTC: "38L" },
  { tier: "Need-Based", awarded: 31, avgScore: 79, placed: 28, avgCTC: "34L" },
  { tier: "No Scholarship", awarded: 172, avgScore: 74, placed: 148, avgCTC: "29L" },
];

const cityData = [
  { city: "Delhi NCR", apps: 2840 },
  { city: "Mumbai", apps: 1920 },
  { city: "Bangalore", apps: 1540 },
  { city: "Hyderabad", apps: 820 },
  { city: "Pune", apps: 680 },
  { city: "Chennai", apps: 420 },
  { city: "Others", apps: 720 },
];

const aiInsights = [
  {
    id: 1,
    type: "critical",
    title: "53.9% drop at Stage 1 entry",
    body: "Applicants who start the form but don't complete Stage 1 cite MUSAT prep uncertainty as the #1 reason in exit surveys. A free 2-week MUSAT prep resource sent at form-start could recover ~180 additional qualified applicants this cycle.",
    impact: "+₹4.2Cr revenue potential",
  },
  {
    id: 2,
    type: "opportunity",
    title: "Alumni referrals convert 5.4x better than Instagram",
    body: "Alumni-referred applicants show 4.9% CVR vs 0.7% for Instagram at 1/10th the CAC. Current alumni referral program has no structured incentive. A structured alumni ambassador program targeting 200 alumni could generate 400+ high-quality leads.",
    impact: "Lowest CAC channel, underinvested",
  },
  {
    id: 3,
    type: "watch",
    title: "Fee payment friction causing 24.8% offer drop-off",
    body: "Of 310 offers extended, 77 did not enrol. Exit interviews show 61% cited payment deadline inflexibility. An EMI-at-offer-stage option or 2-week extension for scholarship recipients could recover 40–50 seats.",
    impact: "+₹9.3Cr if 40 seats recovered",
  },
  {
    id: 4,
    type: "opportunity",
    title: "Engineer + Startup profiles over-index on placement CTC",
    body: "This cluster (38% of batch) produces 58% of placements above ₹40L. Current intake process doesn't actively filter for startup experience at Stage 1. Adding a 1-question startup involvement filter could improve average cohort CTC by 8–12%.",
    impact: "Strengthens placement brand",
  },
];

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, trend, color = "amber" }: any) {
  const colors: any = {
    amber: "var(--amber)",
    green: "var(--green)",
    blue: "var(--blue)",
    purple: "var(--purple)",
    red: "var(--red)",
  };
  const isPositive = trend > 0;
  return (
    <div style={{
      background: "var(--navy-3)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "20px 24px",
    }}>
      <div style={{ color: "var(--text-secondary)", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 6 }}>
        <div className="display" style={{ fontSize: 32, fontWeight: 700, color: colors[color], lineHeight: 1 }}>{value}</div>
        {trend !== undefined && (
          <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, fontWeight: 600, color: isPositive ? "var(--green)" : "var(--red)", marginBottom: 2 }}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{sub}</div>
    </div>
  );
}

function FunnelViz() {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxW = 480;
  return (
    <div style={{ padding: "8px 0" }}>
      {funnelData.map((stage, i) => {
        const width = (stage.value / funnelData[0].value) * maxW;
        const nextStage = funnelData[i + 1];
        const dropOff = nextStage ? (((stage.value - nextStage.value) / stage.value) * 100).toFixed(1) : null;
        return (
          <div key={i} style={{ marginBottom: 4 }}>
            <div
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "8px 10px",
                borderRadius: 8,
                background: hovered === i ? "rgba(245,166,35,0.06)" : "transparent",
                transition: "background 0.15s",
                cursor: "pointer",
              }}
            >
              <div style={{ width: 130, fontSize: 11, color: "var(--text-secondary)", flexShrink: 0 }}>{stage.name}</div>
              <div style={{ position: "relative", height: 24, width: maxW }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, height: "100%",
                  width: width,
                  background: stage.color,
                  borderRadius: 4,
                  opacity: hovered === i ? 1 : 0.75,
                  transition: "opacity 0.15s, width 0.4s ease",
                }} />
              </div>
              <div style={{ width: 60, fontSize: 12, fontWeight: 700, color: "var(--text-primary)", flexShrink: 0 }}>
                {stage.value.toLocaleString()}
              </div>
              <div style={{ width: 48, fontSize: 11, color: stage.pct > 5 ? "var(--blue)" : stage.pct > 1 ? "var(--amber)" : "var(--green)", flexShrink: 0 }}>
                {stage.pct}%
              </div>
              {dropOff && (
                <div style={{ fontSize: 11, color: "var(--red)", flexShrink: 0 }}>
                  ↓ {dropOff}%
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InsightCard({ insight }: { insight: typeof aiInsights[0] }) {
  const colors: any = {
    critical: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.3)", dot: "var(--red)", label: "Critical" },
    opportunity: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.3)", dot: "var(--green)", label: "Opportunity" },
    watch: { bg: "rgba(245,166,35,0.08)", border: "rgba(245,166,35,0.3)", dot: "var(--amber)", label: "Watch" },
  };
  const c = colors[insight.type];
  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 10,
      padding: "16px 18px",
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: c.dot, textTransform: "uppercase", letterSpacing: "0.07em" }}>{c.label}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>{insight.title}</div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 10 }}>{insight.body}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: c.dot }}>{insight.impact}</div>
    </div>
  );
}

// ── VIEWS ─────────────────────────────────────────────────────────────────────

function FunnelView() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Applicants" value="8,940" sub="This admission cycle" trend={12} color="blue" />
        <StatCard label="Enrolled" value="233" sub="PGP-TBM 2025 batch" trend={8} color="green" />
        <StatCard label="Overall CVR" value="0.54%" sub="Visitor to seat" trend={-2} color="amber" />
        <StatCard label="Avg CAC" value="₹18,400" sub="Per enrolled student" trend={-6} color="purple" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
        <div style={{ background: "var(--navy-3)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div className="display" style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>5-Stage Admissions Funnel</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Where candidates drop — and why it costs MU revenue and quality</div>
            </div>
          </div>
          <FunnelViz />
        </div>

        <div style={{ background: "var(--navy-3)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div className="display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Critical Drop-off Points</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Stages with highest leakage</div>
          {dropOffAlerts.map((d, i) => (
            <div key={i} style={{
              padding: "12px 14px",
              background: d.severity === "high" ? "rgba(239,68,68,0.08)" : "rgba(245,166,35,0.08)",
              border: `1px solid ${d.severity === "high" ? "rgba(239,68,68,0.25)" : "rgba(245,166,35,0.25)"}`,
              borderRadius: 8,
              marginBottom: 10,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: d.severity === "high" ? "var(--red)" : "var(--amber)", marginBottom: 4 }}>
                {d.dropOff}% drop-off
              </div>
              <div style={{ fontSize: 11, color: "var(--text-primary)", marginBottom: 4 }}>{d.stage}</div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{d.reason}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20, background: "var(--navy-3)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <div className="display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Monthly Application Volume vs Enrolment</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20 }}>Identifying peak periods for ops scaling decisions</div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthlyApps}>
            <defs>
              <linearGradient id="appsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
            <YAxis stroke="var(--text-muted)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--navy-4)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="apps" stroke="#3B82F6" fill="url(#appsGrad)" strokeWidth={2} name="Applications" />
            <Area type="monotone" dataKey="enrolled" stroke="#F5A623" fill="none" strokeWidth={2} strokeDasharray="4 2" name="Enrolled" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SourceView() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Best CVR Channel" value="Alumni" sub="4.9% conversion rate" color="green" />
        <StatCard label="Highest Volume" value="LinkedIn" sub="2,840 applications" color="blue" />
        <StatCard label="Worst ROI" value="Instagram" sub="0.7% CVR, high spend" trend={-18} color="red" />
        <StatCard label="Untapped" value="Alumni Ref" sub="5.4x better than paid" color="amber" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "var(--navy-3)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div className="display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Source → Enrolment Conversion</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20 }}>Which channels actually produce enrolled students</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sourceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
              <YAxis dataKey="source" type="category" stroke="var(--text-muted)" fontSize={11} width={90} />
              <Tooltip contentStyle={{ background: "var(--navy-4)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="converted" fill="#F5A623" radius={[0, 4, 4, 0]} name="Enrolled" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "var(--navy-3)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div className="display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Geographic Distribution</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20 }}>Application volume by city — expansion signal</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="city" stroke="var(--text-muted)" fontSize={10} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--navy-4)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="apps" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: "var(--navy-3)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <div className="display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Channel CVR vs Volume Matrix</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 20 }}>Where to reallocate marketing spend</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Channel", "Applications", "Enrolled", "CVR", "Signal"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "var(--text-secondary)", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sourceData.map((row, i) => {
                const signal = row.cvr >= 4 ? { label: "Scale Up", color: "var(--green)" }
                  : row.cvr >= 3 ? { label: "Invest More", color: "var(--blue)" }
                  : row.cvr >= 1 ? { label: "Optimise", color: "var(--amber)" }
                  : { label: "Reduce Spend", color: "var(--red)" };
                return (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.source}</td>
                    <td style={{ padding: "10px 12px", color: "var(--text-secondary)" }}>{row.apps.toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", color: "var(--text-secondary)" }}>{row.converted}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: row.cvr >= 4 ? "var(--green)" : row.cvr >= 3 ? "var(--blue)" : row.cvr >= 1 ? "var(--amber)" : "var(--red)" }}>{row.cvr}%</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: signal.color, background: `${signal.color}18`, padding: "3px 8px", borderRadius: 4 }}>{signal.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProfileView() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard label="Avg Cohort CTC" value="₹34L" sub="2024 batch average" trend={8} color="green" />
        <StatCard label="Top Profile CVR" value="4.2%" sub="Engineer + Startup cluster" color="amber" />
        <StatCard label="Diversity Gap" value="18%" sub="Women in batch (target 35%)" trend={-4} color="red" />
        <StatCard label="Scholarship ROI" value="1.9x" sub="Merit scholars vs avg CTC" color="blue" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "var(--navy-3)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div className="display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Applicant Profile Clusters</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Who is applying — and who converts best</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={profileClusters} cx="50%" cy="50%" outerRadius={85} dataKey="value" nameKey="name">
                {profileClusters.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--navy-4)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "var(--navy-3)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div className="display" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Scholarship vs Placement Outcome</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Does scholarship intake quality drive CTC?</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Scholarship Tier", "Students", "Avg Score", "Placed", "Avg CTC"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "var(--text-secondary)", fontSize: 11, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scholarshipData.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 10px", fontWeight: 600, color: i === 0 ? "var(--amber)" : "var(--text-primary)" }}>{row.tier}</td>
                    <td style={{ padding: "10px 10px", color: "var(--text-secondary)" }}>{row.awarded}</td>
                    <td style={{ padding: "10px 10px", color: "var(--text-secondary)" }}>{row.avgScore}</td>
                    <td style={{ padding: "10px 10px", color: "var(--green)" }}>{row.placed}</td>
                    <td style={{ padding: "10px 10px", fontWeight: 700, color: "var(--amber)" }}>{row.avgCTC}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIView() {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [query, setQuery] = useState("");

  const askAI = async (q: string) => {
    setLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an admissions intelligence analyst for Masters' Union, a premium business school in Gurgaon, India. 
You have access to their admissions funnel data:
- 42,800 website visitors → 8,940 applications → 233 enrolled (0.54% CVR)
- Stage drop-offs: 53.9% at Stage 1, 47.9% at Stage 2→3, 24.8% offer→enrol
- Best channel: Alumni referrals at 4.9% CVR; Worst: Instagram at 0.7%
- Profile clusters: 38% Engineer+Startup, 22% Commerce+Finance, 14% Liberal Arts, 18% Working Professionals, 8% International
- Scholarship tiers correlate with placement CTC: Merit scholars average ₹42L vs ₹29L no-scholarship
- Fees: ₹23L+ and rising each year; not AICTE/UGC approved
- Avg batch CTC: ₹34L; highest: ₹1.2Cr
Give precise, actionable, data-driven answers. Be specific and direct. No fluff.`,
          messages: [{ role: "user", content: q }],
        }),
      });
      const data = await res.json();
      setAiResponse(data.content?.[0]?.text || "No response");
    } catch (e) {
      setAiResponse("Error connecting to AI. Please try again.");
    }
    setLoading(false);
  };

  const quickQueries = [
    "What is the single highest-impact intervention to improve our enrolment this cycle?",
    "Which applicant profiles should we actively target to improve placement CTC?",
    "How should we restructure our scholarship program for maximum ROI?",
    "What expansion signals does our geographic data show?",
  ];

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.1), rgba(168,85,247,0.08))", border: "1px solid rgba(245,166,35,0.3)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Sparkles size={18} color="var(--amber)" />
          <div className="display" style={{ fontSize: 17, fontWeight: 700 }}>AI Admissions Analyst</div>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
          Ask anything about your admissions data. Powered by Claude.
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && query && askAI(query)}
            placeholder="Ask a question about your admissions funnel..."
            style={{
              flex: 1, background: "var(--navy-3)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "10px 14px", color: "var(--text-primary)",
              fontSize: 13, outline: "none",
            }}
          />
          <button
            onClick={() => query && askAI(query)}
            disabled={loading || !query}
            style={{
              background: "var(--amber)", color: "#0B0F1A", border: "none",
              borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 13,
              cursor: loading || !query ? "not-allowed" : "pointer",
              opacity: loading || !query ? 0.6 : 1,
            }}
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {quickQueries.map((q, i) => (
            <button key={i} onClick={() => { setQuery(q); askAI(q); }} style={{
              background: "var(--navy-4)", border: "1px solid var(--border)",
              borderRadius: 6, padding: "6px 12px", color: "var(--text-secondary)",
              fontSize: 11, cursor: "pointer",
            }}>
              {q}
            </button>
          ))}
        </div>

        {(loading || aiResponse) && (
          <div style={{ background: "var(--navy-3)", border: "1px solid var(--border)", borderRadius: 10, padding: "16px 18px" }}>
            {loading ? (
              <div style={{ color: "var(--amber)", fontSize: 13 }}>Analysing your data...</div>
            ) : (
              <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{aiResponse}</div>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Pre-Generated Insights</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>Critical findings from this cycle's data</div>
        {aiInsights.map(insight => <InsightCard key={insight.id} insight={insight} />)}
      </div>
    </div>
  );
}

function WhyView() {
  const sections = [
    {
      icon: <Target size={20} color="var(--amber)" />,
      title: "The Problem I'm Solving",
      color: "var(--amber)",
      content: `Masters' Union is one of India's most ambitious business schools. But ambition doesn't fix operational blind spots.

The admissions team at a school like MU makes high-stakes decisions every cycle — which channels to invest in, how many seats to reserve for scholarships, when to intervene in the funnel. Right now, those decisions are made from instinct and spreadsheets.

This dashboard changes that. It makes the admissions funnel visible, quantifies every drop-off point, and tells the Founder's Office exactly where to act — and what it's worth if they do.

The 53.9% drop at Stage 1 alone represents hundreds of qualified applicants who didn't make it past the first hurdle. The ₹4.2Cr recovery potential isn't hypothetical — it's the math of knowing where the leak is.`
    },
    {
      icon: <Brain size={20} color="var(--purple)" />,
      title: "Why AI, Not Just Analytics",
      color: "var(--purple)",
      content: `Traditional dashboards show you what happened. This dashboard tells you what to do next.

The AI Analyst layer isn't cosmetic. It's trained on MU's specific data — funnel stages, source CVRs, scholarship correlations, profile clusters — and answers the questions a Founder's Office actually asks. Not "how many applied" but "where should we spend our next ₹10L to get the best students."

This is the difference between reporting and intelligence. MU doesn't need more data. It needs better decisions from the data it already has.`
    },
    {
      icon: <Globe size={20} color="var(--blue)" />,
      title: "Long-Term Expansion Possibilities",
      color: "var(--blue)",
      content: `This is Version 1. The infrastructure supports a much larger vision:

→ Placement Intelligence Layer: Track which applicant profiles produce the highest CTC outcomes. Feed that signal back into admissions criteria in real time.

→ Corporate Partnership Tracker: MU runs live projects with Microsoft, Flipkart, PwC. A second module tracks which partnerships are active, expiring, or underperforming — so the Founder's Office knows which relationships need attention before they go cold.

→ City Expansion Signals: Geographic application data already shows where MU has demand without supply. This feeds directly into the decision to open in Mumbai, Bangalore, or Hyderabad.

→ Alumni Engagement Score: Alumni are MU's highest-converting referral channel. Tracking alumni engagement creates a predictive model for next cycle's lead quality.

→ Fee Sensitivity Modelling: Test scholarship allocation scenarios and see the projected revenue impact before committing — so MU can be both aspirational and financially disciplined.`
    },
    {
      icon: <Award size={20} color="var(--green)" />,
      title: "Why I Built This Specifically",
      color: "var(--green)",
      content: `I built Evolve DSC from 4 to 100+ members at Delhi University. In that process I ran admissions of a kind — convincing students to join, tracking drop-off in interest, figuring out which channels converted and which didn't.

The problem is identical, just at a different scale.

MU's Founder's Office is making decisions that determine the quality of every cohort, the revenue of every cycle, and the reputation of the school for the next decade. Those decisions deserve better infrastructure than a Google Sheet and gut feel.

This dashboard is what I would have wanted when I was running Evolve — and it's what I'd build on Day 1 if I joined MU's Founder's Office.`
    },
  ];

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, rgba(245,166,35,0.08), rgba(59,130,246,0.06))", border: "1px solid rgba(245,166,35,0.2)", borderRadius: 14, padding: "28px 32px", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <GraduationCap size={22} color="var(--amber)" />
          <div className="display" style={{ fontSize: 22, fontWeight: 800 }}>MU Admissions Intelligence</div>
        </div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 680 }}>
          Built for Masters' Union's Founder's Office. Not a generic dashboard — a tool designed around the specific operational decisions MU's leadership makes every admissions cycle.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ background: "var(--navy-3)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              {s.icon}
              <div className="display" style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.title}</div>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

const navItems = [
  { id: "funnel", label: "Funnel", icon: <BarChart2 size={16} /> },
  { id: "sources", label: "Sources", icon: <Globe size={16} /> },
  { id: "profiles", label: "Profiles", icon: <Users size={16} /> },
  { id: "ai", label: "AI Analyst", icon: <Sparkles size={16} /> },
  { id: "why", label: "Why This", icon: <BookOpen size={16} /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("funnel");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0,
        background: "var(--navy-2)",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        position: "fixed", height: "100vh", zIndex: 10,
      }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <GraduationCap size={16} color="#0B0F1A" />
            </div>
            <div className="display" style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em" }}>MU Intelligence</div>
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 36 }}>Founder's Office</div>
        </div>

        <div style={{ padding: "16px 12px", flex: 1 }}>
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, paddingLeft: 8 }}>Analytics</div>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8, border: "none",
                background: activeTab === item.id ? "rgba(245,166,35,0.12)" : "transparent",
                color: activeTab === item.id ? "var(--amber)" : "var(--text-secondary)",
                cursor: "pointer", fontSize: 13, fontWeight: activeTab === item.id ? 600 : 400,
                marginBottom: 2, textAlign: "left",
                borderLeft: activeTab === item.id ? "2px solid var(--amber)" : "2px solid transparent",
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>Built by Navtesh Sharma</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)" }}>For MU Founder's Office</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 220, flex: 1, padding: "28px 32px", maxWidth: "calc(100vw - 220px)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <div className="display" style={{ fontSize: 22, fontWeight: 800 }}>
              {navItems.find(n => n.id === activeTab)?.label === "Why This"
                ? "Why I Built This"
                : navItems.find(n => n.id === activeTab)?.label + " Analytics"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              Masters' Union · PGP-TBM 2025 Admissions Cycle
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "var(--green)", fontWeight: 600,
            }}>
              ● Live
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Last updated: just now</div>
          </div>
        </div>

        {activeTab === "funnel" && <FunnelView />}
        {activeTab === "sources" && <SourceView />}
        {activeTab === "profiles" && <ProfileView />}
        {activeTab === "ai" && <AIView />}
        {activeTab === "why" && <WhyView />}
      </div>
    </div>
  );
}
