import { Users, FileText, TrendingUp, Award, BookOpen, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressCircle } from '@/components/ui/progress-circle';

const stats = [
  {
    title: 'Total Siswa',
    value: '245',
    icon: Users,
    change: '+12',
    changeText: 'siswa baru bulan ini',
    color: 'text-primary'
  },
  {
    title: 'Total Ujian',
    value: '18',
    icon: FileText,
    change: '+3',
    changeText: 'ujian bulan ini',
    color: 'text-secondary'
  },
  {
    title: 'Nilai Rata-rata',
    value: '85.2',
    icon: TrendingUp,
    change: '+2.5',
    changeText: 'poin dari bulan lalu',
    color: 'text-success'
  },
  {
    title: 'Ujian Selesai',
    value: '156',
    icon: Award,
    change: '+24',
    changeText: 'ujian diselesaikan',
    color: 'text-warning'
  }
];

const recentExams = [
  {
    id: 1,
    title: 'Ujian Bahasa Indonesia - Kelas 5A',
    subject: 'Bahasa Indonesia',
    participants: 32,
    completed: 28,
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Ujian IPA - Kelas 4B',
    subject: 'IPA',
    participants: 30,
    completed: 25,
    date: '2024-01-14'
  },
  {
    id: 3,
    title: 'Ujian Matematika - Kelas 6A',
    subject: 'Matematika',
    participants: 35,
    completed: 35,
    date: '2024-01-13'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang di sistem penilaian essay</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gradient-primary hover:opacity-90">
            <BookOpen className="mr-2 h-4 w-4" />
            Buat Ujian Baru
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card shadow-soft hover:shadow-hover transition-all duration-300 animate-fade-in border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <span className="font-medium text-success">{stat.change}</span>{' '}
                    {stat.changeText}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-primary/10 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Exams */}
        <Card className="lg:col-span-2 bg-card shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Ujian Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{exam.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {exam.subject} • {exam.date}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Peserta: {exam.participants}
                      </span>
                      <span className="text-xs text-success">
                        Selesai: {exam.completed}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ProgressCircle 
                      value={(exam.completed / exam.participants) * 100} 
                      size={40}
                      strokeWidth={4}
                    />
                    <Button variant="outline" size="sm">
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-primary hover:opacity-90">
              <BookOpen className="mr-2 h-4 w-4" />
              Buat Ujian Baru
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Tambah Siswa
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Lihat Semua Ujian
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="mr-2 h-4 w-4" />
              Laporan Nilai
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}