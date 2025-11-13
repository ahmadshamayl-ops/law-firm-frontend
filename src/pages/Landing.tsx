import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Target, TrendingUp, Shield, Brain, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">CashPost AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary-light">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              AI-Powered Cash Posting
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
              Automate Cash Posting with 98% Accuracy
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your accounts receivable with AI-powered payment matching. 
              Match bank transactions to invoices instantly with enterprise-grade accuracy.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary-light h-12 px-8">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  View Demo
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Match Accuracy</div>
              </div>
              <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <div className="text-4xl font-bold text-accent mb-2">85%</div>
                <div className="text-sm text-muted-foreground">Time Saved</div>
              </div>
              <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <div className="text-4xl font-bold text-success mb-2">$2M+</div>
                <div className="text-sm text-muted-foreground">Processed Daily</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Finance Teams</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to streamline your cash posting process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
              <p className="text-muted-foreground">
                Advanced NLP algorithms match payments to invoices with 98% accuracy, even with incomplete data.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Exception Handling</h3>
              <p className="text-muted-foreground">
                Unmatched payments are flagged with AI suggestions and confidence scores for quick resolution.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-muted-foreground">
                Track match rates, automation levels, and processing times with comprehensive dashboards.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bank-Grade Security</h3>
              <p className="text-muted-foreground">
                Enterprise encryption, SOC 2 compliance, and role-based access control keep your data safe.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seamless Integration</h3>
              <p className="text-muted-foreground">
                Connect with your ERP system (SAP, Oracle, Dynamics) via REST APIs in minutes.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto-Posting</h3>
              <p className="text-muted-foreground">
                Automatically post matched transactions or export for review with full audit trails.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Cash Posting?
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Join leading law firms and finance teams automating their AR processes
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">CashPost AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 CashPost AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
