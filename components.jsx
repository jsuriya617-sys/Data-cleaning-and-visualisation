// ── Reusable UI Components ────────────────────────────────────────────────────

// Stat card
export function StatCard({ label, value, sub, color = "#38bdf8" }) {
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b",
      borderRadius: 12, padding: "18px 22px", flex: 1, minWidth: 130,
    }}>
      <p style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>
        {label}
      </p>
      <p style={{ color, fontSize: 26, fontWeight: 700, margin: "0 0 4px", fontFamily: "'DM Mono', monospace" }}>
        {value}
      </p>
      {sub && <p style={{ color: "#475569", fontSize: 11, margin: 0 }}>{sub}</p>}
    </div>
  );
}

// Custom recharts tooltip
export function CustomTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #334155",
      borderRadius: 8, padding: "10px 14px",
    }}>
      {label && <p style={{ color: "#94a3b8", fontSize: 11, margin: "0 0 4px" }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#e2e8f0", fontSize: 13, margin: 0 }}>
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  );
}

// Tab bar
export function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 4, marginBottom: 28,
      background: "#0f172a", padding: 4, borderRadius: 12,
      width: "fit-content", flexWrap: "wrap",
    }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            background: active === t.id ? "#0ea5e9" : "none",
            border: "none", cursor: "pointer",
            padding: "8px 18px", borderRadius: 8,
            fontSize: 13, fontWeight: 500,
            color: active === t.id ? "#fff" : "#94a3b8",
            transition: "all .2s", fontFamily: "inherit",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
