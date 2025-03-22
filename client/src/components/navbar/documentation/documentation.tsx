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

// SVG Icon components
const CopyIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

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
        <TabsTrigger
          value="npm"
          className="rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          npm
        </TabsTrigger>
        <TabsTrigger
          value="yarn"
          className="rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          yarn
        </TabsTrigger>
        <TabsTrigger
          value="pnpm"
          className="rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          pnpm
        </TabsTrigger>
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
          <button className="absolute right-4 top-3 text-slate-400 hover:text-slate-600">
            <CopyIcon />
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

const CodeBlock: React.FC<{ language: string; children: React.ReactNode }> = ({
  language,
  children,
}) => (
  <div className="relative rounded-md border">
    <pre className={`language-${language} ms-2 my-2`}>
      <code className={`language-${language}`}>{children}</code>
    </pre>
    <button className="absolute right-4 top-3 text-slate-400 hover:text-slate-600">
      <CopyIcon />
    </button>
  </div>
);

// main documentation component
const ScopeoDocumentation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>("/docs/introduction");
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
              1. Create project
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
      next: { href: "/docs/configuration", title: "Configuration" },
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
    // Components section
    "/docs/configuration": {
      title: "Configuration",
      section: "Components",
      prev: { href: "/docs/basic-setup", title: "Basic Setup" },
      next: { href: "/docs/workflow", title: "Workflow" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Configuration</h1>
          <p className="text-lg text-muted-foreground">
            Learn how to configure Scopeo for different environments and use
            cases.
          </p>

          <div className="space-y-4">
            <h2
              id="configuration-options"
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              Configuration Options
            </h2>
            <p>
              Scopeo provides a variety of configuration options to customize
              its behavior:
            </p>

            <CodeBlock language="javascript">
              {`import { configManager } from 'scopeo';

configManager.setConfig({
// Required options
apiKey: process.env.SCOPEO_API_KEY,    // Your Scopeo API key
passKey: process.env.SCOPEO_PASS_KEY,  // Your Scopeo pass key

// Environment settings
environment: 'production',  // 'development', 'staging', 'production'

// Optional settings
logLevel: 'info',          // 'debug', 'info', 'warn', 'error'
sampling: {
  errorRate: 1.0,          // Capture 100% of errors
  metricRate: 0.1          // Sample 10% of metrics
},

// Feature toggles
features: {
  errorTracking: true,     // Enable error tracking
  performanceMonitoring: true,  // Enable performance monitoring
  securityScanning: true,  // Enable security scanning
  userTracking: false      // Disable user tracking
},

// Custom tags
tags: {
  region: 'us-west',
  service: 'payment-api'
}
});`}
            </CodeBlock>

            <h2
              id="environment-specific"
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            >
              Environment-Specific Configuration
            </h2>
            <p>
              You can create different configurations for development, staging,
              and production environments:
            </p>

            <CodeBlock language="javascript">
              {`// config.js
import { configManager } from 'scopeo';

export const setupScopeoConfig = () => {
const environment = process.env.NODE_ENV || 'development';

const commonConfig = {
  apiKey: process.env.SCOPEO_API_KEY,
  passKey: process.env.SCOPEO_PASS_KEY,
  environment
};

if (environment === 'development') {
  configManager.setConfig({
    ...commonConfig,
    logLevel: 'debug',
    sampling: { errorRate: 1.0, metricRate: 1.0 }
  });
} else if (environment === 'staging') {
  configManager.setConfig({
    ...commonConfig,
    logLevel: 'info',
    sampling: { errorRate: 1.0, metricRate: 0.5 }
  });
} else {
  // Production
  configManager.setConfig({
    ...commonConfig,
    logLevel: 'warn',
    sampling: { errorRate: 1.0, metricRate: 0.1 }
  });
}
};`}
            </CodeBlock>
          </div>
        </div>
      ),
    },
    // Library section
    "/docs/workflow": {
      title: "Workflow",
      section: "Library",
      prev: { href: "/docs/configuration", title: "Configuration" },
      next: { href: "/docs/library-agent", title: "Library with Agent" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Workflow</h1>
          <p className="text-lg text-muted-foreground">
            Hi! Understand the workflow and processes in Scopeo.
          </p>
          <p>We&apos;ll be adding more content to this section soon.</p>
        </div>
      ),
    },
    // Data section
    "/docs/library-agent": {
      title: "Library with Agent",
      section: "Library",
      prev: { href: "/docs/workflow", title: "Workflow" },
      next: { href: "/docs/server", title: "Server" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Library with Agent
          </h1>
          <p className="text-lg text-muted-foreground">
            Hi! Learn about the Scopeo agent library and its capabilities.
          </p>
          <p>We&apos;ll be adding more content to this section soon.</p>
        </div>
      ),
    },
    "/docs/aggregation": {
      title: "Data Aggregation",
      section: "Library",
      prev: { href: "/docs/server", title: "Server" },
      next: { href: "/docs/data-visualization", title: "Data Visualization" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Data Aggregation
          </h1>
          <p className="text-lg text-muted-foreground">
            Hi! How Scopeo aggregates and processes monitoring data.
          </p>
          <p> be adding more content to this section soon.</p>
        </div>
      ),
    },
    "/docs/data-visualization": {
      title: "Data Visualization",
      section: "Library",
      prev: { href: "/docs/aggregation", title: "Data Aggregation" },
      next: { href: "/docs/common-errors", title: "Common Errors" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Data Visualization
          </h1>
          <p className="text-lg text-muted-foreground">
            Hi! Visualizing metrics and logs with Scopeo&apos;s dashboards.
          </p>
          <p> be adding more content to this section soon.</p>
        </div>
      ),
    },
    // Troubleshooting section
    "/docs/common-errors": {
      title: "Common Errors",
      section: "Troubleshooting",
      prev: { href: "/docs/data-visualization", title: "Data Visualization" },
      next: {
        href: "/docs/informational-messages",
        title: "Informational Messages",
      },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Common Errors</h1>
          <p className="text-lg text-muted-foreground">
            Hi! Solutions for common errors and issues you might encounter with
            Scopeo.
          </p>
          <p> be adding more content to this section soon.</p>
        </div>
      ),
    },
    "/docs/informational-messages": {
      title: "Informational Messages",
      section: "Troubleshooting",
      prev: { href: "/docs/common-errors", title: "Common Errors" },
      next: { href: "/docs/architecture", title: "Architecture" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Informational Messages
          </h1>
          <p className="text-lg text-muted-foreground">
            Hi! Understanding informational and warning messages from Scopeo.
          </p>
          <p> be adding more content to this section soon.</p>
        </div>
      ),
    },
    // project Info section
    "/docs/architecture": {
      title: "Architecture",
      section: "Project Info",
      prev: {
        href: "/docs/informational-messages",
        title: "Informational Messages",
      },
      next: { href: "/docs/version", title: "Version" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Architecture</h1>
          <p className="text-lg text-muted-foreground">
            Hi! Overview of Scopeo&apos;s architecture and design principles.
          </p>
          <p> be adding more content to this section soon.</p>
        </div>
      ),
    },
    "/docs/version": {
      title: "Version",
      section: "Project Info",
      prev: { href: "/docs/architecture", title: "Architecture" },
      next: { href: "/docs/license", title: "License" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Version</h1>
          <p className="text-lg text-muted-foreground">
            Hi! Version history and release notes.
          </p>
          <p> be adding more content to this section soon.</p>
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
          <h1 className="text-3xl font-bold tracking-tight">License</h1>
          <p className="text-lg text-muted-foreground">
            Hi! Licensing information for Scopeo.
          </p>
          <p> be adding more content to this section soon.</p>
        </div>
      ),
    },
    "/docs/github": {
      title: "GitHub Repo",
      section: "Project Info",
      prev: { href: "/docs/license", title: "License" },
      next: { href: "/docs/buy-coffee", title: "Buy Us a Coffee" },
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">GitHub Repo</h1>
          <p className="text-lg text-muted-foreground">
            Hi! Information about the Scopeo GitHub repository.
          </p>
          <p> be adding more content to this section soon.</p>
        </div>
      ),
    },
    "/docs/buy-coffee": {
      title: "Buy Us a Coffee",
      section: "Project Info",
      prev: { href: "/docs/github", title: "GitHub Repo" },
      next: null,
      content: () => (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Buy Us a Coffee</h1>
          <p className="text-lg text-muted-foreground">
            Hi! Support the Scopeo project by buying us a coffee.
          </p>
          <p>We&apos;ll be adding more content to this section soon.</p>
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
      title: "Components",
      links: [{ href: "/docs/configuration", title: "Configuration" }],
    },
    {
      title: "Library",
      links: [{ href: "/docs/library-agent", title: "Library with Agent" }],
    },
    {
      title: "Troubleshooting",
      links: [
        { href: "/docs/common-errors", title: "Common Errors" },
        {
          href: "/docs/informational-messages",
          title: "Informational Messages",
        },
      ],
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
  ];

  const handleNavigate = (page: string): void => {
    setCurrentPage(page);
  };

  const currentPageData = pages[currentPage] || pages["/docs/introduction"];

  // not yet added
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
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r border-border h-screen sticky top-0 overflow-y-auto scrollbar-hide">
        <div className="flex h-14 items-center border-b px-4 ps-10 ">
          <button
            onClick={() => handleNavigate("/docs/introduction")}
            className="flex items-center font-bold"
          >
            <LogoIcon />
          </button>
        </div>

        <nav className="p-4">
          {navigation.map((section) => (
            <SidebarSection
              key={section.title}
              title={section.title}
              links={section.links}
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <div className="flex flex-1 items-center gap-4">
            <nav className="flex items-center space-x-4 lg:space-x-6">
              <button
                onClick={() => handleNavigate("/docs/introduction")}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Docs
              </button>
              <button className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                API
              </button>
              <button className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Examples
              </button>
            </nav>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6 p-4 sm:p-6">
          <main className="prose max-w-full">
            {currentPageData.content()}

            <div className="mt-12 border-t pt-6">
              <Pagination
                prev={currentPageData.prev}
                next={currentPageData.next}
                onNavigate={handleNavigate}
              />
            </div>
          </main>

          <div className="hidden md:block">
            <div className="sticky top-16">
              <h4 className="mb-2 text-sm font-semibold">On This Page</h4>
              <ul className="m-0 list-none p-0 text-sm space-y-2">
                {tableOfContents.map((item) => (
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
