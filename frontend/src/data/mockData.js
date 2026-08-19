/**
 * CloudOpsAI - Mock & Isolated SRE Data Layer
 * Provides realistic operational dataset when backend API is offline or during demonstrations.
 */

export const MOCK_SERVICES = [
  {
    id: "srv-001",
    name: "payment-gateway",
    environment: "production",
    owner: "FinTech Platform Team",
    health_status: "DEGRADED",
    uptime: "99.82%",
    latency_ms: 342,
    error_rate: "4.8%",
    version: "v2.14.0",
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-08-19T10:45:00Z",
    description: "Core payment processing pipeline handling Stripe, PayPal, and ACH integrations.",
    cluster: "k8s-prod-us-east-1",
    replicas: "8/8",
    endpoint: "https://api.cloudops.internal/payments",
  },
  {
    id: "srv-002",
    name: "auth-service",
    environment: "production",
    owner: "Security & IAM Team",
    health_status: "HEALTHY",
    uptime: "99.99%",
    latency_ms: 28,
    error_rate: "0.01%",
    version: "v3.1.2",
    created_at: "2026-01-10T08:00:00Z",
    updated_at: "2026-08-19T11:00:00Z",
    description: "OAuth2 / JWT token issuer, SSO gateway, and RBAC policy enforcement.",
    cluster: "k8s-prod-us-east-1",
    replicas: "12/12",
    endpoint: "https://api.cloudops.internal/auth",
  },
  {
    id: "srv-003",
    name: "kubernetes-ingress",
    environment: "production",
    owner: "SRE Core Team",
    health_status: "HEALTHY",
    uptime: "99.95%",
    latency_ms: 12,
    error_rate: "0.12%",
    version: "v1.9.4",
    created_at: "2026-01-05T08:00:00Z",
    updated_at: "2026-08-19T10:30:00Z",
    description: "NGINX Edge Ingress controller routing external traffic to internal microservices.",
    cluster: "k8s-prod-us-east-1",
    replicas: "16/16",
    endpoint: "https://gateway.cloudops.internal",
  },
  {
    id: "srv-004",
    name: "postgresql-primary",
    environment: "production",
    owner: "Database Operations",
    health_status: "DEGRADED",
    uptime: "99.78%",
    latency_ms: 184,
    error_rate: "3.2%",
    version: "Postgres 16.2",
    created_at: "2025-11-20T08:00:00Z",
    updated_at: "2026-08-19T10:48:00Z",
    description: "Primary transactional PostgreSQL cluster with PgBouncer connection pooling.",
    cluster: "rds-postgres-prod-01",
    replicas: "1 Primary + 2 Read Replicas",
    endpoint: "postgres.internal.cloudops:5432",
  },
  {
    id: "srv-005",
    name: "redis-cache-cluster",
    environment: "production",
    owner: "Platform Architecture",
    health_status: "HEALTHY",
    uptime: "99.99%",
    latency_ms: 3,
    error_rate: "0.00%",
    version: "Redis 7.2-Alpine",
    created_at: "2025-12-01T08:00:00Z",
    updated_at: "2026-08-19T11:05:00Z",
    description: "Distributed in-memory caching layer for session storage, rate limiting, and fast lookups.",
    cluster: "elasticache-redis-prod",
    replicas: "6 Nodes (3 Shards)",
    endpoint: "redis-cluster.internal:6379",
  },
  {
    id: "srv-006",
    name: "order-processing-worker",
    environment: "production",
    owner: "E-Commerce Services",
    health_status: "HEALTHY",
    uptime: "99.91%",
    latency_ms: 74,
    error_rate: "0.08%",
    version: "v4.0.1",
    created_at: "2026-02-01T08:00:00Z",
    updated_at: "2026-08-19T10:15:00Z",
    description: "Asynchronous Celery/Kafka queue consumer processing order fulfillment workflows.",
    cluster: "k8s-prod-us-east-1",
    replicas: "20/20",
    endpoint: "internal://order-worker.k8s",
  },
  {
    id: "srv-007",
    name: "notification-dispatch",
    environment: "staging",
    owner: "Growth & Engagement",
    health_status: "HEALTHY",
    uptime: "99.88%",
    latency_ms: 95,
    error_rate: "0.2%",
    version: "v1.8.0-rc3",
    created_at: "2026-03-10T08:00:00Z",
    updated_at: "2026-08-19T09:20:00Z",
    description: "Multi-channel notification dispatcher (Push, Email via SendGrid, SMS via Twilio).",
    cluster: "k8s-staging-us-east-1",
    replicas: "4/4",
    endpoint: "https://staging.cloudops.internal/notify",
  },
  {
    id: "srv-008",
    name: "search-indexer",
    environment: "development",
    owner: "Data Engineering",
    health_status: "DOWN",
    uptime: "94.20%",
    latency_ms: 1240,
    error_rate: "100%",
    version: "v0.9.12-dev",
    created_at: "2026-04-01T08:00:00Z",
    updated_at: "2026-08-19T08:10:00Z",
    description: "Elasticsearch synchronization pipeline extracting document embeddings for vector search.",
    cluster: "k8s-dev-sandbox",
    replicas: "0/2 (CrashLoopBackOff)",
    endpoint: "http://search-indexer.dev.svc:9200",
  }
];

