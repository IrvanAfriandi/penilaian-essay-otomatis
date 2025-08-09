import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Plus, Upload, Eye, Edit, Check, X, FileText, Users, Search, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';
import { ProgressCircle } from '@/components/ui/progress-circle';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock exam data
const examDetail = {
  id: 1,
  title: "Ujian Tengah Semester - Matematika",
  subject: "Matematika",
  class: "XII IPA 1",
  date: "2024-03-15",
  totalParticipants: 30,
  completedParticipants: 18,
  status: "Berlangsung",
  questions: [
    "Berdasarkan gambar grafik fungsi di atas, tentukan nilai limit ketika x mendekati 2",
    "Hitunglah turunan dari fungsi f(x) = 3x² + 5x - 2",
    "Perhatikan diagram geometri berikut. Tentukan luas daerah yang diarsir",
    "Tentukan persamaan garis singgung kurva y = x² - 4x + 3 di titik (2, -1)",
    "Selesaikan sistem persamaan: 2x + 3y = 12 dan x - y = 1"
  ],
  answerKeys: [
    "4",
    "6x + 5",
    "12 satuan luas",
    "y = -1",
    "x = 3, y = 2"
  ]
};

// Mock data for all students in class 5A
const allStudents = [
  { id: 1, name: 'Ahmad Rizki', nisn: '0051234567', status: 'completed', score: 85, inExam: true },
  { id: 2, name: 'Siti Nurhaliza', nisn: '0051234568', status: 'not_completed', inExam: true },
  { id: 3, name: 'Budi Santoso', nisn: '0051234569', status: 'completed', score: 78, inExam: true },
  { id: 4, name: 'Dewi Sartika', nisn: '0051234570', status: 'not_completed', inExam: true },
  { id: 5, name: 'Rahman Ali', nisn: '0051234571', status: 'not_in_exam', inExam: false },
  { id: 6, name: 'Sari Indah', nisn: '0051234572', status: 'not_in_exam', inExam: false },
  { id: 7, name: 'Doni Pratama', nisn: '0051234573', status: 'not_in_exam', inExam: false },
  { id: 8, name: 'Maya Putri', nisn: '0051234574', status: 'not_in_exam', inExam: false },
];

