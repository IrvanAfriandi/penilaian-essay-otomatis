import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Plus, Upload, Eye, Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ProgressCircle } from '@/components/ui/progress-circle';

// Mock data
const examDetail = {
  id: 1,
  title: 'Ujian Bahasa Indonesia - Kelas 5A',
  subject: 'Bahasa Indonesia',
  class: '5A',
  date: '2024-01-20',
  totalParticipants: 32,
  completedParticipants: 28,
  status: 'Berlangsung',
  questions: [
    'Jelaskan pengertian dari kata "gotong royong" dan berikan contoh penerapannya dalam kehidupan sehari-hari!',
    'Ceritakan pengalaman liburan yang paling berkesan menurut kalian dengan menggunakan kalimat yang baik dan benar!',
    'Apa manfaat membaca buku? Jelaskan minimal 3 manfaat dan berikan alasannya!',
    'Buatlah pantun dengan tema lingkungan hidup yang terdiri dari 4 baris!',
    'Jelaskan perbedaan antara dongeng dan fabel beserta masing-masing contohnya!'
  ],
  answerKeys: [
    'Gotong royong adalah kegiatan bersama-sama untuk mencapai tujuan bersama. Contoh: kerja bakti membersihkan lingkungan.',
    'Jawaban bervariasi sesuai pengalaman siswa dengan struktur cerita yang baik.',
    'Manfaat membaca: menambah wawasan, melatih konsentrasi, mengembangkan imajinasi.',
    'Pantun dengan tema lingkungan yang memenuhi syarat A-B-A-B.',
    'Dongeng: cerita rakyat dengan tokoh manusia. Fabel: cerita dengan tokoh hewan.'
  ]
};

const participants = [
  {
    id: 1,
    name: 'Ahmad Rizki',
    status: 'completed',
    score: 85,
    answers: [
      'Gotong royong adalah bekerja sama untuk kepentingan bersama...',
      'Liburan ke pantai bersama keluarga sangat menyenangkan...',
      'Membaca buku dapat menambah pengetahuan...',
      'Bunga mawar di taman indah, Kupu-kupu hinggap di ranting...',
      'Dongeng bercerita tentang manusia, fabel tentang hewan...'
    ]
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    status: 'not_completed'
  },
  {
    id: 3,
    name: 'Budi Santoso',
    status: 'completed',
    score: 78,
    answers: [
      'Gotong royong adalah membantu sesama...',
      'Saya pergi ke kebun binatang...',
      'Buku memberikan ilmu pengetahuan...',
      'Pohon hijau di halaman, Burung berkicau merdu...',
      'Dongeng adalah cerita rakyat...'
    ]
  },
  {
    id: 4,
    name: 'Dewi Sartika',
    status: 'not_completed'
  }
];