export const MOCK_INCIDENTS = [
  {
    id: "INC-4092",
    title: "Payment Gateway Latency Spike & PgBouncer Connection Pool Starvation",
    service_id: "srv-001",
    service_name: "payment-gateway",
    environment: "production",
    severity: "CRITICAL",
    status: "INVESTIGATING",
    started_at: "2026-08-19T10:24:18Z",
    resolved_at: null,
    duration_minutes: 46,
    commander: "Alex Mercer (Senior SRE)",
    description: "Elevated 504 Gateway Timeouts on /api/v2/checkout endpoint. Transaction throughput dropped by 42%. PgBouncer active client connection limit reached 10,000 max threshold.",
    impact: "Customer checkouts failing in US-East region; estimated ~140 stalled transactions per minute.",
    ai_analysis_id: "ai-4092",
    events_count: 5,
    logs_count: 142
  },
  {
    id: "INC-4091",
    title: "PostgreSQL Primary Slow Query Lock Contention on invoices_ledger",
    service_id: "srv-004",
    service_name: "postgresql-primary",
    environment: "production",
    severity: "HIGH",
    status: "OPEN",
    started_at: "2026-08-19T09:48:00Z",
    resolved_at: null,
    duration_minutes: 82,
    commander: "Sarah Chen (DBA Lead)",
    description: "Heavy table lock acquired during unindexed reconciliation batch job created cascading wait queues for row-level locks on payments table.",
    impact: "Query latency on database reads increased from 15ms to 1,200ms across all dependent microservices.",
    ai_analysis_id: "ai-4091",
    events_count: 4,
    logs_count: 88
  },
  {
    id: "INC-4089",
    title: "Search Indexer Pod CrashLoopBackOff due to Memory Allocation Exceeded",
    service_id: "srv-008",
    service_name: "search-indexer",
    environment: "development",
    severity: "MEDIUM",
    status: "OPEN",
    started_at: "2026-08-19T08:12:00Z",
    resolved_at: null,
    duration_minutes: 178,
    commander: "Dev Team On-Call",
    description: "Elasticsearch vector batch bulk insert exceeded container memory limit of 2GiB causing Kernel OOMKilled signal 137.",
    impact: "Development indexing halted; no production customer impact.",
    ai_analysis_id: "ai-4089",
    events_count: 3,
    logs_count: 35
  },
  {
    id: "INC-4085",
    title: "Kubernetes Ingress Controller SSL Certificate Handshake Flapping",
    service_id: "srv-003",
    service_name: "kubernetes-ingress",
    environment: "production",
    severity: "HIGH",
    status: "RESOLVED",
    started_at: "2026-08-18T14:10:00Z",
    resolved_at: "2026-08-18T14:48:00Z",
    duration_minutes: 38,
    commander: "Marcus Vance (Principal SRE)",
    description: "Automated Let's Encrypt Cert-Manager secret sync failed during key rotation, causing 3 out of 16 ingress pods to serve expired TLS bundle.",
    impact: "0.4% of inbound HTTPS requests received SSL handshake errors for 38 minutes.",
    ai_analysis_id: "ai-4085",
    events_count: 6,
    logs_count: 210
  },
  {
    id: "INC-4082",
    title: "Redis Cache Cluster Node-3 Ephemeral Network Partition",
    service_id: "srv-005",
    service_name: "redis-cache-cluster",
    environment: "production",
    severity: "LOW",
    status: "RESOLVED",
    started_at: "2026-08-17T22:04:00Z",
    resolved_at: "2026-08-17T22:21:00Z",
    duration_minutes: 17,
    commander: "Automated Failover Bot",
    description: "AWS VPC ENI interface reset triggered Redis Sentinel cluster failover to replica shard seamlessly.",
    impact: "Temporary 200ms spike in cache misses; auto-recovered.",
    ai_analysis_id: "ai-4082",
    events_count: 4,
    logs_count: 42
  }
];

