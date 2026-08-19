import { useState } from 'react'

type IconName =
  | 'archive'
  | 'arrow-up-right'
  | 'bell'
  | 'book'
  | 'chevron-down'
  | 'chevron-right'
  | 'circle-check'
  | 'clock'
  | 'copy'
  | 'file'
  | 'folder'
  | 'folder-open'
  | 'git'
  | 'link'
  | 'lock'
  | 'menu'
  | 'more'
  | 'panel-right'
  | 'plus'
  | 'search'
  | 'sparkles'
  | 'square-arrow-out-up-right'
  | 'sun'
  | 'text'
  | 'x'

function Icon({ name, size = 16 }: { name: IconName; size?: number }): React.JSX.Element {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true
  }
  const paths: Record<IconName, React.ReactNode> = {
    archive: (
      <>
        <path d="M3 7h18" />
        <path d="M5 7l1 13h12l1-13" />
        <path d="M9 11h6" />
        <path d="M4 4h16v3H4z" />
      </>
    ),
    'arrow-up-right': (
      <>
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" />
        <path d="M4 5.5V22" />
        <path d="M8 7h8M8 11h6" />
      </>
    ),
    'chevron-down': <path d="m6 9 6 6 6-6" />,
    'chevron-right': <path d="m9 6 6 6-6 6" />,
    'circle-check': (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),
    file: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h4" />
      </>
    ),
    folder: (
      <>
        <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h5l2 2H19.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
      </>
    ),
    'folder-open': (
      <>
        <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h5l2 2H20a1 1 0 0 1 .95 1.32l-2.2 7A2.35 2.35 0 0 1 16.5 19H4.6a1.6 1.6 0 0 1-1.53-2.08z" />
        <path d="M3.5 17h14" />
      </>
    ),
    git: (
      <>
        <circle cx="7" cy="7" r="2" />
        <circle cx="17" cy="17" r="2" />
        <path d="m8.5 8.5 7 7" />
        <path d="M7 9v6a2 2 0 0 0 2 2h6" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.14 1.14" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.14-1.14" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
      </>
    ),
    'panel-right': (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M16 4v16" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3-1.2 4.3L7 8.5l3.8 1.2L12 14l1.2-4.3L17 8.5l-3.8-1.2z" />
        <path d="m19 14-.7 2.3L16 17l2.3.7L19 20l.7-2.3L22 17l-2.3-.7z" />
        <path d="m5 14-.6 1.9L2.5 16.5l1.9.6L5 19l.6-1.9 1.9-.6-1.9-.6z" />
      </>
    ),
    'square-arrow-out-up-right': (
      <>
        <path d="M14 5h5v5" />
        <path d="m19 5-8 8" />
        <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.4 1.4M17.67 17.67l1.4 1.4M2 12h2M20 12h2M4.93 19.07l1.4-1.4M17.67 6.33l1.4-1.4" />
      </>
    ),
    text: (
      <>
        <path d="M5 5h14M12 5v14M8 19h8" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    )
  }
  return <svg {...common}>{paths[name]}</svg>
}

const files = [
  { name: 'product-brief.md', label: 'Product brief', icon: 'file' as IconName },
  { name: 'roadmap.md', label: 'Roadmap', icon: 'file' as IconName },
  { name: 'technical-architecture.md', label: 'Technical architecture', icon: 'file' as IconName }
]

