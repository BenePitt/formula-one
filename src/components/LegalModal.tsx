import { useEffect } from 'react'
import { legalData } from '../legal/legalData'

type LegalView = 'impressum' | 'datenschutz'

interface Props {
  view: LegalView
  onClose: () => void
}

export function LegalModal({ view, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const { name, street, zip, city, email, phone, website } = legalData

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="bg-f1card border border-f1border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-f1border sticky top-0 bg-f1card rounded-t-2xl">
          <h2 className="text-lg font-bold">
            {view === 'impressum' ? 'Impressum' : 'Datenschutzerklärung'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 text-sm text-gray-300 space-y-5 leading-relaxed">
          {view === 'impressum' ? (
            <Impressum name={name} street={street} zip={zip} city={city} email={email} phone={phone} website={website} />
          ) : (
            <Datenschutz name={name} street={street} zip={zip} city={city} email={email} />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Impressum ──────────────────────────────────────────────────

interface ContactProps {
  name: string
  street: string
  zip: string
  city: string
  email: string
  phone?: string
  website?: string
}

function Impressum({ name, street, zip, city, email, phone, website }: ContactProps) {
  return (
    <>
      <section>
        <h3 className="text-white font-semibold mb-1">Angaben gemäß § 5 TMG</h3>
        <p>{name || <span className="text-red-400 italic">Name nicht eingetragen</span>}</p>
        <p>{street || <span className="text-red-400 italic">Straße nicht eingetragen</span>}</p>
        <p>
          {zip || city
            ? `${zip} ${city}`.trim()
            : <span className="text-red-400 italic">PLZ / Ort nicht eingetragen</span>}
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-1">Kontakt</h3>
        {phone && <p>Telefon: {phone}</p>}
        <p>
          E-Mail:{' '}
          {email
            ? <a href={`mailto:${email}`} className="text-f1red hover:underline">{email}</a>
            : <span className="text-red-400 italic">E-Mail nicht eingetragen</span>}
        </p>
        {website && (
          <p>
            Web:{' '}
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-f1red hover:underline">
              {website}
            </a>
          </p>
        )}
      </section>

      <section>
        <h3 className="text-white font-semibold mb-1">Haftungsausschluss</h3>
        <p>
          Diese Webseite ist ein privates Freizeitprojekt ohne kommerziellen Hintergrund.
          Die dargestellten F1-Daten werden über die öffentliche Jolpica F1 API bezogen
          und dienen ausschließlich der privaten Unterhaltung. Es besteht kein Anspruch
          auf Vollständigkeit oder Aktualität.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-1">Urheberrecht</h3>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte unterliegen dem deutschen
          Urheberrecht. Formula 1, F1 sowie alle damit verbundenen Logos und Marken
          sind Eigentum der Formula One Licensing B.V. Diese Webseite steht in keiner
          Verbindung zu Formula One Management Ltd. oder der FIA.
        </p>
      </section>
    </>
  )
}

// ── Datenschutzerklärung ───────────────────────────────────────

function Datenschutz({ name, street, zip, city, email }: Omit<ContactProps, 'phone' | 'website'>) {
  return (
    <>
      <section>
        <h3 className="text-white font-semibold mb-1">1. Verantwortlicher</h3>
        <p>
          {name || <span className="text-red-400 italic">Name nicht eingetragen</span>}<br />
          {street || <span className="text-red-400 italic">Straße nicht eingetragen</span>}<br />
          {zip || city
            ? `${zip} ${city}`.trim()
            : <span className="text-red-400 italic">PLZ / Ort nicht eingetragen</span>}<br />
          E-Mail:{' '}
          {email
            ? <a href={`mailto:${email}`} className="text-f1red hover:underline">{email}</a>
            : <span className="text-red-400 italic">E-Mail nicht eingetragen</span>}
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-1">2. Erhebung und Verarbeitung personenbezogener Daten</h3>
        <p>
          Diese Webseite erhebt und speichert keine personenbezogenen Daten der Nutzer.
          Es werden keine Cookies gesetzt, kein Tracking durchgeführt und keine
          Nutzerdaten an Dritte weitergegeben.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-1">3. Externe Dienste</h3>
        <p>
          Zur Darstellung der Formel-1-Daten ruft diese Webseite die öffentliche
          {' '}<strong className="text-white">Jolpica F1 API</strong> (api.jolpi.ca) ab.
          Dabei wird eine Verbindung zu den Servern dieses Drittanbieters hergestellt.
          Welche Daten der Anbieter dabei erhebt, entnehmen Sie bitte dessen
          Datenschutzerklärung unter{' '}
          <a href="https://api.jolpi.ca/" target="_blank" rel="noopener noreferrer" className="text-f1red hover:underline">
            api.jolpi.ca
          </a>.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-1">4. Hosting (GitHub Pages)</h3>
        <p>
          Diese Webseite wird über <strong className="text-white">GitHub Pages</strong> gehostet,
          einem Dienst der GitHub Inc. (88 Colin P. Kelly Jr. St., San Francisco, CA 94107, USA),
          einer Tochtergesellschaft der Microsoft Corporation.
        </p>
        <p className="mt-2">
          Beim Aufruf dieser Webseite verarbeitet GitHub automatisch technische Zugriffsdaten,
          insbesondere Ihre IP-Adresse, den verwendeten Browser, das Betriebssystem sowie
          Datum und Uhrzeit des Zugriffs. GitHub Pages nutzt das CDN-Netzwerk von{' '}
          <strong className="text-white">Fastly</strong>; europäische Nutzer werden in der Regel
          von europäischen Edge-Servern bedient, sodass eine Übertragung in die USA nicht
          in jedem Fall stattfindet. Da GitHub Inc. jedoch ein US-amerikanisches Unternehmen ist,
          kann eine Verarbeitung personenbezogener Daten in den USA nicht vollständig
          ausgeschlossen werden.
        </p>
        <p className="mt-2">
          Eine etwaige Datenübermittlung in die USA ist durch das{' '}
          <strong className="text-white">EU-US Data Privacy Framework (DPF)</strong> abgesichert,
          unter dem GitHub Inc. zertifiziert ist (Art. 45 DSGVO). Rechtsgrundlage der
          Verarbeitung ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren
          Betrieb der Webseite). Weitere Informationen:{' '}
          <a
            href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-f1red hover:underline"
          >
            GitHub Privacy Statement
          </a>.
        </p>
      </section>

      <section>
        <h3 className="text-white font-semibold mb-1">5. Ihre Rechte</h3>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung
          der Verarbeitung Ihrer personenbezogenen Daten sowie ein Widerspruchsrecht.
          Da diese Webseite keine personenbezogenen Daten erhebt, ist eine
          Betroffenenanfrage unter der oben genannten E-Mail-Adresse möglich, aber
          voraussichtlich gegenstandslos.
        </p>
        <p className="mt-2">
          Bei Beschwerden wenden Sie sich an die zuständige Datenschutzbehörde,
          z. B. den Bayerischen Landesbeauftragten für den Datenschutz.
        </p>
      </section>
    </>
  )
}