export const MOCK_INCIDENT_TIMELINES = {
  "INC-4092": [
    {
      id: "evt-01",
      event_type: "INCIDENT_TRIGGERED",
      timestamp: "2026-08-19T10:24:18Z",
      actor: "Prometheus AlertManager",
      title: "Alert: High5xxRateTriggered (>3% error rate for 3m)",
      details: "PromQL query: sum(rate(http_requests_total{status=~'5..'}[2m])) / sum(rate(http_requests_total[2m])) * 100 = 4.82%",
      severity: "CRITICAL"
    },
    {
      id: "evt-02",
      event_type: "INVESTIGATION_STARTED",
      timestamp: "2026-08-19T10:27:00Z",
      actor: "Alex Mercer (Senior SRE)",
      title: "Incident Commander Paged & Incident War-Room Opened",
      details: "Acknowledged PagerDuty high-priority escalation. Initiated Slack #incident-4092 war-room.",
      severity: "INFO"
    },
    {
      id: "evt-03",
      event_type: "ERROR_DETECTED",
      timestamp: "2026-08-19T10:31:45Z",
      actor: "CloudOps Telemetry Engine",
      title: "PgBouncer Connection Pool Saturation Detected",
      details: "Client connections spiked to 10,000 / 10,000 (100% capacity). Server connections waiting in queue: 412 queries.",
      severity: "HIGH"
    },
    {
      id: "evt-04",
      event_type: "ROOT_CAUSE_IDENTIFIED",
      timestamp: "2026-08-19T10:38:12Z",
      actor: "CloudOpsAI NVIDIA LLM Engine",
      title: "AI Analysis: Missing Connection Timeout in payment-gateway v2.14.0",
      details: "Correlated release v2.14.0 deployed at 10:15 UTC with unclosed HTTP client sessions in Stripe Webhook Handler holding PostgreSQL connections open indefinitely.",
      severity: "INFO"
    },
    {
      id: "evt-05",
      event_type: "REMEDIATION_IN_PROGRESS",
      timestamp: "2026-08-19T10:45:00Z",
      actor: "Alex Mercer",
      title: "PgBouncer Max Client Connections Dynamically Increased & Rollback Prepared",
      details: "Increased pool size to 15,000 via kubectl config patch; initiating hotfix rollback for payment-gateway pod deployment.",
      severity: "INFO"
    }
  ]
};

