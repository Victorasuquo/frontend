import { useMemo, useState } from 'react'
import { generateActionSheet, generatePatientLetter, generateSMS } from '../api/client'
import { OPPS } from '../data/pocData'
import { useSessionState } from '../hooks/useSessionState'
import type { GeneratedDocumentResponse } from '../types'

type DocType = 'action' | 'letter' | 'sms'

interface DocumentsStoredState {
  oppId: number
  docType: DocType
  practiceName: string
  patientName: string
  notes: string
  generatedCache: Record<string, GeneratedDocumentResponse>
}

export default function DocumentsPage() {
  const [storedState, setStoredState] = useSessionState<DocumentsStoredState>('medsave-documents', {
    oppId: OPPS[0].id,
    docType: 'action',
    practiceName: 'South Yorkshire ICB',
    patientName: '[Patient Name]',
    notes: '',
    generatedCache: {},
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { oppId, docType, practiceName, patientName, notes, generatedCache } = storedState
  const opp = useMemo(() => OPPS.find((o) => o.id === oppId) ?? OPPS[0], [oppId])
  const currentDocumentKey = `${docType}:${oppId}`
  const generated = generatedCache[currentDocumentKey] ?? null

  const updateStoredState = (patch: Partial<DocumentsStoredState>) => {
    setStoredState((current) => ({ ...current, ...patch }))
  }

  const generate = async () => {
    setLoading(true)
    setError(null)

    try {
      let res: GeneratedDocumentResponse
      if (docType === 'action') {
        res = await generateActionSheet({
          opportunity_title: `${opp.fr} → ${opp.to}`,
          practice_name: practiceName,
          patient_count: opp.ptE,
          current_drug: opp.fr,
          target_drug: opp.to,
          clinical_notes: notes || undefined,
        })
      } else if (docType === 'letter') {
        res = await generatePatientLetter({
          patient_name: patientName,
          opportunity_title: `${opp.fr} → ${opp.to}`,
          current_drug: opp.fr,
          target_drug: opp.to,
          practice_name: practiceName,
          additional_advice: notes || undefined,
        })
      } else {
        res = await generateSMS({
          patient_name: patientName,
          practice_name: practiceName,
          current_drug: opp.fr,
          target_drug: opp.to,
        })
      }

      setStoredState((current) => ({
        ...current,
        generatedCache: {
          ...current.generatedCache,
          [currentDocumentKey]: res,
        },
      }))
    } catch {
      setError('Document generation failed. Check backend auth/session and retry.')
    } finally {
      setLoading(false)
    }
  }

  const fallbackSms = `Dear [Name], your ${opp.fr.split('(')[0].trim().substring(0, 30)} is changing to ${opp.to.split('(')[0].trim().substring(0, 25)} from your next prescription. Same medicine - name only changes. NHS-approved. Questions? Call the surgery.`
  const smsText = sanitizeSmsContent(generated?.content, fallbackSms)
  const letterParagraphs = buildLetterParagraphs(generated?.content, opp)
  const actionSteps: Array<[string, string, string | number, string, string]> = [
    ['Run EMIS/SystmOne search query (attached)', `All ${opp.cat} patients`, opp.ptE, 'Practice pharmacist', '17 Mar 2026'],
    [`Review exclusion criteria - ${opp.ptX} expected exclusions`, 'Clinical review', opp.ptX, 'GP / pharmacist', '17 Mar 2026'],
    [`${opp.ptR} patients require individual review before switch`, 'Clinical judgment', opp.ptR, 'GP', '24 Mar 2026'],
    ['Switch eligible patients via EPS batch or individual Rx', `${opp.ptE - opp.ptX - opp.ptR} patients`, opp.ptE - opp.ptX - opp.ptR, 'Prescriber', '31 Mar 2026'],
    ['Send patient letter / SMS to all switched patients', 'All switched', 'As above', 'Admin / pharmacist', '31 Mar 2026'],
    ['Log switch complete in MedSave · confirm annual saving', 'Audit trail', 'All', 'Practice pharmacist', '31 Mar 2026'],
  ]

  return (
    <div className="pg">
      <div className="ph">
        <h1>Action sheets & patient letters</h1>
        <p>Generate, print, or share electronically - BNF-referenced, NHS-compliant, ready to use</p>
      </div>

      <div className="doc-config card">
        <div className="pad">
          <div className="doc-step">Step 1 - select opportunity</div>
          <select className="fi" value={oppId} onChange={(e) => updateStoredState({ oppId: Number(e.target.value) })}>
            {OPPS.map((o) => (
              <option key={o.id} value={o.id}>{o.rank}. {o.fr} → {o.to} (£{o.sav.toLocaleString()}/yr)</option>
            ))}
          </select>

          <div className="doc-step">Step 2 - choose document type</div>
          <div className="dt-grid">
            <button type="button" className={`dtb ${docType === 'action' ? 'sel' : ''}`} onClick={() => updateStoredState({ docType: 'action' })}>
              <div className="dtb-ic">📋</div>
              <div className="dtb-n">Practice action sheet</div>
              <div className="dtb-d">Workflow guide with patient list table</div>
            </button>
            <button type="button" className={`dtb ${docType === 'letter' ? 'sel' : ''}`} onClick={() => updateStoredState({ docType: 'letter' })}>
              <div className="dtb-ic">✉️</div>
              <div className="dtb-n">Patient letter</div>
              <div className="dtb-d">Personalised NHS-style letter for printing or email</div>
            </button>
            <button type="button" className={`dtb ${docType === 'sms' ? 'sel' : ''}`} onClick={() => updateStoredState({ docType: 'sms' })}>
              <div className="dtb-ic">📱</div>
              <div className="dtb-n">SMS message</div>
              <div className="dtb-d">AccuRx / MJOG ready · 160 chars</div>
            </button>
          </div>

          <div className="doc-meta-grid">
            <input className="fi" placeholder="Practice name" value={practiceName} onChange={(e) => updateStoredState({ practiceName: e.target.value })} />
            <input className="fi" placeholder="Patient name" value={patientName} onChange={(e) => updateStoredState({ patientName: e.target.value })} />
          </div>
          <textarea className="fi" placeholder="Additional notes (optional)" value={notes} onChange={(e) => updateStoredState({ notes: e.target.value })} style={{ minHeight: 70 }} />

          <div className="doc-actions-row">
            <button className="btn bp" onClick={() => void generate()} disabled={loading}>{loading ? 'Syncing live preview...' : 'Sync live preview'}</button>
            {generated ? <span className="doc-sync-note">Cached live draft from {formatTimestamp(generated.generated_at)}</span> : <span className="doc-sync-note">Preview stays cached when you switch tabs.</span>}
          </div>
          {error ? <div className="err">{error}</div> : null}
        </div>
      </div>

      {docType === 'action' ? (
        <div className="card">
          <div className="ch">
            <div>
              <div className="ch-t">Practice action sheet - {opp.fr} → {opp.to}</div>
              <div className="ch-s">Generated {formatShortDate(generated?.generated_at)} · BNF {opp.bnf} · South Yorkshire ICB</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button className="btn bp bsm" onClick={() => window.print()}>Print ↗</button>
              <button className="btn bb bsm" onClick={() => downloadText(`MedSave_ActionSheet_${opp.id}.txt`, buildActionSheetDownload(generated?.content, opp))}>Download PDF</button>
              <button className="btn bs bsm" onClick={() => shareByEmail(`Practice action sheet: ${opp.fr} to ${opp.to}`, buildActionSheetDownload(generated?.content, opp))}>Share via NHS mail</button>
            </div>
          </div>

          <div className="as">
            <div className="as-hd">
              <h3>MEDICINES SWITCH - PRACTICE ACTION SHEET</h3>
              <p>South Yorkshire ICB · Medicines Optimisation · {formatShortDate(generated?.generated_at)}</p>
            </div>

            <div className="as-meta">
              <div>
                <div className="as-k">Switch from</div>
                <div className="as-v as-v-from">{opp.fr}</div>
              </div>
              <div>
                <div className="as-k">Switch to</div>
                <div className="as-v as-v-to">{opp.to}</div>
              </div>
              <div>
                <div className="as-k">Annual saving</div>
                <div className="as-v as-v-money">£{opp.sav.toLocaleString()}</div>
              </div>
              <div>
                <div className="as-k">BNF code</div>
                <div className="as-v as-v-code">{opp.bnf}</div>
              </div>
            </div>

            <div className="as-sec">
              <div className="as-sec-label">Clinical guidance</div>
              <div className="as-sec-copy">{opp.guide}</div>
            </div>

            <div className="as-sec">
              <div className="as-sec-label">Exclusion criteria</div>
              <div className="as-ex-grid">
                {opp.ex.map((item) => (
                  <div key={`${item.t}-${item.l}`} className="as-ex-item">
                    <span className={item.t === 'h' ? 'as-ex-hard' : 'as-ex-review'}>{item.t === 'h' ? '✕ HARD EXCLUDE' : '⚠ REVIEW'}:</span>{' '}
                    <span>{item.l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="as-row as-hdr"><div>Action step</div><div>Target</div><div>Patients</div><div>Responsible</div><div>By date</div></div>
            {actionSteps.map((row) => (
              <div key={row[0]} className="as-row">
                {row.map((cell) => <div key={`${row[0]}-${String(cell)}`}>{cell}</div>)}
              </div>
            ))}
          </div>

          <div className="as-ft">Generated by MedSave · South Yorkshire ICB · medicines.optimisation@syicb.nhs.uk · BNF {opp.bnf} · Drug Tariff March 2026</div>
        </div>
      ) : null}

      {docType === 'letter' ? (
        <div className="card">
          <div className="ch">
            <div>
              <div className="ch-t">Patient letter - {opp.fr} → {opp.to}</div>
              <div className="ch-s">AI-generated · edit before sending · NHS Plain English compliant</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button className="btn bp bsm" onClick={() => window.print()}>Print all ↗</button>
              <button className="btn bb bsm" onClick={() => downloadText(`MedSave_PatientLetter_${opp.id}.txt`, buildLetterDownload(letterParagraphs, opp, patientName, practiceName))}>Download PDF batch</button>
              <button className="btn bg bsm" onClick={() => shareByEmail(`Patient letter: ${opp.fr} to ${opp.to}`, buildLetterDownload(letterParagraphs, opp, patientName, practiceName))}>Send electronically ↗</button>
              <button className="btn bs bsm" onClick={() => { void copyToClipboard(buildLetterDownload(letterParagraphs, opp, patientName, practiceName)) }}>Edit / copy</button>
            </div>
          </div>

          <div className="doc-preview-pad">
            <div className="doc-alert">Review before sending - personalise {patientName} from clinical system · AI-generated · clinician must approve</div>
            <div className="lp">
              <div className="lp-top">
                <div>
                  <strong>South Yorkshire ICB</strong><br />
                  Medicines Optimisation<br />
                  NHS South Yorkshire<br />
                  Email: medicines.optimisation@syicb.nhs.uk
                </div>
                <div className="lp-right">
                  <div>17 March 2026</div>
                  <div className="lp-ref">Ref: SW-{opp.id}-14935</div>
                </div>
              </div>

              <div className="lp-address">
                <strong>{patientName}</strong><br />
                [Address]<br />
                [Postcode]
              </div>

              {letterParagraphs.map((paragraph, index) => {
                if (paragraph.startsWith('Change to your prescription')) {
                  return <h3 key={`${paragraph}-${index}`}>{paragraph}</h3>
                }

                if (paragraph.includes('\n')) {
                  const [lead, ...rest] = paragraph.split('\n')
                  return (
                    <p key={`${lead}-${index}`}>
                      <strong>{lead}</strong>
                      <br />
                      {rest.join(' ')}
                    </p>
                  )
                }

                return <p key={`${paragraph}-${index}`}>{paragraph}</p>
              })}
            </div>
          </div>
        </div>
      ) : null}

      {docType === 'sms' ? (
        <div className="card">
          <div className="ch">
            <div>
              <div className="ch-t">SMS message - {opp.fr} → {opp.to}</div>
              <div className="ch-s">{smsText.length} characters · AccuRx / MJOG compatible</div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button className="btn bp bsm" onClick={() => shareByEmail(`SMS draft: ${opp.fr} to ${opp.to}`, smsText)}>Send via AccuRx ↗</button>
              <button className="btn bs bsm" onClick={() => { void copyToClipboard(smsText) }}>Copy text</button>
            </div>
          </div>

          <div className="doc-preview-pad">
            <div className="sms-shell">
              <div className="sms-bubble">{smsText}</div>
              <div className="sms-meta">{smsText.length}/160 · NHS verified sender</div>
            </div>
            <div className="sms-alert">⚠ Approve before sending. Check patient contact details are current. Consider patients who prefer written letters.</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function formatShortDate(timestamp?: string) {
  if (!timestamp) {
    return '17/03/2026'
  }

  return new Date(timestamp).toLocaleDateString('en-GB')
}

function formatTimestamp(timestamp: string) {
  return new Date(timestamp).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function sanitizeSmsContent(content: string | undefined, fallback: string) {
  return (content ?? fallback).replace(/\s+/g, ' ').trim()
}

function buildLetterParagraphs(content: string | undefined, opp: (typeof OPPS)[number]) {
  const fallback = [
    'Dear [Patient Name],',
    `Change to your prescription - ${opp.fr.split('(')[0].trim()}`,
    'I am writing to let you know about a small change to your medication. Your GP practice has been asked by South Yorkshire ICB to review prescriptions to ensure you are receiving the most cost-effective treatment.',
    `Your current medicine, ${opp.fr}, is being changed to ${opp.to}.`,
    `Is this safe?\nYes. ${opp.to} contains exactly the same active ingredient and works in the same way. It is NHS-approved and meets the same standards for safety and effectiveness. The only difference is the name on the packaging.`,
    `What do you need to do?\nNothing - your next prescription will automatically be for ${opp.to.split('(')[0].trim()}. If your pharmacist has any questions they can contact your surgery. If you have concerns, please speak to your GP or practice pharmacist.`,
    'Why is this change being made?\nSouth Yorkshire ICB is working to ensure NHS resources go as far as possible. By switching to a more cost-effective medicine, your practice can reinvest savings into other patient services.',
    'If you have any questions, please contact your surgery.',
    'Yours sincerely,',
    '[Practice Pharmacist Name]\n[Practice Name], South Yorkshire ICB',
  ]

  if (!content) {
    return fallback
  }

  const lines = content
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())

  const firstDear = lines.findIndex((line) => line.startsWith('Dear'))
  const relevantLines = (firstDear >= 0 ? lines.slice(firstDear) : lines).join('\n')
  const paragraphs = relevantLines
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return paragraphs.length ? paragraphs : fallback
}

function buildActionSheetDownload(content: string | undefined, opp: (typeof OPPS)[number]) {
  return [
    'MEDICINES SWITCH - PRACTICE ACTION SHEET',
    `Switch from: ${opp.fr}`,
    `Switch to: ${opp.to}`,
    `Annual saving: £${opp.sav.toLocaleString()}`,
    `BNF code: ${opp.bnf}`,
    '',
    content ?? opp.guide,
  ].join('\n')
}

function buildLetterDownload(paragraphs: string[], opp: (typeof OPPS)[number], patientName: string, practiceName: string) {
  return [
    'South Yorkshire ICB',
    'Medicines Optimisation',
    'NHS South Yorkshire',
    'Email: medicines.optimisation@syicb.nhs.uk',
    '17 March 2026',
    `Ref: SW-${opp.id}-14935`,
    '',
    patientName,
    '[Address]',
    '[Postcode]',
    '',
    ...paragraphs,
    '',
    practiceName,
  ].join('\n\n')
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function shareByEmail(subject: string, body: string) {
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

async function copyToClipboard(content: string) {
  await navigator.clipboard.writeText(content)
}
