"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageLink {
  href: string;
  title: string;
}

interface PageData {
  title: string;
  section: string;
  prev: PageLink | null;
  next: PageLink | null;
  content: () => React.ReactNode;
}

interface NavigationSection {
  title: string;
  links: PageLink[];
}

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: (href: string) => void;
}

interface SidebarSectionProps {
  title: string;
  links: PageLink[];
  currentPage: string;
  onNavigate: (href: string) => void;
}

interface PaginationProps {
  prev: PageLink | null;
  next: PageLink | null;
  onNavigate: (href: string) => void;
}

interface TableOfContentsItem {
  id: string;
  title: string;
}

const LogoIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 mr-2"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const NavIcon: React.FC<{ direction?: "left" | "right" }> = ({
  direction = "right",
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${direction === "left" ? "mr-1 rotate-180" : "ml-1"}`}
  >
    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
  </svg>
);

// SidebarLink component
const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  children,
  isActive,
  onClick,
}) => (
  <button
    onClick={() => onClick(href)}
    className={`block w-full text-left py-2 px-4 text-sm transition-colors ${
      isActive
        ? "text-foreground font-medium"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

// SidebarSection component
const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  links,
  currentPage,
  onNavigate,
}) => (
  <div className="pb-4">
    <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-medium">{title}</h4>
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {links.map((link) => (
        <SidebarLink
          key={link.href}
          href={link.href}
          isActive={currentPage === link.href}
          onClick={onNavigate}
        >
          {link.title}
        </SidebarLink>
      ))}
    </div>
  </div>
);