export const MOCK_AI_ANALYSES = {
  "INC-4092": {
    id: "ai-4092",
    incident_id: "INC-4092",
    model_name: "NVIDIA-hosted Llama-3.3-70B-Instruct SRE-Tuned",
    confidence_score: 93,
    created_at: "2026-08-19T10:38:12Z",
    summary: "The payment-gateway microservice is experiencing cascading 504 Gateway Timeouts due to PostgreSQL connection starvation caused by an unclosed async DB connection bug introduced in release v2.14.0.",
    root_cause: "In deployment v2.14.0 (committed at 10:12 UTC), the new Stripe webhook retry interceptor fails to release database session handles back to the PgBouncer pool when webhook endpoints return HTTP 429 rate limit responses. Over 40 minutes, 10,000 connection slots were permanently held in 'IDLE in transaction' state.",
    confidence_reasons: [
      "Exact temporal correlation: deployment timestamp 10:15 UTC matches first 504 spike at 10:24 UTC.",
      "PgBouncer metric 'pool_idle_in_transaction' matches count of active webhook retries.",
      "142 matching ERROR logs in payment-gateway containing 'Timeout waiting for connection from pool'."
    ],
    evidence: [
      {
        type: "LOG_MATCH",
        timestamp: "2026-08-19T10:32:01.402Z",
        source: "payment-gateway.db.pool",
        content: "sqlalchemy.exc.TimeoutError: QueuePool limit of size 20 overflow 10 reached, connection timed out, timeout 30.00"
      },
      {
        type: "METRIC_ANOMALY",
        timestamp: "2026-08-19T10:30:00Z",
        source: "pgbouncer_client_active_connections",
        content: "Metric surged from 850 (baseline) to 10,000 (100% threshold) in 15 minutes."
      },
      {
        type: "GIT_COMMIT_DIFF",
        timestamp: "2026-08-19T10:12:00Z",
        source: "github.com/cloudops/payment-gateway/commit/a8f3b9",
        content: "Added `async def handle_stripe_webhook()` without `async with db.begin()` context manager."
      }
    ],
    recommended_actions: [
      {
        id: "act-1",
        title: "Flush Stalled PgBouncer Connections",
        command: "kubectl exec -it pgbouncer-prod-0 -n default -- psql -p 6432 -U pgbouncer -c 'PAUSE payment_db; KILL payment_db; RESUME payment_db;'",
        description: "Instantly terminates idle leaked connections to restore database availability.",
        impact: "Immediate recovery of active checkout transactions.",
        priority: "CRITICAL",
        status: "PENDING"
      },
      {
        id: "act-2",
        title: "Rollback payment-gateway to v2.13.9",
        command: "kubectl rollout undo deployment/payment-gateway -n default",
        description: "Reverts the problematic webhook handler to the previous stable release.",
        impact: "Eliminates root-cause connection leaks until hotfix is validated.",
        priority: "HIGH",
        status: "IN_PROGRESS"
      },
      {
        id: "act-3",
        title: "Apply Database Connection Timeout Guard",
        command: "ALTER ROLE payment_user SET idle_in_transaction_session_timeout = '15s';",
        description: "Ensures PostgreSQL server forcefully reclaims transactions stalled longer than 15 seconds.",
        impact: "Prevents future catastrophic connection pool exhaustion.",
        priority: "MEDIUM",
        status: "PENDING"
      }
    ]
  },
  "INC-4091": {
    id: "ai-4091",
    incident_id: "INC-4091",
    model_name: "NVIDIA-hosted Llama-3.3-70B-Instruct SRE-Tuned",
    confidence_score: 88,
    created_at: "2026-08-19T10:02:00Z",
    summary: "Reconciliation batch script initiated an unindexed table scan on invoices_ledger, acquiring an ACCESS EXCLUSIVE lock that blocked concurrent row writes.",
    root_cause: "Cron job 'daily_billing_recon' executed `SELECT * FROM invoices_ledger WHERE reconciled = false FOR UPDATE` without composite index `(reconciled, tenant_id)`, causing a 4.2 million row sequential lock.",
    confidence_reasons: [
      "PostgreSQL pg_stat_activity shows PID 24901 holding ExclusiveLock on invoices_ledger.",
      "High correlation with cron execution started at 09:45 UTC."
    ],
    evidence: [
      {
        type: "LOG_MATCH",
        timestamp: "2026-08-19T09:50:11Z",
        source: "postgresql-primary",
        content: "LOG: process 24988 still waiting for ExclusiveLock on relation 16402 of database 16384 after 1000.089 ms"
      }
    ],
    recommended_actions: [
      {
        id: "act-4091-1",
        title: "Terminate Blocking PID in Postgres",
        command: "SELECT pg_cancel_backend(24901);",
        description: "Cancel the unindexed query to release locks across all waiting workers.",
        priority: "CRITICAL",
        status: "PENDING"
      },
      {
        id: "act-4091-2",
        title: "Create Concurrent Composite Index",
        command: "CREATE INDEX CONCURRENTLY idx_invoices_reconciled ON invoices_ledger(reconciled, tenant_id);",
        description: "Build index in background without table locking to accelerate reconciliation queries.",
        priority: "HIGH",
        status: "PENDING"
      }
    ]
  }
};

