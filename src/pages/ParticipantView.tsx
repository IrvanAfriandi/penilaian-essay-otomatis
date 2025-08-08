import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ProgressCircle } from '@/components/ui/progress-circle';

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
  scores: [18, 16, 17, 15, 16],
  submittedAt: '2024-01-20T10:30:00'
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

export default function ParticipantView() {
  const { examId, participantId } = useParams();
  const navigate = useNavigate();

  const getScoreColor = (score: number) => {
    if (score >= 18) return 'text-success';
    if (score >= 15) return 'text-warning';
    return 'text-destructive';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'E';
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
          <h1 className="text-3xl font-bold text-foreground">Detail Peserta</h1>
          <p className="text-muted-foreground">Informasi lengkap hasil ujian siswa</p>
        </div>
      </div>

      {/* Participant Info */}
      <Card className="bg-gradient-card shadow-soft border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{mockParticipant.name}</h2>
              <p className="text-muted-foreground">NISN: {mockParticipant.nisn}</p>
              <Badge className="bg-success text-success-foreground">
                Status: Selesai
              </Badge>
            </div>
            
            <div className="text-center">
              <ProgressCircle 
                value={mockParticipant.score} 
                size={120} 
                strokeWidth={8}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{mockParticipant.score}</div>
                  <div className="text-xs text-muted-foreground">Nilai Total</div>
                </div>
              </ProgressCircle>
              <div className="mt-2">
                <Badge variant="outline" className="text-lg font-bold">
                  Grade {getGrade(mockParticipant.score)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card shadow-soft border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{mockParticipant.scores.reduce((a, b) => a + b, 0)}/100</div>
            <div className="text-sm text-muted-foreground">Total Skor</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-soft border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{mockParticipant.scores.filter(s => s >= 16).length}</div>
            <div className="text-sm text-muted-foreground">Jawaban Baik</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-soft border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{mockParticipant.scores.filter(s => s >= 12 && s < 16).length}</div>
            <div className="text-sm text-muted-foreground">Jawaban Cukup</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-soft border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{mockParticipant.scores.filter(s => s < 12).length}</div>
            <div className="text-sm text-muted-foreground">Perlu Perbaikan</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Answers */}
      <Card className="bg-card shadow-soft border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detail Jawaban Per Soal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockQuestions.map((question, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="space-y-4">
                  {/* Question */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <Label className="font-semibold text-base">Soal {index + 1}</Label>
                      <Badge 
                        variant="outline" 
                        className={`${getScoreColor(mockParticipant.scores[index])}`}
                      >
                        {mockParticipant.scores[index]}/20
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground bg-muted/20 p-3 rounded">
                      {question}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Answer Key */}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Kunci Jawaban:</Label>
                      <div className="mt-1 p-3 bg-success/10 border-l-4 border-success rounded-r">
                        <p className="text-sm text-foreground">{mockAnswerKeys[index]}</p>
                      </div>
                    </div>

                    {/* Student Answer */}
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Jawaban Siswa:</Label>
                      <div className="mt-1 p-3 bg-muted/20 border-l-4 border-primary rounded-r">
                        <p className="text-sm text-foreground">{mockParticipant.answers[index]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Score Analysis */}
                  <div className="bg-muted/10 p-3 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Analisis Jawaban:</span>
                      <span className={`text-sm font-bold ${getScoreColor(mockParticipant.scores[index])}`}>
                        {mockParticipant.scores[index] >= 16 ? 'Sangat Baik' : 
                         mockParticipant.scores[index] >= 12 ? 'Baik' : 'Perlu Perbaikan'}
                      </span>
                    </div>
                    {mockParticipant.scores[index] < 16 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {mockParticipant.scores[index] >= 12 
                          ? 'Jawaban sudah mengarah ke kunci jawaban namun bisa lebih detail.'
                          : 'Jawaban belum sesuai dengan kunci jawaban yang diharapkan.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={() => navigate(`/exams/${examId}/edit/${participantId}`)}
          className="flex-1 bg-gradient-secondary hover:opacity-90"
        >
          Edit Nilai
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.print()}
          className="flex-1"
        >
          Cetak Laporan
        </Button>
      </div>
    </div>
  );
}