export default function ExamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isAddQuestionsOpen, setIsAddQuestionsOpen] = useState(false);
  const [isUploadAnswerOpen, setIsUploadAnswerOpen] = useState(false);
  const [isViewAnswerOpen, setIsViewAnswerOpen] = useState(false);
  const [isEditScoreOpen, setIsEditScoreOpen] = useState(false);
  const [isProcessingOpen, setIsProcessingOpen] = useState(false);
  const [isScoreResultOpen, setIsScoreResultOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  
  const [questions, setQuestions] = useState(examDetail.questions);
  const [answerKeys, setAnswerKeys] = useState(examDetail.answerKeys);
  const [uploadedAnswers, setUploadedAnswers] = useState(['', '', '', '', '']);
  const [editingScore, setEditingScore] = useState(0);

  const handlePrintExam = () => {
    toast({
      title: "Mencetak Lembar Soal",
      description: "Lembar soal sedang disiapkan untuk dicetak.",
    });
  };

  const handleSaveQuestions = () => {
    setIsAddQuestionsOpen(false);
    toast({
      title: "Berhasil!",
      description: "Soal ujian berhasil disimpan.",
    });
  };

  const handleUploadAnswer = (participant: any) => {
    setSelectedParticipant(participant);
    setIsUploadAnswerOpen(true);
  };

  const handleProcessUpload = () => {
    setIsUploadAnswerOpen(false);
    setIsProcessingOpen(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessingOpen(false);
      // Show answer form with uploaded image
      setUploadedAnswers([
        'Gotong royong adalah kegiatan bersama...',
        'Liburan paling berkesan adalah...',
        'Manfaat membaca buku antara lain...',
        'Bunga mekar di taman...',
        'Dongeng adalah cerita tentang...'
      ]);
      setIsViewAnswerOpen(true);
    }, 2000);
  };

  const handleProcessGrading = () => {
    setIsViewAnswerOpen(false);
    setIsProcessingOpen(true);
    
    // Simulate grading
    setTimeout(() => {
      setIsProcessingOpen(false);
      setEditingScore(82);
      setIsScoreResultOpen(true);
    }, 2000);
  };

  const handleSaveScore = () => {
    setIsScoreResultOpen(false);
    toast({
      title: "Berhasil!",
      description: "Nilai berhasil disimpan.",
    });
  };

  const handleViewAnswer = (participant: any) => {
    setSelectedParticipant(participant);
    setIsViewAnswerOpen(true);
  };

  const handleEditScore = (participant: any) => {
    setSelectedParticipant(participant);
    setEditingScore(participant.score);
    setIsEditScoreOpen(true);
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' 
      ? 'bg-success text-success-foreground' 
      : 'bg-destructive text-destructive-foreground';
  };

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? Check : X;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/exams')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{examDetail.title}</h1>
          <p className="text-muted-foreground">Detail ujian dan peserta</p>
        </div>
        <Button onClick={handlePrintExam} className="bg-gradient-primary hover:opacity-90">
          <Printer className="mr-2 h-4 w-4" />
          Print Lembar Soal
        </Button>
      </div>

      {/* Exam Info */}
      <Card className="bg-gradient-card shadow-soft border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <Label className="text-sm text-muted-foreground">Mata Pelajaran</Label>
              <p className="font-medium">{examDetail.subject}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Kelas</Label>
              <p className="font-medium">{examDetail.class}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Tanggal</Label>
              <p className="font-medium">{new Date(examDetail.date).toLocaleDateString('id-ID')}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Status</Label>
              <Badge className="bg-warning text-warning-foreground">{examDetail.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card className="bg-card shadow-soft border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Soal Ujian</CardTitle>
          <Dialog open={isAddQuestionsOpen} onOpenChange={setIsAddQuestionsOpen}>
            <Button
              onClick={() => setIsAddQuestionsOpen(true)}
              className="bg-gradient-secondary hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Soal
            </Button>
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Soal Ujian & Kunci Jawaban</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="space-y-3">
                    <Label>Soal {num}</Label>
                    <Textarea
                      value={questions[num - 1] || ''}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[num - 1] = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      placeholder={`Masukkan soal nomor ${num}`}
                      className="min-h-[80px]"
                    />
                    <Label>Kunci Jawaban {num}</Label>
                    <Textarea
                      value={answerKeys[num - 1] || ''}
                      onChange={(e) => {
                        const newAnswerKeys = [...answerKeys];
                        newAnswerKeys[num - 1] = e.target.value;
                        setAnswerKeys(newAnswerKeys);
                      }}
                      placeholder={`Masukkan kunci jawaban nomor ${num}`}
                      className="min-h-[60px]"
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveQuestions} className="flex-1 bg-gradient-primary hover:opacity-90">
                    Simpan
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddQuestionsOpen(false)} className="flex-1">
                    Batal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <p className="font-medium text-sm text-muted-foreground mb-2">Soal {index + 1}</p>
                <p className="text-foreground">{question}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participants Section */}
      <Card className="bg-card shadow-soft border-0">
        <CardHeader>
          <CardTitle>Peserta Ujian ({participants.length} siswa)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participants.map((participant) => {
              const StatusIcon = getStatusIcon(participant.status);
              return (
                <Card key={participant.id} className="bg-gradient-card border-0 shadow-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{participant.name}</h3>
                      <Badge className={getStatusColor(participant.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {participant.status === 'completed' ? 'Selesai' : 'Belum Upload'}
                      </Badge>
                    </div>
                    
                    {participant.status === 'completed' ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Nilai:</span>
                          <span className="font-medium text-primary">{participant.score}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAnswer(participant)}
                            className="flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Detail
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditScore(participant)}
                            className="flex-1"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleUploadAnswer(participant)}
                        className="w-full bg-gradient-secondary hover:opacity-90"
                        size="sm"
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Upload Jawaban
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload Answer Modal */}
      <Dialog open={isUploadAnswerOpen} onOpenChange={setIsUploadAnswerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Jawaban - {selectedParticipant?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Pilih foto jawaban siswa</p>
              <Input type="file" accept="image/*" className="max-w-xs mx-auto" />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleProcessUpload} className="flex-1 bg-gradient-primary hover:opacity-90">
                Upload & Proses
              </Button>
              <Button variant="outline" onClick={() => setIsUploadAnswerOpen(false)} className="flex-1">
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Processing Modal */}
      <Dialog open={isProcessingOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Memproses...</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Sedang memproses jawaban...</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* View/Edit Answer Modal */}
      <Dialog open={isViewAnswerOpen} onOpenChange={setIsViewAnswerOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Jawaban - {selectedParticipant?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Image */}
            <div>
              <Label>Foto Jawaban</Label>
              <div className="mt-2 border rounded-lg p-4 bg-muted/10 min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Gambar jawaban akan ditampilkan di sini</p>
              </div>
            </div>
            
            {/* Right: Answers */}
            <div className="space-y-4">
              <Label>Jawaban Siswa</Label>
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num}>
                  <Label className="text-sm">Jawaban {num}</Label>
                  <Textarea
                    value={uploadedAnswers[num - 1]}
                    onChange={(e) => {
                      const newAnswers = [...uploadedAnswers];
                      newAnswers[num - 1] = e.target.value;
                      setUploadedAnswers(newAnswers);
                    }}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              ))}
              
              <Button onClick={handleProcessGrading} className="w-full bg-gradient-primary hover:opacity-90 mt-4">
                Proses Penilaian
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Score Result Modal */}
      <Dialog open={isScoreResultOpen} onOpenChange={setIsScoreResultOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Hasil Penilaian - {selectedParticipant?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Total Score Section */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-card rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Nilai Total</h3>
              <ProgressCircle value={editingScore} size={150} strokeWidth={10}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{editingScore}</div>
                  <div className="text-sm text-muted-foreground">dari 100</div>
                </div>
              </ProgressCircle>
            </div>
            
            {/* Individual Scores Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Nilai Per Soal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border shadow-sm">
                    <span className="font-medium">Soal {num}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        defaultValue={Math.floor(editingScore / 5)}
                        className="w-16 text-center"
                        max="20"
                        min="0"
                      />
                      <span className="text-sm text-muted-foreground">/20</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button onClick={handleSaveScore} className="w-full bg-gradient-primary hover:opacity-90 mt-6">
                Simpan Nilai
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Score Modal */}
      <Dialog open={isEditScoreOpen} onOpenChange={setIsEditScoreOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Nilai - {selectedParticipant?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nilai Total</Label>
              <Input
                type="number"
                value={editingScore}
                onChange={(e) => setEditingScore(parseInt(e.target.value))}
                max="100"
                min="0"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setIsEditScoreOpen(false)} className="flex-1 bg-gradient-primary hover:opacity-90">
                Simpan
              </Button>
              <Button variant="outline" onClick={() => setIsEditScoreOpen(false)} className="flex-1">
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}