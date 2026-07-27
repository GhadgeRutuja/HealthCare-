import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Share,
  Settings,
  MessageSquare,
  FileText,
  Camera,
  Monitor,
  Users,
  Clock,
  Calendar,
  Stethoscope,
  Pill,
  Heart,
  Activity,
  Eye,
  Ear,
  Brain,
  Thermometer,
  Scale,
  Ruler,
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  PauseCircle,
  StopCircle,
  RotateCcw,
  Download,
  Upload,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Plus,
  Edit,
  Save,
  Loader2
} from 'lucide-react';
import { User as UserType } from '@/services/api';

interface TelemedicineProps {
  user: UserType;
}

interface VirtualAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  scheduledTime: Date;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetingLink: string;
  consultationType: 'follow-up' | 'new-patient' | 'emergency' | 'second-opinion';
  chiefComplaint: string;
  symptoms: string[];
  vitalSigns?: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
  };
  attachments: string[];
  notes: string;
  prescription?: string;
  followUpRequired: boolean;
}

interface CallState {
  isConnected: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  participantCount: number;
  callDuration: number;
}

const TelemedicineSystem: React.FC<TelemedicineProps> = ({ user }) => {
  const [appointments, setAppointments] = useState<VirtualAppointment[]>([]);
  const [activeAppointment, setActiveAppointment] = useState<string | null>(null);
  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isVideoOn: true,
    isAudioOn: true,
    isScreenSharing: false,
    connectionQuality: 'excellent',
    participantCount: 1,
    callDuration: 0
  });
  const [consultationNotes, setConsultationNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isRecording, setIsRecording] = useState(false);
  const [showVitalModal, setShowVitalModal] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mock appointments data
  useEffect(() => {
    const mockAppointments: VirtualAppointment[] = [
      {
        id: 'apt_001',
        patientId: 'pat_001',
        patientName: 'Sarah Johnson',
        patientAge: 34,
        patientGender: 'Female',
        scheduledTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        duration: 30,
        status: 'scheduled',
        meetingLink: 'https://meet.medicare.com/room/abc123',
        consultationType: 'follow-up',
        chiefComplaint: 'Follow-up for hypertension management',
        symptoms: ['Headache', 'Fatigue'],
        attachments: ['blood_pressure_log.pdf', 'medication_list.pdf'],
        notes: '',
        followUpRequired: false
      },
      {
        id: 'apt_002',
        patientId: 'pat_002',
        patientName: 'Michael Brown',
        patientAge: 45,
        patientGender: 'Male',
        scheduledTime: new Date(Date.now() + 90 * 60 * 1000), // 90 minutes from now
        duration: 45,
        status: 'scheduled',
        meetingLink: 'https://meet.medicare.com/room/def456',
        consultationType: 'new-patient',
        chiefComplaint: 'Chest pain and shortness of breath',
        symptoms: ['Chest pain', 'Shortness of breath', 'Dizziness'],
        attachments: ['ecg_report.pdf'],
        notes: '',
        followUpRequired: false
      },
      {
        id: 'apt_003',
        patientId: 'pat_003',
        patientName: 'Emma Davis',
        patientAge: 28,
        patientGender: 'Female',
        scheduledTime: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        duration: 30,
        status: 'completed',
        meetingLink: 'https://meet.medicare.com/room/ghi789',
        consultationType: 'emergency',
        chiefComplaint: 'Severe asthma attack',
        symptoms: ['Difficulty breathing', 'Wheezing', 'Anxiety'],
        vitalSigns: {
          temperature: 98.6,
          bloodPressure: '140/90',
          heartRate: 110,
          respiratoryRate: 28,
          oxygenSaturation: 92
        },
        attachments: [],
        notes: 'Patient responded well to bronchodilator. Prescribed emergency inhaler.',
        prescription: 'Albuterol inhaler 90 mcg, 2 puffs every 4-6 hours as needed',
        followUpRequired: true
      }
    ];

    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const currentAppointment = appointments.find(apt => apt.id === activeAppointment);
  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startCall = (appointmentId: string) => {
    setActiveAppointment(appointmentId);
    setCallState(prev => ({ ...prev, isConnected: true, callDuration: 0 }));
    
    // Start call timer
    callTimerRef.current = setInterval(() => {
      setCallState(prev => ({ ...prev, callDuration: prev.callDuration + 1 }));
    }, 1000);

    // Update appointment status
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'in-progress' } : apt
    ));
  };

  const endCall = () => {
    setCallState(prev => ({ ...prev, isConnected: false }));
    
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }

    // Update appointment status
    if (activeAppointment) {
      setAppointments(prev => prev.map(apt => 
        apt.id === activeAppointment ? { 
          ...apt, 
          status: 'completed',
          notes: consultationNotes,
          prescription: prescription
        } : apt
      ));
    }

    setActiveAppointment(null);
    setConsultationNotes('');
    setPrescription('');
  };

  const toggleVideo = () => {
    setCallState(prev => ({ ...prev, isVideoOn: !prev.isVideoOn }));
  };

  const toggleAudio = () => {
    setCallState(prev => ({ ...prev, isAudioOn: !prev.isAudioOn }));
  };

  const toggleScreenShare = () => {
    setCallState(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }));
  };

  const getConnectionQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'good':
        return <Wifi className="h-4 w-4 text-blue-500" />;
      case 'fair':
        return <Wifi className="h-4 w-4 text-yellow-500" />;
      case 'poor':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConsultationTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'new-patient':
        return 'bg-blue-100 text-blue-800';
      case 'follow-up':
        return 'bg-green-100 text-green-800';
      case 'second-opinion':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const saveConsultationData = () => {
    if (!activeAppointment) return;

    const updatedVitalSigns = {
      temperature: parseFloat(vitalSigns.temperature) || 0,
      bloodPressure: vitalSigns.bloodPressure,
      heartRate: parseInt(vitalSigns.heartRate) || 0,
      respiratoryRate: parseInt(vitalSigns.respiratoryRate) || 0,
      oxygenSaturation: parseInt(vitalSigns.oxygenSaturation) || 0
    };

    setAppointments(prev => prev.map(apt => 
      apt.id === activeAppointment ? {
        ...apt,
        vitalSigns: updatedVitalSigns,
        notes: consultationNotes,
        prescription: prescription
      } : apt
    ));

    // Reset vital signs form
    setVitalSigns({
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: ''
    });
    setShowVitalModal(false);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading telemedicine appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Video className="h-6 w-6 mr-2 text-sky-600" />
            Telemedicine
          </h2>
          <p className="text-gray-600">Virtual consultations and remote patient care</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Audio/Video Settings
          </Button>
          <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Virtual Appointment
          </Button>
        </div>
      </div>

      {/* Active Call Interface */}
      {callState.isConnected && currentAppointment && (
        <Card className="border-2 border-sky-500">
          <CardHeader className="bg-sky-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>Virtual Consultation in Progress</span>
                <Badge variant="outline">
                  {formatDuration(callState.callDuration)}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                {getConnectionQualityIcon(callState.connectionQuality)}
                <span className="text-sm text-gray-600 capitalize">{callState.connectionQuality}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
              {/* Video Area */}
              <div className="lg:col-span-2 bg-gray-900 relative">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  poster="/placeholder.svg"
                />
                
                {/* Patient Video (Picture-in-Picture) */}
                <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-white text-lg">
                        {currentAppointment.patientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Call Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
                  <Button
                    variant={callState.isVideoOn ? "default" : "destructive"}
                    size="sm"
                    className="rounded-full"
                    onClick={toggleVideo}
                  >
                    {callState.isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant={callState.isAudioOn ? "default" : "destructive"}
                    size="sm"
                    className="rounded-full"
                    onClick={toggleAudio}
                  >
                    {callState.isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={toggleScreenShare}
                  >
                    <Share className={`h-4 w-4 ${callState.isScreenSharing ? 'text-blue-500' : ''}`} />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? <StopCircle className="h-4 w-4 text-red-500" /> : <PlayCircle className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-full"
                    onClick={endCall}
                  >
                    <PhoneOff className="h-4 w-4" />
                  </Button>
                </div>

                {/* Patient Info Overlay */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg p-3 text-white">
                  <h3 className="font-semibold">{currentAppointment.patientName}</h3>
                  <p className="text-sm opacity-90">
                    {currentAppointment.patientAge} years old • {currentAppointment.patientGender}
                  </p>
                  <Badge className={`mt-1 ${getConsultationTypeColor(currentAppointment.consultationType)}`}>
                    {currentAppointment.consultationType}
                  </Badge>
                </div>
              </div>

              {/* Consultation Panel */}
              <div className="border-l bg-white">
                <Tabs defaultValue="notes" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-3 rounded-none">
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="vitals">Vitals</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                  </TabsList>

                  <TabsContent value="notes" className="flex-1 p-4 space-y-4">
                    <div>
                      <Label htmlFor="complaint">Chief Complaint</Label>
                      <Input
                        id="complaint"
                        value={currentAppointment.chiefComplaint}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="symptoms">Symptoms</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentAppointment.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="secondary">{symptom}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="consultation-notes">Consultation Notes</Label>
                      <Textarea
                        id="consultation-notes"
                        placeholder="Enter your observations and clinical notes..."
                        value={consultationNotes}
                        onChange={(e) => setConsultationNotes(e.target.value)}
                        rows={6}
                      />
                    </div>

                    <div>
                      <Label htmlFor="prescription">Prescription</Label>
                      <Textarea
                        id="prescription"
                        placeholder="Enter prescription details..."
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button onClick={saveConsultationData} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Consultation Data
                    </Button>
                  </TabsContent>

                  <TabsContent value="vitals" className="flex-1 p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="temp">Temperature (°F)</Label>
                        <Input
                          id="temp"
                          type="number"
                          placeholder="98.6"
                          value={vitalSigns.temperature}
                          onChange={(e) => setVitalSigns(prev => ({ ...prev, temperature: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bp">Blood Pressure</Label>
                        <Input
                          id="bp"
                          placeholder="120/80"
                          value={vitalSigns.bloodPressure}
                          onChange={(e) => setVitalSigns(prev => ({ ...prev, bloodPressure: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hr">Heart Rate (bpm)</Label>
                        <Input
                          id="hr"
                          type="number"
                          placeholder="72"
                          value={vitalSigns.heartRate}
                          onChange={(e) => setVitalSigns(prev => ({ ...prev, heartRate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rr">Respiratory Rate</Label>
                        <Input
                          id="rr"
                          type="number"
                          placeholder="16"
                          value={vitalSigns.respiratoryRate}
                          onChange={(e) => setVitalSigns(prev => ({ ...prev, respiratoryRate: e.target.value }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="o2">Oxygen Saturation (%)</Label>
                        <Input
                          id="o2"
                          type="number"
                          placeholder="98"
                          value={vitalSigns.oxygenSaturation}
                          onChange={(e) => setVitalSigns(prev => ({ ...prev, oxygenSaturation: e.target.value }))}
                        />
                      </div>
                    </div>

                    {currentAppointment.vitalSigns && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Previous Readings</h4>
                        <div className="text-sm space-y-1">
                          <div>Temperature: {currentAppointment.vitalSigns.temperature}°F</div>
                          <div>Blood Pressure: {currentAppointment.vitalSigns.bloodPressure}</div>
                          <div>Heart Rate: {currentAppointment.vitalSigns.heartRate} bpm</div>
                          <div>Respiratory Rate: {currentAppointment.vitalSigns.respiratoryRate}</div>
                          <div>O2 Saturation: {currentAppointment.vitalSigns.oxygenSaturation}%</div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="chat" className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-3">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm">Patient has joined the call</p>
                          <span className="text-xs text-gray-500">{formatTime(new Date())}</span>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm">Doctor: Hello! How are you feeling today?</p>
                          <span className="text-xs text-gray-500">2 minutes ago</span>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm">Patient: I'm feeling much better, thank you doctor.</p>
                          <span className="text-xs text-gray-500">1 minute ago</span>
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Input placeholder="Type a message..." className="flex-1" />
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointments Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                          <p className="text-gray-600">
                            {appointment.patientAge} years old • {appointment.patientGender}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatTime(appointment.scheduledTime)} ({appointment.duration} min)
                            </div>
                            <Badge className={getConsultationTypeColor(appointment.consultationType)}>
                              {appointment.consultationType}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startCall(appointment.id)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Start Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Chief Complaint</h4>
                          <p className="text-sm text-gray-600">{appointment.chiefComplaint}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Symptoms</h4>
                          <div className="flex flex-wrap gap-1">
                            {appointment.symptoms.slice(0, 3).map((symptom, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                            {appointment.symptoms.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{appointment.symptoms.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming virtual appointments</h3>
              <p className="text-gray-600">Your virtual consultation schedule is clear</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAppointments.length > 0 ? (
            <div className="grid gap-4">
              {completedAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                          <p className="text-gray-600">
                            {formatTime(appointment.scheduledTime)} • {appointment.duration} min
                          </p>
                          <Badge className={getConsultationTypeColor(appointment.consultationType)}>
                            {appointment.consultationType}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>

                    {appointment.vitalSigns && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Vital Signs</h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                          <div className="flex items-center">
                            <Thermometer className="h-4 w-4 mr-1 text-red-500" />
                            {appointment.vitalSigns.temperature}°F
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-1 text-red-500" />
                            {appointment.vitalSigns.bloodPressure}
                          </div>
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 mr-1 text-blue-500" />
                            {appointment.vitalSigns.heartRate} bpm
                          </div>
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 mr-1 text-green-500" />
                            {appointment.vitalSigns.respiratoryRate} /min
                          </div>
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 mr-1 text-blue-500" />
                            {appointment.vitalSigns.oxygenSaturation}% O2
                          </div>
                        </div>
                      </div>
                    )}

                    {appointment.notes && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Consultation Notes</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {appointment.notes}
                        </p>
                      </div>
                    )}

                    {appointment.prescription && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Pill className="h-4 w-4 mr-1 text-green-600" />
                          Prescription
                        </h4>
                        <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
                          {appointment.prescription}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        {appointment.followUpRequired && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-800">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Follow-up Required
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No completed consultations</h3>
              <p className="text-gray-600">Completed virtual consultations will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelemedicineSystem;
