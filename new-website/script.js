// ===== 데이터 =====
const STORAGE_KEY = "pointSystemData";

let data = { students: [], history: [] };

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) data = JSON.parse(saved);
  } catch (e) {
    console.warn("불러오기 실패", e);
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    alert("저장에 실패했어요. 백업 저장을 이용해 주세요.");
  }
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// 학생별 상점/벌점 합계 계산
function getScores(studentId) {
  let merit = 0, demerit = 0;
  for (const h of data.history) {
    if (h.studentId !== studentId) continue;
    if (h.type === "merit") merit += h.amount;
    else demerit += h.amount;
  }
  return { merit, demerit, total: merit - demerit };
}

function findStudent(id) {
  return data.students.find((s) => s.id === id);
}

// ===== 기능 =====
function addStudent(no, name) {
  if (data.students.some((s) => s.no === no)) {
    alert(`${no}번 학생이 이미 있어요.`);
    return false;
  }
  data.students.push({ id: newId(), no, name });
  save();
  render();
  return true;
}

function deleteStudent(id) {
  const s = findStudent(id);
  if (!confirm(`${s.no}번 ${s.name} 학생과 모든 기록을 삭제할까요?`)) return;
  data.students = data.students.filter((x) => x.id !== id);
  data.history = data.history.filter((h) => h.studentId !== id);
  save();
  render();
}

function givePoint(studentId, type, amount, reason) {
  data.history.unshift({
    id: newId(),
    studentId,
    type,
    amount,
    reason: reason || "",
    time: new Date().toISOString(),
  });
  save();
  render();
}

function deleteHistory(id) {
  data.history = data.history.filter((h) => h.id !== id);
  save();
  render();
}

// ===== 화면 그리기 =====
const $ = (id) => document.getElementById(id);

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function formatTime(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function render() {
  renderStudentSelect();
  renderTable();
  renderHistory();
}

function renderStudentSelect() {
  const select = $("pointStudent");
  const current = select.value;
  const sorted = [...data.students].sort((a, b) => a.no - b.no);
  select.innerHTML =
    '<option value="">학생 선택</option>' +
    sorted.map((s) => `<option value="${s.id}">${s.no}번 ${escapeHtml(s.name)}</option>`).join("");
  select.value = current;
}

function renderTable() {
  const sortBy = $("sortSelect").value;
  const rows = data.students.map((s) => ({ ...s, ...getScores(s.id) }));

  rows.sort((a, b) => {
    if (sortBy === "no") return a.no - b.no;
    return b[sortBy] - a[sortBy] || a.no - b.no;
  });

  $("studentTable").innerHTML = rows.map((s) => `
    <tr>
      <td>${s.no}</td>
      <td class="name">${escapeHtml(s.name)}</td>
      <td class="merit">${s.merit}</td>
      <td class="demerit">${s.demerit}</td>
      <td class="total ${s.total > 0 ? "plus" : s.total < 0 ? "minus" : ""}">${s.total > 0 ? "+" : ""}${s.total}</td>
      <td class="quick">
        <button class="small btn-merit" data-quick="merit" data-id="${s.id}">+1 상점</button>
        <button class="small btn-demerit" data-quick="demerit" data-id="${s.id}">+1 벌점</button>
      </td>
      <td><button class="small danger" data-delete="${s.id}">삭제</button></td>
    </tr>
  `).join("");

  $("emptyMsg").style.display = rows.length ? "none" : "block";
}

function renderHistory() {
  const items = data.history.slice(0, 100);
  $("historyList").innerHTML = items.map((h) => {
    const s = findStudent(h.studentId);
    const name = s ? `${s.no}번 ${escapeHtml(s.name)}` : "(삭제된 학생)";
    const label = h.type === "merit"
      ? `<span class="merit">상점 +${h.amount}</span>`
      : `<span class="demerit">벌점 +${h.amount}</span>`;
    const reason = h.reason ? ` · ${escapeHtml(h.reason)}` : "";
    return `
      <li>
        <span>${name} ${label}${reason}<span class="time">${formatTime(h.time)}</span></span>
        <button class="small danger" data-undo="${h.id}">취소</button>
      </li>`;
  }).join("");

  $("emptyHistory").style.display = items.length ? "none" : "block";
}

// ===== 이벤트 =====
$("addStudentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const no = parseInt($("studentNo").value, 10);
  const name = $("studentName").value.trim();
  if (!name) return;
  if (addStudent(no, name)) {
    $("studentNo").value = no + 1; // 다음 번호 자동 입력
    $("studentName").value = "";
    $("studentName").focus();
  }
});

$("pointForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const studentId = $("pointStudent").value;
  if (!studentId) return alert("학생을 선택해 주세요.");
  const amount = parseInt($("pointAmount").value, 10) || 1;
  givePoint(studentId, $("pointType").value, amount, $("pointReason").value.trim());
  $("pointReason").value = "";
});

$("sortSelect").addEventListener("change", renderTable);

// 표 안의 버튼들 (빠른 점수, 삭제)
$("studentTable").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.dataset.quick) {
    const reason = prompt("사유를 입력하세요 (없으면 비워두기)") ;
    if (reason === null) return; // 취소 누름
    givePoint(btn.dataset.id, btn.dataset.quick, 1, reason.trim());
  } else if (btn.dataset.delete) {
    deleteStudent(btn.dataset.delete);
  }
});

$("historyList").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-undo]");
  if (btn && confirm("이 기록을 취소할까요?")) deleteHistory(btn.dataset.undo);
});

$("clearHistoryBtn").addEventListener("click", () => {
  if (!data.history.length) return;
  if (confirm("모든 상벌점 기록을 삭제할까요? (학생 명단은 남아요)")) {
    data.history = [];
    save();
    render();
  }
});

// 백업 저장 / 불러오기
$("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `상벌점_백업_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
});

$("importInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.students) || !Array.isArray(imported.history)) throw new Error();
      if (confirm("지금 데이터를 백업 파일로 바꿀까요?")) {
        data = imported;
        save();
        render();
      }
    } catch {
      alert("올바른 백업 파일이 아니에요.");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

// ===== 시작 =====
load();
render();
