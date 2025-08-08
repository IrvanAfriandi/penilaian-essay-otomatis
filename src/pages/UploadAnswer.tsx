import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Zap, Save, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { removeBackground, loadImage } from '@/lib/backgroundRemoval';

const mockQuestions = [
  'Jelaskan pengertian dari kata "gotong royong" dan berikan contoh penerapannya dalam kehidupan sehari-hari!',
  'Ceritakan pengalaman liburan yang paling berkesan menurut kalian dengan menggunakan kalimat yang baik dan benar!',
  'Apa manfaat membaca buku? Jelaskan minimal 3 manfaat dan berikan alasannya!',
  'Buatlah pantun dengan tema lingkungan hidup yang terdiri dari 4 baris!',
  'Jelaskan perbedaan antara dongeng dan fabel beserta masing-masing contohnya!'
];

const mockAnswerKeys = [
  'Gotong royong adalah kegiatan bersama-sama untuk mencapai tujuan bersama. Contoh: kerja bakti membersihkan lingkungan.',
  'Jawaban bervariasi sesuai pengalaman siswa dengan struktur cerita yang baik.',
  'Manfaat membaca: menambah wawasan, melatih konsentrasi, mengembangkan imajinasi.',
  'Pantun dengan tema lingkungan yang memenuhi syarat A-B-A-B.',
  'Dongeng: cerita rakyat dengan tokoh manusia. Fabel: cerita dengan tokoh hewan.'
];

