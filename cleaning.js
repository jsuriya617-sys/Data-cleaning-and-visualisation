// ── Data Cleaning Pipeline ────────────────────────────────────────────────────

export function cleanData(raw) {
  const log = [];
  let data = [...raw];

  // Step 1: Remove duplicates (by name + dept + joined)
  const seen = new Set();
  const beforeDup = data.length;
  data = data.filter(r => {
    const key = `${r.name}|${r.dept}|${r.joined}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  log.push({ step: "Remove Duplicates", removed: beforeDup - data.length, icon: "⊘" });

  // Step 2: Fix age outliers (age > 100 or < 16 → null)
  let ageOutliers = 0;
  data = data.map(r => {
    if (r.age !== null && (r.age > 100 || r.age < 16)) {
      ageOutliers++;
      return { ...r, age: null };
    }
    return r;
  });
  log.push({ step: "Age Outliers → null", removed: ageOutliers, icon: "⚠" });

  // Step 3: Fix negative salaries → null
  let negSalary = 0;
  data = data.map(r => {
    if (r.salary !== null && r.salary < 0) {
      negSalary++;
      return { ...r, salary: null };
    }
    return r;
  });
  log.push({ step: "Negative Salary → null", removed: negSalary, icon: "⚠" });

  // Step 4: Impute missing age with mean
  const validAges = data.filter(r => r.age !== null).map(r => r.age);
  const meanAge = Math.round(validAges.reduce((a, b) => a + b, 0) / validAges.length);
  let imputedAge = 0;
  data = data.map(r => {
    if (r.age === null) { imputedAge++; return { ...r, age: meanAge }; }
    return r;
  });
  log.push({ step: `Impute Age (mean=${meanAge})`, removed: imputedAge, icon: "✦" });

  // Step 5: Impute missing salary with department median
  const deptSalaries = {};
  data.forEach(r => {
    if (r.salary !== null) {
      deptSalaries[r.dept] = deptSalaries[r.dept] || [];
      deptSalaries[r.dept].push(r.salary);
    }
  });
  const deptMedian = {};
  Object.entries(deptSalaries).forEach(([d, vals]) => {
    const s = [...vals].sort((a, b) => a - b);
    deptMedian[d] = s[Math.floor(s.length / 2)];
  });
  let imputedSal = 0;
  data = data.map(r => {
    if (r.salary === null) {
      imputedSal++;
      return { ...r, salary: deptMedian[r.dept] || 70000 };
    }
    return r;
  });
  log.push({ step: "Impute Salary (dept median)", removed: imputedSal, icon: "✦" });

  // Step 6: Impute missing score with department mean
  const deptScores = {};
  data.forEach(r => {
    if (r.score !== null) {
      deptScores[r.dept] = deptScores[r.dept] || [];
      deptScores[r.dept].push(r.score);
    }
  });
  const deptMeanScore = {};
  Object.entries(deptScores).forEach(([d, vals]) => {
    deptMeanScore[d] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  });
  let imputedScore = 0;
  data = data.map(r => {
    if (r.score === null) {
      imputedScore++;
      return { ...r, score: deptMeanScore[r.dept] || 80 };
    }
    return r;
  });
  log.push({ step: "Impute Score (dept mean)", removed: imputedScore, icon: "✦" });

  return { cleaned: data, log };
}

// ── Statistics Helper ─────────────────────────────────────────────────────────

export function stats(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mean   = arr.reduce((a, b) => a + b, 0) / arr.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const min    = sorted[0];
  const max    = sorted[sorted.length - 1];
  const std    = Math.sqrt(
    arr.map(x => (x - mean) ** 2).reduce((a, b) => a + b, 0) / arr.length
  );
  return { mean: +mean.toFixed(1), median, min, max, std: +std.toFixed(1) };
}
