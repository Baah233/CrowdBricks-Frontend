import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Download,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const DividendTracker = () => {
  const [dividends, setDividends] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, paid, pending, overdue

  useEffect(() => {
    fetchDividends();
  }, []);

  const fetchDividends = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/user/dividends', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDividends(response.data.dividends || []);
      setSummary(response.data.summary || {});
    } catch (error) {
      console.error('Error fetching dividends:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTaxReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const year = new Date().getFullYear();
      const response = await axios.get(`http://localhost:8000/api/user/tax-report?year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Create downloadable JSON file
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax-report-${year}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading tax report:', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Paid': 'default',
      'Pending': 'secondary',
      'Processing': 'outline',
      'Failed': 'destructive'
    };
    
    const icons = {
      'Paid': <CheckCircle className="w-3 h-3 mr-1" />,
      'Pending': <Clock className="w-3 h-3 mr-1" />,
      'Processing': <TrendingUp className="w-3 h-3 mr-1" />,
      'Failed': <AlertCircle className="w-3 h-3 mr-1" />
    };

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {icons[status]}
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type) => {
    const colors = {
      'Quarterly': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'Annual': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'Project_completion': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'Special': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-700'}`}>
        {type.replace('_', ' ')}
      </span>
    );
  };

  const filteredDividends = dividends.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'paid') return d.status === 'Paid';
    if (filter === 'pending') return d.status === 'Pending' || d.status === 'Processing';
    if (filter === 'overdue') return d.is_overdue;
    return true;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₵{summary?.total_earned?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ₵{summary?.total_pending?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Next Payment</p>
                  {summary?.next_payment ? (
                    <>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        ₵{summary.next_payment.amount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {summary.next_payment.date}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">None scheduled</p>
                  )}
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dividend List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dividend History</CardTitle>
              <CardDescription>
                {summary?.total_count || 0} total dividends • {filteredDividends.length} showing
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadTaxReport}>
                <Download className="w-4 h-4 mr-2" />
                Tax Report
              </Button>
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                {['all', 'paid', 'pending', 'overdue'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      filter === f 
                        ? 'bg-white dark:bg-gray-800 shadow-sm' 
                        : 'hover:bg-white/50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredDividends.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No dividends found</p>
              </div>
            ) : (
              filteredDividends.map((dividend, idx) => (
                <motion.div
                  key={dividend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{dividend.project_title}</h4>
                      {getTypeBadge(dividend.type)}
                      {dividend.is_overdue && (
                        <Badge variant="destructive" className="text-xs">Overdue</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Declared: {dividend.declaration_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Payment: {dividend.payment_date || 'TBD'}
                      </span>
                      <span>
                        {dividend.percentage}% yield
                      </span>
                      {dividend.payment_method && (
                        <span className="capitalize">via {dividend.payment_method}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        ₵{dividend.amount?.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        on ₵{(dividend.amount / (dividend.percentage / 100))?.toLocaleString()} invested
                      </p>
                    </div>
                    {getStatusBadge(dividend.status)}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DividendTracker;
