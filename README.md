import React, { useState, useRef } from “react”;

//  DATA & CONSTANTS
const ROLES = { ADMIN: “Admin”, HK: “Housekeeper”, PIC: “PIC”, TIM: “Tim/Owner” };

const INITIAL_USERS = [
{ id: 1, name: “Admin General”, username: “admin”, password: “admin123”, role: “ADMIN”, avatar: “AG” },
{ id: 2, name: “Sari Dewi”, username: “hk1”, password: “hk123”, role: “HK”, avatar: “SD” },
{ id: 3, name: “Budi Santoso”, username: “hk2”, password: “hk456”, role: “HK”, avatar: “BS” },
{ id: 4, name: “Rizky Pratama”, username: “pic1”, password: “pic123”, role: “PIC”, avatar: “RP” },
{ id: 5, name: “Owner Villa”, username: “owner”, password: “owner123”, role: “TIM”, avatar: “OV” },
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

const ROOMS = [“Villa A - Kamar Utama”, “Villa A - Kamar 2”, “Villa A - Kamar 3”, “Villa B - Kamar Utama”, “Villa B - Kamar 2”, “Area Kolam Renang”, “Dapur & Ruang Makan”, “Ruang Tamu”];

const AMENITIES_LIST = [
{ id: “a1”, name: “Sabun Mandi”, unit: “pcs”, stock: 45, min: 20 },
{ id: “a2”, name: “Sampo”, unit: “botol”, stock: 30, min: 15 },
{ id: “a3”, name: “Tissue Gulung”, unit: “roll”, stock: 60, min: 30 },
{ id: “a4”, name: “Air Mineral 600ml”, unit: “botol”, stock: 24, min: 12 },
{ id: “a5”, name: “Handuk Kecil”, unit: “lembar”, stock: 20, min: 10 },
{ id: “a6”, name: “Handuk Besar”, unit: “lembar”, stock: 15, min: 8 },
{ id: “a7”, name: “Sandal Kamar”, unit: “pasang”, stock: 12, min: 6 },
{ id: “a8”, name: “Coffee Sachet”, unit: “pcs”, stock: 50, min: 20 },
];

const INITIAL_PO = [
{ id: “po1”, date: “2025-04-20”, hk: “Sari Dewi”, items: [{ name: “Sabun Mandi”, qty: 20 }, { name: “Tissue Gulung”, qty: 30 }], status: “approved”, note: “Stok menipis”, approvedBy: “Rizky Pratama” },
{ id: “po2”, date: “2025-04-22”, hk: “Budi Santoso”, items: [{ name: “Air Mineral 600ml”, qty: 24 }, { name: “Sampo”, qty: 15 }], status: “pending”, note: “Persiapan tamu baru”, approvedBy: null },
];

const INITIAL_CHECKLISTS = [
{ id: “cl1”, date: “2025-04-23”, hk: “Sari Dewi”, room: “Villa A - Kamar Utama”, status: “approved”, approvedBy: “Rizky Pratama”, note: “Sangat bersih, bagus!”, checks: { i1: true, i2: true, i3: true, i4: true, i5: true, i6: true, i7: true, i8: true, i9: true, i10: true, i11: true, i12: true, i13: true, i14: true, i15: true, i16: true }, photos: [“room_main.jpg”] },
];

//  ICONS
const Icon = ({ name, size = 18 }) => {
const icons = {
home: “M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10”,
checklist: “M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 0 1 2h7”,
box: “M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z”,
po: “M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8”,
users: “M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75”,
chart: “M18 20V10 M12 20V4 M6 20v-6”,
logout: “M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9”,
camera: “M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z”,
check: “M20 6L9 17l-5-5”,
x: “M18 6L6 18 M6 6l12 12”,
plus: “M12 5v14 M5 12h14”,
alert: “M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01”,
eye: “M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z”,
bell: “M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0”,
star: “M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z”,
};
const d = icons[name];
if (!d) return null;
const paths = d.split(” M “).map((p, i) => i === 0 ? p : “M “ + p);
return (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
{paths.map((p, i) => <path key={i} d={p} />)}
</svg>
);
};

//  MAIN APP
export default function App() {
const [currentUser, setCurrentUser] = useState(null);
const [activeTab, setActiveTab] = useState(“dashboard”);
const [users, setUsers] = useState(INITIAL_USERS);
const [amenities, setAmenities] = useState(AMENITIES_LIST);
const [purchaseOrders, setPurchaseOrders] = useState(INITIAL_PO);
const [checklists, setChecklists] = useState(INITIAL_CHECKLISTS);
const [loginError, setLoginError] = useState(””);
const [loginForm, setLoginForm] = useState({ username: “”, password: “” });

const login = () => {
const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
if (user) { setCurrentUser(user); setLoginError(””); setActiveTab(“dashboard”); }
else setLoginError(“Username atau password salah!”);
};
const logout = () => { setCurrentUser(null); setLoginForm({ username: “”, password: “” }); };

if (!currentUser) return <LoginScreen form={loginForm} setForm={setLoginForm} onLogin={login} error={loginError} />;

const role = currentUser.role;
const tabs = [
{ id: “dashboard”, label: “Dashboard”, icon: “home”, roles: [“ADMIN”,“HK”,“PIC”,“TIM”] },
{ id: “checklist”, label: “Checklist”, icon: “checklist”, roles: [“ADMIN”,“HK”,“PIC”,“TIM”] },
{ id: “inventory”, label: “Inventory”, icon: “box”, roles: [“ADMIN”,“HK”,“PIC”,“TIM”] },
{ id: “po”, label: “Purchase Order”, icon: “po”, roles: [“ADMIN”,“HK”,“PIC”] },
{ id: “users”, label: “Tim HK”, icon: “users”, roles: [“ADMIN”,“PIC”] },
{ id: “laporan”, label: “Laporan”, icon: “chart”, roles: [“ADMIN”,“TIM”,“PIC”] },
].filter(t => t.roles.includes(role));

return (
<div style={{ minHeight: “100vh”, background: “#f0f4f8”, fontFamily: “‘Nunito’, ‘Segoe UI’, sans-serif”, display: “flex”, flexDirection: “column” }}>
{/* TOP NAV */}
<header style={{ background: “linear-gradient(135deg, #1a3a4f 0%, #0d6e6e 100%)”, color: “#fff”, padding: “0 20px”, display: “flex”, alignItems: “center”, justifyContent: “space-between”, height: 60, boxShadow: “0 2px 12px rgba(0,0,0,0.15)”, position: “sticky”, top: 0, zIndex: 100 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 10 }}>
<span style={{ fontSize: 22 }}></span>
<div>
<div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 0.5 }}>Villa HK System</div>
<div style={{ fontSize: 11, opacity: 0.75 }}>{ROLES[role]}</div>
</div>
</div>
<div style={{ display: “flex”, alignItems: “center”, gap: 12 }}>
<div style={{ textAlign: “right” }}>
<div style={{ fontWeight: 700, fontSize: 13 }}>{currentUser.name}</div>
<div style={{ fontSize: 11, opacity: 0.7 }}>{ROLES[role]}</div>
</div>
<div style={{ width: 36, height: 36, borderRadius: “50%”, background: “rgba(255,255,255,0.2)”, display: “flex”, alignItems: “center”, justifyContent: “center”, fontWeight: 800, fontSize: 13 }}>{currentUser.avatar}</div>
<button onClick={logout} style={{ background: “rgba(255,255,255,0.15)”, border: “none”, color: “#fff”, borderRadius: 8, padding: “6px 10px”, cursor: “pointer”, display: “flex”, alignItems: “center”, gap: 5 }}>
<Icon name="logout" size={15} /> <span style={{ fontSize: 12 }}>Keluar</span>
</button>
</div>
</header>

```
  <div style={{ display: "flex", flex: 1 }}>
    {/* SIDEBAR */}
    <nav style={{ width: 200, background: "#fff", borderRight: "1px solid #e2e8f0", padding: "16px 0", position: "sticky", top: 60, height: "calc(100vh - 60px)", overflowY: "auto" }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", border: "none", background: activeTab === tab.id ? "linear-gradient(90deg, #e6f7f7, #f0fafa)" : "transparent", color: activeTab === tab.id ? "#0d6e6e" : "#64748b", fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 13, cursor: "pointer", borderLeft: activeTab === tab.id ? "3px solid #0d6e6e" : "3px solid transparent", transition: "all 0.2s" }}>
          <Icon name={tab.icon} size={17} />{tab.label}
        </button>
      ))}
    </nav>

    {/* CONTENT */}
    <main style={{ flex: 1, padding: 24, overflowY: "auto" }}>
      {activeTab === "dashboard" && <Dashboard currentUser={currentUser} checklists={checklists} amenities={amenities} purchaseOrders={purchaseOrders} users={users} />}
      {activeTab === "checklist" && <ChecklistPage currentUser={currentUser} checklists={checklists} setChecklists={setChecklists} />}
      {activeTab === "inventory" && <InventoryPage currentUser={currentUser} amenities={amenities} setAmenities={setAmenities} />}
      {activeTab === "po" && <POPage currentUser={currentUser} purchaseOrders={purchaseOrders} setPurchaseOrders={setPurchaseOrders} amenities={amenities} setAmenities={setAmenities} />}
      {activeTab === "users" && <UsersPage currentUser={currentUser} users={users} setUsers={setUsers} />}
      {activeTab === "laporan" && <LaporanPage checklists={checklists} amenities={amenities} purchaseOrders={purchaseOrders} users={users} />}
    </main>
  </div>
</div>
```

);
}

//  LOGIN
function LoginScreen({ form, setForm, onLogin, error }) {
return (
<div style={{ minHeight: “100vh”, background: “linear-gradient(135deg, #1a3a4f 0%, #0d6e6e 60%, #16a085 100%)”, display: “flex”, alignItems: “center”, justifyContent: “center”, fontFamily: “‘Nunito’, sans-serif”, padding: 20 }}>
<div style={{ background: “#fff”, borderRadius: 20, padding: 40, width: “100%”, maxWidth: 380, boxShadow: “0 20px 60px rgba(0,0,0,0.3)” }}>
<div style={{ textAlign: “center”, marginBottom: 30 }}>
<div style={{ fontSize: 48, marginBottom: 8 }}></div>
<h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: “#1a3a4f” }}>Villa HK System</h1>
<p style={{ margin: “6px 0 0”, fontSize: 13, color: “#94a3b8” }}>Sistem Manajemen Housekeeping</p>
</div>
<div style={{ marginBottom: 16 }}>
<label style={{ display: “block”, fontSize: 12, fontWeight: 700, color: “#475569”, marginBottom: 6 }}>USERNAME</label>
<input value={form.username} onChange={e => setForm(f => ({ …f, username: e.target.value }))} placeholder=“Masukkan username” style={{ width: “100%”, padding: “11px 14px”, border: “2px solid #e2e8f0”, borderRadius: 10, fontSize: 14, outline: “none”, boxSizing: “border-box”, fontFamily: “inherit” }} onKeyDown={e => e.key === “Enter” && onLogin()} />
</div>
<div style={{ marginBottom: 20 }}>
<label style={{ display: “block”, fontSize: 12, fontWeight: 700, color: “#475569”, marginBottom: 6 }}>PASSWORD</label>
<input type=“password” value={form.password} onChange={e => setForm(f => ({ …f, password: e.target.value }))} placeholder=“Masukkan password” style={{ width: “100%”, padding: “11px 14px”, border: “2px solid #e2e8f0”, borderRadius: 10, fontSize: 14, outline: “none”, boxSizing: “border-box”, fontFamily: “inherit” }} onKeyDown={e => e.key === “Enter” && onLogin()} />
</div>
{error && <div style={{ background: “#fef2f2”, color: “#dc2626”, padding: “10px 14px”, borderRadius: 8, fontSize: 13, marginBottom: 16, display: “flex”, alignItems: “center”, gap: 8 }}><Icon name="alert" size={15} /> {error}</div>}
<button onClick={onLogin} style={{ width: “100%”, padding: 13, background: “linear-gradient(135deg, #1a3a4f, #0d6e6e)”, color: “#fff”, border: “none”, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: “pointer”, letterSpacing: 0.5 }}>Masuk </button>
<div style={{ marginTop: 20, padding: 14, background: “#f8fafc”, borderRadius: 10, fontSize: 11, color: “#64748b” }}>
<div style={{ fontWeight: 700, marginBottom: 6, color: “#475569” }}>Demo Login:</div>
{[[“admin / admin123”,“Admin”],[“hk1 / hk123”,“HK”],[“pic1 / pic123”,“PIC”],[“owner / owner123”,“Tim/Owner”]].map(([c,r]) => (
<div key={r}> {c}  <strong>{r}</strong></div>
))}
</div>
</div>
</div>
);
}

//  DASHBOARD
function Dashboard({ currentUser, checklists, amenities, purchaseOrders, users }) {
const role = currentUser.role;
const lowStock = amenities.filter(a => a.stock <= a.min);
const pendingPO = purchaseOrders.filter(p => p.status === “pending”);
const pendingCL = checklists.filter(c => c.status === “pending”);
const todayCL = checklists.filter(c => c.date === new Date().toISOString().slice(0,10));

const cards = [
{ label: “Checklist Pending”, value: pendingCL.length, icon: “checklist”, color: “#f59e0b”, bg: “#fffbeb” },
{ label: “PO Menunggu”, value: pendingPO.length, icon: “po”, color: “#3b82f6”, bg: “#eff6ff” },
{ label: “Stok Menipis”, value: lowStock.length, icon: “alert”, color: “#ef4444”, bg: “#fef2f2” },
{ label: “Total HK”, value: users.filter(u => u.role === “HK”).length, icon: “users”, color: “#10b981”, bg: “#ecfdf5” },
];

return (
<div>
<div style={{ marginBottom: 24 }}>
<h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: “#1a3a4f” }}>Selamat Datang, {currentUser.name.split(” “)[0]}! </h2>
<p style={{ margin: “4px 0 0”, color: “#64748b”, fontSize: 14 }}>{new Date().toLocaleDateString(“id-ID”, { weekday: “long”, year: “numeric”, month: “long”, day: “numeric” })}</p>
</div>

```
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
    {cards.map(c => (
      <div key={c.label} style={{ background: c.bg, borderRadius: 14, padding: 18, border: `1px solid ${c.color}22` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, fontWeight: 600 }}>{c.label}</div>
          </div>
          <div style={{ color: c.color, opacity: 0.7 }}><Icon name={c.icon} size={22} /></div>
        </div>
      </div>
    ))}
  </div>

  {/* Low Stock Alert */}
  {lowStock.length > 0 && (
    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: 16, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#dc2626", fontWeight: 700 }}>
        <Icon name="alert" size={16} /> Peringatan Stok Menipis
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {lowStock.map(a => <span key={a.id} style={{ background: "#fff", border: "1px solid #fecaca", padding: "4px 10px", borderRadius: 20, fontSize: 12, color: "#dc2626" }}>{a.name}: {a.stock} {a.unit}</span>)}
      </div>
    </div>
  )}

  {/* Recent Checklists */}
  <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ fontWeight: 700, fontSize: 15, color: "#1a3a4f", marginBottom: 14 }}> Checklist Terbaru</div>
    {checklists.length === 0 ? <EmptyState text="Belum ada checklist" /> : checklists.slice(-5).reverse().map(cl => (
      <div key={cl.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{cl.room}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{cl.hk}  {cl.date}</div>
        </div>
        <StatusBadge status={cl.status} />
      </div>
    ))}
  </div>
</div>
```

);
}

//  CHECKLIST PAGE
function ChecklistPage({ currentUser, checklists, setChecklists }) {
const role = currentUser.role;
const [showForm, setShowForm] = useState(false);
const [viewCL, setViewCL] = useState(null);
const [approvingCL, setApprovingCL] = useState(null);
const [approveNote, setApproveNote] = useState(””);

const myChecklists = role === “HK” ? checklists.filter(c => c.hk === currentUser.name) : checklists;

const approve = (id, approved) => {
setChecklists(prev => prev.map(c => c.id === id ? { …c, status: approved ? “approved” : “revision”, approvedBy: approved ? currentUser.name : null, note: approved ? approveNote : approveNote } : c));
setApprovingCL(null); setApproveNote(””);
};

return (
<div>
<PageHeader title=" Checklist Kamar" subtitle="Laporan kebersihan & kelengkapan villa">
{role === “HK” && <Btn onClick={() => setShowForm(true)} label=”+ Buat Checklist” />}
</PageHeader>

```
  {showForm && <ChecklistForm currentUser={currentUser} onSubmit={(data) => { setChecklists(prev => [{ id: "cl" + Date.now(), ...data, status: "pending", approvedBy: null, note: "" }, ...prev]); setShowForm(false); }} onCancel={() => setShowForm(false)} />}

  {approvingCL && (
    <Modal title="Approve / Revisi Checklist" onClose={() => setApprovingCL(null)}>
      <p style={{ fontSize: 13, color: "#64748b" }}>Kamar: <strong>{approvingCL.room}</strong>  HK: <strong>{approvingCL.hk}</strong></p>
      <textarea value={approveNote} onChange={e => setApproveNote(e.target.value)} placeholder="Catatan (opsional)..." style={{ width: "100%", height: 80, borderRadius: 8, border: "1px solid #e2e8f0", padding: 10, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", resize: "none" }} />
      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <Btn onClick={() => approve(approvingCL.id, true)} label=" Approve" color="#10b981" />
        <Btn onClick={() => approve(approvingCL.id, false)} label=" Minta Revisi" color="#ef4444" />
      </div>
    </Modal>
  )}

  {viewCL && <ChecklistDetail cl={viewCL} onClose={() => setViewCL(null)} />}

  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {myChecklists.length === 0 ? <EmptyState text="Belum ada checklist" /> : myChecklists.map(cl => {
      const total = Object.keys(cl.checks).length;
      const done = Object.values(cl.checks).filter(Boolean).length;
      return (
        <div key={cl.id} style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#1a3a4f" }}>{cl.room}</span>
              <StatusBadge status={cl.status} />
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{cl.hk}  {cl.date}</div>
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 5, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(done/total)*100}%`, background: "#10b981", borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{done}/{total} item selesai</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
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

function ChecklistForm({ currentUser, onSubmit, onCancel }) {
const [room, setRoom] = useState(ROOMS[0]);
const [checks, setChecks] = useState({});
const [photos, setPhotos] = useState([]);
const fileRef = useRef();

const toggle = (id) => setChecks(prev => ({ …prev, [id]: !prev[id] }));
const handlePhoto = (e) => {
const files = Array.from(e.target.files);
files.forEach(f => {
const reader = new FileReader();
reader.onload = ev => setPhotos(prev => […prev, { name: f.name, url: ev.target.result }]);
reader.readAsDataURL(f);
});
};

const submit = () => {
onSubmit({ date: new Date().toISOString().slice(0,10), hk: currentUser.name, room, checks, photos: photos.map(p => p.name) });
};

return (
<div style={{ background: “#fff”, borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: “0 2px 12px rgba(0,0,0,0.08)” }}>
<h3 style={{ margin: “0 0 16px”, color: “#1a3a4f”, fontSize: 16 }}> Buat Checklist Baru</h3>
<div style={{ marginBottom: 14 }}>
<label style={{ fontSize: 12, fontWeight: 700, color: “#475569”, display: “block”, marginBottom: 6 }}>PILIH KAMAR/AREA</label>
<select value={room} onChange={e => setRoom(e.target.value)} style={{ width: “100%”, padding: “10px 12px”, border: “1px solid #e2e8f0”, borderRadius: 8, fontSize: 14, fontFamily: “inherit” }}>
{ROOMS.map(r => <option key={r}>{r}</option>)}
</select>
</div>

```
  {CHECKLIST_TEMPLATE.map(cat => (
    <div key={cat.id} style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#0d6e6e", marginBottom: 8, padding: "4px 10px", background: "#f0fafa", borderRadius: 6 }}>{cat.category}</div>
      {cat.items.map(item => (
        <label key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", cursor: "pointer", borderBottom: "1px solid #f8fafc" }}>
          <input type="checkbox" checked={!!checks[item.id]} onChange={() => toggle(item.id)} style={{ width: 16, height: 16, accentColor: "#0d6e6e" }} />
          <span style={{ fontSize: 13, color: checks[item.id] ? "#0d6e6e" : "#475569", textDecoration: checks[item.id] ? "none" : "none" }}>{item.label}</span>
          {checks[item.id] && <span style={{ color: "#10b981", marginLeft: "auto" }}></span>}
        </label>
      ))}
    </div>
  ))}

  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}> FOTO BUKTI KAMAR</div>
    <button onClick={() => fileRef.current.click()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: "2px dashed #cbd5e1", borderRadius: 10, background: "#f8fafc", cursor: "pointer", fontSize: 13, color: "#64748b" }}>
      <Icon name="camera" size={16} /> Tambah Foto
    </button>
    <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handlePhoto} />
    {photos.length > 0 && (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        {photos.map((p, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={p.url} alt={p.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "2px solid #e2e8f0" }} />
            <button onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, background: "#ef4444", border: "none", borderRadius: "50%", color: "#fff", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}></button>
          </div>
        ))}
      </div>
    )}
  </div>

  <div style={{ display: "flex", gap: 10 }}>
    <Btn onClick={submit} label=" Submit Checklist" color="#0d6e6e" />
    <Btn onClick={onCancel} label="Batal" color="#94a3b8" />
  </div>
</div>
```

);
}

function ChecklistDetail({ cl, onClose }) {
const total = Object.keys(cl.checks).length;
const done = Object.values(cl.checks).filter(Boolean).length;
return (
<Modal title={`Detail Checklist  ${cl.room}`} onClose={onClose}>
<div style={{ display: “flex”, gap: 8, marginBottom: 12, flexWrap: “wrap” }}>
<span style={{ fontSize: 12, color: “#64748b” }}>HK: <strong>{cl.hk}</strong></span>
<span style={{ fontSize: 12, color: “#64748b” }}>Tanggal: <strong>{cl.date}</strong></span>
<StatusBadge status={cl.status} />
</div>
<div style={{ background: “#f0fafa”, borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 13, color: “#0d6e6e”, fontWeight: 700 }}>
Progress: {done}/{total} item ({Math.round((done/total)*100)}%)
</div>
{CHECKLIST_TEMPLATE.map(cat => (
<div key={cat.id} style={{ marginBottom: 12 }}>
<div style={{ fontSize: 12, fontWeight: 700, color: “#0d6e6e”, marginBottom: 6 }}>{cat.category}</div>
{cat.items.map(item => (
<div key={item.id} style={{ display: “flex”, alignItems: “center”, gap: 8, padding: “5px 0”, fontSize: 13 }}>
<span style={{ color: cl.checks[item.id] ? “#10b981” : “#ef4444”, fontSize: 16 }}>{cl.checks[item.id] ? “” : “”}</span>
<span style={{ color: cl.checks[item.id] ? “#1e293b” : “#94a3b8” }}>{item.label}</span>
</div>
))}
</div>
))}
{cl.note && <div style={{ background: “#fffbeb”, border: “1px solid #fde68a”, borderRadius: 8, padding: 10, fontSize: 13, color: “#92400e” }}> Catatan: {cl.note}</div>}
{cl.approvedBy && <div style={{ fontSize: 12, color: “#64748b”, marginTop: 8 }}>Diapprove oleh: <strong>{cl.approvedBy}</strong></div>}
</Modal>
);
}

//  INVENTORY
function InventoryPage({ currentUser, amenities, setAmenities }) {
const role = currentUser.role;
const [editItem, setEditItem] = useState(null);
const [editStock, setEditStock] = useState(””);
const [showAdd, setShowAdd] = useState(false);
const [newItem, setNewItem] = useState({ name: “”, unit: “pcs”, stock: 0, min: 0 });

const updateStock = (id, delta) => setAmenities(prev => prev.map(a => a.id === id ? { …a, stock: Math.max(0, a.stock + delta) } : a));
const saveEdit = () => { setAmenities(prev => prev.map(a => a.id === editItem.id ? { …a, stock: parseInt(editStock) || 0 } : a)); setEditItem(null); };
const addItem = () => {
setAmenities(prev => […prev, { id: “a” + Date.now(), …newItem, stock: parseInt(newItem.stock), min: parseInt(newItem.min) }]);
setShowAdd(false); setNewItem({ name: “”, unit: “pcs”, stock: 0, min: 0 });
};

return (
<div>
<PageHeader title=" Inventory Amenities" subtitle="Kelola stok perlengkapan villa">
{(role === “ADMIN”) && <Btn onClick={() => setShowAdd(true)} label=”+ Tambah Item” />}
</PageHeader>

```
  {showAdd && (
    <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#1a3a4f" }}>Tambah Item Baru</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[["Nama Item", "name", "text"], ["Satuan", "unit", "text"], ["Stok Awal", "stock", "number"], ["Minimum Stok", "min", "number"]].map(([l, k, t]) => (
          <div key={k}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>{l.toUpperCase()}</label>
            <input type={t} value={newItem[k]} onChange={e => setNewItem(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Btn onClick={addItem} label="Simpan" color="#0d6e6e" />
        <Btn onClick={() => setShowAdd(false)} label="Batal" color="#94a3b8" />
      </div>
    </div>
  )}

  {editItem && (
    <Modal title={`Edit Stok  ${editItem.name}`} onClose={() => setEditItem(null)}>
      <input type="number" value={editStock} onChange={e => setEditStock(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Btn onClick={saveEdit} label="Simpan" color="#0d6e6e" />
        <Btn onClick={() => setEditItem(null)} label="Batal" color="#94a3b8" />
      </div>
    </Modal>
  )}

  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
    {amenities.map(a => {
      const pct = Math.min(100, (a.stock / Math.max(a.min * 2, a.stock)) * 100);
      const low = a.stock <= a.min;
      return (
        <div key={a.id} style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: low ? "1px solid #fecaca" : "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#1a3a4f" }}>{a.name}</span>
            {low && <span style={{ fontSize: 10, background: "#fef2f2", color: "#dc2626", padding: "2px 7px", borderRadius: 10, fontWeight: 700 }}>MENIPIS</span>}
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: low ? "#dc2626" : "#1a3a4f" }}>{a.stock} <span style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8" }}>{a.unit}</span></div>
          <div style={{ height: 5, background: "#f1f5f9", borderRadius: 3, margin: "8px 0", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: low ? "#ef4444" : "#10b981", borderRadius: 3, transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>Min. stok: {a.min} {a.unit}</div>
          {(role === "HK" || role === "ADMIN") && (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => updateStock(a.id, -1)} style={{ flex: 1, padding: "6px 0", border: "1px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 16, color: "#ef4444" }}></button>
              <button onClick={() => { setEditItem(a); setEditStock(a.stock); }} style={{ flex: 2, padding: "6px 0", border: "1px solid #e2e8f0", borderRadius: 7, background: "#f8fafc", cursor: "pointer", fontSize: 12, color: "#475569", fontFamily: "inherit" }}>Edit</button>
              <button onClick={() => updateStock(a.id, 1)} style={{ flex: 1, padding: "6px 0", border: "1px solid #e2e8f0", borderRadius: 7, background: "#fff", cursor: "pointer", fontSize: 16, color: "#10b981" }}>+</button>
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>
```

);
}

//  PURCHASE ORDER
function POPage({ currentUser, purchaseOrders, setPurchaseOrders, amenities }) {
const role = currentUser.role;
const [showForm, setShowForm] = useState(false);
const [items, setItems] = useState([{ name: “”, qty: 1 }]);
const [note, setNote] = useState(””);

const submit = () => {
setPurchaseOrders(prev => [{ id: “po” + Date.now(), date: new Date().toISOString().slice(0,10), hk: currentUser.name, items: items.filter(i => i.name), status: “pending”, note, approvedBy: null }, …prev]);
setShowForm(false); setItems([{ name: “”, qty: 1 }]); setNote(””);
};
const approve = (id, approved) => setPurchaseOrders(prev => prev.map(p => p.id === id ? { …p, status: approved ? “approved” : “rejected”, approvedBy: approved ? currentUser.name : null } : p));

const myPOs = role === “HK” ? purchaseOrders.filter(p => p.hk === currentUser.name) : purchaseOrders;

return (
<div>
<PageHeader title=" Purchase Order" subtitle="Permintaan pengadaan barang keperluan villa">
{role === “HK” && <Btn onClick={() => setShowForm(true)} label=”+ Buat PO” />}
</PageHeader>

```
  {showForm && (
    <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#1a3a4f" }}>Buat Purchase Order</h3>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <select value={item.name} onChange={e => setItems(prev => prev.map((it, j) => j === i ? { ...it, name: e.target.value } : it))} style={{ flex: 3, padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit" }}>
            <option value="">-- Pilih Barang --</option>
            {amenities.map(a => <option key={a.id}>{a.name}</option>)}
          </select>
          <input type="number" min="1" value={item.qty} onChange={e => setItems(prev => prev.map((it, j) => j === i ? { ...it, qty: parseInt(e.target.value)||1 } : it))} style={{ flex: 1, padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit" }} />
          {items.length > 1 && <button onClick={() => setItems(prev => prev.filter((_,j) => j !== i))} style={{ padding: "0 10px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#ef4444", cursor: "pointer", fontSize: 14 }}></button>}
        </div>
      ))}
      <button onClick={() => setItems(p => [...p, { name: "", qty: 1 }])} style={{ fontSize: 12, color: "#0d6e6e", background: "none", border: "1px dashed #0d6e6e", borderRadius: 8, padding: "6px 14px", cursor: "pointer", marginBottom: 12 }}>+ Tambah Item</button>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Keterangan / alasan..." style={{ width: "100%", height: 70, borderRadius: 8, border: "1px solid #e2e8f0", padding: 10, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", resize: "none", display: "block", marginBottom: 12 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <Btn onClick={submit} label="Kirim PO" color="#0d6e6e" />
        <Btn onClick={() => setShowForm(false)} label="Batal" color="#94a3b8" />
      </div>
    </div>
  )}

  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {myPOs.length === 0 ? <EmptyState text="Belum ada PO" /> : myPOs.map(po => (
      <div key={po.id} style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a3a4f" }}>{po.hk}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>{po.date}</div>
          </div>
          <StatusBadge status={po.status} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {po.items.map((item, i) => <span key={i} style={{ fontSize: 12, background: "#f0fafa", color: "#0d6e6e", padding: "3px 10px", borderRadius: 10 }}>{item.name}  {item.qty}</span>)}
        </div>
        {po.note && <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}> {po.note}</div>}
        {po.approvedBy && <div style={{ fontSize: 12, color: "#10b981" }}> Disetujui oleh {po.approvedBy}</div>}
        {(role === "PIC" || role === "ADMIN") && po.status === "pending" && (
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Btn onClick={() => approve(po.id, true)} label=" Approve" small color="#10b981" />
            <Btn onClick={() => approve(po.id, false)} label=" Tolak" small color="#ef4444" />
          </div>
        )}
      </div>
    ))}
  </div>
</div>
```

);
}

//  USERS PAGE
function UsersPage({ currentUser, users, setUsers }) {
const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState({ name: “”, username: “”, password: “”, role: “HK” });
const [del, setDel] = useState(null);

const hkUsers = users.filter(u => u.role === “HK”);

const add = () => {
const av = form.name.split(” “).map(w => w[0]).slice(0, 2).join(””).toUpperCase();
setUsers(prev => […prev, { id: Date.now(), …form, avatar: av }]);
setShowForm(false); setForm({ name: “”, username: “”, password: “”, role: “HK” });
};
const remove = (id) => { setUsers(prev => prev.filter(u => u.id !== id)); setDel(null); };

return (
<div>
<PageHeader title=" Tim Housekeeper" subtitle="Kelola anggota tim HK">
<Btn onClick={() => setShowForm(true)} label=”+ Tambah HK” />
</PageHeader>

```
  {showForm && (
    <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 15, color: "#1a3a4f" }}>Tambah Housekeeper Baru</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[["Nama Lengkap", "name", "text"], ["Username", "username", "text"], ["Password", "password", "password"]].map(([l, k, t]) => (
          <div key={k}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>{l.toUpperCase()}</label>
            <input type={t} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
        ))}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>ROLE</label>
          <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, fontFamily: "inherit" }}>
            <option value="HK">Housekeeper</option>
            <option value="PIC">PIC</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Btn onClick={add} label="Simpan" color="#0d6e6e" />
        <Btn onClick={() => setShowForm(false)} label="Batal" color="#94a3b8" />
      </div>
    </div>
  )}

  {del && (
    <Modal title="Hapus Housekeeper?" onClose={() => setDel(null)}>
      <p style={{ fontSize: 14, color: "#475569" }}>Yakin ingin menghapus <strong>{del.name}</strong>?</p>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn onClick={() => remove(del.id)} label="Ya, Hapus" color="#ef4444" />
        <Btn onClick={() => setDel(null)} label="Batal" color="#94a3b8" />
      </div>
    </Modal>
  )}

  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
    {users.filter(u => u.role === "HK" || u.role === "PIC").map(u => (
      <div key={u.id} style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #1a3a4f, #0d6e6e)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{u.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#1a3a4f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>@{u.username}</div>
          <div style={{ fontSize: 11, marginTop: 3 }}><span style={{ background: u.role === "PIC" ? "#eff6ff" : "#f0fafa", color: u.role === "PIC" ? "#3b82f6" : "#0d6e6e", padding: "1px 7px", borderRadius: 10, fontWeight: 600 }}>{ROLES[u.role]}</span></div>
        </div>
        {u.id !== currentUser.id && <button onClick={() => setDel(u)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 4 }}></button>}
      </div>
    ))}
  </div>
</div>
```

);
}

//  LAPORAN
function LaporanPage({ checklists, amenities, purchaseOrders, users }) {
const lowStock = amenities.filter(a => a.stock <= a.min);
const approved = checklists.filter(c => c.status === “approved”);
const poApproved = purchaseOrders.filter(p => p.status === “approved”);

return (
<div>
<PageHeader title=" Laporan & Rekap" subtitle="Ringkasan aktivitas villa untuk owner & manajemen" />

```
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
    {[
      { label: "Total Checklist", value: checklists.length, sub: `${approved.length} diapprove`, color: "#0d6e6e" },
      { label: "PO Diapprove", value: poApproved.length, sub: `dari ${purchaseOrders.length} total`, color: "#3b82f6" },
      { label: "Stok Menipis", value: lowStock.length, sub: "perlu restock", color: "#ef4444" },
      { label: "Total Tim HK", value: users.filter(u => u.role === "HK").length, sub: "aktif", color: "#f59e0b" },
    ].map(s => (
      <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderTop: `3px solid ${s.color}` }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#1a3a4f" }}>{s.label}</div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.sub}</div>
      </div>
    ))}
  </div>

  {/* Inventory Recap */}
  <div style={{ background: "#fff", borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ fontWeight: 700, fontSize: 15, color: "#1a3a4f", marginBottom: 14 }}> Rekap Stok Amenities</div>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {["Nama Item", "Stok", "Satuan", "Min. Stok", "Status"].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: 12 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {amenities.map(a => (
            <tr key={a.id} style={{ borderTop: "1px solid #f1f5f9" }}>
              <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1e293b" }}>{a.name}</td>
              <td style={{ padding: "10px 12px", fontWeight: 700, color: a.stock <= a.min ? "#ef4444" : "#10b981" }}>{a.stock}</td>
              <td style={{ padding: "10px 12px", color: "#64748b" }}>{a.unit}</td>
              <td style={{ padding: "10px 12px", color: "#64748b" }}>{a.min}</td>
              <td style={{ padding: "10px 12px" }}><span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 10, background: a.stock <= a.min ? "#fef2f2" : "#ecfdf5", color: a.stock <= a.min ? "#dc2626" : "#059669", fontWeight: 700 }}>{a.stock <= a.min ? "MENIPIS" : "AMAN"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Checklist Recap */}
  <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
    <div style={{ fontWeight: 700, fontSize: 15, color: "#1a3a4f", marginBottom: 14 }}> Rekap Checklist</div>
    {checklists.length === 0 ? <EmptyState text="Belum ada data" /> : checklists.map(cl => (
      <div key={cl.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{cl.room}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{cl.hk}  {cl.date}</div>
        </div>
        <StatusBadge status={cl.status} />
      </div>
    ))}
  </div>
</div>
```

);
}

//  SHARED COMPONENTS
function PageHeader({ title, subtitle, children }) {
return (
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “flex-start”, marginBottom: 20 }}>
<div>
<h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: “#1a3a4f” }}>{title}</h2>
{subtitle && <p style={{ margin: “4px 0 0”, color: “#64748b”, fontSize: 13 }}>{subtitle}</p>}
</div>
{children}
</div>
);
}

function Btn({ onClick, label, color = “#0d6e6e”, small }) {
return (
<button onClick={onClick} style={{ padding: small ? “7px 14px” : “10px 18px”, background: color, color: “#fff”, border: “none”, borderRadius: 9, fontSize: small ? 12 : 13, fontWeight: 700, cursor: “pointer”, fontFamily: “inherit”, whiteSpace: “nowrap” }}>
{label}
</button>
);
}

function StatusBadge({ status }) {
const map = { pending: [”#f59e0b”, “#fffbeb”, “Menunggu”], approved: [”#10b981”, “#ecfdf5”, “Disetujui”], rejected: [”#ef4444”, “#fef2f2”, “Ditolak”], revision: [”#f59e0b”, “#fffbeb”, “Revisi”] };
const [color, bg, label] = map[status] || [”#94a3b8”, “#f8fafc”, status];
return <span style={{ fontSize: 11, padding: “3px 10px”, borderRadius: 20, background: bg, color, fontWeight: 700, whiteSpace: “nowrap” }}>{label}</span>;
}

function Modal({ title, children, onClose }) {
return (
<div style={{ position: “fixed”, inset: 0, background: “rgba(0,0,0,0.4)”, display: “flex”, alignItems: “center”, justifyContent: “center”, zIndex: 200, padding: 20 }}>
<div style={{ background: “#fff”, borderRadius: 16, padding: 24, width: “100%”, maxWidth: 440, maxHeight: “85vh”, overflowY: “auto”, boxShadow: “0 20px 60px rgba(0,0,0,0.2)” }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 16 }}>
<h3 style={{ margin: 0, fontSize: 16, color: “#1a3a4f”, fontWeight: 800 }}>{title}</h3>
<button onClick={onClose} style={{ background: “#f1f5f9”, border: “none”, borderRadius: 7, padding: “5px 9px”, cursor: “pointer”, fontSize: 14 }}></button>
</div>
{children}
</div>
</div>
);
}

function EmptyState({ text }) {
return <div style={{ textAlign: “center”, padding: 40, color: “#94a3b8”, fontSize: 14 }}> {text}</div>;
}
