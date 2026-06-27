import { useState, useMemo } from "react";
import {
  BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell,
  PieChart, Pie,
} from "recharts";

import { RAW_DATA, DEPT_COLORS } from "./data";
import { cleanData, stats } from "./cleaning";
import { StatCard, CustomTip, TabBar } from "./components";

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview"     },
  { id: "cleaning", label: "Cleaning Log" },
  { id: "salary",   label: "Salary Analysis" },
  { id: "dept",     label: "By Department"   },
  { id: "scatter",  label: "Correlation"     },
  { id: "table",    label: "Clean Data"      },
];

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("overview");
  const { cleaned, log } = useMemo(() => cleanData(RAW_DATA), []);

  const salaries = cleaned.map(r => r.salary);
  const scores   = cleaned.map(r => r.score);
  const ages     = cleaned.map(r => r.age);

  const salaryStats = stats(salaries);
  const scoreStats  = stats(scores);
  const ageStats    = stats(ages);

  // Dept aggregates
  const deptAgg = useMemo(() => {
    const map = {};
    cleaned.forEach(r => {
      map[r.dept] = map[r.dept] || { dept: r.dept, count: 0, salarySum: 0, scoreSum: 0 };
      map[r.dept].count++;
      map[r.dept].salarySum += r.salary;
      map[r.dept].scoreSum  += r.score;
    });
    return Object.values(map).map(d => ({
      dept:      d.dept,
      count:     d.count,
      avgSalary: Math.round(d.salarySum / d.count),
      avgScore:  Math.round(d.scoreSum  / d.count),
    }));
  }, [cleaned]);

  // Salary distribution bins
  const salaryBins = useMemo(() => {
    const bins = [
      { range: "60–75k",   count: 0 },
      { range: "75–90k",   count: 0 },
      { range: "90–105k",  count: 0 },
      { range: "105–120k", count: 0 },
      { range: "120k+",    count: 0 },
    ];
    salaries.forEach(s => {
      if      (s < 75000)  bins[0].count++;
      else if (s < 90000)  bins[1].count++;
      else if (s < 105000) bins[2].count++;
      else if (s < 120000) bins[3].count++;
      else                 bins[4].count++;
    });
    return bins;
  }, [salaries]);

  // Scatter data
  const scatterData = cleaned.map(r => ({ x: r.age, y: r.salary, name: r.name, dept: r.dept }));

  // Missing value summary from raw data
  const missingCounts = useMemo(() =>
    ["age", "salary", "score"].map(f => ({
      field: f,
      missing: RAW_DATA.filter(r => r[f] === null).length,
      total: RAW_DATA.length,
    }))
  , []);

  return (
    <div style={{ minHeight: "100vh", background: "#020817", color: "#e2e8f0", fontFamily: "'Inter', sans-serif", padding: "28px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #1e293b; font-size: 13px; }
        th { color: #64748b; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
        tr:hover td { background: #0f172a; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 8, height: 36, background: "linear-gradient(#38bdf8,#818cf8)", borderRadius: 4 }} />
          <h1 style={{ margin: 0, fontSize: 28, fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
            Data Cleaning & Visualization
          </h1>
        </div>
        <p style={{ margin: "0 0 0 20px", color: "#64748b", fontSize: 13 }}>
          {RAW_DATA.length} raw records → {cleaned.length} clean records · {log.length} cleaning steps applied
        </p>
      </div>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {/* ── Overview ── */}
      {tab === "overview" && (
        <div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <StatCard label="Total Records" value={cleaned.length} sub={`from ${RAW_DATA.length} raw`} />
            <StatCard label="Avg Salary" value={`$${(salaryStats.mean / 1000).toFixed(0)}k`} sub={`range $${(salaryStats.min/1000).toFixed(0)}k–$${(salaryStats.max/1000).toFixed(0)}k`} color="#34d399" />
            <StatCard label="Avg Score"  value={scoreStats.mean}  sub={`std dev ${scoreStats.std}`} color="#f472b6" />
            <StatCard label="Avg Age"    value={ageStats.mean}    sub={`range ${ageStats.min}–${ageStats.max}`} color="#a78bfa" />
            <StatCard label="Departments" value={deptAgg.length}  sub="unique depts" color="#fb923c" />
          </div>

          {/* Missing values bar */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>Missing Values in Raw Data</h3>
            <div style={{ display: "flex", gap: 16 }}>
              {missingCounts.map(m => (
                <div key={m.field} style={{ flex: 1, background: "#020817", borderRadius: 10, padding: "14px 18px" }}>
                  <p style={{ margin: "0 0 10px", color: "#64748b", fontSize: 11, textTransform: "uppercase" }}>{m.field}</p>
                  <div style={{ background: "#1e293b", borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${(m.missing / m.total) * 100}%`, background: "#f43f5e", height: "100%", borderRadius: 4 }} />
                  </div>
                  <p style={{ margin: "8px 0 0", color: "#e2e8f0", fontSize: 13, fontFamily: "DM Mono" }}>
                    {m.missing} / {m.total} <span style={{ color: "#64748b" }}>({((m.missing / m.total) * 100).toFixed(0)}%)</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dept pie */}
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 24 }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>Headcount by Department</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={deptAgg} dataKey="count" nameKey="dept" cx="50%" cy="50%"
                  outerRadius={85} innerRadius={45} paddingAngle={3}
                  label={({ dept, count }) => `${dept} (${count})`}
                  labelLine={{ stroke: "#334155" }}>
                  {deptAgg.map(d => <Cell key={d.dept} fill={DEPT_COLORS[d.dept]} />)}
                </Pie>
                <Tooltip content={<CustomTip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Cleaning Log ── */}
      {tab === "cleaning" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <StatCard label="Issues Found"   value={RAW_DATA.length - cleaned.length + log.filter(l => l.icon === "⚠").reduce((a, l) => a + l.removed, 0)} sub="duplicates + outliers" />
            <StatCard label="Values Imputed" value={log.filter(l => l.icon === "✦").reduce((a, l) => a + l.removed, 0)} sub="nulls filled" color="#a78bfa" />
            <StatCard label="Clean Records"  value={cleaned.length} sub="ready for analysis" color="#34d399" />
          </div>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 24 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>Cleaning Pipeline Steps</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {log.map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, background: "#020817", borderRadius: 10, padding: "14px 18px", border: "1px solid #1e293b" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 16,
                    background: l.icon === "⊘" ? "#1c1917" : l.icon === "⚠" ? "#1c1107" : "#0c1a14",
                    color:      l.icon === "⊘" ? "#f87171" : l.icon === "⚠" ? "#fb923c" : "#34d399",
                  }}>{l.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>Step {i + 1}: {l.step}</p>
                  </div>
                  <span className="badge" style={{
                    background: l.icon === "⊘" ? "#450a0a" : l.icon === "⚠" ? "#431407" : "#052e16",
                    color:      l.icon === "⊘" ? "#fca5a5" : l.icon === "⚠" ? "#fdba74" : "#86efac",
                  }}>
                    {l.removed} record{l.removed !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Salary Analysis ── */}
      {tab === "salary" && (
        <div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <StatCard label="Mean"    value={`$${(salaryStats.mean/1000).toFixed(1)}k`}   sub="average salary" />
            <StatCard label="Median"  value={`$${(salaryStats.median/1000).toFixed(0)}k`} sub="middle value"   color="#a78bfa" />
            <StatCard label="Min"     value={`$${(salaryStats.min/1000).toFixed(0)}k`}    sub="lowest salary"  color="#34d399" />
            <StatCard label="Max"     value={`$${(salaryStats.max/1000).toFixed(0)}k`}    sub="highest salary" color="#f472b6" />
            <StatCard label="Std Dev" value={`$${(salaryStats.std/1000).toFixed(1)}k`}    sub="spread"         color="#fb923c" />
          </div>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>Salary Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salaryBins} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip content={<CustomTip />} />
                <Bar dataKey="count" name="Employees" radius={[6, 6, 0, 0]}>
                  {salaryBins.map((_, i) => (
                    <Cell key={i} fill={["#0ea5e9","#38bdf8","#7dd3fc","#bae6fd","#e0f2fe"][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 24 }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>Avg Salary by Department</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptAgg} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis type="category" dataKey="dept" tick={{ fill: "#94a3b8", fontSize: 13 }} width={90} />
                <Tooltip content={<CustomTip />} formatter={v => [`$${v.toLocaleString()}`, "Avg Salary"]} />
                <Bar dataKey="avgSalary" name="Avg Salary" radius={[0, 6, 6, 0]}>
                  {deptAgg.map(d => <Cell key={d.dept} fill={DEPT_COLORS[d.dept]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── By Department ── */}
      {tab === "dept" && (
        <div>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>Avg Performance Score by Dept</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={deptAgg} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="dept" tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis domain={[60, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip content={<CustomTip />} />
                <Bar dataKey="avgScore" name="Avg Score" radius={[6, 6, 0, 0]}>
                  {deptAgg.map(d => <Cell key={d.dept} fill={DEPT_COLORS[d.dept]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            {deptAgg.map(d => (
              <div key={d.dept} style={{ background: "#0f172a", border: `1px solid ${DEPT_COLORS[d.dept]}33`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: DEPT_COLORS[d.dept] }} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{d.dept}</span>
                </div>
                {[["Headcount", d.count], ["Avg Salary", `$${(d.avgSalary/1000).toFixed(0)}k`], ["Avg Score", `${d.avgScore} / 100`]].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#64748b", fontSize: 12 }}>{label}</span>
                    <span style={{ color: "#e2e8f0", fontSize: 13, fontFamily: "DM Mono", fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Scatter / Correlation ── */}
      {tab === "scatter" && (
        <div>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 6px", fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>Age vs. Salary Correlation</h3>
            <p style={{ margin: "0 0 18px", color: "#475569", fontSize: 12 }}>Each dot is an employee, colored by department</p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="x" name="Age" type="number" domain={[20, 60]}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  label={{ value: "Age", position: "insideBottom", offset: -2, fill: "#475569", fontSize: 12 }} />
                <YAxis dataKey="y" name="Salary" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px" }}>
                      <p style={{ margin: "0 0 2px", fontWeight: 600 }}>{d?.name}</p>
                      <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>{d?.dept}</p>
                      <p style={{ margin: "4px 0 0", color: "#38bdf8", fontSize: 12 }}>Age {d?.x} · ${d?.y?.toLocaleString()}</p>
                    </div>
                  );
                }} />
                {Object.keys(DEPT_COLORS).map(dept => (
                  <Scatter key={dept} name={dept}
                    data={scatterData.filter(d => d.dept === dept)}
                    fill={DEPT_COLORS[dept]} opacity={0.85} />
                ))}
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 20, color: "#64748b", fontSize: 13, lineHeight: 1.7 }}>
            <strong style={{ color: "#94a3b8" }}>Insight:</strong> A positive correlation exists between age and salary — older employees tend to earn more. Management clusters in the top-right (higher age, higher salary), while Engineering spans the full salary range.
          </div>
        </div>
      )}

      {/* ── Clean Data Table ── */}
      {tab === "table" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "auto" }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid #1e293b" }}>
            <h3 style={{ margin: 0, fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>{cleaned.length} Clean Records</h3>
          </div>
          <table>
            <thead>
              <tr>{["#", "Name", "Age", "Dept", "Salary", "Score", "Joined"].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {cleaned.map((r, i) => (
                <tr key={r.id}>
                  <td style={{ color: "#475569", fontFamily: "DM Mono", fontSize: 12 }}>{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{r.name}</td>
                  <td style={{ fontFamily: "DM Mono" }}>{r.age}</td>
                  <td>
                    <span className="badge" style={{ background: DEPT_COLORS[r.dept] + "22", color: DEPT_COLORS[r.dept] }}>
                      {r.dept}
                    </span>
                  </td>
                  <td style={{ fontFamily: "DM Mono", color: "#34d399" }}>${r.salary.toLocaleString()}</td>
                  <td style={{ fontFamily: "DM Mono", color: r.score >= 90 ? "#f472b6" : r.score >= 80 ? "#38bdf8" : "#94a3b8" }}>
                    {r.score}
                  </td>
                  <td style={{ color: "#64748b", fontSize: 12 }}>{r.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
