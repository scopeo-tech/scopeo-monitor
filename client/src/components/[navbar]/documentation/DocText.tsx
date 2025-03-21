// DocumentationComponent.tsx
import React, { useState } from 'react';
import Link from 'next/link';


interface DocSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const DocumentationComponent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('purpose');

  const sections: DocSection[] = [
    {
      id: 'purpose',
      title: 'Purpose',
      content: (
        <div>
          <p className="mb-4">The Website Monitor helps developers keep track of their deployed projects by monitoring key metrics, detecting security threats, and identifying performance issues in real time.</p>
          <p className="mb-4">Our main project is all about monitoring web-applications, giving users real-time insights into their projects. To support this, we&apos;ve built a library that simplifies API security, logging, and structured error tracking. It seamlessly integrates into any project, making monitoring and analytics effortless.</p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
            <h4 className="font-bold mb-2">Project Overview</h4>
            <ul className="list-disc pl-6">
              <li><strong>Project Duration:</strong> 5 Weeks</li>
              <li><strong>Team Size:</strong> 4 Developers</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'working-flow',
      title: 'Working Flow',
      content: (
        <div>
          <p className="mb-4">The Website Monitor operates through a lightweight monitoring agent installed on your project&apos;s server or application:</p>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2">The agent collects critical data (performance metrics, security logs, API activity)</li>
            <li className="mb-2">Data is securely encrypted and transmitted to our servers</li>
            <li className="mb-2">The monitoring dashboard processes and analyzes the data in real-time</li>
            <li className="mb-2">Users can view insights, alerts, and recommendations through the dashboard</li>
            <li className="mb-2">Configure automated notifications for critical issues</li>
          </ol>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2">Data Flow</h4>
            <p>Project Server → Monitoring Agent → Encryption → Website Monitor → Dashboard</p>
          </div>
        </div>
      ),
    },
    {
      id: 'library-with-agent',
      title: 'Library with Agent',
      content: (
        <div>
          <p className="mb-4">Our libraries provide essential functionalities that work with the monitoring agent:</p>
          
          <h4 className="font-bold mt-4 mb-2">Backend Library</h4>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Language:</strong> Node.js</li>
            <li><strong>Modules:</strong>
              <ul className="list-disc pl-6 mt-1">
                <li>Express → Core framework</li>
                <li>Helmet → Security headers</li>
                <li>CORS → Cross-Origin Resource Sharing</li>
                <li>Winston & Morgan → Logging</li>
                <li>Express-Rate-Limit → Rate limiting</li>
              </ul>
            </li>
          </ul>
          
          <h4 className="font-bold mt-4 mb-2">Frontend Library (Optional)</h4>
          <ul className="list-disc pl-6">
            <li><strong>Language:</strong> TypeScript</li>
            <li><strong>Libraries:</strong> Axios, React Query</li>
            <li><strong>Features:</strong> Error Handling & Logging</li>
          </ul>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-4">
            <h4 className="font-bold mb-2">Integration Example</h4>
            <code className="block bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
              <pre>{`// Backend integration
const { setupMonitoring } = require('website-monitor-agent');

// Initialize with your project key
setupMonitoring({
  projectKey: 'your-project-key',
  securityTracking: true,
  performanceMetrics: true,
  errorReporting: true
});`}</pre>
            </code>
          </div>
        </div>
      ),
    },
    {
      id: 'server-aggregation',
      title: 'Server (Aggregation)',
      content: (
        <div>
          <p className="mb-4">Our server aggregates data from multiple sources and provides valuable insights:</p>
          
          <h4 className="font-bold mt-2 mb-2">Data Aggregation Features</h4>
          <ul className="list-disc pl-6 mb-4">
            <li>Collecting metrics from multiple deployments</li>
            <li>Combining data across environments (development, staging, production)</li>
            <li>Statistical analysis of performance trends</li>
            <li>Anomaly detection in response times and error rates</li>
            <li>Correlation of security events across projects</li>
            <li>Unified log storage and search capabilities</li>
          </ul>
          
          <h4 className="font-bold mt-4 mb-2">Server Architecture</h4>
          <ul className="list-disc pl-6">
            <li>Scalable microservices design</li>
            <li>Real-time data processing pipeline</li>
            <li>Time-series database for metrics storage</li>
            <li>Document database for logs and errors</li>
            <li>Authentication and encryption layers</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'data-showing',
      title: 'Data Showing',
      content: (
        <div>
          <p className="mb-4">The Website Monitor provides comprehensive visual representations of your project&apos;s data:</p>
          
          <h4 className="font-bold mt-2 mb-2">Dashboard Features</h4>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Project Overview:</strong> Project Name & Status (Active, Inactive, or Failing)</li>
            <li><strong>Performance & Health Monitoring:</strong>
              <ul className="list-disc pl-6 mt-1">
                <li>Uptime Percentage → Ensure your application is always available</li>
                <li>Response Time & Latency → Monitor API speed and server response times</li>
                <li>Connection Health → Track database queries and server connections (optional)</li>
              </ul>
            </li>
            <li><strong>Security & Access Tracking:</strong>
              <ul className="list-disc pl-6 mt-1">
                <li>Failed Login Attempts → Detect unauthorized access attempts</li>
                <li>Unusual Logins → Monitor suspicious login patterns</li>
                <li>API Abuse Detection → Identify rate limit violations and unauthorized API usage</li>
              </ul>
            </li>
            <li><strong>Error & Issue Reporting:</strong>
              <ul className="list-disc pl-6 mt-1">
                <li>Total Errors & Trends → See how often issues occur and what&apos;s causing them</li>
                <li>Most Common Issues → Identify recurring problems quickly (optional)</li>
              </ul>
            </li>
            <li><strong>Logs & User Activity:</strong>
              <ul className="list-disc pl-6 mt-1">
                <li>Server Logs → Track errors, warnings, and system events</li>
                <li>User Activity Logs → See user interactions and behavior</li>
              </ul>
            </li>
          </ul>
          
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mt-2">
            <h4 className="font-bold mb-2">Visualization Types</h4>
            <ul className="list-disc pl-6">
              <li>Real-time metrics charts</li>
              <li>Heatmaps for error frequency</li>
              <li>Timeline views for incident tracking</li>
              <li>Geographic maps for user activity</li>
              <li>Custom dashboards with drag-and-drop widgets</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'dependencies',
      title: 'Dependencies and Technologies Used',
      content: (
        <div>
          <h4 className="font-bold mt-2 mb-3">Website Monitor</h4>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Frontend:</strong> Next.js along with TypeScript</li>
            <li><strong>Backend:</strong> Node.js, Express along with TypeScript</li>
            <li><strong>Database:</strong> MongoDB</li>
            <li><strong>Other:</strong>
              <ul className="list-disc pl-6 mt-1">
                <li>Socket.IO (for real-time updates)</li>
                <li>AWS & S3 Bucket (for storage and cloud services)</li>
                <li>CI/CD pipeline (for automated deployment and integration)</li>
                <li>Jest (Framework) (for unit testing and test automation)</li>
              </ul>
            </li>
          </ul>
          
          <h4 className="font-bold mt-4 mb-3">Backend Library</h4>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Language:</strong> Node.js</li>
            <li><strong>Modules:</strong>
              <ul className="list-disc pl-6 mt-1">
                <li>Express → Core framework</li>
                <li>Helmet → Security headers</li>
                <li>CORS → Cross-Origin Resource Sharing</li>
                <li>Winston & Morgan → Logging</li>
                <li>Express-Rate-Limit → Rate limiting</li>
              </ul>
            </li>
          </ul>
          
          <h4 className="font-bold mt-4 mb-3">Frontend Library (Optional)</h4>
          <ul className="list-disc pl-6">
            <li><strong>Language:</strong> TypeScript</li>
            <li><strong>Library:</strong> Axios, React Query</li>
            <li><strong>Other:</strong> Error Handling & Logging</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'features-detail',
      title: 'Features Detail Explanation',
      content: (
        <div>
          <p className="mb-4">Detailed explanation of the key features of our Website Monitor and Libraries:</p>
          
          <h4 className="font-bold mt-2 mb-2">Performance & Health Monitoring</h4>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Uptime Monitoring:</strong> Continuous checks to ensure your application is available and responsive. Receive immediate notifications when your service goes down.</li>
            <li><strong>Response Time Tracking:</strong> Monitor API and server response times to identify performance bottlenecks and slowdowns before they affect users.</li>
            <li><strong>Resource Utilization:</strong> Track CPU, memory, and disk usage to optimize server resources and prevent outages.</li>
          </ul>
          
          <h4 className="font-bold mt-4 mb-2">Security & Access Tracking</h4>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Authentication Monitoring:</strong> Track login attempts, failures, and suspicious patterns to prevent unauthorized access.</li>
            <li><strong>API Security:</strong> Monitor for unusual API usage patterns, rate limit violations, and potential data exfiltration attempts.</li>
            <li><strong>Headers & CORS:</strong> Automatic security header implementation and CORS configuration to protect against common web vulnerabilities.</li>
          </ul>
          
          <h4 className="font-bold mt-4 mb-2">Error & Issue Management</h4>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Structured Error Tracking:</strong> Capture and categorize errors with complete stack traces, request context, and user information.</li>
            <li><strong>Error Trends:</strong> Identify recurring issues and track their frequency over time to prioritize fixes.</li>
            <li><strong>Custom Alerts:</strong> Set up notifications based on error thresholds or specific error types.</li>
          </ul>
          
          <h4 className="font-bold mt-4 mb-2">Data Collection & Work Flow</h4>
          <ul className="list-disc pl-6">
            <li><strong>Agent Configuration:</strong> Customize what data is collected and how frequently it&apos;s reported.</li>
            <li><strong>Data Encryption:</strong> All collected data is encrypted before transmission to ensure security.</li>
            <li><strong>Minimal Overhead:</strong> The monitoring agent is designed to have minimal impact on your application&apos;s performance.</li>
            <li><strong>Flexible Integration:</strong> Integrates seamlessly with existing logging and monitoring solutions.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'by-us-a-coffee',
      title: 'By Us a Coffee',
      content: (
        <div>
          <p className="mb-4">Support our development team and help us improve the Website Monitor project:</p>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
            <h4 className="font-bold mb-2">Ways to Support</h4>
            <ul className="list-disc pl-6">
              <li>Make a one-time donation to our team</li>
              <li>Subscribe to our monthly supporter program</li>
              <li>Sponsor a specific feature development</li>
              <li>Purchase an enterprise support package</li>
              <li>Contribute to our open-source codebase</li>
              <li>Share feedback and feature requests</li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition">
              Support Our Project ☕
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'action-to-faq',
      title: 'Action to FAQ',
      content: (
        <div>
          <h4 className="font-bold mb-4">Frequently Asked Questions</h4>
          
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h5 className="font-semibold mb-2">How do I install the monitoring agent?</h5>
              <p>Installation is simple using npm or yarn:<br />
              <code className="bg-gray-100 px-2 py-1 rounded">npm install website-monitor-agent</code> or <code className="bg-gray-100 px-2 py-1 rounded">yarn add website-monitor-agent</code></p>
            </div>
            
            <div className="border-b pb-3">
              <h5 className="font-semibold mb-2">Does the monitoring agent affect my application&apos;s performance?</h5>
              <p>Our agent is designed to have minimal impact on performance. In typical usage, the overhead is less than 1% of CPU and memory resources.</p>
            </div>
            
            <div className="border-b pb-3">
              <h5 className="font-semibold mb-2">What data does the monitoring agent collect?</h5>
              <p>The agent collects performance metrics, error logs, API request information, and security events. It does NOT collect sensitive user data or application source code.</p>
            </div>
            
            <div className="border-b pb-3">
              <h5 className="font-semibold mb-2">How secure is the data transmission?</h5>
              <p>All data is encrypted before transmission using industry-standard encryption protocols, and all communications use HTTPS with certificate validation.</p>
            </div>
            
            <div className="border-b pb-3">
              <h5 className="font-semibold mb-2">Can I customize what metrics are collected?</h5>
              <p>Yes, you can configure the agent to collect only the metrics you&apos;re interested in, and you can set custom thresholds for alerts.</p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-2">How do I get support if I encounter issues?</h5>
              <p>Support is available through our GitHub issues page, community forums, or premium support channels for enterprise customers.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'architecture',
      title: 'Architecture',
      content: (
        <div>
          <p className="mb-4">The Website Monitor & Libraries project follows a modular architecture designed for scalability and reliability:</p>
          
          <h4 className="font-bold mt-2 mb-2">System Architecture</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <ul className="list-disc pl-6">
              <li><strong>Client Layer:</strong> Dashboard interface built with Next.js and TypeScript</li>
              <li><strong>API Gateway:</strong> Handles authentication, routing, and request validation</li>
              <li><strong>Microservices:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Metrics Service: Processes and stores performance data</li>
                  <li>Security Service: Analyzes and alerts on security events</li>
                  <li>Error Tracking Service: Aggregates and categorizes error reports</li>
                  <li>Log Management Service: Stores and indexes application logs</li>
                </ul>
              </li>
              <li><strong>Database Layer:</strong> MongoDB for document storage, time-series collections for metrics</li>
              <li><strong>Agent Layer:</strong> Lightweight monitoring agents installed on client applications</li>
            </ul>
          </div>
          
          <h4 className="font-bold mt-4 mb-2">Data Flow</h4>
          <ol className="list-decimal pl-6">
            <li className="mb-2">Monitoring agents collect data from client applications</li>
            <li className="mb-2">Data is encrypted and transmitted to the API Gateway</li>
            <li className="mb-2">API Gateway authenticates and routes data to appropriate microservices</li>
            <li className="mb-2">Microservices process and store data in the database layer</li>
            <li className="mb-2">Dashboard retrieves processed data and displays it to users</li>
            <li className="mb-2">Alert system monitors thresholds and sends notifications when triggered</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'versions',
      title: 'Versions',
      content: (
        <div>
          <h4 className="font-bold mb-4">Version History</h4>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <h5 className="font-semibold">v1.0.0 - Initial Release</h5>
              <ul className="list-disc pl-6 mt-1">
                <li>Core monitoring functionality</li>
                <li>Basic dashboard with uptime and error tracking</li>
                <li>Node.js backend library</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <h5 className="font-semibold">v1.1.0 - Security Enhancement</h5>
              <ul className="list-disc pl-6 mt-1">
                <li>Added security monitoring features</li>
                <li>Improved authentication tracking</li>
                <li>Enhanced data encryption</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-3 rounded border border-purple-200">
              <h5 className="font-semibold">v1.2.0 - Performance Metrics</h5>
              <ul className="list-disc pl-6 mt-1">
                <li>Expanded performance monitoring</li>
                <li>Added response time tracking</li>
                <li>Database connection monitoring</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <h5 className="font-semibold">v1.3.0 - Frontend Library</h5>
              <ul className="list-disc pl-6 mt-1">
                <li>Added optional frontend library</li>
                <li>Client-side error tracking</li>
                <li>User activity monitoring</li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
              <h5 className="font-semibold">v2.0.0 (Current) - Complete Overhaul</h5>
              <ul className="list-disc pl-6 mt-1">
                <li>Redesigned dashboard interface</li>
                <li>Enhanced real-time monitoring with Socket.IO</li>
                <li>Improved data visualization</li>
                <li>Added custom alert configurations</li>
                <li>Microservices architecture</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-bold mb-2">Upcoming Releases</h4>
            <ul className="list-disc pl-6">
              <li><strong>v2.1.0:</strong> Mobile application for on-the-go monitoring</li>
              <li><strong>v2.2.0:</strong> Advanced analytics with machine learning</li>
              <li><strong>v2.3.0:</strong> Integration with popular CI/CD platforms</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'license',
      title: 'License',
      content: (
        <div>
          <h4 className="font-bold mb-4">License Information</h4>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <p className="mb-2">This project is licensed under the MIT License:</p>
            
            <div className="bg-white p-3 rounded border border-gray-300 text-sm">
              <p>MIT License</p>
              <p className="mt-2">Copyright (c) 2025 Website Monitor Team</p>
              <p className="mt-2">Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the &quot;Software&quot;), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:</p>
              <p className="mt-2">The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.</p>
              <p className="mt-2">THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.</p>
            </div>
          </div>
          
          <h4 className="font-bold mt-4 mb-2">Third-Party Licenses</h4>
          <p>This project includes the following third-party open-source packages:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Express (MIT License)</li>
            <li>Next.js (MIT License)</li>
            <li>MongoDB Node.js Driver (Apache 2.0 License)</li>
            <li>Socket.IO (MIT License)</li>
            <li>Winston (MIT License)</li>
            <li>React Query (MIT License)</li>
          </ul>
          
          <p className="mt-4">Full license details can be found in the LICENSE file in our repository.</p>
        </div>
      ),
    },
    {
      id: 'github-repo',
      title: 'GitHub Repo, Source Code',
      content: (
        <div>
          <h4 className="font-bold mb-4">Repository Information</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h5 className="font-semibold mb-2">Website Monitor Repository</h5>
              <p className="mb-2">Our main project repository:</p>
              <Link href="https://github.com/your-organization/website-monitor" className="text-blue-600 hover:underline block mb-4">
                github.com/your-organization/website-monitor
              </Link>
              
              <h6 className="font-medium">Key Directories:</h6>
              <ul className="list-disc pl-6 mt-1">
                <li>frontend/ - Next.js dashboard application</li>
                <li>backend/ - Express API server</li>
                <li>docs/ - Documentation</li>
                <li>tests/ - Unit and integration tests</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h5 className="font-semibold mb-2">Libraries Repository</h5>
              <p className="mb-2">Our monitoring libraries:</p>
              <Link href="https://github.com/your-organization/website-monitor-libraries" className="text-blue-600 hover:underline block mb-4">
                github.com/your-organization/website-monitor-libraries
              </Link>
              
              <h6 className="font-medium">Key Directories:</h6>
              <ul className="list-disc pl-6 mt-1">
                <li>backend-lib/ - Node.js monitoring library</li>
                <li>frontend-lib/ - TypeScript client library</li>
                <li>examples/ - Integration examples</li>
                <li>tests/ - Unit tests</li>
              </ul>
            </div>
          </div>
          
          <h4 className="font-bold mt-6 mb-2">Contributing</h4>
          <p className="mb-3">We welcome contributions from the community! Check out our contributing guidelines:</p>
          <Link href="https://github.com/your-organization/website-monitor/blob/main/CONTRIBUTING.md" className="text-blue-600 hover:underline block mb-4">
            CONTRIBUTING.md
          </Link>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="font-semibold mb-2">Getting Started with Development</h5>
            <ol className="list-decimal pl-6">
              <li className="mb-2">Fork the repository</li>
              <li className="mb-2">Clone your fork: <code className="bg-white px-2 py-1 rounded">git clone https://github.com/your-username/website-monitor.git</code></li>
              <li className="mb-2">Install dependencies: <code className="bg-white px-2 py-1 rounded">npm install</code></li>
              <li className="mb-2">Set up environment variables (see .env.example)</li>
              <li className="mb-2">Start development server: <code className="bg-white px-2 py-1 rounded">npm run dev</code></li>
            </ol>
          </div>
          
          <h4 className="font-bold mt-6 mb-2">Documentation</h4>
          <p>Complete documentation is available at:</p>
          <Link href="https://docs.website-monitor.dev" className="text-blue-600 hover:underline">
            docs.website-monitor.dev
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-4 gap-6">
      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0 mb-6 md:mb-0">
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Documentation</h2>
          <nav>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-200 transition ${
                      activeSection === section.id ? 'bg-gray-200 font-medium' : ''
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6 pb-4 border-b">
            <h1 className="text-2xl font-bold">Website Monitor & Libraries</h1>
            <p className="text-gray-600">Real-time monitoring and security for web applications</p>
          </div>
          
          {sections.map((section) => (
            <div
              key={section.id}
              className={`${activeSection === section.id ? 'block' : 'hidden'}`}
            >
              <h2 className="text-xl font-bold mb-4">{section.title}</h2>
              <div className="prose max-w-none">{section.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentationComponent;