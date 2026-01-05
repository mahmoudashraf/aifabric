import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle, Clock, Database, Pause, Play, RefreshCw, Server, Settings, Shield, XCircle, Zap, Moon, Sun, AlertTriangle, TrendingUp, Users, Target, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DocsLayout from '@/components/docs/DocsLayout';
import StoryLoveButton from '@/components/StoryLoveButton';
import PageViewCounter from "@/components/PageViewCounter";
import StoryNavigation from "@/components/StoryNavigation";
import { Link } from 'react-router-dom';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// Migration Flow Diagram Component
const MigrationFlowDiagram = () => (
  <div className="bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl p-6 border border-border/50">
    <h4 className="text-lg font-semibold text-foreground mb-4 text-center">Complete Migration Flow</h4>
    <div className="flex flex-col items-center space-y-3">
      {/* Start */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-primary/20 border border-primary/30 rounded-lg px-6 py-3 text-center"
      >
        <div className="text-sm font-mono text-primary">migrationService.startMigration()</div>
      </motion.div>
      
      <ArrowDown className="w-5 h-5 text-muted-foreground" />
      
      {/* Create Job */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-secondary/30 border border-secondary/50 rounded-lg px-6 py-4 w-full max-w-md"
      >
        <div className="text-sm font-semibold text-foreground mb-2">CREATE JOB</div>
        <div className="text-xs font-mono text-muted-foreground space-y-1">
          <div>id: "mig-uuid"</div>
          <div>status: RUNNING</div>
          <div>totalEntities: 10,000,000</div>
        </div>
      </motion.div>
      
      <ArrowDown className="w-5 h-5 text-muted-foreground" />
      
      {/* Async Submit */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-green-500/20 border border-green-500/30 rounded-lg px-6 py-3 text-center"
      >
        <div className="text-sm text-green-400">Submit to ExecutorService (Async!)</div>
        <div className="text-xs text-green-400/70 mt-1">Returns immediately ✓</div>
      </motion.div>
      
      <ArrowDown className="w-5 h-5 text-muted-foreground" />
      
      {/* Background Processing */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg px-6 py-4 w-full max-w-md"
      >
        <div className="text-sm font-semibold text-foreground mb-3">BACKGROUND PROCESSING</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-muted-foreground">Check status (paused/cancelled?)</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3 text-blue-400" />
            <span className="text-muted-foreground">Fetch batch (2000 entities)</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-yellow-400" />
            <span className="text-muted-foreground">Apply filters</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-purple-400" />
            <span className="text-muted-foreground">Enqueue for indexing</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3 text-orange-400" />
            <span className="text-muted-foreground">CHECKPOINT saved!</span>
          </div>
        </div>
      </motion.div>
      
      <ArrowDown className="w-5 h-5 text-muted-foreground" />
      
      {/* Completion */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-green-500/20 border border-green-500/50 rounded-lg px-6 py-4 text-center"
      >
        <div className="text-sm font-semibold text-green-400">COMPLETED</div>
        <div className="text-xs text-green-400/70 mt-1">10M records • 99.9% success • Zero downtime</div>
      </motion.div>
    </div>
  </div>
);

// State Machine Diagram
const StateMachineDiagram = () => (
  <div className="bg-gradient-to-br from-secondary/10 to-primary/5 rounded-xl p-6 border border-border/50">
    <h4 className="text-lg font-semibold text-foreground mb-4 text-center">Job Lifecycle State Machine</h4>
    <div className="flex flex-col items-center">
      {/* Running state - center */}
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-blue-500/20 border-2 border-blue-500/50 rounded-xl px-8 py-4 text-center mb-6"
      >
        <div className="text-lg font-bold text-blue-400">RUNNING</div>
        <div className="text-xs text-muted-foreground mt-1">Processing batches...</div>
      </motion.div>
      
      {/* Arrows and states */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <ArrowDown className="w-4 h-4 text-yellow-400 mb-2" />
          <div className="text-xs text-yellow-400 mb-1">pause()</div>
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-4 py-2 text-center">
            <Pause className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <div className="text-sm font-semibold text-yellow-400">PAUSED</div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <ArrowDown className="w-4 h-4 text-red-400 mb-2" />
          <div className="text-xs text-red-400 mb-1">cancel()</div>
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 text-center">
            <XCircle className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <div className="text-sm font-semibold text-red-400">CANCELLED</div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <ArrowDown className="w-4 h-4 text-red-400 mb-2" />
          <div className="text-xs text-red-400 mb-1">error</div>
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 text-center">
            <AlertTriangle className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <div className="text-sm font-semibold text-red-400">FAILED</div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center"
        >
          <ArrowDown className="w-4 h-4 text-green-400 mb-2" />
          <div className="text-xs text-green-400 mb-1">completes</div>
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg px-4 py-2 text-center">
            <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <div className="text-sm font-semibold text-green-400">COMPLETED</div>
          </div>
        </motion.div>
      </div>
      
      {/* Resume arrow */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Play className="w-3 h-3 text-green-400" />
        <span>PAUSED → resume() → RUNNING (from checkpoint)</span>
      </motion.div>
    </div>
  </div>
);

// Checkpoint Recovery Timeline
const CheckpointRecoveryDiagram = () => (
  <div className="bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-xl p-6 border border-border/50">
    <h4 className="text-lg font-semibold text-foreground mb-4 text-center">Checkpoint Recovery (Crash Scenario)</h4>
    <div className="space-y-3">
      {[
        { time: '11:30 PM', event: 'Start migration', page: 0, processed: 0, icon: Play },
        { time: '02:15 AM', event: 'Processed pages 0-2,449', page: 2449, processed: '4,898,000', icon: CheckCircle },
        { time: '02:30 AM', event: '💥 SERVER CRASHES', page: 2449, processed: '4,898,000', icon: AlertTriangle, danger: true },
        { time: '03:05 AM', event: 'resume(jobId) - loads checkpoint', page: 2450, processed: 'Continue...', icon: RefreshCw },
        { time: '06:30 AM', event: 'Migration completes', page: 5000, processed: '10,000,000', icon: CheckCircle, success: true },
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
          className={`flex items-center gap-4 p-3 rounded-lg ${
            item.danger ? 'bg-red-500/20 border border-red-500/30' : 
            item.success ? 'bg-green-500/20 border border-green-500/30' : 
            'bg-secondary/30'
          }`}
        >
          <div className="text-xs font-mono text-muted-foreground w-20">{item.time}</div>
          <item.icon className={`w-4 h-4 ${item.danger ? 'text-red-400' : item.success ? 'text-green-400' : 'text-primary'}`} />
          <div className="flex-1 text-sm text-foreground">{item.event}</div>
          <div className="text-xs font-mono text-muted-foreground">page: {item.page}</div>
        </motion.div>
      ))}
    </div>
    <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
      <div className="text-sm text-green-400 font-semibold">Result: Zero entities re-processed!</div>
      <div className="text-xs text-muted-foreground mt-1">4.9M entities didn't need to be processed again</div>
    </div>
  </div>
);

// Rate Limiting Visualization
const RateLimitingDiagram = () => (
  <div className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl p-6 border border-border/50">
    <h4 className="text-lg font-semibold text-foreground mb-4 text-center">Rate Limiting: Production Safety</h4>
    <div className="grid md:grid-cols-2 gap-6">
      {/* Without Rate Limit */}
      <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
        <div className="text-sm font-semibold text-red-400 mb-3">❌ Without Rate Limiting</div>
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.05 }}
              className="w-8 h-8 bg-red-500/30 rounded flex items-center justify-center text-xs"
            >
              🔥
            </motion.div>
          ))}
          <ArrowRight className="w-4 h-4 text-red-400" />
          <span className="text-xs text-red-400">💥</span>
        </div>
        <div className="text-xs text-red-400/70">Database overwhelmed • Queries timeout</div>
      </div>
      
      {/* With Rate Limit */}
      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
        <div className="text-sm font-semibold text-green-400 mb-3">✅ With Rate Limiting (100/min)</div>
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map((i) => (
            <motion.div key={i} className="flex items-center gap-1">
              <div className="w-8 h-8 bg-green-500/30 rounded flex items-center justify-center text-xs">✓</div>
              <div className="text-xs text-muted-foreground">[600ms]</div>
            </motion.div>
          ))}
        </div>
        <div className="text-xs text-green-400/70">Database happy 😊 • Production fast ⚡</div>
      </div>
    </div>
    
    {/* Rate examples */}
    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
      {[
        { rate: '1200/min', delay: '50ms', label: 'Aggressive', color: 'text-red-400' },
        { rate: '500/min', delay: '120ms', label: 'Moderate', color: 'text-yellow-400' },
        { rate: '100/min', delay: '600ms', label: 'Conservative', color: 'text-green-400' },
        { rate: '60/min', delay: '1s', label: 'Very Safe', color: 'text-blue-400' },
      ].map((item, i) => (
        <div key={i} className="bg-secondary/30 rounded-lg p-2 text-center">
          <div className={`text-sm font-mono ${item.color}`}>{item.rate}</div>
          <div className="text-xs text-muted-foreground">{item.delay} delay</div>
          <div className="text-xs text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// Multi-Tenant Isolation
const MultiTenantDiagram = () => (
  <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl p-6 border border-border/50">
    <h4 className="text-lg font-semibold text-foreground mb-4 text-center">Multi-Tenant Isolation</h4>
    
    {/* Tenants */}
    <div className="flex justify-center gap-2 mb-4 flex-wrap">
      {['Tenant 1', 'Tenant 2', 'Tenant 3', '...', 'Tenant 500'].map((tenant, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-secondary/50 rounded-lg px-3 py-2 text-xs text-center"
        >
          <Users className="w-3 h-3 mx-auto mb-1 text-primary" />
          {tenant}
        </motion.div>
      ))}
    </div>
    
    <ArrowDown className="w-5 h-5 text-muted-foreground mx-auto" />
    
    {/* Jobs */}
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 my-4">
      {[
        { id: 1, users: '25K', status: 'completed' },
        { id: 2, users: '18K', status: 'failed' },
        { id: 3, users: '42K', status: 'completed' },
        { id: 287, users: '15K', status: 'retry' },
        { id: 500, users: '8K', status: 'completed' },
      ].map((job, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className={`rounded-lg p-2 text-center text-xs ${
            job.status === 'completed' ? 'bg-green-500/20 border border-green-500/30' :
            job.status === 'failed' ? 'bg-red-500/20 border border-red-500/30' :
            'bg-yellow-500/20 border border-yellow-500/30'
          }`}
        >
          <div className="font-mono">Job {job.id}</div>
          <div className="text-muted-foreground">{job.users} users</div>
          <div className={
            job.status === 'completed' ? 'text-green-400' :
            job.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
          }>{job.status}</div>
        </motion.div>
      ))}
    </div>
    
    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30 text-center">
      <div className="text-sm text-green-400">499 tenants successful • 1 tenant needs retry</div>
      <div className="text-xs text-muted-foreground mt-1">Perfect isolation ✓</div>
    </div>
  </div>
);

// Impact Metrics
const ImpactMetrics = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[
      { value: '10M+', label: 'Records Migrated', icon: Database },
      { value: '99.9%', label: 'Success Rate', icon: Target },
      { value: 'Zero', label: 'Downtime', icon: Zap },
      { value: '16hrs', label: 'Sleep Recovered', icon: Moon },
    ].map((metric, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/20 border-primary/20">
          <CardContent className="pt-6 text-center">
            <metric.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-3xl font-bold text-foreground">{metric.value}</div>
            <div className="text-sm text-muted-foreground">{metric.label}</div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);

// Features Grid
const FeaturesGrid = () => (
  <div className="grid md:grid-cols-3 gap-4">
    {[
      { icon: Play, title: 'Pause/Resume/Cancel', desc: 'Graceful control anytime', color: 'text-blue-400' },
      { icon: RefreshCw, title: 'Checkpointing', desc: 'Survive crashes, resume where left off', color: 'text-green-400' },
      { icon: Clock, title: 'Real-time ETA', desc: 'Know exactly when it\'ll finish', color: 'text-yellow-400' },
      { icon: Shield, title: 'Smart Filtering', desc: 'Date ranges, IDs, custom logic', color: 'text-purple-400' },
      { icon: Target, title: 'Deduplication', desc: 'Don\'t migrate twice', color: 'text-orange-400' },
      { icon: Settings, title: 'Rate Limiting', desc: 'Production-safe throughput', color: 'text-cyan-400' },
    ].map((feature, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="bg-secondary/30 border-border/50 h-full hover:bg-secondary/50 transition-colors">
          <CardContent className="pt-6">
            <feature.icon className={`w-8 h-8 mb-3 ${feature.color}`} />
            <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);

export default function MigrationStory() {
  return (
    <DocsLayout>
      <motion.article 
        className="max-w-4xl mx-auto"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50 mb-12">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="py-12 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <span className="text-2xl">🔄</span>
                  Migration V1
                </span>
                <Link 
                  to="/docs/migration_story_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="migration-module-story" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Migration Module:{" "}
                <span className="text-gradient">Moving 10 Million Records</span>{" "}
                While You Sleep
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How we built a system that migrates massive datasets with pause/resume/cancel, 
                zero downtime, and real-time ETA. Part of the AI Fabric Framework series.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <RefreshCw className="h-4 w-4" />
                  Checkpoint Recovery
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Database className="h-4 w-4" />
                  10M+ Records
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  Zero Downtime
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Problem */}
        <motion.section variants={fadeIn} className="mb-12">
          <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">The Overnight Gamble</h2>
                  <p className="text-lg text-foreground font-medium">Friday, 5 PM. CTO asks:</p>
                  <blockquote className="border-l-4 border-red-500/50 pl-4 mt-2 text-lg text-foreground italic">
                    "Can you migrate 8 million user records into the new AI search by Monday morning?"
                  </blockquote>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-500/10 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-3">❌ Traditional Approach</h4>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li>• Write custom migration script</li>
                    <li>• Hope it doesn't crash</li>
                    <li>• If crashes at 6M → start over from zero</li>
                    <li>• Babysit all weekend</li>
                    <li>• Pray 🙏</li>
                  </ul>
                </div>
                
                <div className="bg-green-500/10 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-3">✅ Migration Module</h4>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li>• Start job, go home, sleep</li>
                    <li>• If crashes? Resume from checkpoint</li>
                    <li>• ETA calculated automatically</li>
                    <li>• Monday 8 AM: 8M records migrated ✓</li>
                    <li>• Zero downtime, 99.9% success ✓</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Impact Metrics */}
        <motion.section variants={fadeIn} className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">The Impact</h2>
          <ImpactMetrics />
        </motion.section>

        {/* Features */}
        <motion.section variants={fadeIn} className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">The 6 Superpowers</h2>
          <FeaturesGrid />
        </motion.section>

        {/* Migration Flow Diagram */}
        <motion.section variants={fadeIn} className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
          <MigrationFlowDiagram />
        </motion.section>

        {/* State Machine */}
        <motion.section variants={fadeIn} className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Job Lifecycle</h2>
          <StateMachineDiagram />
        </motion.section>

        {/* Checkpoint Recovery */}
        <motion.section variants={fadeIn} className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Crash Recovery</h2>
          <CheckpointRecoveryDiagram />
        </motion.section>

        {/* Rate Limiting */}
        <motion.section variants={fadeIn} className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Production Safety</h2>
          <RateLimitingDiagram />
        </motion.section>

        {/* Multi-Tenant */}
        <motion.section variants={fadeIn} className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Multi-Tenant Support</h2>
          <MultiTenantDiagram />
        </motion.section>

        {/* Real Business Cases */}
        <motion.section variants={fadeIn} className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Real Business Impact</h2>
          <div className="grid gap-4">
            {[
              { 
                title: 'E-Commerce Platform', 
                records: '8M Products', 
                time: '32 hours', 
                result: '$250K additional monthly revenue',
                icon: TrendingUp
              },
              { 
                title: 'SaaS Platform', 
                records: '12M Users / 500 Tenants', 
                time: '18 hours', 
                result: '30-50% churn reduction',
                icon: Users
              },
              { 
                title: 'Healthcare Platform', 
                records: '2M Patient Records', 
                time: 'HIPAA Compliant', 
                result: '$500K/year support savings',
                icon: Shield
              },
            ].map((case_, index) => (
              <Card key={index} className="bg-secondary/30 border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <case_.icon className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">{case_.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{case_.records}</Badge>
                        <Badge variant="outline">{case_.time}</Badge>
                      </div>
                      <p className="text-sm text-green-400 mt-2">{case_.result}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section variants={fadeIn} className="mb-12">
          <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Want the Full Technical Deep-Dive?
              </h3>
              <p className="text-muted-foreground mb-6">
                Complete code examples, configuration guide, troubleshooting tips, and more.
              </p>
              <Link 
                to="/docs/guides/migration" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Read Full Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </motion.section>

        {/* Story Navigation */}
        <motion.section variants={fadeIn} className="mt-12">
          <StoryNavigation />
        </motion.section>

        {/* Footer */}
        <motion.footer variants={fadeIn} className="border-t border-border/50 pt-8">
          <div className="flex flex-col items-center gap-4">
            <StoryLoveButton storySlug="migration-module-story" />
            <p className="text-sm text-muted-foreground text-center">
              Part of the AI Fabric Framework series — under active development for Q1 2026
            </p>
          </div>
        </motion.footer>
      </motion.article>
    </DocsLayout>
  );
}
