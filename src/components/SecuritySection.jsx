import React, { useState, useEffect } from 'react';
import { Shield, Lock, Smartphone, History, Monitor, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import api from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const SecuritySection = () => {
  const [securityData, setSecurityData] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [twoFAModal, setTwoFAModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchSecurityData();
    fetchLoginHistory();
    fetchActiveSessions();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const response = await api.get('/v1/security/overview');
      setSecurityData(response.data);
    } catch (error) {
      console.error('Failed to fetch security data:', error);
      showAlert('error', 'Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLoginHistory = async () => {
    try {
      const response = await api.get('/v1/security/login-history');
      setLoginHistory(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch login history:', error);
    }
  };

  const fetchActiveSessions = async () => {
    try {
      const response = await api.get('/v1/security/active-sessions');
      setActiveSessions(response.data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch active sessions:', error);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  const handleEnable2FA = async () => {
    try {
      const response = await api.post('/v1/security/2fa/enable');
      setQrCodeUrl(response.data.qr_code_url);
      setRecoveryCodes(response.data.recovery_codes);
      setTwoFAModal(true);
    } catch (error) {
      showAlert('error', 'Failed to enable 2FA');
    }
  };

  const handleVerify2FA = async () => {
    try {
      await api.post('/v1/security/2fa/verify', {
        code: verificationCode,
      });
      showAlert('success', '2FA enabled successfully');
      setTwoFAModal(false);
      fetchSecurityData();
    } catch (error) {
      showAlert('error', 'Invalid verification code');
    }
  };

  const handleDisable2FA = async () => {
    const password = prompt('Enter your password to disable 2FA:');
    const code = prompt('Enter your 2FA code:');

    if (!password || !code) return;

    try {
      await api.post('/v1/security/2fa/disable', { password, code });
      showAlert('success', '2FA disabled successfully');
      fetchSecurityData();
    } catch (error) {
      showAlert('error', 'Failed to disable 2FA');
    }
  };

  const handleTerminateSession = async (sessionId) => {
    if (!confirm('Terminate this session?')) return;

    try {
      await api.delete(`/v1/security/sessions/${sessionId}`);
      showAlert('success', 'Session terminated');
      fetchActiveSessions();
    } catch (error) {
      showAlert('error', 'Failed to terminate session');
    }
  };

  const handleTerminateAllSessions = async () => {
    if (!confirm('Terminate all other sessions? You will remain logged in on this device.')) return;

    try {
      await api.post('/v1/security/sessions/terminate-all');
      showAlert('success', 'All sessions terminated');
      fetchActiveSessions();
    } catch (error) {
      showAlert('error', 'Failed to terminate sessions');
    }
  };

  const getSecurityScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDeviceIcon = (deviceType) => {
    if (deviceType?.toLowerCase().includes('mobile')) return '📱';
    if (deviceType?.toLowerCase().includes('tablet')) return '📲';
    return '💻';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert.message && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
          {alert.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
          <CardDescription>Your account security rating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-4xl font-bold ${getSecurityScoreColor(securityData?.security_score || 0)}`}>
                {securityData?.security_score || 0}
              </span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <Progress value={securityData?.security_score || 0} className="h-3" />
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Email Verified</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span>2FA Enabled</span>
                {securityData?.two_factor_enabled ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>No Suspicious Activity</span>
                {securityData?.suspicious_activity_count === 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2FA Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {securityData?.two_factor_enabled ? 'Enabled' : 'Not Enabled'}
              </p>
              <p className="text-sm text-muted-foreground">
                {securityData?.two_factor_enabled
                  ? 'Your account is protected with 2FA'
                  : 'Protect your account with 2FA'}
              </p>
            </div>
            {securityData?.two_factor_enabled ? (
              <Button variant="destructive" onClick={handleDisable2FA}>
                Disable 2FA
              </Button>
            ) : (
              <Button onClick={handleEnable2FA}>Enable 2FA</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Login History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Login History
          </CardTitle>
          <CardDescription>Recent login attempts to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loginHistory.slice(0, 10).map((login) => (
              <div
                key={login.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getDeviceIcon(login.device_type)}</span>
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {login.device_name || login.browser}
                      {login.is_suspicious && (
                        <Badge variant="destructive" className="text-xs">
                          Suspicious
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {login.location || login.ip_address} • {new Date(login.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant={login.status === 'success' ? 'default' : 'destructive'}>
                  {login.status}
                </Badge>
              </div>
            ))}
            {loginHistory.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No login history available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage devices currently logged into your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div
                key={session.session_id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getDeviceIcon(session.device_type)}</span>
                  <div>
                    <p className="font-medium">{session.device_name || session.browser}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.location || session.ip_address} • Last active:{' '}
                      {new Date(session.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTerminateSession(session.session_id)}
                >
                  Terminate
                </Button>
              </div>
            ))}
            {activeSessions.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No active sessions</p>
            )}
          </div>
          {activeSessions.length > 1 && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="destructive" onClick={handleTerminateAllSessions} className="w-full">
                Terminate All Other Sessions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2FA Setup Modal */}
      <Dialog open={twoFAModal} onOpenChange={setTwoFAModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app and enter the verification code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {qrCodeUrl && (
              <div className="flex justify-center">
                <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
              </div>
            )}
            {recoveryCodes.length > 0 && (
              <div className="space-y-2">
                <Label>Recovery Codes (Save these securely!)</Label>
                <div className="bg-muted p-3 rounded-lg font-mono text-sm space-y-1">
                  {recoveryCodes.map((code, index) => (
                    <div key={index}>{code}</div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>
            <Button onClick={handleVerify2FA} className="w-full">
              Verify and Enable
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecuritySection;
