import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InsightReportProps {
  insights: {
    codeStructure: {
      description: string;
    };
    complexityAnalysis: {
      complexAreas: Array<{
        area: string;
        complexity: number;
        refactoringSuggestions: string[];
      }>;
      overallComplexity: number;
    };
    documentationCoverage: {
      wellDocumented: string[];
      needsAttention: string[];
      overallCoverage: number;
    };
    dependencyTracker: {
      external: string[];
      internal: string[];
      dependencyRelations: string;
    };
    codeHealthMetrics: {
      codeQuality: number;
      testCoverage: number;
      securityVulnerabilities: Array<{
        severity: "low" | "medium" | "high" | "critical";
        description: string;
      }>;
      cyclomaticComplexity: number;
      codeDuplication: number;
      maintainabilityIndex: number;
      codeChurn: number;
    };
  };
}

const InsightReport: React.FC<InsightReportProps> = ({ insights }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Code Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{insights.codeStructure.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Complexity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Overall Complexity: {insights.complexityAnalysis.overallComplexity}</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.complexityAnalysis.complexAreas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="complexity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <Accordion type="single" collapsible className="mt-4">
            {insights.complexityAnalysis.complexAreas.map((area, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{area.area}</AccordionTrigger>
                <AccordionContent>
                  <p>Complexity: {area.complexity}</p>
                  <p>Refactoring Suggestions:</p>
                  <ul className="list-disc pl-5">
                    {area.refactoringSuggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Code Health Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="mb-2">Code Quality: {insights.codeHealthMetrics.codeQuality}%</p>
              <Progress value={insights.codeHealthMetrics.codeQuality} />
            </div>
            <div>
              <p className="mb-2">Test Coverage: {insights.codeHealthMetrics.testCoverage}%</p>
              <Progress value={insights.codeHealthMetrics.testCoverage} />
            </div>
            <div>
              <p className="mb-2">Cyclomatic Complexity: {insights.codeHealthMetrics.cyclomaticComplexity}</p>
              <Progress value={Math.min(insights.codeHealthMetrics.cyclomaticComplexity / 10 * 100, 100)} />
            </div>
            <div>
              <p className="mb-2">Code Duplication: {insights.codeHealthMetrics.codeDuplication}%</p>
              <Progress value={insights.codeHealthMetrics.codeDuplication} />
            </div>
            <div>
              <p className="mb-2">Maintainability Index: {insights.codeHealthMetrics.maintainabilityIndex}</p>
              <Progress value={insights.codeHealthMetrics.maintainabilityIndex} />
            </div>
            <div>
              <p className="mb-2">Code Churn: {insights.codeHealthMetrics.codeChurn}</p>
              <Progress value={Math.min(insights.codeHealthMetrics.codeChurn / 100 * 100, 100)} />
            </div>
            <div>
              <p className="mb-2">Security Vulnerabilities:</p>
              {insights.codeHealthMetrics.securityVulnerabilities.map((vuln, index) => (
                <div key={index} className="mb-2">
                  <Badge variant={vuln.severity === 'critical' || vuln.severity === 'high' ? 'destructive' : vuln.severity === 'medium' ? 'secondary' : 'outline'}>
                    {vuln.severity}
                  </Badge>
                  <span className="ml-2">{vuln.description}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentation Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={insights.documentationCoverage.overallCoverage} className="mb-4" />
          <p className="mb-2">Well Documented Areas:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {insights.documentationCoverage.wellDocumented.map((area, index) => (
              <Badge key={index} variant="secondary">{area}</Badge>
            ))}
          </div>
          <p className="mb-2">Areas Needing Attention:</p>
          <div className="flex flex-wrap gap-2">
            {insights.documentationCoverage.needsAttention.map((area, index) => (
              <Badge key={index} variant="destructive">{area}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dependency Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{insights.dependencyTracker.dependencyRelations}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">External Dependencies:</h4>
              <ul className="list-disc pl-5">
                {insights.dependencyTracker.external.map((dep, index) => (
                  <li key={index}>{dep}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Internal Dependencies:</h4>
              <ul className="list-disc pl-5">
                {insights.dependencyTracker.internal.map((dep, index) => (
                  <li key={index}>{dep}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightReport;
