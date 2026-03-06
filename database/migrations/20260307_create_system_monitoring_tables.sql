-- System Monitoring Tables
-- Created: 2026-03-07
-- Description: Tables for system performance monitoring and metrics

-- System metrics storage table
CREATE TABLE IF NOT EXISTS system_metrics (
    id BIGSERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(20, 6) NOT NULL,
    unit VARCHAR(20),
    tags JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Indexes for efficient querying
    CONSTRAINT valid_metric_name CHECK (metric_name IN (
        'cpu_percent',
        'memory_percent',
        'memory_used',
        'memory_available',
        'disk_percent',
        'disk_used',
        'disk_available',
        'network_in',
        'network_out',
        'load_average_1m',
        'load_average_5m',
        'load_average_15m',
        'process_count',
        'thread_count'
    ))
);

-- Index for time-based queries
CREATE INDEX idx_system_metrics_timestamp ON system_metrics(timestamp DESC);
CREATE INDEX idx_system_metrics_metric_name ON system_metrics(metric_name);
CREATE INDEX idx_system_metrics_metric_timestamp ON system_metrics(metric_name, timestamp DESC);

-- Partitioning for better performance (optional, for PostgreSQL 10+)
-- Uncomment if your PostgreSQL version supports partitioning
/*
CREATE TABLE system_metrics_cpu PARTITION OF system_metrics
    FOR VALUES IN ('cpu_percent', 'load_average_1m', 'load_average_5m', 'load_average_15m');

CREATE TABLE system_metrics_memory PARTITION OF system_metrics
    FOR VALUES IN ('memory_percent', 'memory_used', 'memory_available');

CREATE TABLE system_metrics_disk PARTITION OF system_metrics
    FOR VALUES IN ('disk_percent', 'disk_used', 'disk_available');

CREATE TABLE system_metrics_network PARTITION OF system_metrics
    FOR VALUES IN ('network_in', 'network_out');
*/

-- Alert rules table
CREATE TABLE IF NOT EXISTS alert_rules (
    id BIGSERIAL PRIMARY KEY,
    rule_name VARCHAR(255) NOT NULL UNIQUE,
    metric_name VARCHAR(100) NOT NULL,
    condition VARCHAR(20) NOT NULL, -- '>', '<', '>=', '<=', '==', '!='
    threshold DECIMAL(20, 6) NOT NULL,
    duration_seconds INTEGER DEFAULT 300, -- How long condition must be met
    severity VARCHAR(20) DEFAULT 'warning', -- 'info', 'warning', 'critical'
    enabled BOOLEAN DEFAULT true,
    notification_channels JSONB, -- Array of notification configs
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_condition CHECK (condition IN ('>', '<', '>=', '<=', '==', '!='))
);

CREATE INDEX idx_alert_rules_metric_name ON alert_rules(metric_name);
CREATE INDEX idx_alert_rules_enabled ON alert_rules(enabled);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id BIGSERIAL PRIMARY KEY,
    rule_id BIGINT REFERENCES alert_rules(id) ON DELETE SET NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    metric_value DECIMAL(20, 6),
    threshold DECIMAL(20, 6),
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved'
    acknowledged_by UUID REFERENCES users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,

    CONSTRAINT valid_severity CHECK (severity IN ('info', 'warning', 'critical')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'acknowledged', 'resolved'))
);

CREATE INDEX idx_alerts_triggered_at ON alerts(triggered_at DESC);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_rule_id ON alerts(rule_id);

-- Performance logs table
CREATE TABLE IF NOT EXISTS performance_logs (
    id BIGSERIAL PRIMARY KEY,
    endpoint_path VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_method CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'))
);

CREATE INDEX idx_performance_logs_timestamp ON performance_logs(timestamp DESC);
CREATE INDEX idx_performance_logs_endpoint ON performance_logs(endpoint_path);
CREATE INDEX idx_performance_logs_status_code ON performance_logs(status_code);
CREATE INDEX idx_performance_logs_response_time ON performance_logs(response_time_ms);

-- Batch operations log table
CREATE TABLE IF NOT EXISTS batch_operations (
    id BIGSERIAL PRIMARY KEY,
    operation_type VARCHAR(50) NOT NULL,
    target_table VARCHAR(100) NOT NULL,
    total_count INTEGER NOT NULL,
    successful_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'cancelled'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    error_summary TEXT,
    errors JSONB, -- Array of error objects
    metadata JSONB,
    initiated_by UUID REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT valid_operation_type CHECK (operation_type IN (
        'batch_create',
        'batch_update',
        'batch_delete',
        'batch_export',
        'batch_import'
    )),
    CONSTRAINT valid_batch_status CHECK (status IN (
        'pending',
        'running',
        'completed',
        'failed',
        'cancelled'
    ))
);

