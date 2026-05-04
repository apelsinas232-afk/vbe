import { useEffect, useState } from "react";
import { BookOpen, ArrowRight, Sparkles, Plus, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

// --- TIPAI ---
interface Subject { id: string; name: string; }
interface Topic { id: string; subject_id: string; title: string; }
interface Question { id: string; topic_id: string; question_pdf_url: string; answer_text: string; solution_pdf_url: string; }

const Index = () => {
  const { user } = useAuth();
  const [view, setView] = useState<"subjects" | "topics" | "solve">("subjects");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin formos būsenos
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newQUrl, setNewQUrl] = useState("");
  const [newAUrl, setNewAUrl] = useState("");
  const [newAText, setNewAText] = useState("");

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    const { data } = await supabase.from("subjects").select("*").order("name");
    setSubjects(data || []);
    setLoading(false);
  };

  const loadTopics = async (subject: Subject) => {
    setLoading(true);
    const { data } = await supabase.from("topics").select("*").eq("subject_id", subject.id);
    setTopics(data || []);
    setSelectedSubject(subject);
    setView("topics");
    setLoading(false);
  };

  const startSolving = async (topic: Topic) => {
    setLoading(true);
    const { data } = await supabase.from("questions").select("*").eq("topic_id", topic.id).order("order_index");
    setQuestions(data || []);
    setSelectedTopic(topic);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setView("solve");
    setLoading(false);
  };

  // --- ADMIN FUNKCIJOS ---
  const handleAddTopic = async () => {
    if (!newTopicTitle || !selectedSubject) return;
    await supabase.from("topics").insert([{ title: newTopicTitle, subject_id: selectedSubject.id }]);
    setNewTopicTitle("");
    loadTopics(selectedSubject);
  };

  const handleAddQuestion = async () => {
    if (!selectedTopic) return;
    await supabase.from("questions").insert([{ 
      topic_id: selectedTopic.id, 
      question_pdf_url: newQUrl, 
      answer_text: newAText, 
      solution_pdf_url: newAUrl 
    }]);
    setNewQUrl(""); setNewAUrl(""); setNewAText("");
    startSolving(selectedTopic);
  };

  if (!user) return <div className="p-10 text-center">Prašome prisijungti...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="container py-8">
        
        {/* NAVIGACIJA (Breadcrumbs) */}
        <div className="mb-6 flex gap-2 text-sm text-muted-foreground">
          <span className="cursor-pointer hover:text-primary" onClick={() => setView("subjects")}>Dalykai</span>
          {selectedSubject && (
            <> <ChevronRight className="h-4 w-4" /> <span className="cursor-pointer hover:text-primary" onClick={() => setView("topics")}>{selectedSubject.name}</span> </>
          )}
        </div>

        {/* 1. DALYKŲ PASIRINKIMAS */}
        {view === "subjects" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Pasirinkite dalyką</h1>
            <div className="grid gap-4 md:grid-cols-2">
              {subjects.map(s => (
                <Card key={s.id} className="cursor-pointer hover:border-primary transition-all" onClick={() => loadTopics(s)}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg"><BookOpen className="text-primary" /></div>
                      <span className="text-xl font-medium">{s.name}</span>
                    </div>
                    <ArrowRight />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 2. TEMŲ PASIRINKIMAS */}
        {view === "topics" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{selectedSubject?.name}: Temos</h1>
            <div className="grid gap-3">
              {topics.map(t => (
                <Button key={t.id} variant="outline" className="justify-between h-14 text-lg" onClick={() => startSolving(t)}>
                  {t.title} <ChevronRight />
                </Button>
              ))}
            </div>

            {/* ADMIN: Pridėti temą */}
            <div className="mt-12 p-6 border-2 border-dashed rounded-xl bg-white/50">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Plus size={18}/> Pridėti naują temą (Admin)</h3>
              <div className="flex gap-2">
                <Input placeholder="Temos pavadinimas" value={newTopicTitle} onChange={(e) => setNewTopicTitle(e.target.value)} />
                <Button onClick={handleAddTopic}>Sukurti</Button>
              </div>
            </div>
          </div>
        )}

        {/* 3. UŽDUOČIŲ SPRENDIMAS */}
        {view === "solve" && questions.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedTopic?.title} ({currentQuestionIndex + 1} / {questions.length})</h2>
              <Button variant="ghost" onClick={() => setView("topics")}>Grįžti į temas</Button>
            </div>

            <Card className="overflow-hidden border-2">
              <div className="bg-white p-2 border-b flex justify-between items-center text-sm font-medium">
                Užduoties peržiūra
              </div>
              <div className="aspect-[4/3] bg-slate-200">
                {/* PDF arba Paveikslėlis */}
                <iframe src={questions[currentQuestionIndex].question_pdf_url} className="w-full h-full" title="Užduotis" />
              </div>
            </Card>

            <div className="flex flex-col gap-4">
              {!showAnswer ? (
                <Button size="lg" className="w-full h-16 text-xl" onClick={() => setShowAnswer(true)}>
                  <CheckCircle className="mr-2" /> Patikrinti atsakymą
                </Button>
              ) : (
                <Card className="bg-green-50 border-green-200 animate-in fade-in slide-in-from-bottom-2">
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <p className="text-sm uppercase font-bold text-green-700">Teisingas atsakymas:</p>
                      <p className="text-2xl font-semibold">{questions[currentQuestionIndex].answer_text}</p>
                    </div>
                    {questions[currentQuestionIndex].solution_pdf_url && (
                      <a href={questions[currentQuestionIndex].solution_pdf_url} target="_blank" className="text-primary underline font-medium block">
                        Peržiūrėti pilną sprendimą (PDF)
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" disabled={currentQuestionIndex === 0} onClick={() => {setCurrentQuestionIndex(i => i - 1); setShowAnswer(false)}}>
                  <ChevronLeft /> Atgal
                </Button>
                <Button disabled={currentQuestionIndex === questions.length - 1} onClick={() => {setCurrentQuestionIndex(i => i + 1); setShowAnswer(false)}}>
                  Toliau <ChevronRight />
                </Button>
              </div>
            </div>

            {/* ADMIN: Pridėti užduotį į šią temą */}
            <div className="mt-20 p-6 border-2 border-dashed rounded-xl bg-white/50 space-y-4">
              <h3 className="font-bold flex items-center gap-2"><Plus size={18}/> Įkelti užduotį į "{selectedTopic?.title}"</h3>
              <Input placeholder="Užduoties PDF/Paveikslėlio nuoroda (URL)" value={newQUrl} onChange={(e) => setNewQUrl(e.target.value)} />
              <Input placeholder="Teisingas atsakymas (trumpas tekstas)" value={newAText} onChange={(e) => setNewAText(e.target.value)} />
              <Input placeholder="Sprendimo PDF nuoroda (URL)" value={newAUrl} onChange={(e) => setNewAUrl(e.target.value)} />
              <Button className="w-full" onClick={handleAddQuestion}>Įkelti užduotį</Button>
            </div>
          </div>
        )}

        {view === "solve" && questions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Šioje temoje užduočių dar nėra.</p>
            <Button onClick={() => setView("topics")}>Grįžti</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;