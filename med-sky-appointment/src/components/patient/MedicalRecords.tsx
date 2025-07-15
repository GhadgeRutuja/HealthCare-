import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  FileText, 
  Calendar, 
  User, 
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { User as UserType } from '@/services/api';

interface MedicalRecordsProps {
  user: UserType;
}

interface MedicalRecord {
  id: string;
  type: string;
  doctorName: string;
  doctorId: string;
  date: string;
  status: 'completed' | 'pending' | 'in-progress';
  priority: 'normal' | 'high' | 'urgent';
  results?: string;
  notes?: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  diagnosis?: string;
  treatment?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}

const MedicalRecords: React.FC<MedicalRecordsProps> = ({ user }) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch medical records
  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await api.getPatientMedicalRecords(user._id);
        
        // Mock data - will be replaced with real API
        const mockRecords: MedicalRecord[] = [];
        
        setRecords(mockRecords);
        setFilteredRecords(mockRecords);
      } catch (error) {
        console.error('Failed to fetch medical records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [user._id]);

  // Filter records based on search and status
  useEffect(() => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(record => record.status === filterStatus);
    }

    setFilteredRecords(filtered);
  }, [records, searchTerm, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <Loader2 className="h-4 w-4 animate-spin" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Records</h2>
          <p className="text-gray-600">View and manage your medical history</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Records
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search records, doctors, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            Status:
          </Label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Your Medical Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading medical records...</p>
            </div>
          ) : filteredRecords.length > 0 ? (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{record.type}</h3>
                        <Badge className={getStatusColor(record.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(record.status)}
                            {record.status}
                          </span>
                        </Badge>
                        <Badge className={getPriorityColor(record.priority)}>
                          {record.priority}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>Dr. {record.doctorName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{record.date}</span>
                        </div>
                      </div>

                      {record.diagnosis && (
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Diagnosis:</strong> {record.diagnosis}
                        </p>
                      )}

                      {record.results && (
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Results:</strong> {record.results}
                        </p>
                      )}

                      {record.followUpRequired && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                          <p className="text-sm text-amber-800">
                            <strong>Follow-up Required:</strong> {record.followUpDate}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(record)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      
                      {record.attachments && record.attachments.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {record.attachments.length} attachment(s)
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No matching records found' : 'No medical records yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Your medical records from appointments and tests will appear here'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button className="bg-sky-600 hover:bg-sky-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Your First Appointment
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Medical Record Details</DialogTitle>
            <DialogDescription>
              Complete information about your medical record
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Record Type</Label>
                  <p className="text-lg font-semibold">{selectedRecord.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Date</Label>
                  <p className="text-lg font-semibold">{selectedRecord.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Doctor</Label>
                  <p className="text-lg font-semibold">Dr. {selectedRecord.doctorName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedRecord.status)}>
                    {selectedRecord.status}
                  </Badge>
                  <Badge className={getPriorityColor(selectedRecord.priority)}>
                    {selectedRecord.priority}
                  </Badge>
                </div>
              </div>

              {selectedRecord.diagnosis && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Diagnosis</Label>
                  <p className="mt-1 text-gray-900">{selectedRecord.diagnosis}</p>
                </div>
              )}

              {selectedRecord.treatment && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Treatment</Label>
                  <p className="mt-1 text-gray-900">{selectedRecord.treatment}</p>
                </div>
              )}

              {selectedRecord.results && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Results</Label>
                  <p className="mt-1 text-gray-900">{selectedRecord.results}</p>
                </div>
              )}

              {selectedRecord.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Additional Notes</Label>
                  <p className="mt-1 text-gray-900">{selectedRecord.notes}</p>
                </div>
              )}

              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Attachments</Label>
                  <div className="mt-2 space-y-2">
                    {selectedRecord.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium">{attachment.name}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.followUpRequired && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                    <Label className="text-sm font-medium text-amber-800">Follow-up Required</Label>
                  </div>
                  <p className="text-sm text-amber-700">
                    Please schedule a follow-up appointment for: {selectedRecord.followUpDate}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalRecords;