export function App(): React.JSX.Element {
  const [selectedFile, setSelectedFile] = useState('product-brief.md')
  const [inspectorTab, setInspectorTab] = useState<'context' | 'agent'>('context')
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const activeFile = files.find((file) => file.name === selectedFile) ?? files[0]

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <button className="icon-button mobile-menu" aria-label="Open navigation">
            <Icon name="menu" />
          </button>
          <div className="brand-mark" aria-hidden="true">
            <span>C</span>
          </div>
          <span className="brand-name">Cortex</span>
          <span className="topbar-divider" />
          <button className="workspace-crumb" aria-label="Switch workspace">
            <span className="workspace-dot" />
            <span>Personal workspace</span>
            <Icon name="chevron-down" size={13} />
          </button>
        </div>
        <div className="topbar-actions">
          <button className="command-search">
            <Icon name="search" size={15} />
            <span>Search workspace</span>
            <kbd>⌘ K</kbd>
          </button>
          <button className="icon-button" aria-label="Notifications">
            <Icon name="bell" />
          </button>
          <button className="avatar" aria-label="Open profile">
            HT
          </button>
        </div>
      </header>

      <div className="workspace-layout">
        <aside className="sidebar">
          <div className="sidebar-scroll">
            <div className="sidebar-heading-row">
              <span className="sidebar-label">Workspace</span>
              <button className="icon-button small" aria-label="Workspace options">
                <Icon name="more" size={15} />
              </button>
            </div>
            <button className="workspace-switcher">
              <span className="folder-icon">
                <Icon name="folder-open" size={17} />
              </span>
              <span className="workspace-switcher-copy">
                <strong>Cortex</strong>
                <small>~/Desktop/Cortex</small>
              </span>
              <Icon name="chevron-down" size={14} />
            </button>
            <nav className="primary-nav" aria-label="Workspace navigation">
              <button className="nav-item">
                <Icon name="archive" />
                <span>Inbox</span>
                <span className="nav-count">3</span>
              </button>
              <button className="nav-item">
                <Icon name="clock" />
                <span>Recent</span>
              </button>
              <button className="nav-item">
                <Icon name="book" />
                <span>All documents</span>
              </button>
            </nav>
            <div className="tree-section">
              <div className="tree-heading">
                <span className="sidebar-label">Projects</span>
                <button className="icon-button small" aria-label="Create project">
                  <Icon name="plus" size={15} />
                </button>
              </div>
              <button className="tree-item project-item active">
                <Icon name="chevron-down" size={13} />
                <span className="tree-folder">
                  <Icon name="folder-open" size={15} />
                </span>
                <span>Cortex</span>
              </button>
              <div className="tree-children">
                {files.map((file) => (
                  <button
                    key={file.name}
                    className={`tree-item file-item ${selectedFile === file.name ? 'selected' : ''}`}
                    onClick={() => setSelectedFile(file.name)}
                  >
                    <Icon name={file.icon} size={15} />
                    <span>{file.label}</span>
                  </button>
                ))}
                <button className="tree-item file-item muted">
                  <Icon name="folder" size={15} />
                  <span>research</span>
                  <Icon name="chevron-right" size={12} />
                </button>
              </div>
              <button className="tree-item project-item">
                <Icon name="chevron-right" size={13} />
                <span className="tree-folder">
                  <Icon name="folder" size={15} />
                </span>
                <span>Writing</span>
              </button>
              <button className="tree-item project-item">
                <Icon name="chevron-right" size={13} />
                <span className="tree-folder">
                  <Icon name="folder" size={15} />
                </span>
                <span>Resume</span>
              </button>
            </div>
          </div>
          <div className="sidebar-bottom">
            <div className="sync-status">
              <span className="sync-dot" />
              <span>All changes saved</span>
              <Icon name="git" size={14} />
            </div>
            <button className="nav-item settings-item">
              <Icon name="sun" />
              <span>Appearance</span>
            </button>
          </div>
        </aside>

        <main className="main-area">
          <div className="document-tabs">
            <div className="tab active">
              <Icon name="file" size={14} />
              <span>{activeFile.name}</span>
              <button className="tab-close" aria-label="Close document">
                <Icon name="x" size={13} />
              </button>
            </div>
            <button className="new-tab" aria-label="New tab">
              <Icon name="plus" size={15} />
            </button>
            <div className="tab-spacer" />
            <button
              className="icon-button small"
              onClick={() => setIsAssistantOpen((open) => !open)}
              aria-label="Toggle inspector"
            >
              <Icon name="panel-right" size={16} />
            </button>
            <button className="icon-button small" aria-label="More document actions">
              <Icon name="more" size={16} />
            </button>
          </div>
          <div className="editor-toolbar">
            <div className="editor-breadcrumb">
              <span>Projects</span>
              <Icon name="chevron-right" size={12} />
              <span>Cortex</span>
              <Icon name="chevron-right" size={12} />
              <strong>{activeFile.label}</strong>
            </div>
            <div className="editor-actions">
              <span className="saved-indicator">
                <Icon name="circle-check" size={14} /> Saved
              </span>
              <button className="toolbar-button">
                <Icon name="square-arrow-out-up-right" size={14} /> Open file
              </button>
              <button
                className="toolbar-button primary"
                onClick={() => {
                  setInspectorTab('agent')
                  setIsAssistantOpen(true)
                }}
              >
                <Icon name="sparkles" size={14} /> Ask Cortex
              </button>
            </div>
          </div>
          <article className="editor-canvas">
            <div className="document-meta">
              <span className="doc-type">
                <Icon name="text" size={13} /> Markdown
              </span>
              <span>Edited 8 minutes ago</span>
              <span className="meta-separator">·</span>
              <span>1,248 words</span>
            </div>
            <p className="document-kicker">Product / Foundations</p>
            <h1>{activeFile.label}</h1>
            {selectedFile === 'product-brief.md' ? (
              <>
                <p className="document-lede">
                  An editor-first, AI-native knowledge workspace where useful thinking becomes
                  durable project knowledge.
                </p>
                <blockquote>
                  Write with an agent, preserve what matters, and make future work better because
                  the workspace remembers.
                </blockquote>
                <section className="document-section">
                  <div className="section-marker">01</div>
                  <div>
                    <h2>The product thesis</h2>
                    <p>
                      Cortex is a calm writing environment with a general AI collaborator that
                      understands a scoped workspace, researches, creates artifacts, proposes
                      changes, and preserves the result as editable knowledge.
                    </p>
                    <p>
                      The editor should remain useful without AI. The AI makes the editor and
                      knowledge base substantially more capable.
                    </p>
                  </div>
                </section>
                <section className="document-section loop-section">
                  <div className="section-marker">02</div>
                  <div>
                    <h2>The core loop</h2>
                    <div className="core-loop">
                      <span>Write or converse</span>
                      <Icon name="arrow-up-right" size={14} />
                      <span>Understand scope</span>
                      <Icon name="arrow-up-right" size={14} />
                      <span>Review proposals</span>
                      <Icon name="arrow-up-right" size={14} />
                      <span>Preserve knowledge</span>
                    </div>
                    <p className="section-note">
                      Conversations are where ideas develop; documents are where understanding
                      compounds.
                    </p>
                  </div>
                </section>
              </>
            ) : (
              <>
                <p className="document-lede">
                  A living view of the decisions, experiments, and next steps shaping the Cortex
                  workspace.
                </p>
                <section className="document-section">
                  <div className="section-marker">01</div>
                  <div>
                    <h2>Coming into focus</h2>
                    <p>
                      This document is ready to become part of the shared context. Ask Cortex to
                      summarize open questions, turn notes into milestones, or propose the next
                      revision.
                    </p>
                  </div>
                </section>
              </>
            )}
            <div className="editor-caret" aria-hidden="true" />
          </article>
          <div className="composer-wrap">
            <div className="composer">
              <button className="composer-icon" aria-label="Add context">
                <Icon name="plus" size={17} />
              </button>
              <span>Ask Cortex to help with this document…</span>
              <button className="send-button" aria-label="Send prompt">
                <Icon name="arrow-up-right" size={16} />
              </button>
            </div>
            <div className="composer-hint">
              <span>
                <Icon name="lock" size={12} /> Scoped to {activeFile.label}
              </span>
              <span>⌘ ↵ to send</span>
            </div>
          </div>
        </main>

        {isAssistantOpen && (
          <div className="mobile-inspector-backdrop" onClick={() => setIsAssistantOpen(false)} />
        )}
        <aside className={`inspector ${isAssistantOpen ? 'mobile-open' : ''}`}>
          <div className="inspector-header">
            <div>
              <span className="eyebrow">Workspace context</span>
              <h2>Cortex agent</h2>
            </div>
            <button
              className="icon-button small inspector-close"
              onClick={() => setIsAssistantOpen(false)}
              aria-label="Close inspector"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
          <div className="inspector-tabs">
            <button
              className={inspectorTab === 'context' ? 'active' : ''}
              onClick={() => setInspectorTab('context')}
            >
              Context
            </button>
            <button
              className={inspectorTab === 'agent' ? 'active' : ''}
              onClick={() => setInspectorTab('agent')}
            >
              Assistant
            </button>
          </div>
          {inspectorTab === 'context' ? (
            <div className="inspector-body">
              <div className="agent-status">
                <span className="agent-orb">
                  <Icon name="sparkles" size={17} />
                </span>
                <div>
                  <strong>Ready to collaborate</strong>
                  <span>Understands this project</span>
                </div>
                <span className="online-dot" />
              </div>
              <div className="inspector-block">
                <div className="block-heading">
                  <span>Current document</span>
                  <button className="icon-button small" aria-label="Document options">
                    <Icon name="more" size={14} />
                  </button>
                </div>
                <div className="context-document">
                  <span className="doc-icon">
                    <Icon name="file" size={16} />
                  </span>
                  <div>
                    <strong>{activeFile.name}</strong>
                    <small>Canonical knowledge</small>
                  </div>
                </div>
              </div>
              <div className="inspector-block">
                <div className="block-heading">
                  <span>Suggested next steps</span>
                  <span className="suggestion-count">2</span>
                </div>
                <button className="suggestion">
                  <span className="suggestion-icon">
                    <Icon name="sparkles" size={14} />
                  </span>
                  <span>
                    <strong>Find open questions</strong>
                    <small>Surface decisions that need an owner</small>
                  </span>
                  <Icon name="chevron-right" size={14} />
                </button>
                <button className="suggestion">
                  <span className="suggestion-icon">
                    <Icon name="link" size={14} />
                  </span>
                  <span>
                    <strong>Connect related notes</strong>
                    <small>Look for relevant project context</small>
                  </span>
                  <Icon name="chevron-right" size={14} />
                </button>
              </div>
              <div className="inspector-block">
                <div className="block-heading">
                  <span>Included context</span>
                  <button className="text-button">Edit</button>
                </div>
                <div className="context-list">
                  <div>
                    <span className="context-dot amber" />
                    <span>This document</span>
                    <small>Always</small>
                  </div>
                  <div>
                    <span className="context-dot blue" />
                    <span>Cortex project</span>
                    <small>12 files</small>
                  </div>
                  <div>
                    <span className="context-dot purple" />
                    <span>Recent activity</span>
                    <small>7 items</small>
                  </div>
                </div>
              </div>
              <button className="manage-context">
                <Icon name="panel-right" size={15} /> Manage context{' '}
                <Icon name="arrow-up-right" size={13} />
              </button>
            </div>
          ) : (
            <div className="assistant-panel">
              <div className="assistant-message">
                <span className="agent-orb small-orb">
                  <Icon name="sparkles" size={14} />
                </span>
                <div>
                  <strong>What should we work on?</strong>
                  <p>
                    I can critique this brief, research a missing piece, or propose a change for
                    your review.
                  </p>
                </div>
              </div>
              <div className="assistant-suggestions">
                <button onClick={() => setInspectorTab('context')}>
                  <Icon name="sparkles" size={14} /> Critique this brief
                </button>
                <button onClick={() => setInspectorTab('context')}>
                  <Icon name="link" size={14} /> Find related notes
                </button>
                <button onClick={() => setInspectorTab('context')}>
                  <Icon name="copy" size={14} /> Summarize the core loop
                </button>
              </div>
              <div className="assistant-input">
                <span>Message Cortex…</span>
                <button aria-label="Send message">
                  <Icon name="arrow-up-right" size={15} />
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
      <footer className="statusbar">
        <div className="status-left">
          <span className="status-live">
            <span />
            Local workspace
          </span>
          <span>main</span>
          <span>
            <Icon name="git" size={12} /> No pending changes
          </span>
        </div>
        <div className="status-right">
          <span>Markdown</span>
          <span>UTF-8</span>
          <span>Ln 12, Col 1</span>
        </div>
      </footer>
    </div>
  )
}
