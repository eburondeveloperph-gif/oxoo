import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Download, Save, RotateCcw, Pencil, History, 
  Search, ZoomIn, ZoomOut, Maximize, FileCode, FileJson, 
  Table as TableIcon, FileBarChart, ExternalLink, Printer,
  Maximize2, Minimize2
} from 'lucide-react';
import { useUI } from '../lib/state';
import ReactMarkdown from 'react-markdown';

interface DocumentWorkspaceProps {
  artifact: {
    title: string;
    type: string;
    content: string;
    language?: string;
  };
}

export function DocumentWorkspace({ artifact }: DocumentWorkspaceProps) {
  const [zoom, setZoom] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const setActiveWorkspaceResult = useUI((state) => state.setActiveWorkspaceResult);
  const isWorkspaceFullScreen = useUI((state) => state.isWorkspaceFullScreen);
  const setIsWorkspaceFullScreen = useUI((state) => state.setIsWorkspaceFullScreen);

  const handleDownload = () => {
    // Basic download logic for string content
    const blob = new Blob([artifact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = artifact.title || 'document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      if (artifact.type === 'html') {
        printWindow.document.write(artifact.content);
      } else {
        printWindow.document.write(`<pre>${artifact.content}</pre>`);
      }
      printWindow.document.close();
      printWindow.print();
    }
  };

  const renderPreview = () => {
    const zoomStyle = { transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s' };

    switch (artifact.type) {
      case 'csv':
      case 'table':
        return (
          <div style={{ width: '100%', height: '100%', overflow: 'auto', padding: '20px', backgroundColor: '#fff' }}>
             <table className="min-w-full border-collapse" style={{ color: '#000' }}>
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-100">Column 1</th>
                    <th className="border p-2 bg-gray-100">Column 2</th>
                    <th className="border p-2 bg-gray-100">Column 3</th>
                  </tr>
                </thead>
                <tbody>
                  {artifact.content.split('\n').map((row, i) => (
                    <tr key={i}>
                      {row.split(',').map((cell, j) => (
                        <td key={j} className="border p-2">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        );
      case 'ppt':
      case 'slide':
        return (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: '#333' }}>
             <div className="shadow-2xl" style={{ width: '800px', height: '450px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', ...zoomStyle }}>
                <div style={{ flex: 1, padding: '40px', color: '#000' }}>
                   <h1 style={{ fontSize: '32px' }}>{artifact.title}</h1>
                   <div style={{ marginTop: '20px' }}>{artifact.content}</div>
                </div>
                <div style={{ height: '40px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', color: '#666', fontSize: '12px' }}>
                   <span>Slide 1 of 1</span>
                   <span>Eburon Presentation</span>
                </div>
             </div>
          </div>
        );
      case 'html':
        return (
          <div className="preview-canvas-container" style={{ width: '100%', height: '100%', overflow: 'auto', backgroundColor: '#525659', display: 'flex', justifyContent: 'center', padding: '40px' }}>
             <div className="a4-page shadow-2xl" style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#fff', border: '1px solid #ddd', padding: '20mm', boxSizing: 'border-box', ...zoomStyle }}>
               <iframe 
                srcDoc={artifact.content} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                title="HTML Document"
               />
             </div>
          </div>
        );
      case 'markdown':
        return (
          <div className="preview-canvas-container" style={{ width: '100%', height: '100%', overflow: 'auto', backgroundColor: '#525659', display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="a4-page shadow-2xl" style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#fff', color: '#000', padding: '20mm', boxSizing: 'border-box', ...zoomStyle }}>
               <div className="markdown-body">
                 <ReactMarkdown>{artifact.content}</ReactMarkdown>
               </div>
            </div>
          </div>
        );
      case 'chart':
        return (
           <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ width: '100%', maxWidth: '800px', height: '500px', backgroundColor: '#fff', borderRadius: '12px', padding: '24px', color: '#000', boxSizing: 'border-box', ...zoomStyle }}>
                 <h3>{artifact.title}</h3>
                 <div style={{ marginTop: '20px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc' }}>
                   Chart Rendering Context: {artifact.content.substring(0, 100)}...
                 </div>
              </div>
           </div>
        );
      case 'json':
        return (
          <div style={{ width: '100%', height: '100%', padding: '20px', backgroundColor: '#1e1e1e', overflow: 'auto' }}>
            <pre style={{ color: '#d4d4d4', fontSize: '13px', fontFamily: 'var(--font-mono)', ...zoomStyle }}>
              {artifact.content}
            </pre>
          </div>
        );
      default:
        return (
          <div style={{ width: '100%', height: '100%', overflowY: 'auto', padding: '24px', color: '#fff' }}>
             <pre style={{ whiteSpace: 'pre-wrap', ...zoomStyle }}>{artifact.content}</pre>
          </div>
        );
    }
  };

  const getIcon = () => {
    switch (artifact.type) {
        case 'html': return <FileText size={20} color="#60a5fa" />;
        case 'markdown': return <FileCode size={20} color="#34d399" />;
        case 'json': return <FileJson size={20} color="#facc15" />;
        case 'chart': return <FileBarChart size={20} color="#f87171" />;
        default: return <FileText size={20} color="#9ca3af" />;
    }
  };

  return (
    <div className="document-workspace" style={{ 
      display: 'flex', 
      width: '100%', 
      height: '100%', 
      backgroundColor: '#111', 
      color: '#fff', 
      flexDirection: 'row', 
      flexWrap: 'nowrap',
      position: 'relative'
    }}>
      {/* Left Panel: Metadata & Controls */}
      <motion.div 
        initial={false}
        animate={{ width: isSidebarCollapsed ? '0px' : '260px', opacity: isSidebarCollapsed ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="metadata-panel" 
        style={{ 
          minWidth: isSidebarCollapsed ? '0px' : '220px',
          borderRight: isSidebarCollapsed ? 'none' : '1px solid #333', 
          padding: isSidebarCollapsed ? '0px' : '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          backgroundColor: '#0a0a0a',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {getIcon()}
          <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{artifact.title}</h2>
        </div>
        
        <div className="meta-info" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', color: '#888' }}>
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</span>
                <div style={{ color: '#eee', marginTop: '2px', fontWeight: 500 }}>{artifact.type.toUpperCase()}</div>
            </div>
            <div style={{ fontSize: '11px', color: '#888' }}>
                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
                <div style={{ color: '#34d399', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#34d399' }} />
                   Ready
                </div>
            </div>
        </div>

        <div className="action-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '8px', marginTop: '6px' }}>
          <button onClick={handleDownload} className="workspace-btn"><Download size={14} /> Download</button>
          <button onClick={() => {}} className="workspace-btn"><Save size={14} /> Drive</button>
          <button onClick={handlePrint} className="workspace-btn"><Printer size={14} /> Print</button>
          <button onClick={() => {}} className="workspace-btn"><RotateCcw size={14} /> Regenerate</button>
        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: '16px' }}>
           <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <History size={12} /> History
           </div>
           <div className="version-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="version-item active" style={{ padding: '6px 8px' }}>Current <span className="timestamp">Now</span></div>
              <div className="version-item" style={{ padding: '6px 8px' }}>Draft <span className="timestamp">2m ago</span></div>
           </div>
        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: '16px' }}>
           <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
             <Pencil size={12} /> Refine
           </div>
           <textarea 
             placeholder="How should I change this?"
             style={{ width: '100%', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', padding: '8px', color: '#fff', fontSize: '12px', minHeight: '60px', resize: 'none' }}
           />
           <button 
             className="workspace-btn" 
             style={{ width: '100%', marginTop: '8px', justifyContent: 'center', backgroundColor: 'rgba(203,251,69,0.1)', color: '#cbfb45', border: '1px solid rgba(203,251,69,0.2)' }}
             onClick={() => {
                // In a real app, this would send to Beatrice
                alert("Refinement request sent to Beatrice!");
             }}
           >
             Update Document
           </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <button 
                onClick={() => { setActiveWorkspaceResult(null); setIsWorkspaceFullScreen(false); }}
                style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #333', borderRadius: '6px', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px' }}
            >
                Close Editor
            </button>
        </div>
      </motion.div>

      {/* Right Panel: Preview Area */}
      <div className="preview-panel" style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Toggle Sidebar Button (Floating when collapsed) */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 50,
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            color: '#888',
            width: '24px',
            height: '48px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: isSidebarCollapsed ? 0.8 : 0,
            transition: 'opacity 0.2s'
          }}
          className="hover:opacity-100"
        >
           {isSidebarCollapsed ? <ExternalLink size={14} style={{ transform: 'rotate(180deg)' }} /> : null}
        </button>

        {/* Toolbar */}
        <div className="preview-toolbar" style={{ height: '40px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', padding: '0 12px', justifyContent: 'space-between' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="toolbar-btn"
                style={{ color: isSidebarCollapsed ? '#888' : 'var(--accent-active)' }}
              >
                <div style={{ transform: isSidebarCollapsed ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s' }}>
                  <ExternalLink size={14} />
                </div>
              </button>
              <div className="toolbar-divider" />
              <div className="toolbar-group">
                <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))} className="toolbar-btn" style={{ padding: '4px 6px' }}><ZoomOut size={14} /></button>
                <div className="zoom-level" style={{ fontSize: '11px', minWidth: '32px' }}>{Math.round(zoom * 100)}%</div>
                <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="toolbar-btn" style={{ padding: '4px 6px' }}><ZoomIn size={14} /></button>
              </div>
              <div className="toolbar-divider" />
              <button onClick={() => setZoom(0.6)} className="toolbar-btn" style={{ padding: '4px 8px', fontSize: '12px' }}><Maximize size={14} /> Fit</button>
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setIsWorkspaceFullScreen(!isWorkspaceFullScreen)}
                className="toolbar-btn" 
                style={{ 
                  color: isWorkspaceFullScreen ? '#cbfb45' : '#888', 
                  backgroundColor: isWorkspaceFullScreen ? 'rgba(203,251,69,0.1)' : 'transparent',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  border: isWorkspaceFullScreen ? '1px solid rgba(203,251,69,0.3)' : '1px solid transparent'
                }}
              >
                {isWorkspaceFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                {isWorkspaceFullScreen ? "Exit Fullscreen" : "Full Screen Preview"}
              </button>
           </div>
        </div>

        {/* Canvas */}
        <div className="preview-canvas" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {renderPreview()}
        </div>
      </div>

      <style>{`
        .workspace-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background-color: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          color: #eee;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .workspace-btn:hover {
          background-color: #222;
          border-color: #444;
        }
        .toolbar-group {
          display: flex;
          align-items: center;
          background-color: #222;
          border-radius: 6px;
          padding: 2px;
        }
        .toolbar-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 6px 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          border-radius: 4px;
        }
        .toolbar-btn:hover {
          color: #fff;
          background-color: #333;
        }
        .zoom-level {
          font-size: 12px;
          color: #bbb;
          min-width: 40px;
          text-align: center;
          font-family: var(--font-mono);
        }
        .toolbar-divider {
          width: 1px;
          height: 20px;
          background-color: #333;
        }
        .version-item {
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          color: #888;
          display: flex;
          justify-content: space-between;
          border: 1px solid transparent;
        }
        .version-item:hover {
          background-color: #1a1a1a;
        }
        .version-item.active {
          background-color: #1a1a1a;
          border-color: #333;
          color: #eee;
        }
        .version-item .timestamp {
          font-size: 11px;
          color: #555;
        }
        .a4-page {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
