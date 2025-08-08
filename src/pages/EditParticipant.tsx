import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const mockParticipant = {
  id: 1,
  name: 'Ahmad Rizki',
  nisn: '0051234567',
  status: 'completed',
  score: 85,
  answers: [
    'Gotong royong adalah kegiatan bersama untuk membantu sesama dalam mencapai tujuan bersama. Contoh: kerja bakti membersihkan lingkungan sekitar.',
    'Liburan paling berkesan adalah ketika saya pergi ke pantai bersama keluarga. Kami bermain pasir dan berenang bersama.',
    'Manfaat membaca buku adalah menambah ilmu pengetahuan, melatih daya ingat, dan mengembangkan kreativitas.',
    'Laut biru jernih cemerlang, Ikan berenang di dalamnya, Mari jaga lingkungan yang tenang, Agar tetap lestari selamanya.',
    'Dongeng adalah cerita rakyat yang tokohnya manusia seperti Si Kancil. Fabel adalah cerita yang tokohnya hewan seperti kelinci dan kura-kura.'
  ],
  scores: [18, 16, 17, 15, 16]
};

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

export default function EditParticipant() {
  const { examId, participantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [editedAnswers, setEditedAnswers] = useState(mockParticipant.answers);
  const [editedScores, setEditedScores] = useState(mockParticipant.scores);

  const handleSave = () => {
    const totalScore = editedScores.reduce((sum, score) => sum + score, 0);
    
    toast({
      title: "Berhasil!",
      description: `Jawaban dan nilai berhasil diperbarui. Total nilai: ${totalScore}/100`,
    });
    
    navigate(`/exams/${examId}/participant/${participantId}`);
  };

  const handleCancel = () => {
    navigate(`/exams/${examId}/participant/${participantId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Edit Jawaban & Nilai</h1>
          <p className="text-muted-foreground">Edit jawaban dan nilai untuk {mockParticipant.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Nilai</p>
          <p className="text-2xl font-bold text-primary">
            {editedScores.reduce((sum, score) => sum + score, 0)}/100
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Answer Photo */}
        <Card className="bg-card shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Foto Jawaban
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/20 rounded-lg p-8 text-center min-h-[400px] flex items-center justify-center">
              <div className="text-muted-foreground">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Foto Jawaban Siswa</p>
                <p className="text-sm">Foto jawaban yang diupload oleh siswa akan ditampilkan di sini</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Editable Content */}
        <div className="space-y-6">
          {mockQuestions.map((question, index) => (
            <Card key={index} className="bg-gradient-card shadow-soft border-0">
              <CardContent className="p-6 space-y-4">
                {/* Question */}
                <div>
                  <Label className="font-semibold text-base mb-2 block">Soal {index + 1}</Label>
                  <p className="text-sm text-foreground bg-muted/20 p-3 rounded">
                    {question}
                  </p>
                </div>

                {/* Answer Key (Read-only) */}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Kunci Jawaban:</Label>
                  <div className="mt-1 p-3 bg-success/10 border-l-4 border-success rounded-r">
                    <p className="text-sm text-foreground">{mockAnswerKeys[index]}</p>
                  </div>
                </div>

                {/* Editable Student Answer */}
                <div>
                  <Label htmlFor={`answer-${index}`} className="text-sm font-medium">
                    Jawaban Siswa (dapat diedit):
                  </Label>
                  <Textarea
                    id={`answer-${index}`}
                    value={editedAnswers[index]}
                    onChange={(e) => {
                      const newAnswers = [...editedAnswers];
                      newAnswers[index] = e.target.value;
                      setEditedAnswers(newAnswers);
                    }}
                    className="mt-1 min-h-[100px]"
                    placeholder="Jawaban siswa"
                  />
                </div>

                {/* Editable Score */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`score-${index}`} className="text-sm font-medium">
                      Nilai (0-20):
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id={`score-${index}`}
                        type="number"
                        min="0"
                        max="20"
                        value={editedScores[index]}
                        onChange={(e) => {
                          const newScores = [...editedScores];
                          newScores[index] = Math.min(20, Math.max(0, parseInt(e.target.value) || 0));
                          setEditedScores(newScores);
                        }}
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-muted-foreground">/ 20</span>
                    </div>
                  </div>
                  
                  {/* Score indicator */}
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      editedScores[index] >= 18 ? 'text-success' :
                      editedScores[index] >= 15 ? 'text-warning' : 'text-destructive'
                    }`}>
                      {editedScores[index] >= 18 ? 'A' :
                       editedScores[index] >= 15 ? 'B' :
                       editedScores[index] >= 12 ? 'C' : 'D'}
                    </div>
                    <div className="text-xs text-muted-foreground">Grade</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t">
        <Button 
          onClick={handleSave}
          className="flex-1 bg-gradient-primary hover:opacity-90"
        >
          <Save className="mr-2 h-4 w-4" />
          Simpan Perubahan
        </Button>
        <Button 
          variant="outline" 
          onClick={handleCancel}
          className="flex-1"
        >
          Batal
        </Button>
      </div>
    </div>
  );
}