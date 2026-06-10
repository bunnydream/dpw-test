'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ── INITIAL DATA ───────────────────────────────────────────────────────────────
const INITIAL_BLOCKS = [
  { id: 1, type: 'hero', label: 'Hero Section',
    data: { eyebrow: 'Nonprofit · Open Source · At Cost', h1: 'What if income verification worked for families and states instead of vendors?', subtitle: 'Digital Public Works is the nonprofit alternative. We built Verify My Income (VMI) because families deserve better. It handles the entire process, from applicant consent to caseworker-ready income report. Open source. At cost. No vendor lock-in.', btnPrimary: 'Request a Demo', btnSecondary: 'See How It Works', footnote: 'No procurement required to begin the conversation. We start with a free, philanthropically funded pilot.' }},
  { id: 2, type: 'stats', label: 'VMI at a Glance',
    data: { heading: 'VMI at a glance', stats: [{ num: '<5 min', desc: 'Median applicant verification time' }, { num: '85%', desc: 'Of applicants report no difficulty' }, { num: '93%', desc: 'Of caseworkers find VMI as easy or easier' }, { num: '7.5x', desc: 'Faster than manual verification' }] }},
  { id: 3, type: 'twocol', label: 'The Pressure Is Real',
    data: { sectionLabel: 'The policy context', heading: 'The pressure is real', leftContent: 'H.R. 1 expands work requirements for SNAP and Medicaid. States face financial penalties for SNAP payment error rates above 6%.', rightContent: 'VMI addresses all of these pressures: real-time income data, a validation layer, support for work requirements, and a streamlined process.', ctaLabel: 'Request a Demo', ctaLink: '/contact' }},
  { id: 4, type: 'twocol', label: 'How VMI Works',
    data: { sectionLabel: 'The process', heading: 'How VMI works', leftContent: 'Step 1: Applicant receives a secure link.\nStep 2: Applicant consents and connects their payroll.\nStep 3: Verified income data is delivered to the caseworker.', rightContent: 'No pay stubs to find. No documents to upload. A standardized income report, verified directly from the payroll source.', ctaLabel: '', ctaLink: '' }},
  { id: 5, type: 'twocol', label: 'We Fix the Process',
    data: { sectionLabel: 'Service design', heading: 'We do not just deliver data. We fix the process.', leftContent: 'Most verification vendors hand off data and walk away. DPW embeds with your team to find and fix the problems that no data feed can solve.', rightContent: 'Case study: 40% of applicants did not know they had a next step. DPW worked with the state — leading to a 35% increase in income document submissions.', ctaLabel: '', ctaLink: '' }},
  { id: 6, type: 'stats', label: 'Proven in the Field',
    data: { heading: 'Proven in the field', stats: [{ num: '<5 min', desc: 'Median verification time' }, { num: '85%', desc: 'No difficulty reported' }, { num: '93%', desc: 'Caseworker approval rate' }, { num: '7.5x', desc: 'Faster than manual' }] }},
  { id: 7, type: 'twocol', label: 'A Better Model',
    data: { sectionLabel: 'Our model', heading: 'A better model for income verification', leftContent: 'Traditional verification vendors lock you into rising costs and proprietary systems. DPW is a registered 501(c)(3) nonprofit — legally prohibited from profiting.', rightContent: 'Our code is open source under AGPL-3.0. No vendor lock-in. No black boxes. No surprise overages.', ctaLabel: '', ctaLink: '' }},
  { id: 8, type: 'quote', label: 'In Their Own Words',
    data: { quotes: [{ text: "This is a good product. It will make case reviews easier. This makes it almost fool-proof and it's low cost time-wise for the client.", attr: 'Pilot Agency Leadership' }, { text: 'Being able to update and report my income online is far more efficient than doing so by other means.', attr: 'Pennsylvania VMI User' }, { text: "It was quick and simple and best of all didn't require me to jump through hoops.", attr: 'VMI User' }] }},
  { id: 9, type: 'logo', label: 'Backed By (Funders)',
    data: { label: 'Backed by', logos: [{ name: 'DRK Foundation', url: 'https://www.drkfoundation.org' }, { name: 'AARP Foundation', url: 'https://www.aarp.org/aarp-foundation/' }, { name: 'Families and Workers Fund', url: 'https://familiesandworkers.org' }, { name: "Pritzker Children's Initiative", url: 'https://www.pritzkerchildrensinitiative.org' }] }},
];

// ── HELPERS ────────────────────────────────────────────────────────────────────
const TYPE_INFO = {
  hero:      { badge: 'type-hero',      label: 'Hero' },
  heading:   { badge: 'type-heading',   label: 'Heading' },
  paragraph: { badge: 'type-paragraph', label: 'Paragraph' },
  image:     { badge: 'type-image',     label: 'Image' },
  twocol:    { badge: 'type-twocol',    label: '2-Column' },
  button:    { badge: 'type-button',    label: 'Button / CTA' },
  stats:     { badge: 'type-stats',     label: 'Stats Block' },
  quote:     { badge: 'type-quote',     label: 'Quote' },
  logo:      { badge: 'type-logo',      label: 'Logo Row' },
  divider:   { badge: 'type-divider',   label: 'Divider' },
};