export const MOCK_LOGS = [
  {
    id: "log-101",
    timestamp: "2026-08-19T10:46:12.891Z",
    level: "CRITICAL",
    service: "payment-gateway",
    source: "payment_worker.checkout",
    message: "HTTP 504 Gateway Timeout while awaiting upstream confirmation for transaction txn_90248a8f",
    metadata: {
      transaction_id: "txn_90248a8f",
      customer_id: "cust_4892",
      amount_cents: 14999,
      currency: "USD",
      latency_ms: 30002,
      pgbouncer_pool_wait_ms: 29994,
      host: "k8s-pod-payment-gateway-68b49f99f9-x9w2l"
    }
  },
  {
    id: "log-102",
    timestamp: "2026-08-19T10:45:55.120Z",
    level: "ERROR",
    service: "payment-gateway",
    source: "db.connection_pool",
    message: "sqlalchemy.exc.TimeoutError: QueuePool limit of size 20 overflow 10 reached, connection timed out, timeout 30.00",
    metadata: {
      db_cluster: "rds-postgres-prod-01",
      active_connections: 30,
      waiting_threads: 412,
      database: "payments_prod",
      exception_trace: "Traceback (most recent call last):\n  File '/app/db/session.py', line 44, in get_db\n  File 'sqlalchemy/pool/base.py', line 378, in connect"
    }
  },
  {
    id: "log-103",
    timestamp: "2026-08-19T10:45:30.401Z",
    level: "WARNING",
    service: "kubernetes-ingress",
    source: "nginx.ingress.controller",
    message: "Upstream server returned HTTP 504 for request GET /api/v2/checkout/status",
    metadata: {
      client_ip: "198.51.100.44",
      http_method: "GET",
      uri: "/api/v2/checkout/status",
      status_code: 504,
      request_time: 30.012,
      upstream_addr: "10.244.3.82:8080"
    }
  },
  {
    id: "log-104",
    timestamp: "2026-08-19T10:44:18.230Z",
    level: "INFO",
    service: "auth-service",
    source: "jwt.token_issuer",
    message: "Successfully refreshed JWT session token for user usr_sre_lead",
    metadata: {
      user_id: "usr_sre_lead",
      role: "SRE_ADMIN",
      token_expires_in: 3600,
      issuer: "cloudops-auth-v3"
    }
  },
  {
    id: "log-105",
    timestamp: "2026-08-19T10:43:02.112Z",
    level: "ERROR",
    service: "postgresql-primary",
    source: "postgres.server.locks",
    message: "Process 24988 still waiting for ExclusiveLock on relation 16402 (invoices_ledger) after 15200.089 ms",
    metadata: {
      pid: 24988,
      blocked_by_pid: 24901,
      table: "invoices_ledger",
      query: "UPDATE invoices_ledger SET status = 'PROCESSING' WHERE id = 892014",
      wait_time_ms: 15200
    }
  },
  {
    id: "log-106",
    timestamp: "2026-08-19T10:42:15.654Z",
    level: "INFO",
    service: "redis-cache-cluster",
    source: "redis.server",
    message: "Cluster health OK. 6 nodes connected, 0 failed slots, memory fragmentation ratio 1.12",
    metadata: {
      used_memory_human: "14.2G",
      maxmemory_human: "32G",
      connected_clients: 419,
      ops_per_sec: 14200
    }
  },
  {
    id: "log-107",
    timestamp: "2026-08-19T10:40:00.000Z",
    level: "WARNING",
    service: "order-processing-worker",
    source: "celery.task_consumer",
    message: "Task queue depth backlog exceeding SLA: 1,840 pending tasks waiting in queue 'orders_priority'",
    metadata: {
      queue_name: "orders_priority",
      queue_depth: 1840,
      active_workers: 20,
      oldest_message_age_seconds: 245
    }
  },
  {
    id: "log-108",
    timestamp: "2026-08-19T10:38:12.330Z",
    level: "INFO",
    service: "cloudops-ai-engine",
    source: "ai.inference.nvidia",
    message: "Generated root cause diagnosis for incident INC-4092 with 93% confidence score",
    metadata: {
      model: "NVIDIA Llama-3.3-70B",
      inference_time_ms: 840,
      prompt_tokens: 1420,
      completion_tokens: 388,
      incident_id: "INC-4092"
    }
  },
  {
    id: "log-109",
    timestamp: "2026-08-19T10:35:40.119Z",
    level: "CRITICAL",
    service: "search-indexer",
    source: "k8s.kubelet.oomkiller",
    message: "Container search-indexer in pod search-indexer-dev-0 OOMKilled (exit code 137). Memory usage: 2048MiB / 2048MiB",
    metadata: {
      container: "search-indexer",
      namespace: "sandbox-dev",
      exit_code: 137,
      limit: "2048Mi",
      requested: "1024Mi"
    }
  },
  {
    id: "log-110",
    timestamp: "2026-08-19T10:30:19.450Z",
    level: "INFO",
    service: "kubernetes-ingress",
    source: "nginx.access",
    message: "GET /health 200 OK 1.4ms from CloudOps Sentinel Monitor",
    metadata: {
      status: 200,
      latency: 0.0014,
      user_agent: "CloudOps-HealthCheck/2.0"
    }
  }
];