export default function UploadAnswer() {
  const { examId, participantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedAnswers, setExtractedAnswers] = useState<string[]>(['', '', '', '', '']);
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [isProcessingExtraction, setIsProcessingExtraction] = useState(false);
  const [isProcessingGrading, setIsProcessingGrading] = useState(false);
  const [showExtractedAnswers, setShowExtractedAnswers] = useState(false);
  const [showScores, setShowScores] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Create preview
        const preview = URL.createObjectURL(file);
        setUploadedImage(preview);
        
        toast({
          title: "Foto berhasil diupload",
          description: "Silakan klik 'Ekstraksi Jawaban' untuk memproses.",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error",
          description: "Gagal mengupload foto. Silakan coba lagi.",
          variant: "destructive"
        });
      }
    }
  };

  const handleExtractAnswers = async () => {
    if (!uploadedImage) return;
    
    setIsProcessingExtraction(true);
    
    // Simulate AI processing for answer extraction
    setTimeout(() => {
      setExtractedAnswers([
        'Gotong royong adalah kegiatan bersama untuk membantu sesama dalam mencapai tujuan bersama. Contoh: kerja bakti membersihkan lingkungan sekitar.',
        'Liburan paling berkesan adalah ketika saya pergi ke pantai bersama keluarga. Kami bermain pasir dan berenang bersama.',
        'Manfaat membaca buku adalah menambah ilmu pengetahuan, melatih daya ingat, dan mengembangkan kreativitas.',
        'Laut biru jernih cemerlang, Ikan berenang di dalamnya, Mari jaga lingkungan yang tenang, Agar tetap lestari selamanya.',
        'Dongeng adalah cerita rakyat yang tokohnya manusia seperti Si Kancil. Fabel adalah cerita yang tokohnya hewan seperti kelinci dan kura-kura.'
      ]);
      setShowExtractedAnswers(true);
      setIsProcessingExtraction(false);
      
      toast({
        title: "Ekstraksi berhasil!",
        description: "Jawaban telah berhasil diekstraksi dari foto.",
      });
    }, 3000);
  };

  const handleAutoGrading = () => {
    setIsProcessingGrading(true);
    
    // Simulate AI grading
    setTimeout(() => {
      setScores([18, 16, 17, 15, 16]); // Scores out of 20 each
      setShowScores(true);
      setIsProcessingGrading(false);
      
      toast({
        title: "Penilaian selesai!",
        description: "Penilaian otomatis telah selesai.",
      });
    }, 2500);
  };

  const handleSaveGrades = () => {
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    
    toast({
      title: "Nilai tersimpan!",
      description: `Total nilai: ${totalScore}/100 berhasil disimpan.`,
    });
    
    navigate(`/exams/${examId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(`/exams/${examId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Upload Jawaban</h1>
          <p className="text-muted-foreground">Upload dan proses jawaban ujian siswa</p>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="bg-gradient-card shadow-soft border-0">
        <CardHeader>
          <CardTitle>Upload Foto Jawaban</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadedImage ? (
                <div className="space-y-4">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded answer" 
                    className="max-w-full h-64 object-contain mx-auto rounded-lg"
                  />
                  <p className="text-sm text-muted-foreground">Foto berhasil diupload. Klik untuk mengubah.</p>
                </div>
              ) : (
                <>
                  <Camera className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Upload Foto Jawaban</p>
                  <p className="text-muted-foreground mb-4">Klik di sini untuk memilih foto jawaban siswa</p>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Pilih Foto
                  </Button>
                </>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {uploadedImage && (
              <Button 
                onClick={handleExtractAnswers}
                className="w-full bg-gradient-secondary hover:opacity-90"
                disabled={isProcessingExtraction}
              >
                <Zap className="mr-2 h-4 w-4" />
                {isProcessingExtraction ? 'Memproses...' : 'Ekstraksi Jawaban'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Extracted Answers Section */}
      {showExtractedAnswers && (
        <Card className="bg-card shadow-soft border-0">
          <CardHeader>
            <CardTitle>Jawaban Hasil Ekstraksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {extractedAnswers.map((answer, index) => (
                <div key={index} className="space-y-2">
                  <Label className="font-medium">Jawaban {index + 1}</Label>
                  <p className="text-xs text-muted-foreground mb-1">
                    Soal: {mockQuestions[index]}
                  </p>
                  <Textarea
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...extractedAnswers];
                      newAnswers[index] = e.target.value;
                      setExtractedAnswers(newAnswers);
                    }}
                    className="min-h-[100px]"
                    placeholder={`Jawaban soal nomor ${index + 1}`}
                  />
                </div>
              ))}
              
              <Button 
                onClick={handleAutoGrading}
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={isProcessingGrading}
              >
                <Zap className="mr-2 h-4 w-4" />
                {isProcessingGrading ? 'Menilai...' : 'Penilaian Otomatis'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scores Section */}
      {showScores && (
        <Card className="bg-card shadow-soft border-0">
          <CardHeader>
            <CardTitle>Hasil Penilaian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {scores.map((score, index) => (
                <div key={index} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <Label className="font-medium">Soal {index + 1}</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      {mockQuestions[index]}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Kunci Jawaban:</Label>
                      <p className="text-sm text-foreground bg-success/10 p-2 rounded border-l-4 border-success">
                        {mockAnswerKeys[index]}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Jawaban Siswa:</Label>
                      <p className="text-sm text-foreground bg-muted/20 p-2 rounded">
                        {extractedAnswers[index]}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`score-${index}`} className="text-sm font-medium">
                      Nilai (0-20):
                    </Label>
                    <input
                      id={`score-${index}`}
                      type="number"
                      min="0"
                      max="20"
                      value={scores[index]}
                      onChange={(e) => {
                        const newScores = [...scores];
                        newScores[index] = parseInt(e.target.value) || 0;
                        setScores(newScores);
                      }}
                      className="w-20 px-2 py-1 border rounded text-center"
                    />
                    <span className="text-sm text-muted-foreground">/ 20</span>
                  </div>
                </div>
              ))}
              
              <div className="bg-gradient-primary/10 p-4 rounded-lg border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Nilai:</span>
                  <span className="text-2xl font-bold text-primary">
                    {scores.reduce((sum, score) => sum + score, 0)}/100
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={handleSaveGrades}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                <Save className="mr-2 h-4 w-4" />
                Simpan Nilai
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Modals */}
      <Dialog open={isProcessingExtraction} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mengekstraksi Jawaban</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Sedang memproses foto dan mengekstraksi jawaban...</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isProcessingGrading} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Menilai Jawaban</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Sedang melakukan penilaian otomatis...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}