CREATE INDEX idx_batch_operations_started_at ON batch_operations(started_at DESC);
CREATE INDEX idx_batch_operations_status ON batch_operations(status);
CREATE INDEX idx_batch_operations_type ON batch_operations(operation_type);

-- Health check history table
CREATE TABLE IF NOT EXISTS health_check_history (
    id BIGSERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'healthy', 'degraded', 'unhealthy'
    response_time_ms INTEGER,
    details JSONB,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_health_status CHECK (status IN ('healthy', 'degraded', 'unhealthy'))
);

CREATE INDEX idx_health_check_checked_at ON health_check_history(checked_at DESC);
CREATE INDEX idx_health_check_service_name ON health_check_history(service_name);
CREATE INDEX idx_health_check_status ON health_check_history(status);

-- Scheduled task logs table
CREATE TABLE IF NOT EXISTS scheduled_task_logs (
    id BIGSERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    task_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'pending', 'running', 'completed', 'failed'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    output TEXT,
    error_message TEXT,
    metadata JSONB,

    CONSTRAINT valid_task_status CHECK (status IN ('pending', 'running', 'completed', 'failed'))
);

CREATE INDEX idx_scheduled_task_logs_started_at ON scheduled_task_logs(started_at DESC);
CREATE INDEX idx_scheduled_task_logs_status ON scheduled_task_logs(status);
CREATE INDEX idx_scheduled_task_logs_task_name ON scheduled_task_logs(task_name);

-- System resources snapshot table (for historical data)
CREATE TABLE IF NOT EXISTS system_snapshots (
    id BIGSERIAL PRIMARY KEY,
    cpu_percent DECIMAL(5, 2),
    memory_total BIGINT,
    memory_used BIGINT,
    memory_available BIGINT,
    memory_percent DECIMAL(5, 2),
    disk_total BIGINT,
    disk_used BIGINT,
    disk_free BIGINT,
    disk_percent DECIMAL(5, 2),
    load_average_1m DECIMAL(5, 2),
    load_average_5m DECIMAL(5, 2),
    load_average_15m DECIMAL(5, 2),
    process_count INTEGER,
    thread_count INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_system_snapshots_timestamp ON system_snapshots(timestamp DESC);

-- Comments for documentation
COMMENT ON TABLE system_metrics IS 'Stores system performance metrics over time';
COMMENT ON TABLE alert_rules IS 'Defines rules for triggering alerts based on metrics';
COMMENT ON TABLE alerts IS 'Stores triggered alerts with their status and resolution';
COMMENT ON TABLE performance_logs IS 'Stores API performance metrics for monitoring';
COMMENT ON TABLE batch_operations IS 'Logs batch operations for auditing and monitoring';
COMMENT ON TABLE health_check_history IS 'Stores health check results for services';
COMMENT ON TABLE scheduled_task_logs IS 'Logs execution of scheduled/cron tasks';
COMMENT ON TABLE system_snapshots IS 'Stores periodic snapshots of system resources';

-- Create view for current system status
CREATE OR REPLACE VIEW current_system_status AS
SELECT
    cpu_percent,
    memory_total,
    memory_used,
    memory_available,
    memory_percent,
    disk_total,
    disk_used,
    disk_free,
    disk_percent,
    load_average_1m,
    load_average_5m,
    load_average_15m,
    process_count,
    thread_count,
    timestamp
FROM system_snapshots
ORDER BY timestamp DESC
LIMIT 1;

-- Create view for recent alerts
CREATE OR REPLACE VIEW recent_alerts AS
SELECT
    a.id,
    a.rule_id,
    a.severity,
    a.title,
    a.description,
    a.metric_value,
    a.threshold,
    a.triggered_at,
    a.resolved_at,
    a.status,
    ar.rule_name,
    ar.metric_name
FROM alerts a
LEFT JOIN alert_rules ar ON a.rule_id = ar.id
WHERE a.status IN ('active', 'acknowledged')
ORDER BY a.triggered_at DESC;

-- Create function to cleanup old metrics (retain last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_metrics()
RETURNS void AS $$
BEGIN
    DELETE FROM system_metrics
    WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '30 days';

    DELETE FROM performance_logs
    WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '30 days';

    DELETE FROM health_check_history
    WHERE checked_at < CURRENT_TIMESTAMP - INTERVAL '90 days';

    -- Keep system_snapshots for 1 year at hourly intervals
    DELETE FROM system_snapshots
    WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust based on your database user)
-- GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO cyberpress_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cyberpress_app;
