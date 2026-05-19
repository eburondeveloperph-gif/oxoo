import React, { useState, useEffect } from 'react';
import { MessageSquare, QrCode, User, Check, RefreshCw, UploadCloud, Activity } from 'lucide-react';
import { connectWhatsapp, syncChatwoot, getChatwootStatus } from '../lib/api-client';

export function WhatsAppIntegrationPanel() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchConnection = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await connectWhatsapp();
      setData(res);
      await fetchSyncStatus();
    } catch (e: any) {
      setError(e.message || 'Failed to connect to GoWA');
    } finally {
      setLoading(false);
    }
  };

  const fetchSyncStatus = async () => {
    try {
      const res = await getChatwootStatus();
      setSyncStatus(res);
      if (res?.results?.status === 'running') {
        setTimeout(fetchSyncStatus, 5000);
      }
    } catch (e) {
      console.error('Failed to get sync status', e);
    }
  };

  const handleSyncChatwoot = async () => {
    try {
      setSyncing(true);
      await syncChatwoot(7, true, true);
      alert('Sync initiated. Depending on the amount of history, it might take a few moments.');
      await fetchSyncStatus();
    } catch (e: any) {
      alert(`Failed to sync to Chatwoot: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', margin: '20px' }}>
          <MessageSquare size={48} color="#075e54" style={{ margin: '0 auto', opacity: 0.5, animation: 'pulse-anim 2s infinite' }} />
          <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Connecting to WhatsApp node...</p>
        </div>
      ) : error ? (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fee2e2', margin: '20px', borderRadius: '12px' }}>
          <p style={{ color: '#b91c1c' }}>{error}</p>
          <button onClick={fetchConnection} style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>Retry</button>
        </div>
      ) : data?.data?.qr ? (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#e0f2f1', margin: '20px', borderRadius: '12px' }}>
          <img src={data.data.qr} alt="WhatsApp QR Code" style={{ width: '200px', height: '200px', margin: '0 auto', borderRadius: '8px' }} />
          <h3 style={{ color: '#075e54', marginTop: '16px' }}>Link Eburon to WhatsApp</h3>
          <p style={{ color: '#000', opacity: 0.7, marginTop: '8px' }}>Open WhatsApp on your phone, go to Linked Devices, and scan this code.</p>
          <button onClick={fetchConnection} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#075e54', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 'bold', margin: '16px auto 0' }}>
            <RefreshCw size={16} /> Refresh QR
          </button>
        </div>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#e0f2f1', margin: '20px', borderRadius: '12px' }}>
          <Check size={80} color="#25d366" style={{ margin: '0 auto' }} />
          <h3 style={{ color: '#075e54', marginTop: '16px' }}>WhatsApp Connected!</h3>
          <p style={{ color: '#000', opacity: 0.7, marginTop: '8px' }}>The assistant can now send messages.</p>
        </div>
      )}
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px 20px' }}>
        <h4 style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Connection State</h4>
        {data?.raw_response?.results?.state === 'authenticated' || data?.raw_response?.results?.state === 'OPEN' ? (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <p style={{ color: 'var(--text-muted)' }}>Scan successful. Connected to WhatsApp.</p>
             
             <div style={{ padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
               <h4 style={{ color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <UploadCloud size={16} color="#075e54" /> Sync to Chatwoot
               </h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                 Import existing WhatsApp message history into Chatwoot (requires Chatwoot configured on the GoWA node).
               </p>
               <button 
                 onClick={handleSyncChatwoot} 
                 disabled={syncing || syncStatus?.results?.status === 'running'}
                 style={{ 
                   display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
                   backgroundColor: '#075e54', color: '#fff', borderRadius: '8px', 
                   border: 'none', fontWeight: 'bold', width: '100%', justifyContent: 'center',
                   opacity: (syncing || syncStatus?.results?.status === 'running') ? 0.5 : 1,
                   cursor: (syncing || syncStatus?.results?.status === 'running') ? 'not-allowed' : 'pointer'
                 }}
               >
                 {(syncing || syncStatus?.results?.status === 'running') ? (
                   <><Activity size={16} style={{ animation: 'pulse-anim 2s infinite' }}/> Syncing...</>
                 ) : (
                   <><RefreshCw size={16} /> Start Sync (Last 7 Days)</>
                 )}
               </button>
               {syncStatus?.results && (
                 <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', backgroundColor: '#000', padding: '8px', borderRadius: '6px' }}>
                   Status: <strong>{syncStatus.results.status}</strong><br/>
                   Synced: {syncStatus.results.synced_messages} / {syncStatus.results.total_messages} messages
                 </div>
               )}
             </div>
           </div>
        ) : (
           <pre style={{ backgroundColor: '#111', padding: '12px', borderRadius: '8px', fontSize: '12px', overflowX: 'auto', color: '#0f0' }}>
             {JSON.stringify(data, null, 2)}
           </pre>
        )}
      </div>
    </div>
  );
}
