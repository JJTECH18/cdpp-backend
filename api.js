const API_URL = 'http://localhost:5000/api';

const Auth = {
  save(token, user) { localStorage.setItem('cdpp_token', token); localStorage.setItem('cdpp_user', JSON.stringify(user)); },
  getToken() { return localStorage.getItem('cdpp_token'); },
  getUser() { const u = localStorage.getItem('cdpp_user'); return u ? JSON.parse(u) : null; },
  isLoggedIn() { return !!this.getToken(); },
  isAdmin() { const u = this.getUser(); return u && (u.role === 'admin' || u.role === 'super_admin'); },
  logout() { localStorage.removeItem('cdpp_token'); localStorage.removeItem('cdpp_user'); window.location.href = 'login.html'; }
};

const API = {
  async get(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`, { method: 'GET', headers: { 'Content-Type': 'application/json', ...(Auth.getToken() && { 'Authorization': `Bearer ${Auth.getToken()}` }) } });
    return res.json();
  },
  async post(endpoint, body) {
    const res = await fetch(`${API_URL}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(Auth.getToken() && { 'Authorization': `Bearer ${Auth.getToken()}` }) }, body: JSON.stringify(body) });
    return res.json();
  },
  async put(endpoint, body) {
    const res = await fetch(`${API_URL}${endpoint}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(Auth.getToken() && { 'Authorization': `Bearer ${Auth.getToken()}` }) }, body: JSON.stringify(body) });
    return res.json();
  },
  async delete(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...(Auth.getToken() && { 'Authorization': `Bearer ${Auth.getToken()}` }) } });
    return res.json();
  }
};

function showToast(message, type = 'info', duration = 4000) {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; c.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;'; document.body.appendChild(c); }
  const colors = { success: { bg: '#10B981', icon: '✅' }, error: { bg: '#EF4444', icon: '❌' }, info: { bg: '#38BDF8', icon: 'ℹ️' }, warning: { bg: '#F59E0B', icon: '⚠️' } };
  const { bg, icon } = colors[type] || colors.info;
  const t = document.createElement('div');
  t.style.cssText = `background:${bg};color:white;padding:14px 18px;border-radius:12px;font-family:'Inter',sans-serif;font-size:.85rem;font-weight:600;display:flex;align-items:center;gap:10px;min-width:280px;max-width:360px;box-shadow:0 8px 24px rgba(0,0,0,.25)`;
  t.innerHTML = `<span style="font-size:1.1rem;flex-shrink:0">${icon}</span><span style="flex:1;line-height:1.4">${message}</span><span style="cursor:pointer;opacity:.7" onclick="this.parentElement.remove()">✕</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.transition = 'opacity .4s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, duration);
}