export default function ExamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [questions, setQuestions] = useState(examDetail.questions);
  const [answerKeys, setAnswerKeys] = useState(examDetail.answerKeys);
  const [students, setStudents] = useState(allStudents);
  const [questionImages, setQuestionImages] = useState<{ [key: number]: { file: File | null, preview: string | null, grayscale: boolean } }>({
    0: { file: null, preview: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Grafik+Fungsi+Limit', grayscale: false },
    2: { file: null, preview: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Diagram+Geometri', grayscale: false }
  });
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const [participantSearch, setParticipantSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [isEditQuestionsOpen, setIsEditQuestionsOpen] = useState(false);
  const [isInfoQuestionsOpen, setIsInfoQuestionsOpen] = useState(false);
  const [isAddParticipantsOpen, setIsAddParticipantsOpen] = useState(false);
  const [isPreviewPdfOpen, setIsPreviewPdfOpen] = useState(false);
  const [isUploadAnswerOpen, setIsUploadAnswerOpen] = useState(false);
  const [isProcessingOpen, setIsProcessingOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  const ITEMS_PER_PAGE = 6;

  // Filter participating students
  const participatingStudents = students.filter(student => student.inExam);
  const filteredParticipants = participatingStudents.filter(student => 
    student.name.toLowerCase().includes(participantSearch.toLowerCase())
  );

  // Pagination for participants
  const totalPages = Math.ceil(filteredParticipants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentParticipants = filteredParticipants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Event handlers
  const handlePrintExam = () => {
    window.print();
    toast({
      title: "Lembar Soal Dicetak",
      description: "Lembar soal berhasil dicetak.",
    });
  };

  const handleSaveQuestions = () => {
    setIsEditQuestionsOpen(false);
    toast({
      title: "Berhasil!",
      description: "Soal ujian berhasil disimpan.",
    });
  };

  const handleImageUpload = (questionIndex: number, file: File) => {
    const preview = URL.createObjectURL(file);
    setQuestionImages(prev => ({
      ...prev,
      [questionIndex]: { file, preview, grayscale: false }
    }));
  };

  const toggleImageGrayscale = (questionIndex: number) => {
    setQuestionImages(prev => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        grayscale: !prev[questionIndex]?.grayscale
      }
    }));
  };

  const handleToggleParticipant = (studentId: number) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, inExam: !student.inExam }
        : student
    ));
  };

  const handleSaveParticipants = () => {
    setIsAddParticipantsOpen(false);
    toast({
      title: "Berhasil!",
      description: "Peserta ujian berhasil diperbarui.",
    });
  };

  const handlePreviewPdf = () => {
    setIsPreviewPdfOpen(true);
  };

  const handleExportPdf = async () => {
    const pdf = new jsPDF();
    pdf.text('Lembar Soal Ujian', 20, 20);
    pdf.text(examDetail.title, 20, 30);
    
    questions.forEach((question, index) => {
      const yPosition = 50 + (index * 30);
      pdf.text(`${index + 1}. ${question}`, 20, yPosition);
    });
    
    pdf.save(`${examDetail.title}.pdf`);
    toast({
      title: "Berhasil!",
      description: "PDF berhasil diunduh.",
    });
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

      {/* Main Layout - Left Large Card, Right Two Stacked Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Large Card - Exam Information */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card shadow-soft border-0 h-full">
            <CardHeader>
              <CardTitle>Informasi Ujian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              
              <div>
                <Label className="text-sm text-muted-foreground">Progress Peserta</Label>
                <div className="flex items-center gap-4 mt-2">
                  <ProgressCircle 
                    value={Math.round((examDetail.completedParticipants / examDetail.totalParticipants) * 100)} 
                    size={80} 
                    strokeWidth={8}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {Math.round((examDetail.completedParticipants / examDetail.totalParticipants) * 100)}%
                      </div>
                    </div>
                  </ProgressCircle>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{examDetail.completedParticipants}</span> dari{' '}
                      <span className="font-medium">{examDetail.totalParticipants}</span> siswa telah selesai
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {examDetail.totalParticipants - examDetail.completedParticipants} siswa belum mengumpulkan
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Preview Soal</Label>
                <div className="space-y-3 mt-2">
                  {questions.slice(0, 3).map((question, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg">
                      <p className="font-medium text-xs text-muted-foreground mb-1">Soal {index + 1}</p>
                      <p className="text-sm text-foreground line-clamp-2">{question}</p>
                    </div>
                  ))}
                  {questions.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{questions.length - 3} soal lainnya
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Two Stacked Cards */}
        <div className="space-y-6">
          {/* Right Card 1 - Question Management */}
          <Card className="bg-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="text-lg">Kelola Soal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setIsInfoQuestionsOpen(true)}
                variant="outline"
                className="w-full justify-start"
              >
                <Info className="mr-2 h-4 w-4" />
                Info Soal
              </Button>
              <Button
                onClick={() => setIsEditQuestionsOpen(true)}
                className="w-full justify-start bg-gradient-secondary hover:opacity-90"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Soal
              </Button>
            </CardContent>
          </Card>

          {/* Right Card 2 - Participant Management */}
          <Card className="bg-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="text-lg">Kelola Peserta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setIsAddParticipantsOpen(true)}
                variant="outline"
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Tambah Peserta
              </Button>
              <Button
                onClick={handlePreviewPdf}
                variant="outline"
                className="w-full justify-start"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Lembar Jawaban
              </Button>
              <Button
                onClick={handleExportPdf}
                className="w-full justify-start bg-gradient-primary hover:opacity-90"
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Participants Section */}
      <Card className="bg-card shadow-soft border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Peserta Ujian ({participatingStudents.length} siswa)</CardTitle>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama peserta..."
              value={participantSearch}
              onChange={(e) => setParticipantSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredParticipants.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground text-lg mb-2">Data tidak ditemukan</div>
              <div className="text-muted-foreground text-sm">
                Tidak ada peserta yang sesuai dengan pencarian Anda.
              </div>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentParticipants.map((participant) => (
                    <ParticipantCard 
                      key={participant.id} 
                      participant={participant}
                      onUpload={() => {
                        setSelectedParticipant(participant);
                        navigate(`/exams/${id}/upload/${participant.id}`);
                      }}
                      onView={() => navigate(`/exams/${id}/participant/${participant.id}`)}
                      onEdit={() => navigate(`/exams/${id}/edit/${participant.id}`)}
                      getStatusColor={getStatusColor}
                      getStatusIcon={getStatusIcon}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile Carousel */}
              <div className="block sm:hidden">
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {currentParticipants.map((participant) => (
                      <CarouselItem key={participant.id}>
                        <ParticipantCard 
                          participant={participant}
                          onUpload={() => {
                            setSelectedParticipant(participant);
                            navigate(`/exams/${id}/upload/${participant.id}`);
                          }}
                          onView={() => navigate(`/exams/${id}/participant/${participant.id}`)}
                          onEdit={() => navigate(`/exams/${id}/edit/${participant.id}`)}
                          getStatusColor={getStatusColor}
                          getStatusIcon={getStatusIcon}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}

      {/* Info Questions Modal */}
      <Dialog open={isInfoQuestionsOpen} onOpenChange={setIsInfoQuestionsOpen}>
        <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Informasi Soal Ujian</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <Label className="text-sm text-muted-foreground">Jumlah Soal</Label>
                <p className="font-medium">{questions.length} soal</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Jenis Ujian</Label>
                <p className="font-medium">Isian Singkat</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Daftar Soal</Label>
              {questions.map((question, index) => (
                <div key={index} className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm text-muted-foreground">Soal {index + 1}</span>
                    {questionImages[index] && (
                      <Badge variant="outline" className="text-xs">Bergambar</Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{question}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Questions Modal */}
      <Dialog open={isEditQuestionsOpen} onOpenChange={setIsEditQuestionsOpen}>
        <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Soal Ujian</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="space-y-4 p-4 border rounded-lg">
                <Label className="text-lg font-semibold">Soal {num}</Label>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left side - Question and Answer Key */}
                  <div className="space-y-3">
                    <div>
                      <Label>Pertanyaan</Label>
                      <Textarea
                        value={questions[num - 1] || ''}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[num - 1] = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        placeholder={`Masukkan soal nomor ${num}`}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <Label>Kunci Jawaban</Label>
                      <Textarea
                        value={answerKeys[num - 1] || ''}
                        onChange={(e) => {
                          const newAnswerKeys = [...answerKeys];
                          newAnswerKeys[num - 1] = e.target.value;
                          setAnswerKeys(newAnswerKeys);
                        }}
                        placeholder={`Masukkan kunci jawaban nomor ${num}`}
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>

                  {/* Right side - Image upload */}
                  <div className="space-y-3">
                     <div className="flex items-center space-x-2">
                       <Switch
                         id={`image-toggle-${num}`}
                         checked={!!questionImages[num - 1]}
                         onCheckedChange={(checked) => {
                           if (!checked) {
                             setQuestionImages(prev => {
                               const newImages = { ...prev };
                               delete newImages[num - 1];
                               return newImages;
                             });
                           } else {
                             setCurrentImageIndex(num - 1);
                             fileInputRef.current?.click();
                           }
                         }}
                       />
                       <Label htmlFor={`image-toggle-${num}`}>Tambahkan gambar?</Label>
                     </div>
                    
                     {questionImages[num - 1] && (
                       <div className="space-y-3">
                         <Button
                           variant="outline"
                           onClick={() => {
                             setCurrentImageIndex(num - 1);
                             fileInputRef.current?.click();
                           }}
                           className="w-full"
                         >
                           <Upload className="mr-2 h-4 w-4" />
                           {questionImages[num - 1]?.preview ? 'Ganti Gambar' : 'Pilih Gambar'}
                         </Button>
                        
                        {questionImages[num - 1]?.preview && (
                          <div className="space-y-2">
                            <div className="relative">
                              <img
                                src={questionImages[num - 1]?.preview}
                                alt={`Question ${num} image`}
                                className={`w-full h-40 object-cover rounded-lg ${
                                  questionImages[num - 1]?.grayscale ? 'grayscale' : ''
                                }`}
                              />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`grayscale-${num}`}
                                checked={questionImages[num - 1]?.grayscale || false}
                                onCheckedChange={() => toggleImageGrayscale(num - 1)}
                              />
                              <Label htmlFor={`grayscale-${num}`} className="text-sm">
                                Hitam putih
                              </Label>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && currentImageIndex !== null) {
                  handleImageUpload(currentImageIndex, file);
                }
              }}
            />
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveQuestions} className="flex-1 bg-gradient-primary hover:opacity-90">
                Simpan
              </Button>
              <Button variant="outline" onClick={() => setIsEditQuestionsOpen(false)} className="flex-1">
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Participants Modal */}
      <Dialog open={isAddParticipantsOpen} onOpenChange={setIsAddParticipantsOpen}>
        <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Peserta Ujian</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pilih siswa yang akan mengikuti ujian. Siswa yang belum mengikuti ujian akan ditampilkan di atas.
            </p>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {/* Sort students: not in exam first, then in exam */}
              {students
                .sort((a, b) => (a.inExam === b.inExam ? 0 : a.inExam ? 1 : -1))
                .map((student) => (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                    student.inExam 
                      ? 'border-success/30 bg-success/5' 
                      : 'border-destructive/30 bg-destructive/5'
                  }`}
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">NISN: {student.nisn}</p>
                  </div>
                  <Switch
                    checked={student.inExam}
                    onCheckedChange={() => handleToggleParticipant(student.id)}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveParticipants} className="flex-1 bg-gradient-primary hover:opacity-90">
                Simpan
              </Button>
              <Button variant="outline" onClick={() => setIsAddParticipantsOpen(false)} className="flex-1">
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview PDF Modal */}
      <Dialog open={isPreviewPdfOpen} onOpenChange={setIsPreviewPdfOpen}>
        <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Lembar Jawaban PDF</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-white text-black p-8 rounded-lg border">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">{examDetail.title}</h2>
                <p className="text-sm text-gray-600">Kelas: {examDetail.class} | Mata Pelajaran: {examDetail.subject}</p>
                <p className="text-sm text-gray-600">Tanggal: {new Date(examDetail.date).toLocaleDateString('id-ID')}</p>
              </div>
              
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Nama: ________________________</div>
                  <div>NISN: ________________________</div>
                </div>
              </div>
              
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <p className="font-medium">{index + 1}. {question}</p>
                    {questionImages[index]?.preview && (
                      <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 text-xs">
                        [Gambar Soal]
                      </div>
                    )}
                    <div className="border-b border-gray-300 pb-8 mb-4">
                      <p className="text-xs text-gray-500 mb-2">Jawaban:</p>
                      {Array.from({ length: 4 }).map((_, lineIndex) => (
                        <div key={lineIndex} className="border-b border-gray-200 h-6 mb-2"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Separate ParticipantCard component
function ParticipantCard({ participant, onUpload, onView, onEdit, getStatusColor, getStatusIcon }: any) {
  const StatusIcon = getStatusIcon(participant.status);
  
  return (
    <Card className="bg-gradient-card border-0 shadow-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
              {participant.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-sm">{participant.name}</h3>
              <p className="text-xs text-muted-foreground">NISN: {participant.nisn}</p>
            </div>
          </div>
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
                onClick={() => onView(participant)}
                className="flex-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                Info
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(participant)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => onUpload(participant)}
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
}