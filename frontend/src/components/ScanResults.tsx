import { Shield, AlertTriangle, CheckCircle, Clock, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ScanResultsProps {
  results: {
    malicious: number;
    suspicious: number;
    clean: number;
    total: number;
    md5?: string;
    sha256?: string;
    sha512?: string;
  } | null;
  isScanning: boolean;
  scanProgress: number;
  scanStep: string;
}

export const ScanResults = ({ results, isScanning, scanProgress, scanStep }: ScanResultsProps) => {
  if (isScanning) {
    return (
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center">
            <Clock className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-medium mb-2">Analyzing File...</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {scanStep}
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Please wait while we scan your file with multiple security engines
            </p>
            
            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto space-y-3">
              <Progress 
                value={scanProgress} 
                className="h-3 bg-muted/50"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(scanProgress)}%</span>
              </div>
            </div>

            {/* Scanning Steps Indicator */}
            <div className="mt-6 grid grid-cols-4 gap-2 max-w-sm mx-auto">
              <div className={`h-2 rounded-full transition-colors duration-300 ${
                scanProgress >= 25 ? 'bg-primary' : 'bg-muted'
              }`} />
              <div className={`h-2 rounded-full transition-colors duration-300 ${
                scanProgress >= 50 ? 'bg-primary' : 'bg-muted'
              }`} />
              <div className={`h-2 rounded-full transition-colors duration-300 ${
                scanProgress >= 75 ? 'bg-primary' : 'bg-muted'
              }`} />
              <div className={`h-2 rounded-full transition-colors duration-300 ${
                scanProgress >= 100 ? 'bg-primary' : 'bg-muted'
              }`} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null;
  }

  const getThreatLevel = () => {
    if (results.malicious > 0) return 'high';
    if (results.suspicious > 0) return 'medium';
    return 'low';
  };

  const threatLevel = getThreatLevel();
  const cleanPercentage = (results.clean / results.total) * 100;

  return (
    <div className="space-y-6">
      {/* Threat Assessment */}
      <Card className={`border-2 ${
        threatLevel === 'high' ? 'border-destructive bg-destructive/5' :
        threatLevel === 'medium' ? 'border-accent bg-accent/5' :
        'border-primary bg-primary/5'
      }`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {threatLevel === 'high' ? (
              <AlertTriangle className="h-6 w-6 text-destructive" />
            ) : threatLevel === 'medium' ? (
              <Shield className="h-6 w-6 text-accent" />
            ) : (
              <CheckCircle className="h-6 w-6 text-primary" />
            )}
            <span>
              {threatLevel === 'high' ? 'THREAT DETECTED' :
               threatLevel === 'medium' ? 'SUSPICIOUS FILE' :
               'FILE CLEAN'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{results.malicious}</div>
              <div className="text-sm text-muted-foreground">Malicious</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{results.suspicious}</div>
              <div className="text-sm text-muted-foreground">Suspicious</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{results.clean}</div>
              <div className="text-sm text-muted-foreground">Clean</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{results.total}</div>
              <div className="text-sm text-muted-foreground">Total Engines</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Clean Detection Rate</span>
              <span>{cleanPercentage.toFixed(1)}%</span>
            </div>
            <Progress 
              value={cleanPercentage} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* File Hashes */}
      {(results.md5 || results.sha256 || results.sha512) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Hash className="h-5 w-5" />
              <span>File Hashes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.md5 && (
              <div>
                <Badge variant="secondary" className="mb-2">MD5</Badge>
                <div className="font-mono text-sm bg-muted p-2 rounded break-all">
                  {results.md5}
                </div>
              </div>
            )}
            {results.sha256 && (
              <div>
                <Badge variant="secondary" className="mb-2">SHA-256</Badge>
                <div className="font-mono text-sm bg-muted p-2 rounded break-all">
                  {results.sha256}
                </div>
              </div>
            )}
            {results.sha512 && (
              <div>
                <Badge variant="secondary" className="mb-2">SHA-512</Badge>
                <div className="font-mono text-sm bg-muted p-2 rounded break-all">
                  {results.sha512}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};