function getTypeInfo(type) { return TYPE_INFO[type] || { badge: 'type-paragraph', label: type }; }

function getPreview(block) {
  const d = block.data;
  switch (block.type) {
    case 'hero':      return `${d.h1 ? d.h1.substring(0, 80) + (d.h1.length > 80 ? '…' : '') : 'No headline'}`;
    case 'heading':   return `${d.text || 'No text'} [${d.level || 'H2'}]`;
    case 'paragraph': return d.text ? d.text.substring(0, 120) + (d.text.length > 120 ? '…' : '') : 'No content';
    case 'image':     return d.filename ? d.filename : 'No image uploaded';
    case 'twocol':    return `${d.heading ? d.heading.substring(0, 60) + (d.heading.length > 60 ? '…' : '') : 'No heading'} — 2-column layout`;
    case 'button':    return `Button: "${d.label || 'No label'}" → ${d.link || 'No link'}`;
    case 'stats':     return `${d.heading || 'Stats'} — ${(d.stats || []).length} metric(s)`;
    case 'quote':     return `${(d.quotes || []).length} quote(s)${d.quotes?.[0] ? ': "' + d.quotes[0].text.substring(0, 50) + '…"' : ''}`;
    case 'logo':      return `${d.label || 'Logo row'} — ${(d.logos || []).length} logo(s)`;
    case 'divider':   return d.style === 'space' ? 'Spacer (blank space)' : 'Horizontal divider line';
    default:          return 'Block';
  }
}

function getDefaultData(type) {
  switch (type) {
    case 'heading':   return { text: 'New Heading', level: 'H2' };
    case 'paragraph': return { text: 'Enter your text here.' };
    case 'image':     return { filename: '', alt: '', width: 'full' };
    case 'twocol':    return { sectionLabel: '', heading: 'New Section', leftContent: 'Left column content.', rightContent: 'Right column content.', ctaLabel: '', ctaLink: '' };
    case 'button':    return { label: 'Request a Demo', link: '#', style: 'primary', align: 'left' };
    case 'stats':     return { heading: 'Key Metrics', stats: [{ num: '—', desc: 'Metric 1' }, { num: '—', desc: 'Metric 2' }, { num: '—', desc: 'Metric 3' }, { num: '—', desc: 'Metric 4' }] };
    case 'quote':     return { quotes: [{ text: 'Enter quote text here.', attr: 'Attribution' }] };
    case 'logo':      return { label: 'Backed by', logos: [{ name: 'Organization Name', url: '' }] };
    case 'divider':   return { style: 'rule' };
    default:          return {};
  }
}

let _nextId = 100;
function newId() { return _nextId++; }

