/** Studio — versie 2.0 | Laatst gewijzigd: 2026-11-04. Verbindt editorpanelen en documentbewerkingen. */
import { useState } from 'react'
import {
  ArrowDownLeft,
  ExternalLink,
  Monitor,
  MousePointer2,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react'
import { useDocument } from '../../hooks/useDocument.js'
import { updateBlock, moveBlock, createBlock } from '../../lib/document.js'
import { locateBlock, mapBlocks, insertBlock, cloneBlock } from '../../lib/tree.js'
import { relocateBlock } from '../../lib/nesting.js'
import { createProjectPage } from '../../lib/projects.js'
import { removePage } from '../../lib/pages.js'
import { validateSite } from '../../lib/validation.js'
import { initialSite } from '../../data/initialSite.js'
import { loadDocument, publishDocument } from '../../services/storage.js'
import { firebaseReady } from '../../services/firebase.js'
import { ResizablePanel } from './ResizablePanel.jsx'
import { Toolbar } from './Toolbar.jsx'
import { Sidebar } from './Sidebar.jsx'
import { PropertiesPanel } from '../panels/PropertiesPanel.jsx'
import { Canvas } from '../renderer/Canvas.jsx'

// De bouwer bewaart UI-selecties los van de inhoud, zodat preview geen werk verliest.
export function Builder({ account, onLogout }) {
  const model = useDocument()
  const [tab, setTab] = useState('pages')
  const [pageId, setPageId] = useState('home')
  const [selected, setSelected] = useState('intro')
  const [preview, setPreview] = useState(false)
  const [device, setDevice] = useState('desktop')
  const [desktopWidth, setDesktopWidth] = useState(0)
  const [replay, setReplay] = useState(0)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [dialog, setDialog] = useState(null)
  const page = model.site.pages.find((item) => item.id === pageId) || model.site.pages[0]
  const block = locateBlock(page.sections, selected)?.node

  // Past een sectie uit canvas of eigenschappenpaneel aan en bewaart historie.
  const editBlock = (id, patch) => model.change((site) => updateBlock(site, page.id, id, patch))

  // Handelt gerichte opdrachten af; destructieve conceptacties krijgen een herstelbare bevestiging.
  const action = async (type, value) => {
    try {
      setNotice('')
      if (['save', 'publish'].includes(type)) {
        setBusy(true)
        await model.persist(model.site, type === 'publish')
        setNotice(
          type === 'publish'
            ? firebaseReady
              ? 'Je website is gepubliceerd.'
              : 'Lokaal gepubliceerd. Open de hoofdwebsite in deze browser.'
            : 'Je concept is opgeslagen.'
        )
        return
      }
      if (type === 'open-blocks') return setTab('blocks')
      if (type === 'open-media') return setTab('media')
      if (type === 'media') {
        if (!block) throw new Error('Selecteer eerst een afbeelding- of videobouwsteen.')
        return editBlock(block.id, { image: value })
      }
      if (type === 'add-block') {
        const next = createBlock(value)
        model.change((site) => ({
          ...site,
          pages: site.pages.map((item) =>
            item.id === page.id
              ? {
                  ...item,
                  sections: insertBlock(
                    item.sections,
                    next,
                    block?.type === 'container' ? block.id : ''
                  ),
                }
              : item
          ),
        }))
        setSelected(next.id)
        setTab('pages')
        return
      }
      if (type === 'move-node')
        return model.change((site) => ({
          ...site,
          pages: site.pages.map((item) =>
            item.id === page.id
              ? {
                  ...item,
                  sections: relocateBlock(item.sections, value.id, value.parentId, value.index),
                }
              : item
          ),
        }))
      if (type === 'move')
        return model.change((site) => moveBlock(site, page.id, value.from, value.to))
      if (type === 'page-patch')
        return model.change((site) => ({
          ...site,
          pages: site.pages.map((item) => (item.id === page.id ? { ...item, ...value } : item)),
        }))
      if (type === 'add-page') {
        const id = crypto.randomUUID()
        model.change((site) => ({
          ...site,
          pages: [
            ...site.pages,
            {
              id,
              title: `Nieuwe pagina ${site.pages.length}`,
              slug: `pagina-${id.slice(0, 8)}`,
              sections: [],
            },
          ],
        }))
        setPageId(id)
        setSelected(null)
        return
      }
      if (type === 'create-project-page') {
        const next = createProjectPage(value)
        model.change((site) => {
          const linked = updateBlock(site, page.id, block.id, {
            items: block.items.map((item) =>
              item.id === value.id ? { ...item, pageId: next.id } : item
            ),
          })
          return { ...linked, pages: [...linked.pages, next] }
        })
        setPageId(next.id)
        setSelected(next.sections[0].id)
        return
      }
      if (type === 'duplicate-page') {
        const id = crypto.randomUUID()
        model.change((site) => ({
          ...site,
          pages: [
            ...site.pages,
            {
              ...structuredClone(page),
              id,
              title: `${page.title} kopie`,
              slug: `pagina-${id.slice(0, 8)}`,
              sections: page.sections.map(cloneBlock),
            },
          ],
        }))
        setPageId(id)
        setSelected(null)
        return
      }
      if (type === 'delete-page') {
        if (page.slug === '') throw new Error('De homepage kan niet worden verwijderd.')
        setDialog({
          type: 'confirm-page',
          title: `Pagina “${page.title}” verwijderen?`,
          text: 'Bijbehorende menulinks worden ook verwijderd. Dit kun je ongedaan maken.',
        })
        return
      }
      if (type === 'confirm-page') {
        model.change((site) => removePage(site, page.id))
        setPageId(model.site.pages[0].id)
        setSelected(null)
        return
      }
      if (type === 'duplicate-block' && block) {
        const next = { ...cloneBlock(block), label: `${block.label} kopie` }
        const source = locateBlock(page.sections, block.id)
        model.change((site) => ({
          ...site,
          pages: site.pages.map((item) =>
            item.id === page.id
              ? {
                  ...item,
                  sections: insertBlock(item.sections, next, source.parentId, source.index + 1),
                }
              : item
          ),
        }))
        setSelected(next.id)
        return
      }
      if (type === 'delete-block' && block) {
        model.change((site) => ({
          ...site,
          pages: site.pages.map((item) =>
            item.id === page.id
              ? {
                  ...item,
                  sections: mapBlocks(item.sections, (entry) =>
                    entry.id === block.id ? null : entry
                  ),
                }
              : item
          ),
        }))
        setSelected(null)
        return
      }
      if (type === 'export') {
        const url = URL.createObjectURL(
          new Blob([JSON.stringify(model.site, null, 2)], { type: 'application/json' })
        )
        const link = document.createElement('a')
        link.href = url
        link.download = `aidan-website-${new Date().toISOString().slice(0, 10)}.json`
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        return
      }
      if (type === 'import' && value) {
        if (value.size > 8 * 1024 * 1024) throw new Error('Het importbestand is te groot.')
        const site = validateSite(JSON.parse(await value.text()))
        setDialog({
          type: 'confirm-import',
          site,
          title: 'Dit ontwerp importeren?',
          text: 'Vervangt het huidige concept. De live website verandert pas na publiceren.',
        })
        return
      }
      if (type === 'confirm-import') {
        model.change(value)
        setPageId(value.pages[0].id)
        setSelected(null)
        return
      }
      if (['empty', 'template'].includes(type)) {
        setDialog({
          type: `confirm-${type}`,
          title:
            type === 'empty' ? 'Beginnen met een leeg canvas?' : 'Filmisch startontwerp laden?',
          text: 'Dit vervangt je concept. Je kunt de stap ongedaan maken.',
        })
        return
      }
      if (type === 'confirm-empty') {
        const site = {
          ...structuredClone(initialSite),
          navigation: [],
          pages: [{ id: 'home', title: 'Home', slug: '', sections: [] }],
        }
        model.change(site)
        setPageId('home')
        setSelected(null)
        setTab('blocks')
        return
      }
      if (type === 'confirm-template') {
        model.change(structuredClone(initialSite))
        setPageId('home')
        setSelected('intro')
        return
      }
      if (type === 'restore') {
        setDialog({
          type: 'confirm-restore',
          title: 'Vorige publicatie terugzetten?',
          text: 'Dit verandert de hoofdwebsite. Het huidige concept blijft bewaard.',
        })
        return
      }
      if (type === 'confirm-restore') {
        setBusy(true)
        const previous = await loadDocument('previous')
        if (!previous?.site) throw new Error('Er is nog geen vorige publicatie.')
        await publishDocument(previous.site)
        setNotice('Vorige publicatie is teruggezet.')
        return
      }
    } catch (reason) {
      model.setError(reason.message)
    } finally {
      setBusy(false)
    }
  }

  if (!model.ready)
    return (
      <main className="entry">
        <span className="eyebrow">AIDAN / STUDIO</span>
        <h1>{model.error ? 'Nog even aansluiten.' : 'Je werkruimte openen…'}</h1>
        <p role={model.error ? 'alert' : 'status'}>
          {model.error || 'Je concept wordt veilig geladen.'}
        </p>
        {account && (
          <p className="account-reference">
            Ingelogd als {account.email}
            <br />
            Gebruikers-ID: <code>{account.uid}</code>
          </p>
        )}
        {model.error && (
          <>
            <p>
              Controleer de Firestore-regels en het beheerdersdocument. De stappen staan in
              README.md.
            </p>
            <button className="primary" onClick={() => location.reload()}>
              Opnieuw proberen
            </button>
            {['localhost', '127.0.0.1'].includes(location.hostname) && (
              <a href="/studio?demo=1">Lokale proef openen →</a>
            )}
            {account && <button onClick={onLogout}>Uitloggen</button>}
          </>
        )}
      </main>
    )

  return (
    <div className={`studio ${preview ? 'preview-mode' : ''}`}>
      <Toolbar
        model={model}
        page={page}
        preview={preview}
        setPreview={setPreview}
        device={device}
        setDevice={setDevice}
        action={action}
        busy={busy}
      />
      <div className="studio-body">
        {!preview && (
          <ResizablePanel side="left">
            <Sidebar
              tab={tab}
              setTab={setTab}
              site={model.site}
              page={page}
              selected={selected}
              setSelected={setSelected}
              setPageId={setPageId}
              action={action}
              model={model}
              onLogout={account ? onLogout : null}
            />
          </ResizablePanel>
        )}
        <main className="workspace">
          <div className="workspace-top">
            <div>
              <span className="workspace-dot" />
              {page.title}
              <span className="workspace-breadcrumb">/ {preview ? 'Voorbeeld' : 'Canvas'}</span>
            </div>
            <div>
              {device === 'mobile' ? (
                <span>390 px</span>
              ) : (
                <label className="viewport-control">
                  <input
                    aria-label="Desktopvoorbeeldbreedte"
                    type="number"
                    min="240"
                    placeholder="Auto"
                    value={desktopWidth || ''}
                    onChange={(event) => setDesktopWidth(Math.max(0, Number(event.target.value)))}
                  />
                  px
                </label>
              )}
              <button
                className="icon-button"
                title="Animaties opnieuw afspelen"
                aria-label="Animaties opnieuw afspelen"
                onClick={() => {
                  setReplay(replay + 1)
                  setPreview(true)
                }}
              >
                <RotateCcw size={12} />
              </button>
              <a
                className="icon-button"
                href="/"
                target="_blank"
                rel="noreferrer"
                aria-label="Hoofdwebsite openen"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
          <div className={`canvas-surround device-${device}`}>
            <div className="canvas-address">
              <span />
              <span />
              <span />
              <span className="canvas-url">
                {model.site.name.toLowerCase().replaceAll(' ', '')}.portfolio / {page.slug}
              </span>
              <span className="canvas-lock">{preview ? 'Voorbeeld' : 'Concept'}</span>
            </div>
            <Canvas
              viewportWidth={device === 'mobile' ? 390 : desktopWidth}
              site={model.site}
              pageId={page.id}
              selected={selected}
              editing={!preview}
              onSelect={setSelected}
              onEdit={editBlock}
              onNavigate={(id) => {
                setPageId(id)
                setSelected(null)
              }}
              replay={replay}
            />
          </div>
          {!preview && (
            <button className="canvas-add" onClick={() => setTab('blocks')}>
              <Plus size={13} />
              Bouwsteen toevoegen
            </button>
          )}
          <div className="workspace-foot">
            <span>
              <MousePointer2 size={11} />
              {preview
                ? 'Bekijk je ontwerp zoals een bezoeker.'
                : 'Klik op een element om het te bewerken.'}
            </span>
            <span>
              <Monitor size={11} />
              {device === 'mobile' ? 'Mobiel' : 'Desktop'}
              <span className="foot-dot">·</span>Passend
            </span>
          </div>
        </main>
        {!preview && (
          <ResizablePanel side="right">
            <PropertiesPanel
              pages={model.site.pages}
              site={model.site}
              block={block}
              update={(patch) => editBlock(block.id, patch)}
              action={action}
              device={device}
              replay={() => {
                setReplay(replay + 1)
                setPreview(true)
              }}
            />
          </ResizablePanel>
        )}
      </div>
      <footer className="studio-status">
        <span>
          <span className="status-dot" />
          Alle ruimte voor jouw verhaal.
        </span>
        <span>
          {firebaseReady ? 'Verbonden met Firebase' : 'Lokale proef · geen cloudpublicatie'}
          <ArrowDownLeft size={11} />
        </span>
      </footer>
      {(notice || model.error) && (
        <div
          role={model.error ? 'alert' : 'status'}
          className={`toast ${model.error ? 'error' : ''}`}
        >
          <span>{model.error || notice}</span>
          <button
            aria-label="Melding sluiten"
            onClick={() => {
              setNotice('')
              model.setError('')
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}
      {dialog && (
        <div className="dialog-overlay">
          <section
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <span className="eyebrow">EVEN CONTROLEREN</span>
            <h2 id="dialog-title">{dialog.title}</h2>
            <p>{dialog.text}</p>
            <div>
              <button autoFocus className="button secondary" onClick={() => setDialog(null)}>
                Annuleren
              </button>
              <button
                className="button publish-button"
                onClick={() => {
                  action(dialog.type, dialog.site)
                  setDialog(null)
                }}
              >
                Doorgaan →
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
