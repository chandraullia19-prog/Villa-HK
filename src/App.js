import React, { useState, useEffect } from “react”;

const ROLES = { ADMIN: “Admin”, HK: “Housekeeper”, PIC: “PIC”, TIM: “Head Team” };

const UNITS = [“Banyu 3”, “Banyu 5”, “Brownies”, “Kaza”];
const UNITS_LISTRIK = [“Banyu 3”, “Banyu 5”, “Brownies”];

const HK_UNIT = {
“Pa Ade”: “Banyu 3”,
“Sandi”: “Banyu 5”,
“Pa Isak”: “Brownies”,
“Agung”: “Kaza”,
};

const ROOMS = [
“Banyu 3 - Kamar 1”, “Banyu 3 - Kamar 2”,
“Banyu 3 - Kitchen”, “Banyu 3 - Bathroom”, “Banyu 3 - Living Room”, “Banyu 3 - Taman”,
“Banyu 5 - Kamar 1”, “Banyu 5 - Kamar 2”,
“Banyu 5 - Kitchen”, “Banyu 5 - Bathroom”, “Banyu 5 - Living Room”, “Banyu 5 - Taman”,
“Brownies - Kamar 1”, “Brownies - Kamar 2”, “Brownies - Kamar 3”,
“Brownies - Kitchen”, “Brownies - Bathroom”, “Brownies - Living Room”, “Brownies - Taman”,
“Kaza - Kamar 1”, “Kaza - Kamar 2”, “Kaza - Kamar 3”,
“Kaza - Kitchen”, “Kaza - Bathroom”, “Kaza - Living Room”, “Kaza - Taman”,
];

const CHECKLIST_TEMPLATE = [
{ id: “c1”, category: “Remote & Elektronik”, items: [
{ id: “i1”, label: “Remote AC berfungsi” },
{ id: “i2”, label: “Remote TV berfungsi” },
{ id: “i3”, label: “Semua lampu berfungsi” },
{ id: “i4”, label: “WiFi berfungsi” },
]},
{ id: “c2”, category: “Kebersihan Kamar”, items: [
{ id: “i5”, label: “Lantai bersih & dipel” },
{ id: “i6”, label: “Tempat tidur rapi & bersih” },
{ id: “i7”, label: “Jendela & kaca bersih” },
{ id: “i8”, label: “Lemari tertata rapi” },
]},
{ id: “c3”, category: “Kamar Mandi”, items: [
{ id: “i9”, label: “Toilet bersih & wangi” },
{ id: “i10”, label: “Wastafel bersih” },
{ id: “i11”, label: “Shower/bathtub bersih” },
{ id: “i12”, label: “Handuk bersih tersedia” },
]},
{ id: “c4”, category: “Amenities”, items: [
{ id: “i13”, label: “Sabun mandi tersedia” },
{ id: “i14”, label: “Sampo tersedia” },
{ id: “i15”, label: “Tissue tersedia” },
{ id: “i16”, label: “Air mineral tersedia” },
]},
];

const INITIAL_USERS = [
{ id: 1, name: “Admin General”, username: “admin”, password: “admin123”, role: “ADMIN”, avatar: “AG” },
{ id: 2, name: “Sandi”, username: “sandi”, password: “hk123”, role: “HK”, avatar: “SN” },
{ id: 3, name: “Pa Ade”, username: “paade”, password: “hk123”, role: “HK”, avatar: “AD” },
{ id: 4, name: “Pa Isak”, username: “paisak”, password: “hk123”, role: “HK”, avatar: “IS” },
{ id: 5, name: “Agung”, username: “agung”, password: “hk123”, role: “HK”, avatar: “AU” },
{ id: 6, name: “Aulia”, username: “aulia”, password: “pic123”, role: “PIC”, avatar: “AL” },
{ id: 7, name: “Head Team”, username: “headteam”, password: “head123”, role: “TIM”, avatar: “HT” },
];

const INITIAL_AMENITIES = [
{ id: “a1”, name: “Sabun Mandi”, unit: “pcs”, stock: 45, min: 20 },
{ id: “a2”, name: “Sampo”, unit: “botol”, stock: 30, min: 15 },
{ id: “a3”, name: “Tissue Gulung”, unit: “roll”, stock: 60, min: 30 },
{ id: “a4”, name: “Air Mineral 600ml”, unit: “botol”, stock: 24, min: 12 },
{ id: “a5”, name: “Handuk Kecil”, unit: “lembar”, stock: 20, min: 10 },
{ id: “a6”, name: “Handuk Besar”, unit: “lembar”, stock: 15, min: 8 },
{ id: “a7”, name: “Sandal Kamar”, unit: “pasang”, stock: 12, min: 6 },
{ id: “a8”, name: “Coffee Sachet”, unit: “pcs”, stock: 50, min: 20 },
];

function useLS(key, init) {
const [val, setVal] = useState(() => {
try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
catch { return init; }
});
useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
return [val, setVal];
}

function exportCSV(filename, headers, rows) {
const csv = [headers, …rows].map(r => r.map(c => ‘”’ + String(c || “”).replace(/”/g, ‘””’) + ‘”’).join(”,”)).join(”\n”);
const blob = new Blob([csv], { type: “text/csv;charset=utf-8;” });
const url = URL.createObjectURL(blob);
const a = document.createElement(“a”); a.href = url; a.download = filename; a.click();
URL.revokeObjectURL(url);
}