// Package manager tabs component
const PackageManagerTabs: React.FC = () => {
  const [packageManager, setPackageManager] = useState<string>("npm");
  const [copiedState, setCopiedState] = useState<{ [key: string]: boolean }>({
    npm: false,
    yarn: false,
    pnpm: false,
  });
  const copyToClipboard = async (pkg: string) => {
    try {
      await navigator.clipboard.writeText(commands[pkg]);
      setCopiedState((prev) => ({ ...prev, [pkg]: true }));
      setTimeout(() => {
        setCopiedState((prev) => ({ ...prev, [pkg]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const commands: Record<string, string> = {
    npm: "npm install scopeo",
    yarn: "yarn add scopeo",
    pnpm: "pnpm add scopeo",
  };

  return (
    <Tabs
      defaultValue={packageManager}
      onValueChange={setPackageManager}
      className="relative mt-6 w-full"
    >
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
        {Object.keys(commands).map((pkg) => (
          <TabsTrigger
            key={pkg}
            value={pkg}
            className="rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            {pkg}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.keys(commands).map((pkg) => (
        <TabsContent
          key={pkg}
          value={pkg}
          className="relative rounded-md border"
        >
          <pre className="language-bash mt-2 ms-2">
            <code className="language-bash">{commands[pkg]}</code>
          </pre>
          <button
            onClick={() => copyToClipboard(pkg)}
            className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 transition-all duration-300"
          >
            {copiedState[pkg] ? (
              <Check
                size={20}
                className="text-green-500 scale-110 transition-transform duration-300"
              />
            ) : (
              <Copy size={20} className="transition-opacity duration-300" />
            )}
          </button>
        </TabsContent>
      ))}
    </Tabs>
  );
};

// Pagination component
const Pagination: React.FC<PaginationProps> = ({ prev, next, onNavigate }) => (
  <div className="flex items-center justify-between">
    {prev && (
      <div className="flex items-center space-x-2 text-sm">
        <div className="flex items-center">
          <NavIcon direction="left" />
          <button
            onClick={() => onNavigate(prev.href)}
            className="text-muted-foreground hover:text-foreground"
          >
            Previous: {prev.title}
          </button>
        </div>
      </div>
    )}
    {!prev && <div />}
    {next && (
      <div className="flex items-center space-x-2 text-sm">
        <div className="flex items-center">
          <button
            onClick={() => onNavigate(next.href)}
            className="text-muted-foreground hover:text-foreground"
          >
            Next: {next.title}
          </button>
          <NavIcon direction="right" />
        </div>
      </div>
    )}
  </div>
);

import { Copy, Check, Menu, X } from "lucide-react";

const CodeBlock: React.FC<{ language: string; children: React.ReactNode }> = ({
  language,
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(children));
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative rounded-md border">
      <pre className={`language-${language} ms-2 my-2`}>
        <code className={`language-${language}`}>{children}</code>
      </pre>

      <button
        onClick={copyToClipboard}
        className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 transition-all duration-300"
      >
        {copied ? (
          <Check
            size={20}
            className="text-green-500 scale-110 transition-transform duration-300"
          />
        ) : (
          <Copy size={20} className="transition-opacity duration-300" />
        )}
      </button>
    </div>
  );
};

// main documentation component
const ScopeoDocumentation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("/docs/introduction");
  const [isOpen, setIsOpen] = useState(false);

  const pages: Record<string, PageData> = {
    // Getting Started section
    "/docs/introduction": {
      title: "Introduction",
      section: "Getting Started",
      prev: null,
      next: { href: "/docs/installation", title: "Installation" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Introduction</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to Scopeo - the comprehensive monitoring solution for your
            applications.
          </p>

          <div className="space-y-4">
            <h2
              id="what-is-scopeo"
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              What is Scopeo?
            </h2>
            <p>
              Scopeo is a powerful monitoring library that provides real-time
              insights into your application&apos;s performance, security, and
              errors. It helps you identify and resolve issues quickly,
              improving overall user experience.
            </p>

            <h2
              id="key-features"
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              Key Features
            </h2>
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
              <li>Real-time error tracking and monitoring</li>
              <li>Performance metrics collection and analysis</li>
              <li>Security vulnerability detection</li>
              <li>User behavior analytics</li>
              <li>Customizable alerts and notifications</li>
              <li>Comprehensive dashboard for visualization</li>
            </ul>

            <h2
              id="why-scopeo"
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              Why Scopeo?
            </h2>
            <p>
              Scopeo is designed to be lightweight, easy to integrate, and
              powerful enough for enterprise applications. With minimal
              configuration, you can start monitoring your application and gain
              valuable insights.
            </p>

            <h2
              id="workflow"
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              How It Works
            </h2>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                1. Integrating the Monitoring Agent
              </h3>
              <p>
                Users install a lightweight LIBRARY with an agent in their
                application (Server side). This agent automatically starts
                tracking performance, security, and error logs.
              </p>

              <h3
                id="data-collection & processing"
                className="text-xl font-semibold"
              >
                2. Data Collection & Processing
              </h3>
              <ul className="list-disc ml-6 flex flex-col space-y-2">
                <li>
                  <strong>Performence and health metrices</strong> → Tracks API
                  availability & speed
                </li>
                <li>
                  <strong>Security Logs</strong> → Detects failed logins &
                  suspicious activity
                </li>
                <li>
                  <strong>Error Tracking</strong> → Captures system errors & API
                  failures
                </li>
                <li>
                  <strong>User Activity Logs</strong> → Monitors key
                  interactions
                </li>
              </ul>
              <p>
                The collected data is securely transmitted to the monitoring
                server in real-time.
              </p>

              <h3
                id="real-time analysis & dashboard display"
                className="text-xl font-semibold"
              >
                3. Real-Time Analysis & Dashboard Display
              </h3>
              <p>
                The monitoring server processes the data and updates the
                dashboard.
              </p>
              <ul className="list-disc ml-6 flex flex-col space-y-2">
                <li>
                  <strong>Live Performance Metrics</strong> → API latency,
                  uptime, and trends
                </li>
                <li>
                  <strong>Security Alerts</strong> → Failed login attempts,
                  unauthorized access
                </li>
                <li>
                  <strong>Error Reports</strong> → Frequency of errors &
                  possible causes
                </li>
              </ul>
              <p>
                <strong>Socket.IO</strong> ensures that all updates appear
                instantly on the dashboard.
              </p>

              <h3
                id="alert & issue detection"
                className="text-xl font-semibold"
              >
                4. Alerts & Issue Detection
              </h3>
              <p>Users receive real-time notifications when:</p>
              <ul className="list-disc ml-6 flex flex-col space-y-2">
                <li>The application is down</li>
                <li>A security breach is detected</li>
                <li>API response times are too slow</li>
              </ul>
              <p>
                Alerts can be sent via{" "}
                <strong>email, Slack, or other integrations</strong>.
              </p>

              <h3
                id="taking action & optimizing performance"
                className="text-xl font-semibold"
              >
                5. Taking Action & Optimizing Performance
              </h3>
              <ul className="list-disc ml-6 flex flex-col space-y-2">
                <li>Debug API failures & security vulnerabilities</li>
                <li>Optimize performance by addressing bottlenecks</li>
                <li>Apply security patches to prevent further threats</li>
              </ul>
              <p>Logs and reports are stored for further analysis.</p>
            </div>
          </div>
        </div>
      ),
    },
    "/docs/installation": {
      title: "Installation",
      section: "Getting Started",
      prev: { href: "/docs/introduction", title: "Introduction" },
      next: { href: "/docs/basic-setup", title: "Basic Setup" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
          <p className="text-lg text-muted-foreground">
            How to install and set up Scopeo in your project.
          </p>

          <div className="space-y-4">
            <h2
              id="installation"
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              1. Installation
            </h2>
            <p>Run the command to install Scopeo in your project:</p>

            <PackageManagerTabs />
          </div>

          <div className="space-y-4">
            <h2
              id="configuration"
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              2. Add configuration
            </h2>
            <p>Configure Scopeo with your API keys and environment settings:</p>

            <CodeBlock language="javascript">
              {`import { configManager } from "scopeo";

export const setupScopeoConfig = () => {
  try {
    configManager.setConfig({
      apiKey: process.env.API_KEY,
      passKey: process.env.PASS_KEY,
      environment: process.env.ENVIRONMENT // 'development' or 'production'
    });
  } catch (error) {
    console.log(error, "from scopeo package");
  }
}`}
            </CodeBlock>
          </div>

          <div className="space-y-4">
            <h2
              id="initialize"
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              3. Initialize Scopeo
            </h2>
            <p>You can now start using Scopeo in your project:</p>

            <CodeBlock language="javascript">
              {`import { setupScopeoConfig } from './config';
import initializeScopeo from 'scopeo';
import express from 'express';

const app = express();

// Call this in your entry file
setupScopeoConfig();

// Initialize Scopeo with your app
initializeScopeo(app);

// The rest of your app configuration
app.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
            </CodeBlock>
          </div>
        </div>
      ),
    },
    "/docs/basic-setup": {
      title: "Basic Setup",
      section: "Getting Started",
      prev: { href: "/docs/installation", title: "Installation" },
      next: { href: "/docs/library-agent", title: "Configuration" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Basic Setup</h1>
          <p className="text-lg text-muted-foreground">
            Quick start guide to get Scopeo running in your application.
          </p>

          <div className="space-y-4">
            <h2
              id="quick-start"
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              Quick Start
            </h2>
            <p>Here&apos;s the minimal setup needed to start using Scopeo:</p>

            <CodeBlock language="javascript">
              {`// index.js - Your application entry point
import express from 'express';
import { configManager, initializeScopeo, scopeoErrorHandler } from 'scopeo';

const app = express();

// 1. Configure Scopeo
configManager.setConfig({
  apiKey: process.env.SCOPEO_API_KEY,
  passKey: process.env.SCOPEO_PASS_KEY,
  environment: process.env.NODE_ENV
});

// 2. Initialize Scopeo
initializeScopeo(app);

// Your routes and middleware
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 3. Add error handler (must be after all routes)
scopeoErrorHandler(app);

// Start your server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
            </CodeBlock>

            <h2
              id="verification"
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              Verification
            </h2>
            <p>
              After setup, you can verify that Scopeo is working by checking
              your application logs. You should see messages indicating that
              Scopeo has initialized successfully.
            </p>

            <div className="bg-muted p-4 rounded-md text-sm font-mono">
              [Scopeo] Initializing Scopeo v1.2.3
              <br />
              [Scopeo] Connected to metrics server
              <br />
              [Scopeo] Error handler registered
              <br />
              [Scopeo] Initialization complete
            </div>
          </div>
        </div>
      ),
    },
    "/docs/library-agent": {
      title: "Library with Agent",
      section: "Library",
      prev: { href: "/docs/basic-setup", title: "configuration" },
      next: { href: "/docs/aggregation", title: "Data Aggregation" },
      content: () => (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6 pb-2 border-b-2 border-gray-200">
            Library with Agent
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Welcome to the Scopeo agent library documentation. This library
            provides a comprehensive suite of monitoring and observability tools
            for your applications.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2
              id="performance-and-health-monitoring"
              className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100"
            >
              Performance and Health Monitoring
            </h2>
            <p className="mb-4">
              Track your application&apos;s health metrics in real-time:
            </p>
            <ul className="space-y-3 pl-5 list-disc">
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2"></span>
                <strong>Uptime Percentage:</strong> Automated health checks
                track system availability
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2"></span>
                <strong>Response Time Tracking:</strong> Middleware captures
                request latency using high-resolution timing
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2"></span>
                <strong>Connection Health:</strong> Monitor database
                connectivity and query performance
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2
              id="security-and-access-tracking"
              className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100"
            >
              Security and Access Tracking
            </h2>
            <p className="mb-4">Maintain robust security monitoring:</p>
            <ul className="space-y-3 pl-5 list-disc ">
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2 "></span>
                <strong>Failed Login Detection:</strong> Track authentication
                failures with IP tracking
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2 "></span>
                <strong>Unusual Login Alerts:</strong> Identify logins from new
                locations or devices
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2 "></span>
                <strong>API Abuse Prevention:</strong> Rate limiting and
                unauthorized access detection
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2
              id="error-and-issue-reporting"
              className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100"
            >
              Error and Issue Reporting
            </h2>
            <p className="mb-4">Gain insights into application errors:</p>
            <ul className="space-y-3 pl-5 list-disc">
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2 "></span>
                <strong>Error Trends:</strong> Track error frequency and
                patterns over time
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2 "></span>
                <strong>Common Issues:</strong> Identify the most frequent
                errors affecting your users
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2 "></span>
                <strong>Automated Reporting:</strong> Global error handlers
                capture comprehensive details
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2
              id="logs-and-user-activity"
              className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100"
            >
              Logs and User Activity
            </h2>
            <p className="mb-4">
              Comprehensive logging for all system activity:
            </p>
            <ul className="space-y-3 pl-5 list-disc">
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2 "></span>
                <strong>Structured Logging:</strong> Organized logs using
                Custom Logger with severity levels
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-2 w-2 "></span>
                <strong>Privacy-Focused:</strong> No information is collected from users Database
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    "/docs/aggregation": {
      title: "Data Aggregation",
      section: "Data",
      prev: { href: "/docs/library-agent", title: "Library with agent" },
      next: { href: "/docs/data-visualization", title: "Data Visualization" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Data Aggregation
          </h1>

          <div className="space-y-4">
            <h2 id="overview" className="text-2xl font-semibold tracking-tight">
              Overview
            </h2>
            <p className="text-base text-muted-foreground">
              Scopeo&apos;s data aggregation system collects, processes, and
              analyzes monitoring data from your applications in real-time. Our
              lightweight monitoring agent captures critical metrics without
              impacting your application&apos;s performance, providing
              comprehensive insights while maintaining data privacy and
              security.
            </p>
          </div>

          <div className="space-y-4">
            <h2
              id="how-data-aggregation-works"
              className="text-2xl font-semibold tracking-tight"
            >
              How Data Aggregation Works
            </h2>

            <h3 id="collection-process" className="text-xl font-medium">
              Collection Process
            </h3>
            <ol className="pl-5 space-y-2 list-decimal">
              <li>
                <span className="font-medium">Agent Deployment</span>: Our
                lightweight monitoring agent is installed on your application
                server
              </li>
              <li>
                <span className="font-medium">Data Capture</span>: The agent
                continuously collects performance metrics, security events, and
                system logs
              </li>
              <li>
                <span className="font-medium">Secure Transmission</span>: All
                data is encrypted end-to-end before being sent to our monitoring
                platform
              </li>
              <li>
                <span className="font-medium">Processing</span>: Our backend
                aggregates and analyzes the incoming data in real-time
              </li>
              <li>
                <span className="font-medium">Visualization</span>: Processed
                data is displayed on your dashboard with actionable insights
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h2
              id="technologies-used"
              className="text-2xl font-semibold tracking-tight"
            >
              Technologies Used
            </h2>
            <ul className="pl-5 space-y-2 list-disc">
              <li>
                <span className="font-medium">MongoDB</span>: For efficient
                storage and retrieval of aggregated data
              </li>
              <li>
                <span className="font-medium">Socket.IO</span>: Enables
                real-time updates for notifications and live dashboard updates
              </li>
              <li>
                <span className="font-medium">Express Middleware</span>: For
                capturing request metrics and performance data
              </li>
              <li>
                <span className="font-medium">Node.js Event System</span>: For
                monitoring database connections and system events
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2
              id="data-privacy-and-security"
              className="text-2xl font-semibold tracking-tight"
            >
              Data Privacy & Security
            </h2>
            <p className="text-base text-muted-foreground">
              We prioritize your data security and privacy:
            </p>
            <ul className="pl-5 space-y-2 list-disc">
              <li>
                <span className="font-medium">Limited Data Collection</span>: We
                only collect performance logs, API requests, and security events
              </li>
              <li>
                <span className="font-medium">No Sensitive Data</span>: We never
                collect or store user personal information or project source
                code
              </li>
              <li>
                <span className="font-medium">End-to-End Encryption</span>: All
                data is encrypted during transmission and storage
              </li>
              <li>
                <span className="font-medium">Data Minimization</span>: We
                aggregate only what&apos;s necessary for effective monitoring
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2
              id="real-time-processing"
              className="text-2xl font-semibold tracking-tight"
            >
              Real-time Processing
            </h2>
            <p className="text-base text-muted-foreground">
              Data aggregation happens in real-time through:
            </p>
            <ul className="pl-5 space-y-2 list-disc">
              <li>
                <span className="font-medium">Stream Processing</span>:
                Continuous processing of incoming data as it arrives
              </li>
              <li>
                <span className="font-medium">Socket.IO Integration</span>:
                Instant dashboard updates when new data is available
              </li>
              <li>
                <span className="font-medium">Event-Driven Architecture</span>:
                System immediately responds to critical events and security
                alerts
              </li>
              <li>
                <span className="font-medium">Notification System</span>:
                Real-time alerts for unusual activity or performance issues
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2
              id="custom-aggregation-options"
              className="text-2xl font-semibold tracking-tight"
            >
              Custom Aggregation Options
            </h2>
            <p className="text-base text-muted-foreground">
              Scopeo allows you to customize data aggregation based on your
              needs:
            </p>
            <ul className="pl-5 space-y-2 list-disc">
              <li>
                <span className="font-medium">Configurable Thresholds</span>:
                Set custom thresholds for alerts and notifications
              </li>
              <li>
                <span className="font-medium">Selective Monitoring</span>:
                Choose which metrics and events to track
              </li>
              <li>
                <span className="font-medium">Data Retention</span>: Configure
                how long your aggregated data is stored
              </li>
              <li>
                <span className="font-medium">Export Options</span>: Download
                aggregated data in various formats for external analysis
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    "/docs/data-visualization": {
      title: "Data Visualization",
      section: "Data",
      prev: { href: "/docs/aggregation", title: "Data Aggregation" },
      next: { href: "/docs/architecture", title: "Architecture" },
      content: () => (
        <>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Data Visualization
          </h1>

          <p className="text-lg text-gray-700 mb-8">
            Scopeo&apos;s data visualization tools transform complex monitoring
            data into actionable insights through intuitive charts, graphs, and
            interactive dashboards. This guide explains how to leverage these
            visualization capabilities to better understand your
            application&apos;s performance, security, and overall health.
          </p>

          <h2
            id="overview"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            Overview of Visualization Components
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            Scopeo offers several visualization components for different
            monitoring aspects:
          </p>

          <h4 className="text-2xl font-medium text-gray-800 mt-8 mb-3">
            Performance & Health Metrics Visualizations
          </h4>

          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="font-medium">System Metrics Dashboard</span>:
              Track CPU, memory, and disk usage with real-time percentage
              indicators and health status
            </li>
            <li>
              <span className="font-medium">Performance Line Graphs</span>:
              Visualize metrics over time with multi-series line charts showing
              clear patterns of activity
            </li>
            <li>
              <span className="font-medium">Traffic and Server Metrics</span>:
              View request volumes, success/error rates, and latency using both
              pie charts and numerical indicators
            </li>
            <li>
              <span className="font-medium">Status Indicators</span>:
              Color-coded health status indicators (healthy, unhealthy,
              critical) for quick assessment
            </li>
          </ul>

          <h4 className="text-2xl font-medium text-gray-800 mt-8 mb-3">
            Security & Access Visualizations
          </h4>

          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="font-medium">Login Metrics Dashboard</span>:
              Monitor total logins, failed attempts, unusual activity, and
              potential brute force attacks
            </li>
            <li>
              <span className="font-medium">Security Event Timeline</span>:
              Track login attempts over time with detailed status code
              breakdowns
            </li>
            <li>
              <span className="font-medium">Auth Status Distribution</span>:
              Visualize the distribution of different login outcomes through
              donut charts
            </li>
            <li>
              <span className="font-medium">Security Alert Indicators</span>:
              Color-coded alert icons (green checkmarks, yellow/red warnings)
              for quick security status assessment
            </li>
          </ul>

          <h4 className="text-2xl font-medium text-gray-800 mt-8 mb-3">
            Error & Issue Tracking Visualizations
          </h4>

          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="font-medium">Error Card Displays</span>:
              Highlighted cards showing latest and most common errors with route
              information
            </li>
            <li>
              <span className="font-medium">Error Distribution Charts</span>:
              View error distribution by type using pie charts and bar graphs
            </li>
            <li>
              <span className="font-medium">Error Method Analysis</span>: Break
              down errors by HTTP method (GET, POST, PUT, DELETE) with
              percentage visualization
            </li>
            <li>
              <span className="font-medium">Error Timeline Integration</span>:
              Correlate errors with other metrics through shared timeline views
            </li>
          </ul>

          <h4 className="text-2xl font-medium text-gray-800 mt-8 mb-3">
            Log & Activity Visualizations
          </h4>

          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="font-medium">Recent Logs Stream</span>: Real-time
              chronological display of server logs with HTTP method, endpoint,
              status code, and response time
            </li>
            <li>
              <span className="font-medium">Log Filtering</span>: Filter
              capabilities to focus on specific log types and time periods
            </li>
            <li>
              <span className="font-medium">Log Volume Trends</span>: Track log
              generation patterns over specific time ranges (24 hours, today,
              custom)
            </li>
          </ul>

          <h2
            id="using-the-dashboard"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            Using the Dashboard
          </h2>

          <h4 className="text-2xl font-medium text-gray-800 mt-8 mb-3">
            Understanding the Interface
          </h4>

          <p className="text-lg text-gray-700 mb-4">
            The Scopeo dashboard is organized into several key sections:
          </p>

          <ol className="list-decimal pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="font-medium">System Metrics Panel</span>: Shows
              overall system health, CPU, memory, and disk usage percentages and
              status
            </li>
            <li>
              <span className="font-medium">Performance Metrics Graph</span>:
              Displays time-series data of key performance indicators with
              color-coded lines
            </li>
            <li>
              <span className="font-medium">Server & Traffic Metrics</span>:
              Provides pie chart visualization of request distribution alongside
              numerical indicators
            </li>
            <li>
              <span className="font-medium">Recent Logs Panel</span>: Shows
              chronological list of recent API calls with response codes and
              times
            </li>
            <li>
              <span className="font-medium">Login Security Dashboard</span>:
              Tracks authentication attempts with security indicators and
              time-based visualization
            </li>
          </ol>

          <h4 className="text-2xl font-medium text-gray-800 mt-8 mb-3">
            Time Range Selection
          </h4>

          <p className="text-lg text-gray-700 mb-4">
            Easily adjust your data visualization timeframes:
          </p>
          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="font-medium">Last 24 Hours</span>: View a full
              day of monitoring data (default for most views)
            </li>
            <li>
              <span className="font-medium">Today</span>: Focus on the current
              day&apos;s metrics
            </li>
            <li>
              <span className="font-medium">Custom Ranges</span>: Select
              specific time periods for detailed analysis
            </li>
          </ul>

          <h4 className="text-2xl font-medium text-gray-800 mt-8 mb-3">
            Interpreting Key Metrics
          </h4>

          <h5 className="text-xl font-medium text-gray-800 mt-6 mb-3">
            Performance Indicators
          </h5>

          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="font-medium text-red-600">Critical Status</span>{" "}
              (red): Indicates metrics that have crossed critical thresholds
              requiring immediate attention
            </li>
            <li>
              <span className="font-medium text-green-600">Healthy Status</span>{" "}
              (green): Shows systems operating within normal parameters
            </li>
            <li>
              <span className="font-medium text-yellow-600">
                Unhealthy Status
              </span>{" "}
              (yellow/orange): Highlights metrics approaching problematic
              thresholds
            </li>
          </ul>

          <p className="text-lg text-gray-700 mb-4">
            For example, in the System Metrics panel:
          </p>
          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              Overall Health: &quot;critical&quot; when system resources are
              severely constrained
            </li>
            <li>
              CPU Health: &quot;healthy&quot; when processing load is within
              expected ranges
            </li>
            <li>
              Memory Usage: Percentage indicators (88.64%) with color coding for
              quick assessment
            </li>
          </ul>

          <h4 className="text-xl font-medium text-gray-800 mt-6 mb-3">
            Security Metrics
          </h4>

          <p className="text-lg text-gray-700 mb-4">
            The Login Metrics dashboard provides:
          </p>
          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>Total login attempts with success/failure breakdown</li>
            <li>Visual indicators for unusual login patterns</li>
            <li>Brute force detection with attempt counts</li>
            <li>Time-based visualization of login activity</li>
          </ul>

          <p className="text-lg text-gray-700 mb-4">
            Status codes are color-coded for quick identification:
          </p>
          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="text-green-600">200</span> (green): Successful
              operations
            </li>
            <li>
              <span className="text-orange-600">400/401/403/404</span>{" "}
              (orange/red): Various client and authentication errors
            </li>
          </ul>

          <h4 className="text-xl font-medium text-gray-800 mt-6 mb-3">
            Error Analysis
          </h4>

          <p className="text-lg text-gray-700 mb-4">
            Error tracking visualizations include:
          </p>
          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              Latest Error cards showing the affected route (
              <code className="px-2 py-1 bg-gray-100 rounded text-red-600">
                /auth/refreshToken
              </code>
              )
            </li>
            <li>
              Method distribution showing which HTTP methods (GET, POST, PUT,
              DELETE) generate most errors
            </li>
            <li>
              Error type distribution using pie charts to show relative
              frequency
            </li>
            <li>
              Status code breakdown (500, 401, 404) with visual indicators
            </li>
          </ul>

          <h2
            id="real-time-monitoring"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            Real-time Monitoring
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            Scopeo&apos;s visualizations update in real-time using Socket.IO,
            providing immediate feedback on:
          </p>

          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>New server logs as they appear in the Recent Logs stream</li>
            <li>
              Performance spikes visible in the Performance Metrics timeline
            </li>
            <li>
              Security events as they&apos;re detected in the Login Metrics
              dashboard
            </li>
            <li>
              Error occurrences as they&apos;re logged in the Error panels
            </li>
          </ul>

          <h4 className="text-2xl font-medium text-gray-800 mt-8 mb-3">
            Analyzing Patterns
          </h4>

          <p className="text-lg text-gray-700 mb-4">
            The time-series charts reveal important patterns:
          </p>
          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="font-medium">Activity Spikes</span>: The
              Performance Metrics graph shows clear activity periods between
              1AM-6AM and 11AM-1PM
            </li>
            <li>
              <span className="font-medium">Inactivity Periods</span>: Flat
              lines during periods of no activity help identify normal operation
              windows
            </li>
            <li>
              <span className="font-medium">Correlation</span>: Compare multiple
              metrics (CPU, memory, disk) on the same timeline to identify
              relationships
            </li>
          </ul>

          <h3
            id="best-practices"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            Best Practices
          </h3>

          <h4 className="text-2xl font-medium text-gray-800 mt-8 mb-3">
            Effective Dashboard Usage
          </h4>

          <ol className="list-decimal pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="font-medium">Start with Overview</span>: Begin
              with the System Metrics panel to assess overall health
            </li>
            <li>
              <span className="font-medium">Investigate Anomalies</span>: When
              noticing spikes in the Performance graph, check corresponding logs
            </li>
            <li>
              <span className="font-medium">Monitor Security</span>: Regularly
              check the Login Metrics dashboard for unusual patterns
            </li>
            <li>
              <span className="font-medium">Track Error Trends</span>: Use error
              distribution visualizations to focus troubleshooting efforts
            </li>
          </ol>

          <h4 className="text-2xl font-medium text-gray-800 mt-8 mb-3">
            Troubleshooting with Visualizations
          </h4>

          <ol className="list-decimal pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="font-medium">Identify Error Patterns</span>: Use
              the Recent Logs panel to spot repeated error codes (like the
              multiple 401 errors)
            </li>
            <li>
              <span className="font-medium">Check Resource Correlation</span>:
              When errors occur, check if they correlate with resource spikes
              (CPU, memory)
            </li>
            <li>
              <span className="font-medium">Analyze Traffic Impact</span>:
              Compare Traffic Metrics with Error Rate to determine if errors
              increase with traffic volume
            </li>
          </ol>

          <h4 className="text-2xl font-medium text-gray-800 mt-8 mb-3">
            Alert Configuration
          </h4>

          <p className="text-lg text-gray-700 mb-4">
            Set up alerts based on visualization thresholds:
          </p>
          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>CPU/Memory usage exceeding healthy ranges</li>
            <li>Multiple failed login attempts within short time periods</li>
            <li>Error rates crossing defined thresholds</li>
            <li>Response time degradation patterns</li>
          </ul>

          <h2
            id="implementation-details"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            Implementation Details
          </h2>

          <p className="text-lg text-gray-700 mb-4">
            Scopeo&apos;s visualization layer is built with:
          </p>
          <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
            <li>
              <span className="font-medium">React</span> for component rendering
            </li>
            <li>
              <span className="font-medium">Socket.IO</span> for real-time data
              updates
            </li>
            <li>
              <span className="font-medium">Chart.js/Recharts</span> for
              rendering the various charts and graphs
            </li>
            <li>
              <span className="font-medium">Time-series optimization</span> for
              handling large datasets efficiently
            </li>
          </ul>

          <p className="text-lg text-gray-700 mb-4">
            The dashboard is designed to be both informative and actionable,
            helping you quickly identify issues and maintain optimal application
            performance and security.
          </p>
        </>
      ),
    },
    // project Info section
    "/docs/architecture": {
      title: "Architecture",
      section: "Project Info",
      prev: {
        href: "/docs/data-visualization",
        title: "Data Visualization",
      },
      next: { href: "/docs/version", title: "Version" },
      content: () => (
        <div className="space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
            Architecture
          </h1>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r">
            <p className="text-lg text-blue-700">
              Scopeo is built as a comprehensive monitoring system with two core
              components: a web monitoring dashboard and lightweight libraries
              that integrate into your applications.
            </p>
          </div>

          <h2
            id="system-overview"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            System Overview
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            The Scopeo monitoring system consists of two primary components that
            work together to provide comprehensive application monitoring:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Website Monitor
              </h4>
              <p className="text-gray-700">
                A web application dashboard that tracks and displays key metrics
                of deployed projects such as uptime, response times, errors, and
                logs in real-time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Monitoring Libraries
              </h4>
              <p className="text-gray-700">
                Lightweight libraries for both backend and frontend (optional)
                that provide security, logging, and error management
                functionality.
              </p>
            </div>
          </div>

          <h2
            id="monitoring-agent-flow"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            Monitoring Agent Flow
          </h2>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
            <ol className="list-decimal pl-8 space-y-3 text-gray-700">
              <li>
                <span className="font-medium">Installation & Setup</span>: A
                lightweight monitoring agent is installed in the project&apos;s
                server or application
              </li>
              <li>
                <span className="font-medium">Data Collection</span>: The agent
                collects critical metrics, security logs, and API activity
              </li>
              <li>
                <span className="font-medium">Secure Transmission</span>: Data
                is encrypted and transmitted to the Scopeo monitoring service
              </li>
              <li>
                <span className="font-medium">Processing & Analysis</span>:
                Scopeo processes the incoming data and generates actionable
                insights
              </li>
              <li>
                <span className="font-medium">Dashboard Display</span>:
                Information is presented in real-time through intuitive
                visualizations and alerts
              </li>
            </ol>
          </div>

          <h2
            id="tech-stack"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            Tech Stack
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Frontend
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Framework</span>: Next.js with
                  TypeScript
                </li>
                <li>
                  <span className="font-medium">Real-time Updates</span>:
                  Socket.IO
                </li>
                <li>
                  <span className="font-medium">UI Components</span>: React
                  components with Tailwind CSS
                </li>
                <li>
                  <span className="font-medium">Data Visualization</span>:
                  Chart.js/Recharts
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Backend
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">Server</span>: Node.js with
                  Express and TypeScript
                </li>
                <li>
                  <span className="font-medium">Database</span>: MongoDB
                </li>
                <li>
                  <span className="font-medium">Security</span>: Helmet, JWT
                  authentication
                </li>
                <li>
                  <span className="font-medium">Cloud Services</span>: AWS & S3
                  Bucket for storage
                </li>
              </ul>
            </div>
          </div>

          <h2
            id="database-architecture"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            Database Architecture
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            Scopeo utilizes a MongoDB database with the following key model
            structure:
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse bg-white text-gray-700 shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-gray-800">
                <tr>
                  <th className="py-3 px-4 text-left border-b">Model</th>
                  <th className="py-3 px-4 text-left border-b">Purpose</th>
                  <th className="py-3 px-4 text-left border-b">Key Fields</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border-b font-medium">userModel</td>
                  <td className="py-3 px-4 border-b">
                    User authentication and management
                  </td>
                  <td className="py-3 px-4 border-b">
                    username, email, password
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b font-medium">
                    projectModel
                  </td>
                  <td className="py-3 px-4 border-b">
                    Project configuration and user associations
                  </td>
                  <td className="py-3 px-4 border-b">
                    apikey, passkey, name, user (ref)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b font-medium">
                    securityModel
                  </td>
                  <td className="py-3 px-4 border-b">Security event logging</td>
                  <td className="py-3 px-4 border-b">type, date</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b font-medium">errorModel</td>
                  <td className="py-3 px-4 border-b">
                    Error tracking and categorization
                  </td>
                  <td className="py-3 px-4 border-b">type, date</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b font-medium">
                    healthModel
                  </td>
                  <td className="py-3 px-4 border-b">
                    Performance metric storage
                  </td>
                  <td className="py-3 px-4 border-b">
                    uptime, responsetime, apilatency
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b font-medium">logModel</td>
                  <td className="py-3 px-4 border-b">
                    System and user activity logging
                  </td>
                  <td className="py-3 px-4 border-b">
                    timestamp, message, type
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2
            id="api-architecture"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            API Architecture
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            Scopeo implements a RESTful API architecture organized around
            functional domains:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                User Management
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <code className="px-2 py-1 bg-gray-100 rounded">
                    /api/auth/*
                  </code>{" "}
                  - Authentication operations
                </li>
                <li>
                  <code className="px-2 py-1 bg-gray-100 rounded">
                    /api/user/*
                  </code>{" "}
                  - User profile management
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Project Management
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <code className="px-2 py-1 bg-gray-100 rounded">
                    /api/projects/*
                  </code>{" "}
                  - Project CRUD operations
                </li>
                <li>
                  <code className="px-2 py-1 bg-gray-100 rounded">
                    /api/projects/:id/*
                  </code>{" "}
                  - Specific project operations
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Monitoring Data
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <code className="px-2 py-1 bg-gray-100 rounded">
                    /api/security/*
                  </code>{" "}
                  - Security event endpoints
                </li>
                <li>
                  <code className="px-2 py-1 bg-gray-100 rounded">
                    /api/issues/*
                  </code>{" "}
                  - Error tracking endpoints
                </li>
                <li>
                  <code className="px-2 py-1 bg-gray-100 rounded">
                    /api/metrics/*
                  </code>{" "}
                  - Performance metrics endpoints
                </li>
                <li>
                  <code className="px-2 py-1 bg-gray-100 rounded">
                    /api/logs/*
                  </code>{" "}
                  - Logging endpoints
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Support & Utilities
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <code className="px-2 py-1 bg-gray-100 rounded">
                    /api/contact
                  </code>{" "}
                  - Contact form submission
                </li>
                <li>
                  <code className="px-2 py-1 bg-gray-100 rounded">
                    /api/help/*
                  </code>{" "}
                  - Help and FAQ endpoints
                </li>
              </ul>
            </div>
          </div>

          <h2
            id="real-time-communication"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            Real-time Communication
          </h2>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
            <p className="text-gray-700 mb-4">
              Scopeo uses Socket.IO to provide real-time updates for critical
              monitoring events:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <span className="font-medium">Security Notifications</span> -
                Immediate alerts for API abuse and unusual login activity
              </li>
              <li>
                <span className="font-medium">Log Updates</span> - Real-time
                streaming of new server logs as they occur
              </li>
              <li>
                <span className="font-medium">Performance Alerts</span> -
                Instant notification of performance degradation and health
                issues
              </li>
              <li>
                <span className="font-medium">Error Tracking</span> - Live
                updates when new errors occur in monitored applications
              </li>
            </ul>
          </div>

          <h2
            id="security-architecture"
            className="text-3xl font-semibold text-gray-800 mt-10 mb-4"
          >
            Security Architecture
          </h2>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              Key Security Measures
            </h4>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <span className="font-medium">End-to-End Encryption</span> - All
                monitoring data is encrypted during transmission
              </li>
              <li>
                <span className="font-medium">Limited Data Collection</span> -
                Only performance, security, and API metrics are collected
              </li>
              <li>
                <span className="font-medium">No Sensitive Data</span> - Scopeo
                does not collect or store user data, personal information, or
                project source code
              </li>
              <li>
                <span className="font-medium">Authentication</span> - JWT-based
                authentication with secure token management
              </li>
              <li>
                <span className="font-medium">API Security</span> - Rate
                limiting and security headers via Helmet
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    "/docs/version": {
      title: "Version",
      section: "Project Info",
      prev: { href: "/docs/architecture", title: "Architecture" },
      next: { href: "/docs/license", title: "License" },
      content: () => (
        <div className="max-w-3xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Version</h1>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Version history and release notes for our project. This page
              documents all releases with notable changes and improvements.
            </p>
          </div>

          <div className="space-y-8">
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <div className="flex items-center mb-2">
                <h2 id="version-1.0.1" className="text-xl font-semibold">
                  Version 1.0.1
                </h2>
                <span className="ml-3 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  Latest
                </span>
                <span className="ml-3 text-sm text-gray-500">
                  Released: March 15, 2025
                </span>
              </div>

              <div className="text-gray-700 space-y-3">
                <p>
                  Major release with significant performance improvements and
                  new features.
                </p>

                <div className="mt-3">
                  <h4 className="text-lg font-medium mb-2">Changes:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Completely redesigned user interface</li>
                    <li>Added support for real-time collaboration</li>
                    <li>Improved performance by 40%</li>
                    <li>New API endpoints for third-party integration</li>
                    <li>Enhanced security features</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-gray-300 pl-4 py-1">
              <div className="flex items-center mb-2">
                <h2 id="version-1.0.0" className="text-xl font-semibold">
                  Version 1.0.0
                </h2>
                <span className="ml-3 text-sm text-gray-500">
                  Released: March 1, 2025
                </span>
              </div>

              <div className="text-gray-700 space-y-3">
                <p>Initial stable release.</p>

                <div className="mt-3">
                  <h4 className="text-lg font-medium mb-2">Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Core functionality implemented</li>
                    <li>Basic documentation</li>
                    <li>Command-line interface</li>
                    <li>Support for major platforms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-gray-600 italic">
              We will be adding more detailed release notes to this section
              soon.
            </p>
          </div>
        </div>
      ),
    },
    "/docs/license": {
      title: "License",
      section: "Project Info",
      prev: { href: "/docs/version", title: "Version" },
      next: { href: "/docs/github", title: "GitHub Repo" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            License
          </h1>

          <div className="mt-4 space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Hi! Licensing information for Scopeo.
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 my-6">
              <h2
                id="mit-license"
                className="text-xl font-semibold mb-4 text-gray-800 dark:text-white"
              >
                MIT License
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Copyright (c) 2025 Scopeo Project Team
              </p>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Permission is hereby granted, free of charge, to any person
                obtaining a copy of this software and associated documentation
                files (the &quot;Software&quot;), to deal in the Software
                without restriction, including without limitation the rights to
                use, copy, modify, merge, publish, distribute, sublicense,
                and/or sell copies of the Software, and to permit persons to
                whom the Software is furnished to do so, subject to the
                following conditions:
              </p>

              <p className="text-gray-700 dark:text-gray-300 mb-4">
                The above copyright notice and this permission notice shall be
                included in all copies or substantial portions of the Software.
              </p>

              <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF
                ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
                AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
                WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
                FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
                OTHER DEALINGS IN THE SOFTWARE.
              </p>
            </div>

            <h3
              id="what-this-license-means"
              className="text-lg font-medium text-gray-800 dark:text-white mt-6"
            >
              What This License Means
            </h3>

            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>You can freely use Scopeo in commercial applications</li>
              <li>You can modify, distribute and sublicense the code</li>
              <li>
                You must include the original license when you share the
                software
              </li>
              <li>The software comes with no warranty of any kind</li>
            </ul>

            <p className="text-gray-700 dark:text-gray-300 mt-4">
              For questions about licensing, please contact us through our
              GitHub repository.
            </p>
          </div>
        </div>
      ),
    },
    "/docs/github": {
      title: "GitHub Repo",
      section: "Project Info",
      prev: { href: "/docs/license", title: "License" },
      next: { href: "/docs/buy-coffee", title: "Buy Us a Coffee" },
      content: () => (
        <div className="max-w-3xl mx-auto py-8 space-y-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">
              GitHub Repository
            </h1>
            <p className="text-lg text-muted-foreground">
              Information about the Scopeo GitHub repository and how to
              contribute.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <svg
                className="w-8 h-8 text-gray-900"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <h2 className="text-xl font-semibold">
              github.com/scopeo-tech/scopeo-monitor.git
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                MIT License
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                JavaScript
              </span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                TypeScript
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                React
              </span>
            </div>

            <p className="mb-4">
              Scopeo is an open-source project focusing on [brief description of
              your project]. The codebase is hosted on GitHub and maintained by
              a community of developers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <a
                href="https://github.com/scopeo-tech/scopeo-monitor.git"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                <span>View Repository</span>
              </a>
              <a
                href="https://github.com/scopeo/scopeo/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 bg-white text-black border border-gray-300 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                <span>Report an Issue</span>
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div className="p-2">
                <div className="font-bold text-xl mb-1">2</div>
                <div className="text-gray-600">Stars</div>
              </div>
              <div className="p-2">
                <div className="font-bold text-xl mb-1">4</div>
                <div className="text-gray-600">Forks</div>
              </div>
              <div className="p-2">
                <div className="font-bold text-xl mb-1">4</div>
                <div className="text-gray-600">Contributors</div>
              </div>
              <div className="p-2">
                <div className="font-bold text-xl mb-1">2</div>
                <div className="text-gray-600">Releases</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 id="contribution-guidelines" className="text-2xl font-semibold">
              How to Contribute
            </h2>
            <p>
              We welcome contributions from developers of all skill levels.
              Here&apos;s how you can get involved:
            </p>

            <div className="space-y-3 mt-4">
              <div className="pl-4 border-l-4 border-blue-500">
                <h4 className="font-medium">
                  1. Set up your development environment
                </h4>
                <p className="text-gray-700 mt-1">
                  Clone the repository and install dependencies to get started
                  with development.
                </p>
                <div className="mt-2 p-3 bg-gray-100 rounded-md font-mono text-sm">
                  git clone https://github.com/scopeo/scopeo.git
                  <br />
                  cd scopeo
                  <br />
                  npm install
                </div>
              </div>

              <div className="pl-4 border-l-4 border-blue-500">
                <h4 className="font-medium">2. Find an issue to work on</h4>
                <p className="text-gray-700 mt-1">
                  Look for issues labeled &quot;good first issue&quot; or
                  &quot;help wanted&quot; in our issue tracker.
                </p>
              </div>

              <div className="pl-4 border-l-4 border-blue-500">
                <h4 className="font-medium">3. Create a pull request</h4>
                <p className="text-gray-700 mt-1">
                  Make your changes in a new branch and submit a pull request
                  with a clear description of the changes.
                </p>
              </div>

              <div className="pl-4 border-l-4 border-blue-500">
                <h4 className="font-medium">4. Code review</h4>
                <p className="text-gray-700 mt-1">
                  Wait for a maintainer to review your changes. They might
                  request some modifications before merging.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 id="code-of-conduct" className="text-2xl font-semibold">
              Code of Conduct
            </h2>
            <p>
              We are committed to fostering an open and welcoming environment.
              Please read our
              <a
                href="https://github.com/scopeo/scopeo/blob/main/CODE_OF_CONDUCT.md"
                className="text-blue-600 hover:underline ml-1"
              >
                Code of Conduct
              </a>{" "}
              before participating in our project.
            </p>
          </div>

          <div className="space-y-4">
            <h2 id="project-roadmap" className="text-2xl font-semibold">
              Project Roadmap
            </h2>
            <p>
              Check our
              <a
                href="https://github.com/scopeo/scopeo/projects"
                className="text-blue-600 hover:underline mx-1"
              >
                GitHub Projects
              </a>
              page to see what we&apos;re currently working on and our plans for
              future releases.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-600 italic">
              For more detailed information, please refer to the documentation
              in the repository&apos;s README.md file.
            </p>
          </div>
        </div>
      ),
    },
    "/docs/buy-coffee": {
      title: "Buy Us a Coffee",
      section: "Project Info",
      prev: { href: "/docs/github", title: "GitHub Repo" },
      next: { href: "/docs/common-errors", title: "Common Error" },
      content: () => (
        <div className="max-w-3xl mx-auto py-8 space-y-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Buy Us a Coffee
            </h1>
            <p className="text-lg text-muted-foreground">
              Support the Scopeo project by buying us a coffee. Your
              contributions help us continue developing and improving this
              open-source tool.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <svg
                  className="w-32 h-32 text-amber-800"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 8H19C20.0609 8 21.0783 8.42143 21.8284 9.17157C22.5786 9.92172 23 10.9391 23 12C23 13.0609 22.5786 14.0783 21.8284 14.8284C21.0783 15.5786 20.0609 16 19 16H18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 8H18V17C18 18.0609 17.5786 19.0783 16.8284 19.8284C16.0783 20.5786 15.0609 21 14 21H6C4.93913 21 3.92172 20.5786 3.17157 19.8284C2.42143 19.0783 2 18.0609 2 17V8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 1V4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 1V4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 1V4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2
                  id="buy-us-a-coffee"
                  className="text-2xl font-bold text-amber-900 mb-3"
                >
                  Fuel Our Development
                </h2>
                <p className="text-amber-800 mb-4">
                  Scopeo is created and maintained by a small team of passionate
                  developers. Your support helps us dedicate more time to fixing
                  bugs, adding features, and improving documentation.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  <a
                    href="https://www.buymeacoffee.com/scopeo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-amber-500 text-white font-medium rounded-md hover:bg-amber-600 transition-colors"
                  >
                    <span className="mr-2">☕</span>
                    <span>Buy us a coffee</span>
                  </a>
                  <a
                    href="https://github.com/sponsors/scopeo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-white text-gray-800 border border-gray-300 font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <span className="mr-2">❤️</span>
                    <span>GitHub Sponsors</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h2 id="why-support-us" className="text-2xl font-semibold">
              Why Support Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 border border-gray-200 rounded-lg bg-white">
                <div className="text-amber-500 text-xl mb-3">💻</div>
                <h4 className="font-medium text-lg mb-2">
                  Continued Development
                </h4>
                <p className="text-gray-600">
                  Your support allows us to dedicate more time to developing new
                  features and improvements.
                </p>
              </div>
              <div className="p-5 border border-gray-200 rounded-lg bg-white">
                <div className="text-amber-500 text-xl mb-3">🔧</div>
                <h4 className="font-medium text-lg mb-2">
                  Bug Fixes & Maintenance
                </h4>
                <p className="text-gray-600">
                  Help us maintain and improve the existing codebase with
                  regular updates and fixes.
                </p>
              </div>
              <div className="p-5 border border-gray-200 rounded-lg bg-white">
                <div className="text-amber-500 text-xl mb-3">📚</div>
                <h4 className="font-medium text-lg mb-2">
                  Better Documentation
                </h4>
                <p className="text-gray-600">
                  We can create more comprehensive guides, examples, and
                  tutorials for all users.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h2 id="faq" className="text-2xl font-semibold">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 font-medium">
                  How are the donations used?
                </div>
                <div className="p-4 border-t border-gray-200">
                  <p>
                    All donations go directly toward development costs,
                    including server expenses, development tools, and
                    compensating our core team for their time.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 font-medium">
                  Is my donation tax-deductible?
                </div>
                <div className="p-4 border-t border-gray-200">
                  <p>
                    We are not currently a registered non-profit organization,
                    so donations are not tax-deductible at this time.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 font-medium">
                  Can I donate using cryptocurrency?
                </div>
                <div className="p-4 border-t border-gray-200">
                  <p>
                    Yes! Please reach out to our team directly for
                    cryptocurrency donation options.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 font-medium">
                  Can I support in other ways besides financial contributions?
                </div>
                <div className="p-4 border-t border-gray-200">
                  <p>
                    Absolutely! You can contribute code, documentation, help
                    with testing, or simply spread the word about Scopeo. Every
                    form of support is valuable to us.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <h2 id="contact" className="text-xl font-semibold mb-3">
              Need a Custom Solution?
            </h2>
            <p className="mb-4">
              For larger organizations or custom development needs, we also
              offer consulting services and custom feature development.
            </p>
            <a
              href="mailto:scopeo.tech@gmail.com"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <span>Contact Our Team</span>
            </a>
          </div>

          <div className="pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Thank you for supporting open-source software! ❤️
            </p>
          </div>
        </div>
      ),
    },
    "/docs/common-errors": {
      title: "Common Errors",
      section: "Troubleshooting",
      prev: { href: "/docs/buy-coffee", title: "Buy Us a Coffee" },
      next: null,
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Common Errors</h1>
          <p className="text-lg text-muted-foreground">
            Common issues you might encounter when using Scopeo and how to fix
            them.
          </p>

          <div className="space-y-4">
            <h2 id="configuring-scopeo" className="text-2xl font-semibold">
              Configuring Scopeo
            </h2>
            <p>
              Scopeo must be properly configured before initialization. If not
              set up correctly, tracking for uptime, performance, and errors may
              not work.
            </p>
            <h4 className="text-xl font-semibold text-red-600">
              Possible Error
            </h4>
            <pre className="bg-red-100 p-3 rounded-md text-sm text-red-600">
              {`Error: Missing API key or Pass key. Please provide valid credentials.`}
            </pre>
            <h5 className="text-xl font-semibold">Solution</h5>
            <p>
              Ensure Scopeo is configured before initializing it. Create a
              configuration file and set it up as follows:
            </p>
            <pre className="bg-muted p-3 rounded-md text-sm">
              {`import { configManager } from "scopeo";

export const setupScopeoConfig = () => {
  try {
    configManager.setConfig({
      apiKey: process.env.SCOPEO_API_KEY,
      passKey: process.env.SCOPEO_PASS_KEY,
      environment: process.env.ENVIRONMENT // 'development' or 'production'
    });
  } catch (error) {
    console.log("Scopeo Configuration Error:", error);
  }
};`}
            </pre>
            <p>
              Add the required credentials in your <code>.env</code> file:
            </p>
            <pre className="bg-muted p-3 rounded-md text-sm">
              {`SCOPEO_API_KEY=your-api-key
SCOPEO_PASS_KEY=your-pass-key
ENVIRONMENT=development`}
            </pre>
          </div>

          <div className="space-y-4">
            <h2 id="initializing-scopeo" className="text-2xl font-semibold">
              Initializing Scopeo
            </h2>
            <p>
              After configuring Scopeo, initialize it in your main server file.
              If skipped, Scopeo will not track any data.
            </p>
            <h4 className="text-xl font-semibold text-red-600">
              Possible Error
            </h4>
            <pre className="bg-red-100 p-3 rounded-md text-sm text-red-600">
              {`Error: Scopeo is not initialized. Call initializeScopeo(app).`}
            </pre>
            <h5 className="text-xl font-semibold">Solution</h5>
            <p>
              Ensure Scopeo is initialized in your main application file before
              starting the server:
            </p>
            <pre className="bg-muted p-3 rounded-md text-sm">
              {`import { setupScopeoConfig } from './config';
import initializeScopeo from 'scopeo';
import express from 'express';

const app = express();

// Configure Scopeo before initializing
setupScopeoConfig();

// Initialize Scopeo with your app
initializeScopeo(app);

// The rest of your app configuration
app.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
            </pre>
          </div>

          <div className="space-y-4">
            <h2
              id="unhandled-errors-not-captured"
              className="text-2xl font-semibold"
            >
              Unhandled Errors Not Captured
            </h2>
            <p>
              If unhandled errors are not being reported, ensure the Scopeo
              error handler is added to your Express app.
            </p>
            <h4 className="text-xl font-semibold text-red-600">
              Possible Error
            </h4>
            <pre className="bg-red-100 p-3 rounded-md text-sm text-red-600">
              {`Error: Uncaught exception detected but not logged.`}
            </pre>
            <h5 className="text-xl font-semibold">Solution</h5>
            <p>
              Add the error handler middleware after all routes in your server
              file:
            </p>
            <pre className="bg-muted p-3 rounded-md text-sm">
              {`import { scopeoErrorHandler } from 'scopeo';
app.use(scopeoErrorHandler);`}
            </pre>
            <p>
              This ensures that all unhandled errors are logged and tracked in
              your dashboard.
            </p>
          </div>
        </div>
      ),
    },
  };

  // navigation structure
  const navigation: NavigationSection[] = [
    {
      title: "Getting Started",
      links: [
        { href: "/docs/introduction", title: "Introduction" },
        { href: "/docs/installation", title: "Installation" },
        { href: "/docs/basic-setup", title: "Basic Setup" },
      ],
    },
    {
      title: "Library",
      links: [{ href: "/docs/library-agent", title: "Library with Agent" }],
    },
    {
      title: "Data",
      links: [
        { href: "/docs/aggregation", title: "Data Aggregation" },
        { href: "/docs/data-visualization", title: "Data Visualization" },
      ],
    },
    {
      title: "Project Info",
      links: [
        { href: "/docs/architecture", title: "Architecture" },
        { href: "/docs/version", title: "Version" },
        { href: "/docs/license", title: "License" },
        { href: "/docs/github", title: "GitHub Repo" },
        { href: "/docs/buy-coffee", title: "Buy Us a Coffee" },
      ],
    },
    {
      title: "Troubleshooting",
      links: [{ href: "/docs/common-errors", title: "Common Errors" }],
    },
  ];

  const handleNavigate = (page: string): void => {
    setCurrentPage(page);
  };

  const currentPageData = pages[currentPage] || pages["/docs/introduction"];

  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    []
  );

  useEffect(() => {
    const getTableOfContents = () => {
      const headings = Array.from(document.querySelectorAll("h2, h3"));

      return headings.map((heading) => ({
        id: heading.id,
        title: heading.textContent || "",
        level: heading.tagName === "H2" ? 2 : 3,
      }));
    };

    setTableOfContents(getTableOfContents());
  }, [currentPage]);

  return (
    <div className="flex min-h-screen h-screen bg-background">
      <aside
        className={`overflow-y-auto scrollbar-hide fixed left-0 w-64 bg-white border-r border-border shadow-lg transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:relative sm:w-64 md:left-[-30px] sm:left-0 sm:block h-screen overflow-y-auto z-20`}
      >
        <div className="flex h-14 items-center border-b px-4 ps-10">
          <button
            onClick={() => handleNavigate("/docs/introduction")}
            className="flex items-center font-bold"
          >
            <LogoIcon />
          </button>
          <button
            className="sm:hidden ml-auto p-2"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4">
          {navigation.map((section) => (
            <SidebarSection
              key={section.title}
              title={section.title}
              links={section.links}
              currentPage={currentPage}
              onNavigate={(href) => {
                handleNavigate(href);
                setIsOpen(false);
              }}
            />
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 sm:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <header className=" flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <button className="sm:hidden p-2" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
          <nav className="flex  items-center gap-4">
            <button
              onClick={() => handleNavigate("/docs/introduction")}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {currentPageData.title || "Docs"}
            </button>
          </nav>
        </header>

        <div className=" grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6 p-4 sm:p-6">
          <main className="prose max-w-full">
            {currentPageData?.content()}
            <div className="mt-12 border-t pt-6">
              <Pagination
                prev={currentPageData?.prev}
                next={currentPageData?.next}
                onNavigate={handleNavigate}
              />
            </div>
          </main>

          <div className="hidden md:block">
            <div className="sticky top-16 ">
              <h4 className="mb-2 text-sm font-semibold">On This Page</h4>
              <ul className="m-0 list-none p-0 text-sm space-y-2">
                {tableOfContents?.map((item) => (
                  <li key={item.id} className="pl-4 border-l-2 border-border">
                    <a
                      href={`#${item.id}`}
                      className="block hover:text-primary transition-colors"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeoDocumentation;