export const MOCK_REPORTS = [
  {
    id: "rep-4085",
    incident_id: "INC-4085",
    title: "Post-Mortem: Kubernetes Ingress Controller SSL Secret Flapping",
    service_name: "kubernetes-ingress",
    severity: "HIGH",
    incident_duration_minutes: 38,
    total_impacted_requests: 14200,
    generated_at: "2026-08-18T16:00:00Z",
    author: "CloudOpsAI Automated SRE Reporter",
    status: "FINALIZED",
    root_cause: "Cert-Manager automated ACME renewal secret synchronization was desynchronized during ingress pod autoscaling event.",
    evidence_summary: "3 ingress pods were mounting older secret revision due to kubelet projected volume cache lag.",
    resolution: "Forced rolling restart of ingress daemonset and updated Cert-Manager webhook timeout configuration to 30s.",
    preventive_actions: [
      "Added Prometheus alert for pod secret checksum mismatch.",
      "Configured automated Canary verification before swapping active TLS certificates."
    ]
  },
  {
    id: "rep-4082",
    incident_id: "INC-4082",
    title: "Post-Mortem: Redis Cache Cluster Node-3 ENI Interface Reset",
    service_name: "redis-cache-cluster",
    severity: "LOW",
    incident_duration_minutes: 17,
    total_impacted_requests: 850,
    generated_at: "2026-08-18T09:30:00Z",
    author: "Marcus Vance",
    status: "FINALIZED",
    root_cause: "Underlying AWS Nitro hypervisor network maintenance triggered automatic ENI migration.",
    evidence_summary: "Redis Sentinel triggered election and promoted replica shard in 1.4 seconds.",
    resolution: "Self-healed via Sentinel quorum. SRE validated node rejoin.",
    preventive_actions: [
      "Verified multi-AZ replica placement across 3 distinct Availability Zones."
    ]
  }
];