function Btn({ onClick, label, color = “#0d6e6e”, small, full }) {
return <button onClick={onClick} style={{ padding: small ? “7px 14px” : “10px 18px”, background: color, color: “#fff”, border: “none”, borderRadius: 9, fontSize: small ? 12 : 13, fontWeight: 700, cursor: “pointer”, fontFamily: “inherit”, whiteSpace: “nowrap”, width: full ? “100%” : “auto” }}>{label}</button>;
}

function StatusBadge({ status }) {
const map = { pending: [”#f59e0b”, “#fffbeb”, “Menunggu”], approved: [”#10b981”, “#ecfdf5”, “Disetujui”], rejected: [”#ef4444”, “#fef2f2”, “Ditolak”], revision: [”#f59e0b”, “#fffbeb”, “Revisi”], masuk: [”#3b82f6”, “#eff6ff”, “Masuk”], keluar: [”#f59e0b”, “#fffbeb”, “Keluar”] };
const [color, bg, label] = map[status] || [”#94a3b8”, “#f8fafc”, status];
return <span style={{ fontSize: 11, padding: “3px 10px”, borderRadius: 20, background: bg, color, fontWeight: 700, whiteSpace: “nowrap” }}>{label}</span>;
}

function Modal({ title, children, onClose }) {
return (
<div style={{ position: “fixed”, inset: 0, background: “rgba(0,0,0,0.4)”, display: “flex”, alignItems: “center”, justifyContent: “center”, zIndex: 200, padding: 20 }}>
<div style={{ background: “#fff”, borderRadius: 16, padding: 24, width: “100%”, maxWidth: 460, maxHeight: “88vh”, overflowY: “auto”, boxShadow: “0 20px 60px rgba(0,0,0,0.2)” }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 16 }}>
<h3 style={{ margin: 0, fontSize: 16, color: “#1a3a4f”, fontWeight: 800 }}>{title}</h3>
<button onClick={onClose} style={{ background: “#f1f5f9”, border: “none”, borderRadius: 7, padding: “5px 10px”, cursor: “pointer”, fontSize: 14 }}>x</button>
</div>
{children}
</div>
</div>
);
}

function EmptyState({ text }) {
return <div style={{ textAlign: “center”, padding: 40, color: “#94a3b8”, fontSize: 14 }}>{text}</div>;
}

function PageHeader({ title, subtitle, children }) {
return (
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start”, marginBottom: 20 }}>
<div>
<h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: “#1a3a4f” }}>{title}</h2>
{subtitle && <p style={{ margin: “4px 0 0”, color: “#64748b”, fontSize: 13 }}>{subtitle}</p>}
</div>
<div style={{ display: “flex”, gap: 8 }}>{children}</div>
</div>
);
}

//  INPUT
function Field({ label, children }) {
return (
<div>
<label style={{ fontSize: 11, fontWeight: 700, color: “#475569”, display: “block”, marginBottom: 5 }}>{label}</label>
{children}
</div>
);
}
function Input({ value, onChange, type = “text”, placeholder }) {
return <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: “100%”, padding: “9px 12px”, border: “1px solid #e2e8f0”, borderRadius: 8, fontSize: 13, boxSizing: “border-box”, fontFamily: “inherit” }} />;
}
function Select({ value, onChange, children }) {
return <select value={value} onChange={onChange} style={{ width: “100%”, padding: “9px 12px”, border: “1px solid #e2e8f0”, borderRadius: 8, fontSize: 13, fontFamily: “inherit” }}>{children}</select>;
}

//  MAIN
export default function App() {
const [currentUser, setCurrentUser] = useState(null);
const [activeTab, setActiveTab] = useState(“dashboard”);
const [users, setUsers] = useLS(“vhk_users”, INITIAL_USERS);
const [amenities, setAmenities] = useLS(“vhk_amenities”, INITIAL_AMENITIES);
const [stockLog, setStockLog] = useLS(“vhk_stocklog”, []);
const [purchaseOrders, setPurchaseOrders] = useLS(“vhk_po”, []);
const [checklists, setChecklists] = useLS(“vhk_checklists”, []);
const [listrik, setListrik] = useLS(“vhk_listrik”, []);
const [loginForm, setLoginForm] = useState({ username: “”, password: “” });
const [loginError, setLoginError] = useState(””);
const [showReset, setShowReset] = useState(false);

const login = () => {
const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
if (user) { setCurrentUser(user); setLoginError(””); setActiveTab(“dashboard”); }
else setLoginError(“Username atau password salah!”);
};
const logout = () => { setCurrentUser(null); setLoginForm({ username: “”, password: “” }); };

const exportAll = () => {
const mo = new Date().toLocaleDateString(“id-ID”, { month: “long”, year: “numeric” });
exportCSV(“Checklist_” + mo + “.csv”,
[“Tanggal”, “HK”, “Unit”, “Kamar/Area”, “Status”, “Diapprove”, “Catatan”, “Selesai”, “Total”],
checklists.map(c => {
const done = Object.values(c.checks || {}).filter(Boolean).length;
const tot = Object.keys(c.checks || {}).length;
const unit = UNITS.find(u => c.room && c.room.startsWith(u)) || “-”;
return [c.date, c.hk, unit, c.room, c.status, c.approvedBy || “-”, c.note || “-”, done, tot];
})
);
setTimeout(() => exportCSV(“Inventory_” + mo + “.csv”,
[“Nama Item”, “Stok”, “Satuan”, “Min Stok”, “Status”],
amenities.map(a => [a.name, a.stock, a.unit, a.min, a.stock <= a.min ? “MENIPIS” : “AMAN”])
), 400);
setTimeout(() => exportCSV(“StokLog_” + mo + “.csv”,
[“Tanggal”, “HK”, “Unit”, “Item”, “Jenis”, “Jumlah”, “Catatan”],
stockLog.map(l => [l.date, l.hk, l.unit, l.item, l.type, l.qty, l.note || “-”])
), 800);
setTimeout(() => exportCSV(“PurchaseOrder_” + mo + “.csv”,
[“Tanggal”, “HK”, “Item”, “Status”, “Diapprove”, “Catatan”],
purchaseOrders.map(p => [p.date, p.hk, p.items.map(i => i.name + “ x” + i.qty).join(”; “), p.status, p.approvedBy || “-”, p.note || “-”])
), 1200);
setTimeout(() => exportCSV(“Listrik_” + mo + “.csv”,
[“Tanggal”, “Unit”, “Meter Awal”, “Meter Akhir”, “Pemakaian (kWh)”, “Nominal (Rp)”, “Catatan”],
listrik.map(l => [l.date, l.unit, l.meterAwal, l.meterAkhir, l.meterAkhir - l.meterAwal, l.nominal, l.note || “-”])
), 1600);
};

const resetBulanan = () => {
setPurchaseOrders([]); setChecklists([]); setStockLog([]); setListrik([]);
setAmenities(INITIAL_AMENITIES); setShowReset(false);
};

if (!currentUser) return <LoginPage form={loginForm} setForm={setLoginForm} onLogin={login} error={loginError} />;

const role = currentUser.role;
const hkUnit = HK_UNIT[currentUser.name];
const isAgung = currentUser.name === “Agung”;

const tabs = [
{ id: “dashboard”, label: “Dashboard”, icon: “M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z”, roles: [“ADMIN”,“HK”,“PIC”,“TIM”] },
{ id: “checklist”, label: “Checklist”, icon: “M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7”, roles: [“ADMIN”,“HK”,“PIC”,“TIM”] },
{ id: “inventory”, label: “Inventory”, icon: “M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16”, roles: [“ADMIN”,“HK”,“PIC”,“TIM”], hide: isAgung },
{ id: “po”, label: “Purchase Order”, icon: “M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z”, roles: [“ADMIN”,“HK”,“PIC”], hide: isAgung },
{ id: “listrik”, label: “Listrik”, icon: “M13 2L3 14h9l-1 8 10-12h-9l1-8z”, roles: [“ADMIN”,“HK”,“PIC”,“TIM”], hide: isAgung },
{ id: “users”, label: “Tim HK”, icon: “M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75”, roles: [“ADMIN”,“PIC”] },
{ id: “laporan”, label: “Laporan”, icon: “M18 20V10 M12 20V4 M6 20v-6”, roles: [“ADMIN”,“TIM”,“PIC”] },
].filter(t => t.roles.includes(role) && !t.hide);

return (
<div style={{ minHeight: “100vh”, background: “#f0f4f8”, fontFamily: “‘Nunito’,‘Segoe UI’,sans-serif”, display: “flex”, flexDirection: “column” }}>
{/* HEADER */}
<header style={{ background: “linear-gradient(135deg,#1a3a4f,#0d6e6e)”, color: “#fff”, padding: “0 16px”, display: “flex”, alignItems: “center”, justifyContent: “space-between”, height: 58, boxShadow: “0 2px 12px rgba(0,0,0,0.15)”, position: “sticky”, top: 0, zIndex: 100 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 8 }}>
<span style={{ fontSize: 20 }}>[Villa]</span>
<div>
<div style={{ fontWeight: 800, fontSize: 15 }}>Villa HK System</div>
<div style={{ fontSize: 10, opacity: 0.75 }}>{ROLES[role]}{hkUnit ? “ . “ + hkUnit : “”}</div>
</div>
</div>
<div style={{ display: “flex”, alignItems: “center”, gap: 8 }}>
{(role === “ADMIN” || role === “TIM”) && (
<button onClick={exportAll} style={{ background: “rgba(255,255,255,0.15)”, border: “none”, color: “#fff”, borderRadius: 8, padding: “6px 10px”, cursor: “pointer”, fontSize: 12, fontFamily: “inherit”, fontWeight: 700 }}>Export</button>
)}
{role === “ADMIN” && (
<button onClick={() => setShowReset(true)} style={{ background: “rgba(239,68,68,0.35)”, border: “none”, color: “#fff”, borderRadius: 8, padding: “6px 10px”, cursor: “pointer”, fontSize: 12, fontFamily: “inherit”, fontWeight: 700 }}>Reset</button>
)}
<div style={{ width: 32, height: 32, borderRadius: “50%”, background: “rgba(255,255,255,0.2)”, display: “flex”, alignItems: “center”, justifyContent: “center”, fontWeight: 800, fontSize: 11 }}>{currentUser.avatar}</div>
<div style={{ fontSize: 12, fontWeight: 700 }}>{currentUser.name}</div>
<button onClick={logout} style={{ background: “rgba(255,255,255,0.15)”, border: “none”, color: “#fff”, borderRadius: 8, padding: “6px 8px”, cursor: “pointer”, fontSize: 11, fontFamily: “inherit” }}>Keluar</button>
</div>
</header>

```
  {showReset && (
    <Modal title="Reset Data Bulanan" onClose={() => setShowReset(false)}>
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 13, color: "#dc2626" }}>
        Pastikan sudah Export dulu! Semua checklist, PO, log stok, dan listrik akan dihapus. Stok inventory direset ke awal.
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn onClick={exportAll} label="Export Dulu" color="#3b82f6" />
        <Btn onClick={resetBulanan} label="Reset Sekarang" color="#ef4444" />
        <Btn onClick={() => setShowReset(false)} label="Batal" color="#94a3b8" />
      </div>
    </Modal>
  )}

  <div style={{ display: "flex", flex: 1 }}>
    {/* SIDEBAR */}
    <nav style={{ width: 185, background: "#fff", borderRight: "1px solid #e2e8f0", padding: "12px 0", position: "sticky", top: 58, height: "calc(100vh - 58px)", overflowY: "auto", flexShrink: 0 }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", border: "none", background: activeTab === tab.id ? "#e6f7f7" : "transparent", color: activeTab === tab.id ? "#0d6e6e" : "#64748b", fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 13, cursor: "pointer", borderLeft: activeTab === tab.id ? "3px solid #0d6e6e" : "3px solid transparent", textAlign: "left", fontFamily: "inherit" }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {tab.icon.split(" M ").map((p, i) => <path key={i} d={i === 0 ? p : "M " + p} />)}
          </svg>
          {tab.label}
        </button>
      ))}
    </nav>

    {/* MAIN */}
    <main style={{ flex: 1, padding: 22, overflowY: "auto", minWidth: 0 }}>
      {activeTab === "dashboard" && <Dashboard currentUser={currentUser} checklists={checklists} amenities={amenities} purchaseOrders={purchaseOrders} listrik={listrik} stockLog={stockLog} />}
      {activeTab === "checklist" && <ChecklistPage currentUser={currentUser} checklists={checklists} setChecklists={setChecklists} hkUnit={hkUnit} />}
      {activeTab === "inventory" && <InventoryPage currentUser={currentUser} amenities={amenities} setAmenities={setAmenities} stockLog={stockLog} setStockLog={setStockLog} hkUnit={hkUnit} />}
      {activeTab === "po" && <POPage currentUser={currentUser} purchaseOrders={purchaseOrders} setPurchaseOrders={setPurchaseOrders} amenities={amenities} hkUnit={hkUnit} />}
      {activeTab === "listrik" && <ListrikPage currentUser={currentUser} listrik={listrik} setListrik={setListrik} hkUnit={hkUnit} />}
      {activeTab === "users" && <UsersPage currentUser={currentUser} users={users} setUsers={setUsers} />}
      {activeTab === "laporan" && <LaporanPage checklists={checklists} amenities={amenities} purchaseOrders={purchaseOrders} listrik={listrik} stockLog={stockLog} users={users} exportAll={exportAll} />}
    </main>
  </div>
</div>
```

);
}

//  LOGIN
function LoginPage({ form, setForm, onLogin, error }) {
return (
<div style={{ minHeight: “100vh”, background: “linear-gradient(135deg,#1a3a4f,#0d6e6e)”, display: “flex”, alignItems: “center”, justifyContent: “center”, padding: 20, fontFamily: “‘Nunito’,sans-serif” }}>
<div style={{ background: “#fff”, borderRadius: 20, padding: 36, width: “100%”, maxWidth: 370, boxShadow: “0 20px 60px rgba(0,0,0,0.3)” }}>
<div style={{ textAlign: “center”, marginBottom: 28 }}>
<div style={{ fontSize: 44, marginBottom: 8 }}>[Villa]</div>
<h1 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: “#1a3a4f” }}>Villa HK System</h1>
<p style={{ margin: “5px 0 0”, fontSize: 13, color: “#94a3b8” }}>Sistem Manajemen Housekeeping</p>
</div>
<Field label="USERNAME">
<Input value={form.username} onChange={e => setForm(f => ({ …f, username: e.target.value }))} placeholder=“Masukkan username” />
</Field>
<div style={{ marginTop: 12, marginBottom: 18 }}>
<Field label="PASSWORD">
<input type=“password” value={form.password} onChange={e => setForm(f => ({ …f, password: e.target.value }))} placeholder=“Masukkan password” onKeyDown={e => e.key === “Enter” && onLogin()} style={{ width: “100%”, padding: “9px 12px”, border: “1px solid #e2e8f0”, borderRadius: 8, fontSize: 13, boxSizing: “border-box”, fontFamily: “inherit” }} />
</Field>
</div>
{error && <div style={{ background: “#fef2f2”, color: “#dc2626”, padding: “10px 14px”, borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>}
<Btn onClick={onLogin} label="Masuk" full />
<div style={{ marginTop: 18, padding: 12, background: “#f8fafc”, borderRadius: 10, fontSize: 11, color: “#64748b” }}>
<div style={{ fontWeight: 700, marginBottom: 5, color: “#475569” }}>Info Login:</div>
<div>admin / admin123 (Admin)</div>
<div>sandi / hk123 (Banyu 5)</div>
<div>paade / hk123 (Banyu 3)</div>
<div>paisak / hk123 (Brownies)</div>
<div>agung / hk123 (Kaza - checklist only)</div>
<div>aulia / pic123 (PIC)</div>
<div>headteam / head123 (Head Team)</div>
</div>
</div>
</div>
);
}

//  DASHBOARD
function Dashboard({ currentUser, checklists, amenities, purchaseOrders, listrik, stockLog }) {
const role = currentUser.role;
const hkUnit = HK_UNIT[currentUser.name];
const lowStock = amenities.filter(a => a.stock <= a.min);
const pendingPO = purchaseOrders.filter(p => p.status === “pending”);
const pendingCL = checklists.filter(c => c.status === “pending”);

const cards = [
{ label: “Checklist Pending”, value: pendingCL.length, color: “#f59e0b”, bg: “#fffbeb” },
{ label: “PO Menunggu”, value: pendingPO.length, color: “#3b82f6”, bg: “#eff6ff” },
{ label: “Stok Menipis”, value: lowStock.length, color: “#ef4444”, bg: “#fef2f2” },
{ label: “Log Stok Bulan Ini”, value: stockLog.length, color: “#10b981”, bg: “#ecfdf5” },
];

return (
<div>
<div style={{ marginBottom: 20 }}>
<h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: “#1a3a4f” }}>Selamat Datang, {currentUser.name.split(” “)[0]}!</h2>
<p style={{ margin: “4px 0 0”, color: “#64748b”, fontSize: 13 }}>{new Date().toLocaleDateString(“id-ID”, { weekday: “long”, year: “numeric”, month: “long”, day: “numeric” })}</p>
{hkUnit && <div style={{ marginTop: 6, display: “inline-block”, background: “#e6f7f7”, color: “#0d6e6e”, padding: “3px 12px”, borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Unit: {hkUnit}</div>}
</div>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(auto-fit,minmax(150px,1fr))”, gap: 14, marginBottom: 20 }}>
{cards.map(c => (
<div key={c.label} style={{ background: c.bg, borderRadius: 14, padding: 16, border: “1px solid “ + c.color + “22” }}>
<div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
<div style={{ fontSize: 12, color: “#64748b”, fontWeight: 600 }}>{c.label}</div>
</div>
))}
</div>
{lowStock.length > 0 && (
<div style={{ background: “#fef2f2”, border: “1px solid #fecaca”, borderRadius: 12, padding: 14, marginBottom: 18 }}>
<div style={{ color: “#dc2626”, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Stok Menipis - Perlu Restock</div>
<div style={{ display: “flex”, flexWrap: “wrap”, gap: 6 }}>
{lowStock.map(a => <span key={a.id} style={{ background: “#fff”, border: “1px solid #fecaca”, padding: “3px 10px”, borderRadius: 20, fontSize: 12, color: “#dc2626” }}>{a.name}: {a.stock} {a.unit}</span>)}
</div>
</div>
)}
<div style={{ background: “#fff”, borderRadius: 14, padding: 18, boxShadow: “0 1px 4px rgba(0,0,0,0.06)” }}>
<div style={{ fontWeight: 700, fontSize: 14, color: “#1a3a4f”, marginBottom: 12 }}>Checklist Terbaru</div>
{checklists.length === 0 ? <EmptyState text="Belum ada checklist bulan ini" /> :
checklists.slice(-6).reverse().map(cl => (
<div key={cl.id} style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, padding: “9px 0”, borderBottom: “1px solid #f1f5f9” }}>
<div>
<div style={{ fontWeight: 600, fontSize: 13, color: “#1e293b” }}>{cl.room}</div>
<div style={{ fontSize: 11, color: “#94a3b8” }}>{cl.hk} . {cl.date}</div>
</div>
<StatusBadge status={cl.status} />
</div>
))
}
</div>
</div>
);
}

//  CHECKLIST
function ChecklistPage({ currentUser, checklists, setChecklists, hkUnit }) {
const role = currentUser.role;
const [showForm, setShowForm] = useState(false);
const [viewCL, setViewCL] = useState(null);
const [approvingCL, setApprovingCL] = useState(null);
const [approveNote, setApproveNote] = useState(””);

const myRooms = hkUnit ? ROOMS.filter(r => r.startsWith(hkUnit)) : ROOMS;
const myChecklists = role === “HK” ? checklists.filter(c => c.hk === currentUser.name) : checklists;

const approve = (id, ok) => {
setChecklists(prev => prev.map(c => c.id === id ? { …c, status: ok ? “approved” : “revision”, approvedBy: ok ? currentUser.name : null, note: approveNote } : c));
setApprovingCL(null); setApproveNote(””);
};

return (
<div>
<PageHeader title="Checklist Kamar" subtitle="Laporan kebersihan & kelengkapan villa">
{role === “HK” && <Btn onClick={() => setShowForm(true)} label=”+ Buat Checklist” />}
</PageHeader>

```
  {showForm && (
    <ChecklistForm currentUser={currentUser} rooms={myRooms}
      onSubmit={data => { setChecklists(prev => [{ id: "cl" + Date.now(), ...data, status: "pending", approvedBy: null, note: "" }, ...prev]); setShowForm(false); }}
      onCancel={() => setShowForm(false)} />
  )}

  {approvingCL && (
    <Modal title="Review Checklist" onClose={() => setApprovingCL(null)}>
      <p style={{ fontSize: 13, color: "#64748b" }}>Kamar: <strong>{approvingCL.room}</strong> oleh <strong>{approvingCL.hk}</strong></p>
      <textarea value={approveNote} onChange={e => setApproveNote(e.target.value)} placeholder="Catatan..." style={{ width: "100%", height: 80, borderRadius: 8, border: "1px solid #e2e8f0", padding: 10, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", resize: "none" }} />
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <Btn onClick={() => approve(approvingCL.id, true)} label="Approve" color="#10b981" />
        <Btn onClick={() => approve(approvingCL.id, false)} label="Minta Revisi" color="#ef4444" />
      </div>
    </Modal>
  )}

  {viewCL && (
    <Modal title={"Detail - " + viewCL.room} onClose={() => setViewCL(null)}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>{viewCL.hk} . {viewCL.date}</span>
        <StatusBadge status={viewCL.status} />
      </div>
      {CHECKLIST_TEMPLATE.map(cat => (
        <div key={cat.id} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#0d6e6e", marginBottom: 6 }}>{cat.category}</div>
          {cat.items.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 8, padding: "5px 0", fontSize: 13, alignItems: "center" }}>
              <span style={{ color: viewCL.checks[item.id] ? "#10b981" : "#ef4444", fontSize: 15 }}>{viewCL.checks[item.id] ? "v" : "x"}</span>
              <span style={{ color: viewCL.checks[item.id] ? "#1e293b" : "#94a3b8" }}>{item.label}</span>
            </div>
          ))}
        </div>
      ))}
      {viewCL.note && <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: 10, fontSize: 13, color: "#92400e" }}>Catatan: {viewCL.note}</div>}
      {viewCL.approvedBy && <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>Diapprove oleh: <strong>{viewCL.approvedBy}</strong></div>}
    </Modal>
  )}

  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {myChecklists.length === 0 ? <EmptyState text="Belum ada checklist" /> : myChecklists.map(cl => {
      const total = Object.keys(cl.checks || {}).length;
      const done = Object.values(cl.checks || {}).filter(Boolean).length;
      return (
        <div key={cl.id} style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#1a3a4f" }}>{cl.room}</span>
              <StatusBadge status={cl.status} />
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{cl.hk} . {cl.date}</div>
            <div style={{ marginTop: 7 }}>
              <div style={{ height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: total ? (done / total * 100) + "%" : "0%", background: "#10b981", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{done}/{total} selesai</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <Btn onClick={() => setViewCL(cl)} label="Lihat" small color="#0d6e6e" />
            {(role === "PIC" || role === "ADMIN") && cl.status === "pending" && <Btn onClick={() => setApprovingCL(cl)} label="Review" small color="#f59e0b" />}
          </div>
        </div>
      );
    })}
  </div>
</div>
```

);
}

function ChecklistForm({ currentUser, rooms, onSubmit, onCancel }) {
const [room, setRoom] = useState(rooms[0] || “”);
const [checks, setChecks] = useState({});
const toggle = id => setChecks(p => ({ …p, [id]: !p[id] }));
return (
<div style={{ background: “#fff”, borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: “0 2px 12px rgba(0,0,0,0.08)” }}>
<h3 style={{ margin: “0 0 14px”, color: “#1a3a4f”, fontSize: 15 }}>Buat Checklist Baru</h3>
<div style={{ marginBottom: 14 }}>
<Field label="PILIH KAMAR / AREA">
<Select value={room} onChange={e => setRoom(e.target.value)}>
{rooms.map(r => <option key={r}>{r}</option>)}
</Select>
</Field>
</div>
{CHECKLIST_TEMPLATE.map(cat => (
<div key={cat.id} style={{ marginBottom: 14 }}>
<div style={{ fontSize: 12, fontWeight: 700, color: “#0d6e6e”, padding: “4px 10px”, background: “#f0fafa”, borderRadius: 6, marginBottom: 8 }}>{cat.category}</div>
{cat.items.map(item => (
<label key={item.id} style={{ display: “flex”, alignItems: “center”, gap: 10, padding: “8px 4px”, cursor: “pointer”, borderBottom: “1px solid #f8fafc” }}>
<input type=“checkbox” checked={!!checks[item.id]} onChange={() => toggle(item.id)} style={{ width: 16, height: 16, accentColor: “#0d6e6e” }} />
<span style={{ fontSize: 13, color: “#475569” }}>{item.label}</span>
{checks[item.id] && <span style={{ color: “#10b981”, marginLeft: “auto”, fontSize: 15 }}>v</span>}
</label>
))}
</div>
))}
<div style={{ display: “flex”, gap: 10, marginTop: 16 }}>
<Btn onClick={() => onSubmit({ date: new Date().toISOString().slice(0, 10), hk: currentUser.name, room, checks })} label=“Submit Checklist” color=”#0d6e6e” />
<Btn onClick={onCancel} label="Batal" color="#94a3b8" />
</div>
</div>
);
}

//  INVENTORY
function InventoryPage({ currentUser, amenities, setAmenities, stockLog, setStockLog, hkUnit }) {
const role = currentUser.role;
const isAdmin = role === “ADMIN” || role === “PIC” || role === “TIM”;
const [showLog, setShowLog] = useState(false);
const [logForm, setLogForm] = useState({ itemId: amenities[0]?.id || “”, type: “keluar”, qty: 1, note: “” });
const [showAdd, setShowAdd] = useState(false);
const [newItem, setNewItem] = useState({ name: “”, unit: “pcs”, stock: 0, min: 0 });
const [filterUnit, setFilterUnit] = useState(“Semua”);
const [filterItem, setFilterItem] = useState(“Semua”);
const [viewMode, setViewMode] = useState(“stok”);

const submitLog = () => {
const item = amenities.find(a => a.id === logForm.itemId);
if (!item) return;
const qty = parseInt(logForm.qty) || 0;
const unit = hkUnit || “Admin”;
setStockLog(prev => [{ id: “sl”+Date.now(), date: new Date().toISOString().slice(0,10), hk: currentUser.name, unit, item: item.name, itemId: logForm.itemId, type: logForm.type, qty, note: logForm.note }, …prev]);
setAmenities(prev => prev.map(a => a.id === logForm.itemId ? { …a, stock: logForm.type === “masuk” ? a.stock+qty : Math.max(0,a.stock-qty) } : a));
setShowLog(false); setLogForm({ itemId: amenities[0]?.id || “”, type: “keluar”, qty: 1, note: “” });
};

const addItem = () => {
setAmenities(prev => […prev, { id: “a”+Date.now(), …newItem, stock: parseInt(newItem.stock), min: parseInt(newItem.min) }]);
setShowAdd(false); setNewItem({ name: “”, unit: “pcs”, stock: 0, min: 0 });
};

const unitStats = UNITS.map(u => ({
unit: u,
keluar: stockLog.filter(l => l.unit===u && l.type===“keluar”).reduce((s,l) => s+l.qty, 0),
masuk: stockLog.filter(l => l.unit===u && l.type===“masuk”).reduce((s,l) => s+l.qty, 0),
}));

const filteredLog = stockLog
.filter(l => filterUnit === “Semua” ? true : l.unit === filterUnit)
.filter(l => filterItem === “Semua” ? true : l.item === filterItem);

const rekapPerUnit = UNITS.map(u => {
const items = amenities.map(a => {
const keluar = stockLog.filter(l => l.unit===u && l.item===a.name && l.type===“keluar”).reduce((s,l) => s+l.qty, 0);
const masuk = stockLog.filter(l => l.unit===u && l.item===a.name && l.type===“masuk”).reduce((s,l) => s+l.qty, 0);
return { …a, keluar, masuk };
}).filter(a => a.keluar > 0 || a.masuk > 0);
return { unit: u, items };
});

return (
<div>
<PageHeader title="Inventory Amenities" subtitle="Kelola stok & tracking pemakaian per unit">
<div style={{ display:“flex”, gap:8 }}>
{role === “ADMIN” && <Btn onClick={() => setShowAdd(true)} label=”+ Item” small color=”#3b82f6” />}
{(role === “HK” || role === “ADMIN” || role === “PIC”) && <Btn onClick={() => setShowLog(true)} label=”+ Catat” small color=”#0d6e6e” />}
</div>
</PageHeader>

```
  {isAdmin && (
    <div style={{ display:"flex", gap:6, marginBottom:18, background:"#f1f5f9", borderRadius:10, padding:4, width:"fit-content" }}>
      {[["stok","Stok"],["log","Log Harian"],["rekap","Rekap per Unit"]].map(([v,l]) => (
        <button key={v} onClick={() => setViewMode(v)} style={{ padding:"7px 16px", borderRadius:8, border:"none", background:viewMode===v?"#fff":"transparent", color:viewMode===v?"#0d6e6e":"#64748b", fontWeight:viewMode===v?700:500, fontSize:13, cursor:"pointer", fontFamily:"inherit", boxShadow:viewMode===v?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>{l}</button>
      ))}
    </div>
  )}

  {showAdd && (
    <div style={{ background:"#fff", borderRadius:14, padding:18, marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
      <h3 style={{ margin:"0 0 12px", fontSize:14, color:"#1a3a4f" }}>Tambah Item Baru</h3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {[["Nama Item","name","text"],["Satuan","unit","text"],["Stok Awal","stock","number"],["Min Stok","min","number"]].map(([l,k,t]) => (
          <Field key={k} label={l}><Input type={t} value={newItem[k]} onChange={e => setNewItem(p => ({...p,[k]:e.target.value}))} /></Field>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, marginTop:12 }}>
        <Btn onClick={addItem} label="Simpan" color="#0d6e6e" />
        <Btn onClick={() => setShowAdd(false)} label="Batal" color="#94a3b8" />
      </div>
    </div>
  )}

  {showLog && (
    <Modal title="Catat Barang Masuk / Keluar" onClose={() => setShowLog(false)}>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <Field label="BARANG">
          <Select value={logForm.itemId} onChange={e => setLogForm(p => ({...p,itemId:e.target.value}))}>
            {amenities.map(a => <option key={a.id} value={a.id}>{a.name} (stok: {a.stock} {a.unit})</option>)}
          </Select>
        </Field>
        <Field label="JENIS">
          <Select value={logForm.type} onChange={e => setLogForm(p => ({...p,type:e.target.value}))}>
            <option value="keluar">Keluar (dipakai)</option>
            <option value="masuk">Masuk (restock)</option>
          </Select>
        </Field>
        <Field label="JUMLAH">
          <Input type="number" value={logForm.qty} onChange={e => setLogForm(p => ({...p,qty:e.target.value}))} />
        </Field>
        <Field label="CATATAN / NAMA TAMU (opsional)">
          <Input value={logForm.note} onChange={e => setLogForm(p => ({...p,note:e.target.value}))} placeholder="cth: Tamu Budi check-in" />
        </Field>
        {hkUnit && <div style={{ background:"#f0fafa", borderRadius:8, padding:10, fontSize:12, color:"#0d6e6e", fontWeight:700 }}>Unit otomatis: {hkUnit}</div>}
      </div>
      <div style={{ display:"flex", gap:8, marginTop:16 }}>
        <Btn onClick={submitLog} label="Simpan" color="#0d6e6e" />
        <Btn onClick={() => setShowLog(false)} label="Batal" color="#94a3b8" />
      </div>
    </Modal>
  )}

  {(viewMode === "stok" || !isAdmin) && (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12, marginBottom:20 }}>
      {amenities.map(a => {
        const low = a.stock <= a.min;
        return (
          <div key={a.id} style={{ background:"#fff", borderRadius:12, padding:14, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", border:"1px solid "+(low?"#fecaca":"#f1f5f9") }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontWeight:700, fontSize:13, color:"#1a3a4f" }}>{a.name}</span>
              {low && <span style={{ fontSize:10, background:"#fef2f2", color:"#dc2626", padding:"2px 7px", borderRadius:10, fontWeight:700 }}>MENIPIS</span>}
            </div>
            <div style={{ fontSize:24, fontWeight:800, color:low?"#dc2626":"#1a3a4f" }}>{a.stock} <span style={{ fontSize:12, fontWeight:500, color:"#94a3b8" }}>{a.unit}</span></div>
            <div style={{ height:4, background:"#f1f5f9", borderRadius:3, margin:"8px 0", overflow:"hidden" }}>
              <div style={{ height:"100%", width:Math.min(100,(a.stock/Math.max(a.min*2,a.stock))*100)+"%", background:low?"#ef4444":"#10b981", borderRadius:3 }} />
            </div>
            <div style={{ fontSize:11, color:"#94a3b8" }}>Min: {a.min} {a.unit}</div>
          </div>
        );
      })}
    </div>
  )}

  {(viewMode === "log" || !isAdmin) && (
    <div style={{ background:"#fff", borderRadius:14, padding:18, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", marginBottom:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <div style={{ fontWeight:700, fontSize:14, color:"#1a3a4f" }}>Log Keluar Masuk Harian</div>
        {isAdmin && (
          <div style={{ display:"flex", gap:8 }}>
            <select value={filterUnit} onChange={e => setFilterUnit(e.target.value)} style={{ fontSize:12, padding:"5px 10px", border:"1px solid #e2e8f0", borderRadius:8, fontFamily:"inherit" }}>
              <option>Semua</option>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
            <select value={filterItem} onChange={e => setFilterItem(e.target.value)} style={{ fontSize:12, padding:"5px 10px", border:"1px solid #e2e8f0", borderRadius:8, fontFamily:"inherit" }}>
              <option>Semua</option>
              {amenities.map(a => <option key={a.id}>{a.name}</option>)}
            </select>
          </div>
        )}
      </div>
      {filteredLog.length === 0 ? <EmptyState text="Belum ada log stok" /> : filteredLog.slice(0,50).map(l => (
        <div key={l.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #f1f5f9" }}>
          <div>
            <div style={{ fontWeight:600, fontSize:13, color:"#1e293b" }}>{l.item} <span style={{ fontWeight:400, color:"#64748b" }}>x{l.qty}</span></div>
            <div style={{ fontSize:11, color:"#94a3b8" }}>{l.unit} . {l.hk} . {l.date}</div>
            {l.note && <div style={{ fontSize:11, color:"#0d6e6e", fontStyle:"italic" }}>Tamu: {l.note}</div>}
          </div>
          <StatusBadge status={l.type} />
        </div>
      ))}
    </div>
  )}

  {viewMode === "rekap" && isAdmin && (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:10, marginBottom:16 }}>
        {unitStats.map(u => (
          <div key={u.unit} style={{ background:"#fff", borderRadius:12, padding:14, boxShadow:"0 1px 4px rgba(0,0,0,0.06)", borderTop:"3px solid #0d6e6e" }}>
            <div style={{ fontWeight:700, fontSize:13, color:"#1a3a4f", marginBottom:8 }}>{u.unit}</div>
            <div style={{ display:"flex", gap:6 }}>
              <div style={{ flex:1, background:"#ecfdf5", borderRadius:6, padding:"5px 6px", textAlign:"center" }}>
                <div style={{ fontSize:15, fontWeight:800, color:"#10b981" }}>{u.masuk}</div>
                <div style={{ fontSize:10, color:"#64748b" }}>Masuk</div>
              </div>
              <div style={{ flex:1, background:"#fff7ed", borderRadius:6, padding:"5px 6px", textAlign:"center" }}>
                <div style={{ fontSize:15, fontWeight:800, color:"#f59e0b" }}>{u.keluar}</div>
                <div style={{ fontSize:10, color:"#64748b" }}>Keluar</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {rekapPerUnit.map(u => u.items.length === 0 ? null : (
        <div key={u.unit} style={{ background:"#fff", borderRadius:14, padding:18, marginBottom:14, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight:700, fontSize:14, color:"#1a3a4f", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ background:"#e6f7f7", color:"#0d6e6e", padding:"3px 12px", borderRadius:20, fontSize:13 }}>{u.unit}</span>
            <span style={{ fontSize:12, color:"#94a3b8", fontWeight:400 }}>Pemakaian bulan ini</span>
          </div>
          {u.items.map(item => (
            <div key={item.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f8fafc" }}>
              <span style={{ fontSize:13, color:"#1e293b", fontWeight:600 }}>{item.name}</span>
              <div style={{ display:"flex", gap:8 }}>
                {item.masuk > 0 && <span style={{ fontSize:12, background:"#ecfdf5", color:"#10b981", padding:"2px 10px", borderRadius:10, fontWeight:700 }}>+{item.masuk} masuk</span>}
                {item.keluar > 0 && <span style={{ fontSize:12, background:"#fff7ed", color:"#f59e0b", padding:"2px 10px", borderRadius:10, fontWeight:700 }}>-{item.keluar} keluar</span>}
              </div>
            </div>
          ))}
        </div>
      ))}
      {rekapPerUnit.every(u => u.items.length === 0) && <EmptyState text="Belum ada data pemakaian bulan ini" />}
    </div>
  )}
</div>
```

);
}

//  PURCHASE ORDER
function POPage({ currentUser, purchaseOrders, setPurchaseOrders, amenities, hkUnit }) {
const role = currentUser.role;
const [showForm, setShowForm] = useState(false);
const [items, setItems] = useState([{ name: “”, qty: 1 }]);
const [note, setNote] = useState(””);

const submit = () => {
setPurchaseOrders(prev => [{ id: “po” + Date.now(), date: new Date().toISOString().slice(0, 10), hk: currentUser.name, unit: hkUnit || “Admin”, items: items.filter(i => i.name), status: “pending”, note, approvedBy: null }, …prev]);
setShowForm(false); setItems([{ name: “”, qty: 1 }]); setNote(””);
};
const approve = (id, ok) => setPurchaseOrders(prev => prev.map(p => p.id === id ? { …p, status: ok ? “approved” : “rejected”, approvedBy: ok ? currentUser.name : null } : p));
const myPOs = role === “HK” ? purchaseOrders.filter(p => p.hk === currentUser.name) : purchaseOrders;

return (
<div>
<PageHeader title="Purchase Order" subtitle="Permintaan pengadaan barang keperluan villa">
{role === “HK” && <Btn onClick={() => setShowForm(true)} label=”+ Buat PO” />}
</PageHeader>
{showForm && (
<div style={{ background: “#fff”, borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: “0 2px 8px rgba(0,0,0,0.08)” }}>
<h3 style={{ margin: “0 0 12px”, fontSize: 15, color: “#1a3a4f” }}>Buat Purchase Order {hkUnit ? “- “ + hkUnit : “”}</h3>
{items.map((item, i) => (
<div key={i} style={{ display: “flex”, gap: 8, marginBottom: 8 }}>
<select value={item.name} onChange={e => setItems(prev => prev.map((it, j) => j === i ? { …it, name: e.target.value } : it))} style={{ flex: 3, padding: “8px 10px”, border: “1px solid #e2e8f0”, borderRadius: 8, fontSize: 13, fontFamily: “inherit” }}>
<option value="">– Pilih Barang –</option>
{amenities.map(a => <option key={a.id}>{a.name}</option>)}
</select>
<input type=“number” min=“1” value={item.qty} onChange={e => setItems(prev => prev.map((it, j) => j === i ? { …it, qty: parseInt(e.target.value) || 1 } : it))} style={{ flex: 1, padding: “8px 10px”, border: “1px solid #e2e8f0”, borderRadius: 8, fontSize: 13, fontFamily: “inherit” }} />
{items.length > 1 && <button onClick={() => setItems(prev => prev.filter((_, j) => j !== i))} style={{ padding: “0 10px”, background: “#fef2f2”, border: “1px solid #fecaca”, borderRadius: 8, color: “#ef4444”, cursor: “pointer” }}>x</button>}
</div>
))}
<button onClick={() => setItems(p => […p, { name: “”, qty: 1 }])} style={{ fontSize: 12, color: “#0d6e6e”, background: “none”, border: “1px dashed #0d6e6e”, borderRadius: 8, padding: “6px 14px”, cursor: “pointer”, marginBottom: 10, fontFamily: “inherit” }}>+ Tambah Item</button>
<textarea value={note} onChange={e => setNote(e.target.value)} placeholder=“Keterangan…” style={{ width: “100%”, height: 65, borderRadius: 8, border: “1px solid #e2e8f0”, padding: 10, fontSize: 13, fontFamily: “inherit”, boxSizing: “border-box”, resize: “none”, display: “block”, marginBottom: 10 }} />
<div style={{ display: “flex”, gap: 8 }}>
<Btn onClick={submit} label="Kirim PO" color="#0d6e6e" />
<Btn onClick={() => setShowForm(false)} label=“Batal” color=”#94a3b8” />
</div>
</div>
)}
<div style={{ display: “flex”, flexDirection: “column”, gap: 10 }}>
{myPOs.length === 0 ? <EmptyState text="Belum ada PO" /> : myPOs.map(po => (
<div key={po.id} style={{ background: “#fff”, borderRadius: 14, padding: 16, boxShadow: “0 1px 4px rgba(0,0,0,0.06)” }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start”, marginBottom: 8 }}>
<div>
<span style={{ fontWeight: 700, fontSize: 14, color: “#1a3a4f” }}>{po.hk}</span>
{po.unit && <span style={{ fontSize: 12, color: “#0d6e6e”, marginLeft: 8, background: “#f0fafa”, padding: “1px 8px”, borderRadius: 10 }}>{po.unit}</span>}
<div style={{ fontSize: 12, color: “#94a3b8” }}>{po.date}</div>
</div>
<StatusBadge status={po.status} />
</div>
<div style={{ display: “flex”, flexWrap: “wrap”, gap: 6, marginBottom: 8 }}>
{po.items.map((item, i) => <span key={i} style={{ fontSize: 12, background: “#f0fafa”, color: “#0d6e6e”, padding: “3px 10px”, borderRadius: 10 }}>{item.name} x{item.qty}</span>)}
</div>
{po.note && <div style={{ fontSize: 12, color: “#64748b”, marginBottom: 6 }}>Catatan: {po.note}</div>}
{po.approvedBy && <div style={{ fontSize: 12, color: “#10b981” }}>Disetujui: {po.approvedBy}</div>}
{(role === “PIC” || role === “ADMIN”) && po.status === “pending” && (
<div style={{ display: “flex”, gap: 8, marginTop: 10 }}>
<Btn onClick={() => approve(po.id, true)} label=“Approve” small color=”#10b981” />
<Btn onClick={() => approve(po.id, false)} label=“Tolak” small color=”#ef4444” />
</div>
)}
</div>
))}
</div>
</div>
);
}

//  LISTRIK
function ListrikPage({ currentUser, listrik, setListrik, hkUnit }) {
const role = currentUser.role;
const [showForm, setShowForm] = useState(false);
const myUnit = hkUnit && UNITS_LISTRIK.includes(hkUnit) ? hkUnit : null;
const [form, setForm] = useState({ unit: myUnit || UNITS_LISTRIK[0], meterAwal: “”, meterAkhir: “”, nominal: “”, note: “” });

const submit = () => {
setListrik(prev => [{ id: “lt” + Date.now(), date: new Date().toISOString().slice(0, 10), hk: currentUser.name, …form, meterAwal: parseFloat(form.meterAwal) || 0, meterAkhir: parseFloat(form.meterAkhir) || 0, nominal: parseInt(form.nominal) || 0 }, …prev]);
setShowForm(false); setForm({ unit: myUnit || UNITS_LISTRIK[0], meterAwal: “”, meterAkhir: “”, nominal: “”, note: “” });
};

const myListrik = role === “HK” && myUnit ? listrik.filter(l => l.unit === myUnit) : listrik;

// Stats
const stats = UNITS_LISTRIK.map(u => ({
unit: u,
total: listrik.filter(l => l.unit === u).reduce((s, l) => s + (l.meterAkhir - l.meterAwal), 0),
bayar: listrik.filter(l => l.unit === u).reduce((s, l) => s + l.nominal, 0),
count: listrik.filter(l => l.unit === u).length,
}));

return (
<div>
<PageHeader title="Pencatatan Listrik" subtitle="Banyu 3, Banyu 5 & Brownies">
{(role === “HK” && myUnit) || role === “ADMIN” || role === “PIC” ? <Btn onClick={() => setShowForm(true)} label=”+ Catat Listrik” /> : null}
</PageHeader>

```
  {role === "HK" && !myUnit && (
    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
      Unit kamu (Kaza) tidak menggunakan pencatatan listrik sistem ini.
    </div>
  )}

  {/* Stats */}
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 18 }}>
    {stats.filter(s => role !== "HK" || s.unit === myUnit).map(s => (
      <div key={s.unit} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderTop: "3px solid #f59e0b" }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#1a3a4f", marginBottom: 10 }}>{s.unit}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b" }}>{s.total.toFixed(1)} <span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8" }}>kWh</span></div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Rp {s.bayar.toLocaleString("id-ID")}</div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>{s.count}x pencatatan</div>
      </div>
    ))}
  </div>

  {showForm && (
    <Modal title="Catat Pemakaian Listrik" onClose={() => setShowForm(false)}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {!myUnit && (
          <Field label="UNIT">
            <Select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
              {UNITS_LISTRIK.map(u => <option key={u}>{u}</option>)}
            </Select>
          </Field>
        )}
        {myUnit && <div style={{ background: "#f0fafa", borderRadius: 8, padding: 10, fontSize: 13, color: "#0d6e6e", fontWeight: 700 }}>Unit: {myUnit}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="METER AWAL (kWh)"><Input type="number" value={form.meterAwal} onChange={e => setForm(p => ({ ...p, meterAwal: e.target.value }))} placeholder="0" /></Field>
          <Field label="METER AKHIR (kWh)"><Input type="number" value={form.meterAkhir} onChange={e => setForm(p => ({ ...p, meterAkhir: e.target.value }))} placeholder="0" /></Field>
        </div>
        {form.meterAwal && form.meterAkhir && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: 10, fontSize: 13, color: "#92400e" }}>
            Pemakaian: <strong>{(parseFloat(form.meterAkhir) - parseFloat(form.meterAwal)).toFixed(1)} kWh</strong>
          </div>
        )}
        <Field label="NOMINAL BAYAR (Rp)"><Input type="number" value={form.nominal} onChange={e => setForm(p => ({ ...p, nominal: e.target.value }))} placeholder="0" /></Field>
        <Field label="CATATAN (opsional)"><Input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Keterangan..." /></Field>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <Btn onClick={submit} label="Simpan" color="#0d6e6e" />
        <Btn onClick={() => setShowForm(false)} label="Batal" color="#94a3b8" />
      </div>
    </Modal>
  )}

  <div style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a3a4f", marginBottom: 12 }}>Riwayat Pencatatan</div>
    {myListrik.length === 0 ? <EmptyState text="Belum ada pencatatan listrik" /> : myListrik.map(l => (
      <div key={l.id} style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#1a3a4f" }}>{l.unit}</span>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{l.hk} . {l.date}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: 14 }}>{(l.meterAkhir - l.meterAwal).toFixed(1)} kWh</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Rp {l.nominal.toLocaleString("id-ID")}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{l.meterAwal} - {l.meterAkhir} kWh{l.note ? " . " + l.note : ""}</div>
      </div>
    ))}
  </div>
</div>
```

);
}

//  USERS
function UsersPage({ currentUser, users, setUsers }) {
const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState({ name: “”, username: “”, password: “”, role: “HK” });
const [del, setDel] = useState(null);

const add = () => {
const av = form.name.split(” “).map(w => w[0]).slice(0, 2).join(””).toUpperCase();
setUsers(prev => […prev, { id: Date.now(), …form, avatar: av }]);
setShowForm(false); setForm({ name: “”, username: “”, password: “”, role: “HK” });
};

return (
<div>
<PageHeader title="Tim Housekeeper" subtitle="Kelola anggota tim">
<Btn onClick={() => setShowForm(true)} label=”+ Tambah Anggota” />
</PageHeader>
{showForm && (
<div style={{ background: “#fff”, borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: “0 2px 8px rgba(0,0,0,0.08)” }}>
<h3 style={{ margin: “0 0 12px”, fontSize: 15, color: “#1a3a4f” }}>Tambah Anggota Baru</h3>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 10 }}>
<Field label="Nama Lengkap"><Input value={form.name} onChange={e => setForm(p => ({ …p, name: e.target.value }))} /></Field>
<Field label="Username"><Input value={form.username} onChange={e => setForm(p => ({ …p, username: e.target.value }))} /></Field>
<Field label="Password"><Input type=“password” value={form.password} onChange={e => setForm(p => ({ …p, password: e.target.value }))} /></Field>
<Field label="Role">
<Select value={form.role} onChange={e => setForm(p => ({ …p, role: e.target.value }))}>
<option value="HK">Housekeeper</option>
<option value="PIC">PIC</option>
</Select>
</Field>
</div>
<div style={{ display: “flex”, gap: 8, marginTop: 12 }}>
<Btn onClick={add} label="Simpan" color="#0d6e6e" />
<Btn onClick={() => setShowForm(false)} label=“Batal” color=”#94a3b8” />
</div>
</div>
)}
{del && (
<Modal title=“Hapus Anggota?” onClose={() => setDel(null)}>
<p style={{ fontSize: 14, color: “#475569” }}>Yakin hapus <strong>{del.name}</strong>?</p>
<div style={{ display: “flex”, gap: 8 }}>
<Btn onClick={() => { setUsers(prev => prev.filter(u => u.id !== del.id)); setDel(null); }} label=“Ya, Hapus” color=”#ef4444” />
<Btn onClick={() => setDel(null)} label=“Batal” color=”#94a3b8” />
</div>
</Modal>
)}
<div style={{ display: “grid”, gridTemplateColumns: “repeat(auto-fill,minmax(200px,1fr))”, gap: 12 }}>
{users.filter(u => u.role === “HK” || u.role === “PIC”).map(u => (
<div key={u.id} style={{ background: “#fff”, borderRadius: 14, padding: 16, boxShadow: “0 1px 4px rgba(0,0,0,0.06)”, display: “flex”, alignItems: “center”, gap: 12 }}>
<div style={{ width: 42, height: 42, borderRadius: “50%”, background: “linear-gradient(135deg,#1a3a4f,#0d6e6e)”, display: “flex”, alignItems: “center”, justifyContent: “center”, color: “#fff”, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{u.avatar}</div>
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ fontWeight: 700, fontSize: 13, color: “#1a3a4f” }}>{u.name}</div>
<div style={{ fontSize: 11, color: “#94a3b8” }}>@{u.username}</div>
{HK_UNIT[u.name] && <div style={{ fontSize: 11, color: “#0d6e6e”, fontWeight: 600 }}>{HK_UNIT[u.name]}</div>}
<span style={{ fontSize: 11, background: u.role === “PIC” ? “#eff6ff” : “#f0fafa”, color: u.role === “PIC” ? “#3b82f6” : “#0d6e6e”, padding: “1px 7px”, borderRadius: 10, fontWeight: 600 }}>{ROLES[u.role]}</span>
</div>
{u.id !== currentUser.id && <button onClick={() => setDel(u)} style={{ color: “#ef4444”, background: “none”, border: “none”, cursor: “pointer”, fontSize: 16 }}>x</button>}
</div>
))}
</div>
</div>
);
}

//  LAPORAN
function LaporanPage({ checklists, amenities, purchaseOrders, listrik, stockLog, users, exportAll }) {
const lowStock = amenities.filter(a => a.stock <= a.min);

const unitKeluar = UNITS.map(u => ({
unit: u,
keluar: stockLog.filter(l => l.unit === u && l.type === “keluar”).reduce((s, l) => s + l.qty, 0),
})).sort((a, b) => b.keluar - a.keluar);

const listrikStats = UNITS_LISTRIK.map(u => ({
unit: u,
kwh: listrik.filter(l => l.unit === u).reduce((s, l) => s + (l.meterAkhir - l.meterAwal), 0),
bayar: listrik.filter(l => l.unit === u).reduce((s, l) => s + l.nominal, 0),
}));

return (
<div>
<PageHeader title="Laporan & Rekap" subtitle="Ringkasan aktivitas villa untuk Head Team">
<Btn onClick={exportAll} label="Export Semua ke CSV" color="#10b981" />
</PageHeader>

```
  <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 14, marginBottom: 18, fontSize: 13, color: "#92400e" }}>
    Export akan download 5 file CSV: Checklist, Inventory, Log Stok, Purchase Order, dan Listrik. Buka dengan Excel atau Google Sheets.
  </div>

  {/* Statistik Pemakaian per Unit */}
  <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a3a4f", marginBottom: 14 }}>Pemakaian Barang per Unit (Bulan Ini)</div>
    {unitKeluar.map((u, i) => (
      <div key={u.unit} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{u.unit}</span>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#1a3a4f" }}>{u.keluar} item keluar</span>
          </div>
          <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: unitKeluar[0].keluar > 0 ? (u.keluar / unitKeluar[0].keluar * 100) + "%" : "0%", background: i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : "#94a3b8", borderRadius: 3 }} />
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Statistik Listrik */}
  <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a3a4f", marginBottom: 14 }}>Statistik Listrik Bulanan</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
      {listrikStats.map(s => (
        <div key={s.unit} style={{ background: "#fffbeb", borderRadius: 12, padding: 14, border: "1px solid #fde68a" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#1a3a4f", marginBottom: 6 }}>{s.unit}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b" }}>{s.kwh.toFixed(1)} <span style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8" }}>kWh</span></div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Rp {s.bayar.toLocaleString("id-ID")}</div>
        </div>
      ))}
    </div>
  </div>

  {/* Stok Amenities */}
  <div style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a3a4f", marginBottom: 12 }}>Rekap Stok Amenities</div>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {["Nama Item", "Stok", "Satuan", "Min Stok", "Status"].map(h => <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: 12 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {amenities.map(a => (
            <tr key={a.id} style={{ borderTop: "1px solid #f1f5f9" }}>
              <td style={{ padding: "9px 12px", fontWeight: 600, color: "#1e293b" }}>{a.name}</td>
              <td style={{ padding: "9px 12px", fontWeight: 700, color: a.stock <= a.min ? "#ef4444" : "#10b981" }}>{a.stock}</td>
              <td style={{ padding: "9px 12px", color: "#64748b" }}>{a.unit}</td>
              <td style={{ padding: "9px 12px", color: "#64748b" }}>{a.min}</td>
              <td style={{ padding: "9px 12px" }}><span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: a.stock <= a.min ? "#fef2f2" : "#ecfdf5", color: a.stock <= a.min ? "#dc2626" : "#059669", fontWeight: 700 }}>{a.stock <= a.min ? "MENIPIS" : "AMAN"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Checklist recap */}
  <div style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a3a4f", marginBottom: 12 }}>Rekap Checklist Bulan Ini</div>
    {checklists.length === 0 ? <EmptyState text="Belum ada data checklist" /> : checklists.map(cl => (
      <div key={cl.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{cl.room}</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>{cl.hk} . {cl.date}</div>
        </div>
        <StatusBadge status={cl.status} />
      </div>
    ))}
  </div>
</div>
```

);
}