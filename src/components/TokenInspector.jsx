import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAuthToken,
  selectTokenInspection,
  selectIsTokenTampered,
  tamperToken,
  logout,
} from '../features/auth/authSlice';
import {
  Key,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ShieldAlert,
  Code2,
} from 'lucide-react';

export default function TokenInspector() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const inspection = useSelector(selectTokenInspection);
  const isTampered = useSelector(selectIsTokenTampered);

  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!inspection?.payload?.exp) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = inspection.payload.exp - now;
      if (remaining <= 0) {
        setSecondsLeft(0);
        dispatch(logout());
      } else {
        setSecondsLeft(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [inspection, dispatch]);

  const formatCountdown = (secs) => {
    if (secs <= 0) return 'Expired';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!token || !inspection) {
    return (
      <div className="token-inspector-empty">
        <Key className="w-8 h-8 text-gray-400 mb-2" />
        <p>No active JWT token found in session.</p>
      </div>
    );
  }

  const parts = token.split('.');
  const [headerRaw, payloadRaw, sigRaw] = parts;

  return (
    <div className="token-inspector-card">
      <div className="token-inspector-header">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-500" />
          <h3>JSON Web Token (JWT) Inspector</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`token-status-pill ${isTampered ? 'tampered' : 'valid'}`}>
            {isTampered ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" /> Invalid Signature
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Valid
              </>
            )}
          </div>
          <div className="token-timer-pill">
            <Clock className="w-3.5 h-3.5" />
            <span>Expires in: {formatCountdown(secondsLeft)}</span>
          </div>
        </div>
      </div>

      {/* Raw Token Breakdown */}
      <div className="token-raw-container">
        <div className="token-raw-label">
          <span>Raw Encoded JWT (Header . Payload . Signature):</span>
          <button onClick={copyToClipboard} className="copy-token-btn">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="token-raw-string">
          <span className="jwt-header-part">{headerRaw}</span>
          <span className="jwt-dot">.</span>
          <span className="jwt-payload-part">{payloadRaw}</span>
          <span className="jwt-dot">.</span>
          <span className="jwt-sig-part">{sigRaw}</span>
        </div>
      </div>

      {/* 3 Columns for Header, Payload, Signature */}
      <div className="jwt-grid">
        {/* Header */}
        <div className="jwt-box jwt-header-box">
          <div className="jwt-box-title">
            <span className="jwt-color-badge header-badge"></span>
            <h4>HEADER: Algorithm & Token Type</h4>
          </div>
          <pre className="jwt-json">
            {JSON.stringify(inspection.header, null, 2)}
          </pre>
          <div className="jwt-box-desc">
            Specifies cryptographic algorithm (<code>HS256</code>) and token type.
          </div>
        </div>

        {/* Payload */}
        <div className="jwt-box jwt-payload-box">
          <div className="jwt-box-title">
            <span className="jwt-color-badge payload-badge"></span>
            <h4>PAYLOAD: User Claims & Session</h4>
          </div>
          <pre className="jwt-json">
            {JSON.stringify(inspection.payload, null, 2)}
          </pre>
          <div className="jwt-box-desc">
            Contains user identity (<code>sub</code>), <code>role</code> ({inspection.payload.role}), permissions, and timestamps.
          </div>
        </div>

        {/* Signature */}
        <div className="jwt-box jwt-sig-box">
          <div className="jwt-box-title">
            <span className="jwt-color-badge sig-badge"></span>
            <h4>VERIFY SIGNATURE</h4>
          </div>
          <div className="jwt-sig-content">
            <div className="sig-formula">
              <code>HMACSHA256(</code><br />
              &nbsp;&nbsp;<code>base64UrlEncode(header) + "." +</code><br />
              &nbsp;&nbsp;<code>base64UrlEncode(payload),</code><br />
              &nbsp;&nbsp;<code>secret_key</code><br />
              <code>)</code>
            </div>
            <div className="sig-raw-value">
              Signature: <code>{sigRaw}</code>
            </div>
          </div>
          <div className="jwt-box-desc">
            Ensures token integrity. Any modification invalidates the token.
          </div>
        </div>
      </div>

      {/* Interactive Tamper Test */}
      <div className="tamper-test-box">
        <div className="tamper-info">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Security Simulation: Test what happens if the JWT is intercepted and modified.</span>
        </div>
        <button
          type="button"
          onClick={() => dispatch(tamperToken())}
          disabled={isTampered}
          className="tamper-btn"
        >
          <AlertTriangle className="w-4 h-4 mr-1" />
          {isTampered ? 'Signature Tampered (Rejected)' : 'Simulate Token Tampering'}
        </button>
      </div>
    </div>
  );
}
