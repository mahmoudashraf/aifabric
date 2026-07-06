import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  Upload,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  File,
  FileType,
  HardDrive,
  MessageSquare,
  Loader2,
  X,
  Filter,
  Calendar,
  Tag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

// Mock document data
const documents = [
  {
    id: "1",
    filename: "Q4_Financial_Report_2025.pdf",
    mimeType: "application/pdf",
    fileSizeBytes: 2456789,
    extractedText: "Quarterly financial report showing revenue growth of 23% YoY. Key highlights include expansion into European markets and successful product launches. Operating margin improved to 18.5%...",
    documentType: "Financial Report",
    uploadedAt: "2026-01-10T14:30:00Z",
    wordCount: 4532,
    status: "completed",
    hasPII: true,
    piiTypes: ["phone_number", "email"],
  },
  {
    id: "2",
    filename: "Employee_Handbook_2026.docx",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSizeBytes: 1234567,
    extractedText: "This handbook outlines company policies, benefits, and procedures for all employees. Includes sections on remote work policy, healthcare benefits, and professional development opportunities...",
    documentType: "HR Document",
    uploadedAt: "2026-01-08T09:15:00Z",
    wordCount: 12450,
    status: "completed",
    hasPII: false,
    piiTypes: [],
  },
  {
    id: "3",
    filename: "Software_License_Agreement.pdf",
    mimeType: "application/pdf",
    fileSizeBytes: 567890,
    extractedText: "This Software License Agreement governs the use of the AI Fabric Framework. The licensee agrees to the terms of service including data processing, privacy requirements, and usage limitations...",
    documentType: "Legal Contract",
    uploadedAt: "2026-01-05T16:45:00Z",
    wordCount: 8920,
    status: "completed",
    hasPII: true,
    piiTypes: ["address", "name"],
  },
  {
    id: "4",
    filename: "Research_Paper_ML_Optimization.pdf",
    mimeType: "application/pdf",
    fileSizeBytes: 3456789,
    extractedText: "This paper presents novel approaches to optimizing machine learning models for production environments. We introduce a new technique for reducing inference latency by 40% while maintaining accuracy...",
    documentType: "Research Paper",
    uploadedAt: "2026-01-03T11:20:00Z",
    wordCount: 15670,
    status: "completed",
    hasPII: false,
    piiTypes: [],
  },
];

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  documentContext?: string;
  timestamp: Date;
}

