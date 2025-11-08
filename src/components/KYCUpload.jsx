import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle2, XCircle, Clock, AlertCircle, FileText, Camera } from 'lucide-react';
import api from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const KYCUpload = () => {
  const [kycStatus, setKycStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentFront, setDocumentFront] = useState(null);
  const [documentBack, setDocumentBack] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const response = await api.get('/v1/kyc/status');
      setKycStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch KYC status:', error);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 5000);
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showAlert('error', 'File size must be less than 10MB');
        return;
      }
      setter(file);
    }
  };

  const handleSubmitKYC = async (e) => {
    e.preventDefault();

    if (!documentType || !documentNumber || !documentFront) {
      showAlert('error', 'Please fill in all required fields');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('document_type', documentType);
    formData.append('document_number', documentNumber);
    formData.append('document_front', documentFront);
    if (documentBack) formData.append('document_back', documentBack);
    if (selfie) formData.append('selfie', selfie);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      const response = await api.post('/v1/kyc/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      showAlert('success', 'KYC documents submitted successfully');
      fetchKYCStatus();

      // Reset form
      setDocumentType('');
      setDocumentNumber('');
      setDocumentFront(null);
      setDocumentBack(null);
      setSelfie(null);
    } catch (error) {
      showAlert('error', error.response?.data?.error || 'Failed to submit KYC documents');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      not_submitted: { variant: 'secondary', icon: AlertCircle, label: 'Not Submitted' },
      pending: { variant: 'default', icon: Clock, label: 'Pending Review' },
      under_review: { variant: 'default', icon: Clock, label: 'Under Review' },
      approved: { variant: 'success', icon: CheckCircle2, label: 'Verified' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
      expired: { variant: 'destructive', icon: XCircle, label: 'Expired' },
    };

    const config = statusConfig[status] || statusConfig.not_submitted;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTrustScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const documentTypes = [
    { value: 'national_id', label: 'National ID Card' },
    { value: 'passport', label: 'International Passport' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'business_registration', label: 'Business Registration' },
    { value: 'land_title', label: 'Land Title Certificate' },
    { value: 'tax_certificate', label: 'Tax Identification Certificate' },
  ];

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

      {/* KYC Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              KYC Verification Status
            </span>
            {kycStatus && getStatusBadge(kycStatus.status)}
          </CardTitle>
          <CardDescription>
            Verify your identity to unlock full developer features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kycStatus?.status === 'approved' && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900 dark:text-green-100">
                    Verified Developer
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your identity has been verified. You have full access to all developer features.
                </p>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Trust Score</span>
                    <span className={`text-2xl font-bold ${getTrustScoreColor(kycStatus.trust_score)}`}>
                      {kycStatus.trust_score}
                    </span>
                  </div>
                  <Progress value={kycStatus.trust_score} className="h-2" />
                </div>
              </div>
            )}

            {kycStatus?.status === 'rejected' && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-900 dark:text-red-100">
                    Verification Rejected
                  </span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {kycStatus.rejection_reason || 'Your documents did not meet verification requirements.'}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Please submit new documents.
                </p>
              </div>
            )}

            {['pending', 'under_review'].includes(kycStatus?.status) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900 dark:text-blue-100">
                    Documents Under Review
                  </span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your documents have been submitted and are being reviewed. This typically takes 1-3 business days.
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Submitted: {new Date(kycStatus.submitted_at).toLocaleDateString()}
                </p>
              </div>
            )}

            {kycStatus?.document_type && (
              <div className="pt-2 text-sm text-muted-foreground">
                <p>Document Type: <span className="font-medium">
                  {documentTypes.find(t => t.value === kycStatus.document_type)?.label || kycStatus.document_type}
                </span></p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Form - Only show if not approved or under review */}
      {(!kycStatus || ['not_submitted', 'rejected', 'expired'].includes(kycStatus.status)) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload KYC Documents
            </CardTitle>
            <CardDescription>
              Upload clear photos of your identity documents. All documents must be valid and not expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitKYC} className="space-y-4">
              {/* Document Type */}
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type *</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Document Number */}
              <div className="space-y-2">
                <Label htmlFor="document-number">Document Number *</Label>
                <Input
                  id="document-number"
                  placeholder="Enter document number"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  required
                />
              </div>

              {/* Document Front */}
              <div className="space-y-2">
                <Label htmlFor="document-front">Document Front Photo *</Label>
                <Input
                  id="document-front"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={(e) => handleFileChange(e, setDocumentFront)}
                  required
                />
                {documentFront && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {documentFront.name}
                  </p>
                )}
              </div>

              {/* Document Back (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="document-back">Document Back Photo (if applicable)</Label>
                <Input
                  id="document-back"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={(e) => handleFileChange(e, setDocumentBack)}
                />
                {documentBack && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {documentBack.name}
                  </p>
                )}
              </div>

              {/* Selfie (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="selfie" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Selfie with Document (Optional but recommended)
                </Label>
                <Input
                  id="selfie"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleFileChange(e, setSelfie)}
                />
                {selfie && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selfie.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Hold your document next to your face for faster verification
                </p>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? 'Uploading...' : 'Submit Documents'}
              </Button>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Ensure your documents are clear, not blurry, and all corners are visible.
                  Supported formats: JPG, PNG, PDF (max 10MB per file).
                </AlertDescription>
              </Alert>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KYCUpload;