// ── EDIT PANEL FORM ────────────────────────────────────────────────────────────
function EditPanelForm({ block, onSave }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(block.data)));

  function update(key, val) { setDraft(d => ({ ...d, [key]: val })); }
  function updateStat(i, key, val) {
    setDraft(d => { const stats = [...d.stats]; stats[i] = { ...stats[i], [key]: val }; return { ...d, stats }; });
  }
  function updateQuote(i, key, val) {
    setDraft(d => { const quotes = [...d.quotes]; quotes[i] = { ...quotes[i], [key]: val }; return { ...d, quotes }; });
  }
  function addQuote() { setDraft(d => ({ ...d, quotes: [...d.quotes, { text: '', attr: '' }] })); }
  function removeQuote(i) { setDraft(d => ({ ...d, quotes: d.quotes.filter((_, idx) => idx !== i) })); }
  function updateLogo(i, key, val) {
    setDraft(d => { const logos = [...d.logos]; logos[i] = { ...logos[i], [key]: val }; return { ...d, logos }; });
  }
  function addLogo() { setDraft(d => ({ ...d, logos: [...d.logos, { name: '', url: '' }] })); }
  function removeLogo(i) { setDraft(d => ({ ...d, logos: d.logos.filter((_, idx) => idx !== i) })); }

  const T = ({ id, label, hint, value, onChange, textarea }) => (
    <div className="field-group">
      <label className="field-label">{label}</label>
      {hint && <div className="field-hint">{hint}</div>}
      {textarea
        ? <textarea className="field-input" value={value} onChange={e => onChange(e.target.value)} />
        : <input className="field-input" value={value} onChange={e => onChange(e.target.value)} />}
    </div>
  );

  function renderForm() {
    switch (block.type) {
      case 'hero': return (
        <>
          <T label="Eyebrow text" hint='Small text above the headline (e.g. "Nonprofit · Open Source · At Cost")' value={draft.eyebrow || ''} onChange={v => update('eyebrow', v)} />
          <T label="Main headline" hint="The large H1 title. Keep it under 12 words for best impact." value={draft.h1 || ''} onChange={v => update('h1', v)} textarea />
          <T label="Subtitle" hint="Sentence or two below the headline." value={draft.subtitle || ''} onChange={v => update('subtitle', v)} textarea />
          <hr className="section-divider-line" />
          <div className="field-row">
            <T label="Primary button label" value={draft.btnPrimary || ''} onChange={v => update('btnPrimary', v)} />
            <T label="Secondary button label" value={draft.btnSecondary || ''} onChange={v => update('btnSecondary', v)} />
          </div>
          <T label="Footnote" hint="Small text below the buttons." value={draft.footnote || ''} onChange={v => update('footnote', v)} />
        </>
      );
      case 'heading': return (
        <>
          <div className="field-group">
            <label className="field-label">Heading level</label>
            <div className="tag-selector">
              {['H1', 'H2', 'H3'].map(l => (
                <button key={l} className={`tag-btn${draft.level === l ? ' active' : ''}`} onClick={() => update('level', l)}>{l}</button>
              ))}
            </div>
          </div>
          <T label="Heading text" value={draft.text || ''} onChange={v => update('text', v)} />
        </>
      );
      case 'paragraph': return <T label="Text" hint="Plain text. Press Enter for a new paragraph." value={draft.text || ''} onChange={v => update('text', v)} textarea />;
      case 'image': return (
        <>
          <div className="field-group">
            <label className="field-label">Image</label>
            <div className="field-hint">Image upload will be wired to Supabase Storage.</div>
            <div style={{ border: '2px dashed var(--light-aluminum)', borderRadius: 6, padding: '28px 20px', textAlign: 'center', background: 'var(--cool-white)', color: '#718096', fontSize: 13 }}>
              Click to upload — PNG, JPG, SVG, WebP (max 10 MB)
            </div>
          </div>
          <T label="Alt text" hint="Describe the image for screen readers and accessibility." value={draft.alt || ''} onChange={v => update('alt', v)} />
          <div className="field-group">
            <label className="field-label">Width</label>
            <div className="tag-selector">
              {['full', 'contained'].map(w => (
                <button key={w} className={`tag-btn${draft.width === w ? ' active' : ''}`} onClick={() => update('width', w)}>{w === 'full' ? 'Full width' : 'Contained'}</button>
              ))}
            </div>
          </div>
        </>
      );
      case 'twocol': return (
        <>
          <T label="Section label" hint="Small uppercase label above the heading (optional)." value={draft.sectionLabel || ''} onChange={v => update('sectionLabel', v)} />
          <T label="Heading" value={draft.heading || ''} onChange={v => update('heading', v)} />
          <div className="two-col-editor">
            <div className="col-editor">
              <div className="col-editor-label">Left column</div>
              <textarea className="field-input" style={{ minHeight: 140 }} value={draft.leftContent || ''} onChange={e => update('leftContent', e.target.value)} />
            </div>
            <div className="col-editor">
              <div className="col-editor-label">Right column</div>
              <textarea className="field-input" style={{ minHeight: 140 }} value={draft.rightContent || ''} onChange={e => update('rightContent', e.target.value)} />
            </div>
          </div>
          <div className="field-group" style={{ marginTop: 14 }}>
            <label className="field-label">CTA button (optional)</label>
            <div className="field-row">
              <input className="field-input" placeholder="Button label" value={draft.ctaLabel || ''} onChange={e => update('ctaLabel', e.target.value)} />
              <input className="field-input" placeholder="Link / URL" value={draft.ctaLink || ''} onChange={e => update('ctaLink', e.target.value)} />
            </div>
          </div>
        </>
      );
      case 'button': return (
        <>
          <T label="Button label" value={draft.label || ''} onChange={v => update('label', v)} />
          <T label="Link / URL" value={draft.link || ''} onChange={v => update('link', v)} />
          <div className="field-group">
            <label className="field-label">Style</label>
            <div className="tag-selector">
              {[['primary', 'Primary (copper)'], ['secondary', 'Secondary (outline)']].map(([val, lbl]) => (
                <button key={val} className={`tag-btn${draft.style === val ? ' active' : ''}`} onClick={() => update('style', val)}>{lbl}</button>
              ))}
            </div>
          </div>
          <div className="field-group">
            <label className="field-label">Alignment</label>
            <div className="tag-selector">
              {['left', 'center'].map(a => (
                <button key={a} className={`tag-btn${draft.align === a ? ' active' : ''}`} onClick={() => update('align', a)}>{a.charAt(0).toUpperCase() + a.slice(1)}</button>
              ))}
            </div>
          </div>
        </>
      );
      case 'stats': return (
        <>
          <T label="Section heading" value={draft.heading || ''} onChange={v => update('heading', v)} />
          <hr className="section-divider-line" />
          {(draft.stats || []).map((s, i) => (
            <div key={i} className="stat-entry">
              <div className="stat-entry-header">Stat {i + 1}</div>
              <div className="field-row">
                <div className="field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">Number / Value</label>
                  <input className="field-input" value={s.num || ''} placeholder="e.g. 85%" onChange={e => updateStat(i, 'num', e.target.value)} />
                </div>
                <div className="field-group" style={{ marginBottom: 0 }}>
                  <label className="field-label">Description</label>
                  <input className="field-input" value={s.desc || ''} placeholder="What this number means" onChange={e => updateStat(i, 'desc', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </>
      );
      case 'quote': return (
        <>
          {(draft.quotes || []).map((q, i) => (
            <div key={i} className="stat-entry">
              <div className="stat-entry-header">
                Quote {i + 1}
                {i > 0 && <button className="btn-remove-entry" onClick={() => removeQuote(i)} style={{ marginLeft: 8 }}>&#215;</button>}
              </div>
              <div className="field-group">
                <label className="field-label">Quote text</label>
                <textarea className="field-input" style={{ minHeight: 90 }} value={q.text || ''} onChange={e => updateQuote(i, 'text', e.target.value)} />
              </div>
              <div className="field-group" style={{ marginBottom: 0 }}>
                <label className="field-label">Attribution</label>
                <input className="field-input" value={q.attr || ''} placeholder="Name, Title, or Organization" onChange={e => updateQuote(i, 'attr', e.target.value)} />
              </div>
            </div>
          ))}
          <button className="btn-add-entry" onClick={addQuote}>+ Add another quote</button>
        </>
      );
      case 'logo': return (
        <>
          <T label="Row label" hint='Small label above the logos (e.g. "Backed by").' value={draft.label || ''} onChange={v => update('label', v)} />
          <hr className="section-divider-line" />
          {(draft.logos || []).map((l, i) => (
            <div key={i} className="logo-entry">
              <div className="logo-entry-fields">
                <input className="field-input" placeholder="Organization name" value={l.name || ''} onChange={e => updateLogo(i, 'name', e.target.value)} />
                <input className="field-input" placeholder="https://website.org" value={l.url || ''} onChange={e => updateLogo(i, 'url', e.target.value)} />
              </div>
              <button className="btn-remove-entry" onClick={() => removeLogo(i)}>&#215;</button>
            </div>
          ))}
          <button className="btn-add-entry" onClick={addLogo}>+ Add another logo</button>
        </>
      );
      case 'divider': return (
        <div className="field-group">
          <label className="field-label">Type</label>
          <div className="tag-selector">
            {[['rule', 'Horizontal line'], ['space', 'Blank spacer']].map(([val, lbl]) => (
              <button key={val} className={`tag-btn${draft.style === val ? ' active' : ''}`} onClick={() => update('style', val)}>{lbl}</button>
            ))}
          </div>
        </div>
      );
      default: return <p style={{ color: '#718096', fontFamily: 'var(--font-body)', fontSize: 14 }}>No editable fields for this block type.</p>;
    }
  }

  return { form: renderForm(), draft };
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [selectedId, setSelectedId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelDraft, setPanelDraft] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [insertAfterIdx, setInsertAfterIdx] = useState(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [showHint, setShowHint] = useState(true);
  const [statusText, setStatusText] = useState('Draft — last saved 2 min ago');
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const toastTimer = useRef(null);

  function showToast(msg) {
    setToast({ show: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  }

  // ── DRAG & DROP ──────────────────────────────────────────────────────────────
  function handleDragStart(e, idx) { setDragIdx(idx); }
  function handleDragOver(e, idx) { e.preventDefault(); setDragOverIdx(idx); }
  function handleDrop(e, idx) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) { setDragOverIdx(null); return; }
    setBlocks(bs => {
      const next = [...bs];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setDragIdx(null); setDragOverIdx(null);
    showToast('Block moved');
  }
  function handleDragEnd() { setDragIdx(null); setDragOverIdx(null); }

  // ── REORDER ──────────────────────────────────────────────────────────────────
  function moveBlock(idx, dir) {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    setBlocks(bs => { const next = [...bs]; [next[idx], next[newIdx]] = [next[newIdx], next[idx]]; return next; });
    showToast('Block moved');
  }

  // ── DELETE ───────────────────────────────────────────────────────────────────
  function deleteBlock(id) {
    if (!confirm('Delete this block? This cannot be undone.')) return;
    setBlocks(bs => bs.filter(b => b.id !== id));
    if (selectedId === id) closePanel();
    showToast('Block deleted');
  }

  // ── EDIT PANEL ───────────────────────────────────────────────────────────────
  function openPanel(id) {
    const block = blocks.find(b => b.id === id);
    if (!block) return;
    setSelectedId(id);
    setPanelDraft(JSON.parse(JSON.stringify(block)));
    setPanelOpen(true);
  }
  function closePanel() { setPanelOpen(false); setSelectedId(null); setPanelDraft(null); }
  function savePanel(updatedData) {
    setBlocks(bs => bs.map(b => b.id === selectedId ? { ...b, data: updatedData } : b));
    closePanel();
    showToast('Changes saved');
  }

  // ── ADD BLOCK ────────────────────────────────────────────────────────────────
  function openAddModal(afterIdx) { setInsertAfterIdx(afterIdx); setAddModalOpen(true); }
  function closeAddModal() { setAddModalOpen(false); setInsertAfterIdx(null); }
  function addBlock(type) {
    const newBlock = { id: newId(), type, label: getTypeInfo(type).label, data: getDefaultData(type) };
    setBlocks(bs => {
      const next = [...bs];
      const insertAt = insertAfterIdx === null ? next.length : insertAfterIdx + 1;
      next.splice(insertAt, 0, newBlock);
      return next;
    });
    closeAddModal();
    setTimeout(() => openPanel(newBlock.id), 100);
  }

  // ── SAVE / PUBLISH ───────────────────────────────────────────────────────────
  function saveDraft() { showToast('Draft saved'); setStatusText('Draft — just saved'); }
  function confirmPublish() {
    setPublishModalOpen(false);
    showToast('Live! Changes published to digitalpublicworks.org');
    setStatusText('Published');
  }

  // ── RENDER ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-space)', background: 'var(--cool-white)', color: 'var(--forge)' }}>

      {/* TOP BAR */}
      <div className="topbar">
        <Image src="/logo/extended-dark/Duo-copper.svg" alt="Digital Public Works" className="topbar-logo" width={140} height={17} />
        <div className="topbar-divider" />
        <span className="topbar-badge">Admin</span>
        <div className="topbar-spacer" />
        <div className="topbar-status"><span className="status-dot" />{statusText}</div>
        &nbsp;&nbsp;
        <Link href="/" target="_blank" className="topbar-preview">
          <svg viewBox="0 0 16 16" fill="none" width="13" height="13"><path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Preview
        </Link>
        &nbsp;
        <button className="topbar-btn btn-draft" onClick={saveDraft}>Save Draft</button>
        <button className="topbar-btn btn-publish" onClick={() => setPublishModalOpen(true)}>Publish</button>
        <div className="topbar-avatar" title="Signed in as admin">B</div>
      </div>

      {/* LAYOUT */}
      <div className="admin-layout" style={{ flex: 1, overflow: 'hidden' }}>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-label">Pages</div>
            {[
              { href: '/admin', label: 'Home', icon: <path d="M2 3h12v2H2V3zm0 4h12v2H2V7zm0 4h8v2H2v-2z" fill="currentColor"/> },
              { href: '/admin/product', label: 'Product', icon: <path d="M8 2a6 6 0 100 12A6 6 0 008 2zM1 8a7 7 0 1114 0A7 7 0 011 8z" fill="currentColor"/> },
              { href: '/admin/impact', label: 'Impact', icon: <path d="M3 12l2-4 3 3 2-3 3 4H3z" fill="currentColor"/> },
              { href: '/admin/about', label: 'About', icon: <path d="M8 7a3 3 0 100-6 3 3 0 000 6zm-5 6a5 5 0 0110 0H3z" fill="currentColor"/> },
              { href: '/admin/insights', label: 'Insights', icon: <path d="M2 2h12v3L8 9 2 5V2zm0 5l6 4 6-4v7H2V7z" fill="currentColor"/> },
              { href: '/admin/contact', label: 'Contact', icon: <path d="M2 2h12v3L8 9 2 5V2zm0 5l6 4 6-4v7H2V7z" fill="currentColor"/> },
            ].map(item => (
              <Link key={item.label} href={item.href} className={`nav-item${item.label === 'Home' ? ' active' : ''}`}>
                <svg viewBox="0 0 16 16" fill="currentColor">{item.icon}</svg>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-section-label">Settings</div>
            <Link href="/admin/navigation" className="nav-item">
              <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 4h2v5H7V4zm0 6h2v2H7v-2z"/></svg>
              Navigation
            </Link>
            <Link href="/admin/footer" className="nav-item">
              <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 13l3-3 2 2 5-6 2 2-7 8-5-3z"/></svg>
              Footer
            </Link>
          </div>
          <div className="sidebar-spacer" />
          <div className="sidebar-footer">
            <div className="sidebar-footer-text">Signed in as<br /><strong>admin@digitalpublicworks.org</strong></div>
            <Link href="/admin/login" className="signout-link">Sign out</Link>
          </div>
        </aside>

        {/* MAIN */}
        <main className={`admin-main${panelOpen ? ' panel-open' : ''}`} id="admin-main">
          <div className="page-header">
            <div className="page-title">
              <h2>Home Page</h2>
              <p>Drag blocks to reorder &nbsp;·&nbsp; Click <strong>Edit</strong> to change content &nbsp;·&nbsp; Click <strong>+</strong> to add a new block</p>
            </div>
            <div className="page-actions">
              <button className="btn-add" onClick={() => openAddModal(null)}>
                <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 3v10M3 8h10"/></svg>
                Add Block
              </button>
            </div>
          </div>

          {showHint && (
            <div className="hint-banner">
              <svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm1 10H7V7h2v4zm0-5H7V4h2v2z"/></svg>
              <span><strong>Tip:</strong> Click the <strong>Edit</strong> button on any block to change its content. Use the arrow buttons or drag the handle to reorder blocks.</span>
              <button className="hint-close" onClick={() => setShowHint(false)}>&#215;</button>
            </div>
          )}

          <div className="block-list">
            {/* Insert zone before first block */}
            <InsertZone onAdd={() => openAddModal(-1)} />

            {blocks.map((block, idx) => {
              const ti = getTypeInfo(block.type);
              const isHero = block.type === 'hero';
              return (
                <div key={block.id}>
                  <div
                    className={[
                      'block-card',
                      selectedId === block.id ? 'selected' : '',
                      dragIdx === idx ? 'dragging' : '',
                      dragOverIdx === idx && dragIdx !== idx ? 'drag-over' : '',
                    ].filter(Boolean).join(' ')}
                    draggable
                    onDragStart={e => handleDragStart(e, idx)}
                    onDragOver={e => handleDragOver(e, idx)}
                    onDrop={e => handleDrop(e, idx)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="drag-handle" title="Drag to reorder">
                      <svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 4a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zM5 9a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2zm-6 5a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z"/></svg>
                    </div>
                    <div className="block-content">
                      <div className="block-type-row">
                        <span className={`block-type-badge ${ti.badge}`}>{ti.label}</span>
                        {isHero && <span style={{ fontSize: 11, color: 'var(--aluminum)' }}>Pinned to top</span>}
                      </div>
                      <div className="block-preview">{getPreview(block)}</div>
                    </div>
                    <div className="block-actions">
                      <button className="action-btn edit-btn" title="Edit content" onClick={() => openPanel(block.id)}>
                        <svg viewBox="0 0 16 16" fill="none"><path d="M11 2l3 3-8 8H3v-3l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <div className="action-spacer" />
                      <button className="action-btn" title="Move up" disabled={idx === 0} onClick={() => moveBlock(idx, -1)}>
                        <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 4l-5 5h10L8 4z"/></svg>
                      </button>
                      <button className="action-btn" title="Move down" disabled={idx === blocks.length - 1} onClick={() => moveBlock(idx, 1)}>
                        <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 12l5-5H3l5 5z"/></svg>
                      </button>
                      <div className="action-spacer" />
                      <button
                        className="action-btn delete-btn"
                        title={isHero ? 'Hero block cannot be deleted' : 'Delete block'}
                        disabled={isHero}
                        onClick={() => !isHero && deleteBlock(block.id)}
                      >
                        <svg viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                  <InsertZone onAdd={() => openAddModal(idx)} />
                </div>
              );
            })}

            {blocks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#718096', fontFamily: 'var(--font-body)' }}>
                No blocks yet. Click <strong>Add Block</strong> to get started.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* RIGHT EDIT PANEL */}
      {panelDraft && (
        <EditPanel
          block={panelDraft}
          open={panelOpen}
          onClose={closePanel}
          onSave={savePanel}
        />
      )}

      {/* ADD BLOCK MODAL */}
      {addModalOpen && (
        <AddBlockModal onAdd={addBlock} onClose={closeAddModal} />
      )}

      {/* PUBLISH MODAL */}
      {publishModalOpen && (
        <div className={`modal-overlay${publishModalOpen ? ' show' : ''}`} onClick={e => e.target === e.currentTarget && setPublishModalOpen(false)}>
          <div className="modal publish-modal-inner">
            <div className="modal-body">
              <h4>Publish changes to the live site?</h4>
              <p>This will make your changes visible to everyone visiting digitalpublicworks.org. You can always revert by saving a new draft.</p>
              <div className="publish-modal-btns">
                <button className="btn-cancel-publish" onClick={() => setPublishModalOpen(false)}>Cancel</button>
                <button className="btn-publish-confirm" onClick={confirmPublish}>Yes, publish now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div className={`toast${toast.show ? ' show' : ''}`}>
        <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.7 5.3l-4.5 4.5a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L6.75 9.19l3.97-3.97a.75.75 0 011.06 1.06z"/></svg>
        <span>{toast.msg}</span>
      </div>
    </div>
  );
}

// ── SUB-COMPONENTS ─────────────────────────────────────────────────────────────
function InsertZone({ onAdd }) {
  return (
    <div className="insert-zone">
      <div className="insert-line" />
      <button className="insert-btn" title="Insert block here" onClick={onAdd}>+</button>
      <div className="insert-line" />
    </div>
  );
}

function EditPanel({ block, open, onClose, onSave }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(block.data)));
  const ti = getTypeInfo(block.type);

  function update(key, val) { setDraft(d => ({ ...d, [key]: val })); }
  function updateStat(i, key, val) { setDraft(d => { const s = [...d.stats]; s[i] = { ...s[i], [key]: val }; return { ...d, stats: s }; }); }
  function updateQuote(i, key, val) { setDraft(d => { const q = [...d.quotes]; q[i] = { ...q[i], [key]: val }; return { ...d, quotes: q }; }); }
  function addQuote() { setDraft(d => ({ ...d, quotes: [...d.quotes, { text: '', attr: '' }] })); }
  function removeQuote(i) { setDraft(d => ({ ...d, quotes: d.quotes.filter((_, idx) => idx !== i) })); }
  function updateLogo(i, key, val) { setDraft(d => { const l = [...d.logos]; l[i] = { ...l[i], [key]: val }; return { ...d, logos: l }; }); }
  function addLogo() { setDraft(d => ({ ...d, logos: [...d.logos, { name: '', url: '' }] })); }
  function removeLogo(i) { setDraft(d => ({ ...d, logos: d.logos.filter((_, idx) => idx !== i) })); }

  const Field = ({ label, hint, value, onChange, textarea, style }) => (
    <div className="field-group">
      <label className="field-label">{label}</label>
      {hint && <div className="field-hint">{hint}</div>}
      {textarea
        ? <textarea className="field-input" style={style} value={value} onChange={e => onChange(e.target.value)} />
        : <input className="field-input" style={style} value={value} onChange={e => onChange(e.target.value)} />}
    </div>
  );

  function renderBody() {
    switch (block.type) {
      case 'hero': return <>
        <Field label="Eyebrow text" hint='Small text above the headline' value={draft.eyebrow||''} onChange={v=>update('eyebrow',v)} />
        <Field label="Main headline" hint="The large H1. Keep under 12 words." value={draft.h1||''} onChange={v=>update('h1',v)} textarea />
        <Field label="Subtitle" value={draft.subtitle||''} onChange={v=>update('subtitle',v)} textarea />
        <hr className="section-divider-line" />
        <div className="field-row">
          <Field label="Primary button" value={draft.btnPrimary||''} onChange={v=>update('btnPrimary',v)} />
          <Field label="Secondary button" value={draft.btnSecondary||''} onChange={v=>update('btnSecondary',v)} />
        </div>
        <Field label="Footnote" value={draft.footnote||''} onChange={v=>update('footnote',v)} />
      </>;
      case 'heading': return <>
        <div className="field-group">
          <label className="field-label">Heading level</label>
          <div className="tag-selector">{['H1','H2','H3'].map(l=><button key={l} className={`tag-btn${(draft.level||'H2')===l?' active':''}`} onClick={()=>update('level',l)}>{l}</button>)}</div>
        </div>
        <Field label="Heading text" value={draft.text||''} onChange={v=>update('text',v)} />
      </>;
      case 'paragraph': return <Field label="Text" hint="Plain text." value={draft.text||''} onChange={v=>update('text',v)} textarea style={{minHeight:180}} />;
      case 'image': return <>
        <div className="field-group">
          <label className="field-label">Image</label>
          <div style={{border:'2px dashed var(--light-aluminum)',borderRadius:6,padding:'28px 20px',textAlign:'center',background:'var(--cool-white)',color:'#718096',fontSize:13}}>
            Image upload — wired to Supabase Storage in the next phase
          </div>
        </div>
        <Field label="Alt text" hint="Describe for screen readers." value={draft.alt||''} onChange={v=>update('alt',v)} />
        <div className="field-group">
          <label className="field-label">Width</label>
          <div className="tag-selector">
            {[['full','Full width'],['contained','Contained']].map(([v,l])=><button key={v} className={`tag-btn${(draft.width||'full')===v?' active':''}`} onClick={()=>update('width',v)}>{l}</button>)}
          </div>
        </div>
      </>;
      case 'twocol': return <>
        <Field label="Section label" hint="Small uppercase label (optional)" value={draft.sectionLabel||''} onChange={v=>update('sectionLabel',v)} />
        <Field label="Heading" value={draft.heading||''} onChange={v=>update('heading',v)} />
        <div className="two-col-editor">
          <div className="col-editor"><div className="col-editor-label">Left column</div><textarea className="field-input" style={{minHeight:140}} value={draft.leftContent||''} onChange={e=>update('leftContent',e.target.value)}/></div>
          <div className="col-editor"><div className="col-editor-label">Right column</div><textarea className="field-input" style={{minHeight:140}} value={draft.rightContent||''} onChange={e=>update('rightContent',e.target.value)}/></div>
        </div>
        <div className="field-group" style={{marginTop:14}}>
          <label className="field-label">CTA button (optional)</label>
          <div className="field-row">
            <input className="field-input" placeholder="Button label" value={draft.ctaLabel||''} onChange={e=>update('ctaLabel',e.target.value)}/>
            <input className="field-input" placeholder="Link / URL" value={draft.ctaLink||''} onChange={e=>update('ctaLink',e.target.value)}/>
          </div>
        </div>
      </>;
      case 'button': return <>
        <Field label="Button label" value={draft.label||''} onChange={v=>update('label',v)} />
        <Field label="Link / URL" value={draft.link||''} onChange={v=>update('link',v)} />
        <div className="field-group">
          <label className="field-label">Style</label>
          <div className="tag-selector">{[['primary','Primary (copper)'],['secondary','Secondary (outline)']].map(([v,l])=><button key={v} className={`tag-btn${(draft.style||'primary')===v?' active':''}`} onClick={()=>update('style',v)}>{l}</button>)}</div>
        </div>
      </>;
      case 'stats': return <>
        <Field label="Section heading" value={draft.heading||''} onChange={v=>update('heading',v)} />
        <hr className="section-divider-line" />
        {(draft.stats||[]).map((s,i)=>(
          <div key={i} className="stat-entry">
            <div className="stat-entry-header">Stat {i+1}</div>
            <div className="field-row">
              <div className="field-group" style={{marginBottom:0}}><label className="field-label">Number</label><input className="field-input" value={s.num||''} placeholder="e.g. 85%" onChange={e=>updateStat(i,'num',e.target.value)}/></div>
              <div className="field-group" style={{marginBottom:0}}><label className="field-label">Description</label><input className="field-input" value={s.desc||''} onChange={e=>updateStat(i,'desc',e.target.value)}/></div>
            </div>
          </div>
        ))}
      </>;
      case 'quote': return <>
        {(draft.quotes||[]).map((q,i)=>(
          <div key={i} className="stat-entry">
            <div className="stat-entry-header">Quote {i+1} {i>0&&<button className="btn-remove-entry" onClick={()=>removeQuote(i)} style={{marginLeft:8}}>&#215;</button>}</div>
            <div className="field-group"><label className="field-label">Quote text</label><textarea className="field-input" style={{minHeight:90}} value={q.text||''} onChange={e=>updateQuote(i,'text',e.target.value)}/></div>
            <div className="field-group" style={{marginBottom:0}}><label className="field-label">Attribution</label><input className="field-input" value={q.attr||''} placeholder="Name, Title, or Organization" onChange={e=>updateQuote(i,'attr',e.target.value)}/></div>
          </div>
        ))}
        <button className="btn-add-entry" onClick={addQuote}>+ Add another quote</button>
      </>;
      case 'logo': return <>
        <Field label="Row label" hint='e.g. "Backed by"' value={draft.label||''} onChange={v=>update('label',v)} />
        <hr className="section-divider-line" />
        {(draft.logos||[]).map((l,i)=>(
          <div key={i} className="logo-entry">
            <div className="logo-entry-fields">
              <input className="field-input" placeholder="Organization name" value={l.name||''} onChange={e=>updateLogo(i,'name',e.target.value)}/>
              <input className="field-input" placeholder="https://website.org" value={l.url||''} onChange={e=>updateLogo(i,'url',e.target.value)}/>
            </div>
            <button className="btn-remove-entry" onClick={()=>removeLogo(i)}>&#215;</button>
          </div>
        ))}
        <button className="btn-add-entry" onClick={addLogo}>+ Add another logo</button>
      </>;
      case 'divider': return (
        <div className="field-group">
          <label className="field-label">Type</label>
          <div className="tag-selector">{[['rule','Horizontal line'],['space','Blank spacer']].map(([v,l])=><button key={v} className={`tag-btn${(draft.style||'rule')===v?' active':''}`} onClick={()=>update('style',v)}>{l}</button>)}</div>
        </div>
      );
      default: return <p style={{color:'#718096',fontFamily:'var(--font-body)',fontSize:14}}>No editable fields.</p>;
    }
  }

  return (
    <div className={`panel${open ? ' open' : ''}`}>
      <div className="panel-header">
        <span className="panel-title">Edit: {ti.label}</span>
        <button className="panel-close" onClick={onClose}>
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
        </button>
      </div>
      <div className="panel-body">{renderBody()}</div>
      <div className="panel-footer">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-done" onClick={() => onSave(draft)}>Save changes</button>
      </div>
    </div>
  );
}

const BLOCK_TYPES = [
  { type: 'heading',   icon: { bg: '#DBEAFE', color: '#1D4ED8' }, name: 'Heading',     desc: 'H1, H2, or H3 title text' },
  { type: 'paragraph', icon: { bg: '#F0FDF4', color: '#15803D' }, name: 'Paragraph',   desc: 'Body text block' },
  { type: 'image',     icon: { bg: '#FEF3C7', color: '#92400E' }, name: 'Image',       desc: 'Photo or graphic' },
  { type: 'twocol',    icon: { bg: '#FCE7F3', color: '#9D174D' }, name: '2-Column',    desc: 'Side-by-side content' },
  { type: 'button',    icon: { bg: '#FEF5EE', color: '#9F5528' }, name: 'Button / CTA', desc: 'Call-to-action button' },
  { type: 'stats',     icon: { bg: '#F0F9FF', color: '#0369A1' }, name: 'Stats Block', desc: 'Row of 4 metrics' },
  { type: 'quote',     icon: { bg: '#F9FAFB', color: '#374151' }, name: 'Quote',       desc: 'Testimonial with attribution' },
  { type: 'logo',      icon: { bg: '#F0FDF4', color: '#065F46' }, name: 'Logo Row',    desc: 'Partner / funder logos' },
  { type: 'divider',   icon: { bg: '#F9FAFB', color: '#6B7280' }, name: 'Divider',     desc: 'Horizontal rule or spacer' },
];

function AddBlockModal({ onAdd, onClose }) {
  return (
    <div className="modal-overlay show" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Add a block</h3>
          <button className="modal-close" onClick={onClose}>&#215;</button>
        </div>
        <div className="modal-body">
          <p>Choose the type of content block you want to add.</p>
          <div className="block-type-grid">
            {BLOCK_TYPES.map(bt => (
              <div key={bt.type} className="block-type-option" onClick={() => onAdd(bt.type)}>
                <div className="block-type-icon" style={{ background: bt.icon.bg }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill={bt.icon.color}><rect x="3" y="6" width="14" height="8" rx="1" opacity="0.5"/></svg>
                </div>
                <div className="name">{bt.name}</div>
                <div className="desc">{bt.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