const DocumentIntelligenceHub = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<typeof documents[0] | null>(null);
  const [showPII, setShowPII] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [filterType, setFilterType] = useState("All");

  const documentTypes = ["All", "Financial Report", "HR Document", "Legal Contract", "Research Paper"];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return FileType;
    if (mimeType.includes("word")) return FileText;
    return File;
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = !searchQuery || 
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.extractedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === "All" || doc.documentType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const generateDocumentAnswer = (question: string, doc: typeof documents[0]): string => {
    const q = question.toLowerCase();
    
    if (doc.documentType === "Financial Report") {
      if (q.includes("revenue") || q.includes("growth")) {
        return "Based on the Q4 Financial Report:\n\n📈 **Revenue Growth:** 23% Year-over-Year\n💰 **Operating Margin:** 18.5%\n🌍 **Key Highlight:** Successful expansion into European markets\n\nThe report indicates strong financial performance driven by new product launches.";
      } else if (q.includes("margin") || q.includes("profit")) {
        return "The operating margin improved to **18.5%** in Q4 2025. This improvement is attributed to:\n\n• Increased operational efficiency\n• Higher revenue from premium products\n• Cost optimization initiatives";
      }
    } else if (doc.documentType === "HR Document") {
      if (q.includes("remote") || q.includes("work from home")) {
        return "According to the Employee Handbook:\n\n🏠 **Remote Work Policy:**\n• Employees may work remotely up to 3 days per week\n• Manager approval required for extended remote periods\n• Core hours: 10 AM - 3 PM local time for meetings";
      } else if (q.includes("benefit") || q.includes("healthcare")) {
        return "The handbook outlines these key benefits:\n\n🏥 **Healthcare:** Comprehensive medical, dental, and vision\n📚 **Development:** $2,000 annual learning budget\n🏖️ **PTO:** Unlimited vacation policy\n💪 **Wellness:** Gym membership reimbursement";
      }
    } else if (doc.documentType === "Legal Contract") {
      if (q.includes("license") || q.includes("terms")) {
        return "Key terms from the Software License Agreement:\n\n📋 **License Type:** Enterprise perpetual license\n🔒 **Data Processing:** Must comply with GDPR and CCPA\n⚠️ **Limitations:** Commercial use only, no redistribution";
      }
    } else if (doc.documentType === "Research Paper") {
      if (q.includes("optimization") || q.includes("performance") || q.includes("latency")) {
        return "Key findings from the research paper:\n\n⚡ **Latency Reduction:** 40% improvement in inference time\n🎯 **Accuracy:** Maintained 99.2% accuracy\n🔧 **Technique:** Novel quantization approach combined with model pruning";
      }
    }
    
    return `I analyzed the document "${doc.filename}" but couldn't find specific information about your query. The document is a ${doc.documentType} containing ${doc.wordCount.toLocaleString()} words.\n\nCould you try rephrasing your question or ask about specific topics covered in this document?`;
  };

  const handleAskQuestion = () => {
    if (!inputValue.trim() || !selectedDocument) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateDocumentAnswer(inputValue, selectedDocument);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: answer,
        documentContext: selectedDocument.filename,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const openDocumentChat = (doc: typeof documents[0]) => {
    setSelectedDocument(doc);
    setMessages([
      {
        id: "1",
        type: "ai",
        content: `📄 **Document Loaded:** ${doc.filename}\n\nI've analyzed this ${doc.documentType.toLowerCase()} containing ${doc.wordCount.toLocaleString()} words. ${doc.hasPII ? "⚠️ This document contains detected PII that has been secured." : ""}\n\nWhat would you like to know about this document?`,
        documentContext: doc.filename,
        timestamp: new Date(),
      },
    ]);
    setActiveTab("qa");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="container mx-auto px-4 py-6">
          <Link
            to="/demos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Demos
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <Badge variant="secondary" className="mb-2">
                <Sparkles className="h-3 w-3 mr-1" />
                Interactive Demo
              </Badge>
              <h1 className="text-3xl font-bold">Document Intelligence Hub</h1>
              <p className="text-muted-foreground mt-1">
                AI-powered document processing with PII detection and RAG-based Q&A
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                PII Detection
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Bot className="h-3 w-3" />
                RAG Q&A
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Search className="h-3 w-3" />
                Semantic Search
              </Badge>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-lg">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{documents.length}</p>
                      <p className="text-xs text-muted-foreground">Total Documents</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <HardDrive className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">7.4 MB</p>
                      <p className="text-xs text-muted-foreground">Total Size</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                      <Shield className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{documents.filter(d => d.hasPII).length}</p>
                      <p className="text-xs text-muted-foreground">With PII Detected</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                      <CheckCircle2 className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">100%</p>
                      <p className="text-xs text-muted-foreground">Indexed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                {documentTypes.map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>

              {/* Document List */}
              <div className="space-y-3">
                {filteredDocuments.map((doc) => {
                  const FileIcon = getFileIcon(doc.mimeType);
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                              <FileIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold truncate">{doc.filename}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">{doc.documentType}</Badge>
                                    {doc.hasPII && (
                                      <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-500/50">
                                        <Shield className="h-3 w-3 mr-1" />
                                        PII Detected
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button size="sm" onClick={() => openDocumentChat(doc)}>
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Ask
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {doc.extractedText}
                              </p>
                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <HardDrive className="h-3 w-3" />
                                  {formatFileSize(doc.fileSizeBytes)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {doc.wordCount.toLocaleString()} words
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(doc.uploadedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>
                    Upload PDF, DOCX, or TXT files for AI processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors">
                    {isUploading ? (
                      <div className="space-y-4">
                        <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
                        <div className="max-w-xs mx-auto">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-sm text-muted-foreground mt-2">
                            {uploadProgress < 30 && "Extracting text..."}
                            {uploadProgress >= 30 && uploadProgress < 60 && "Detecting PII..."}
                            {uploadProgress >= 60 && uploadProgress < 90 && "Generating embeddings..."}
                            {uploadProgress >= 90 && "Indexing for search..."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Supports PDF, DOCX, TXT up to 50MB
                        </p>
                        <Button onClick={handleUpload}>
                          <Upload className="h-4 w-4 mr-2" />
                          Select Files
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Processing Pipeline */}
                  <div className="mt-8">
                    <h4 className="font-medium mb-4">Processing Pipeline</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: FileText, label: "Text Extraction", desc: "External library" },
                        { icon: Shield, label: "PII Detection", desc: "Framework" },
                        { icon: Sparkles, label: "Embeddings", desc: "Framework" },
                        { icon: Search, label: "Indexing", desc: "Framework" },
                      ].map((step, i) => (
                        <div key={step.label} className="relative">
                          <Card className="text-center p-4">
                            <step.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium text-sm">{step.label}</p>
                            <p className="text-xs text-muted-foreground">{step.desc}</p>
                          </Card>
                          {i < 3 && (
                            <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-muted-foreground">
                              →
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Search Tab */}
            <TabsContent value="search" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search across all documents... (e.g., 'revenue growth Q4', 'remote work policy')"
                      className="pl-12 h-14 text-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Semantic search - understands meaning across all document content
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Search Results */}
              <div className="space-y-4">
                {searchQuery && (
                  <p className="text-sm text-muted-foreground">
                    Found <span className="font-medium text-foreground">{filteredDocuments.length}</span> documents matching "{searchQuery}"
                  </p>
                )}

                {filteredDocuments.map((doc) => {
                  const FileIcon = getFileIcon(doc.mimeType);
                  return (
                    <Card key={doc.id} className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => openDocumentChat(doc)}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <FileIcon className="h-5 w-5 text-primary shrink-0 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold">{doc.filename}</h3>
                            <Badge variant="secondary" className="text-xs mt-1">{doc.documentType}</Badge>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                              {doc.extractedText}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Q&A Tab */}
            <TabsContent value="qa" className="space-y-4">
              {selectedDocument ? (
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
                          <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Document Q&A</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            {selectedDocument.filename}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedDocument.hasPII && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowPII(!showPII)}
                          >
                            {showPII ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                            {showPII ? "Hide PII" : "Show PII"}
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setSelectedDocument(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* PII Warning */}
                    {selectedDocument.hasPII && (
                      <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                        <div className="text-sm">
                          <span className="font-medium text-yellow-600">PII Detected:</span>{" "}
                          <span className="text-muted-foreground">
                            {selectedDocument.piiTypes.join(", ")} - {showPII ? "Showing original" : "Redacted for security"}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            message.type === "user" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-gradient-primary text-primary-foreground"
                          }`}>
                            {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          <div className={`max-w-[80%] ${message.type === "user" ? "text-right" : ""}`}>
                            <div className={`inline-block rounded-2xl px-4 py-3 ${
                              message.type === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}>
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="bg-muted rounded-2xl px-4 py-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>

                  {/* Input */}
                  <div className="p-4 border-t border-border">
                    <form onSubmit={(e) => { e.preventDefault(); handleAskQuestion(); }} className="flex gap-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask a question about this document..."
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Document</h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a document from the Documents tab to start asking questions
                  </p>
                  <Button onClick={() => setActiveTab("documents")}>
                    Browse Documents
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* Framework Features */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-muted/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">AI Fabric Framework Features Used</CardTitle>
              <CardDescription>This demo showcases the following framework capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { icon: Shield, label: "PII Detection", desc: "Auto-redaction" },
                  { icon: Sparkles, label: "Embeddings", desc: "Vector generation" },
                  { icon: Search, label: "Semantic Search", desc: "Content search" },
                  { icon: Bot, label: "RAG Q&A", desc: "Document answers" },
                  { icon: Clock, label: "Async Processing", desc: "Large docs" },
                  { icon: Tag, label: "Auto Indexing", desc: "@AICapable" },
                ].map((feature) => (
                  <div key={feature.label} className="text-center p-4 rounded-lg bg-card border border-border">
                    <feature.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium text-sm">{feature.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "50-70%", label: "Time Savings" },
              { value: "3-4 weeks", label: "Implementation" },
              { value: "12", label: "Endpoints" },
              { value: "Medium-High", label: "Complexity" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DocumentIntelligenceHub;
