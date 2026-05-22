package com.elearn.lms.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationFailedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class DeployDiagnosticsListener implements ApplicationListener<ApplicationFailedEvent> {

    private static final Logger log = LoggerFactory.getLogger(DeployDiagnosticsListener.class);

    @Override
    public void onApplicationEvent(ApplicationFailedEvent event) {
        Environment env = event.getApplicationContext().getEnvironment();
        String url = env.getProperty("spring.datasource.url", "");
        boolean pointsToLocalhost = url.contains("localhost") || url.contains("127.0.0.1");

        if (pointsToLocalhost) {
            log.error(
                    "Database connection failed: SPRING_DATASOURCE_URL still points to localhost. "
                            + "On Railway, set SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, and "
                            + "SPRING_DATASOURCE_PASSWORD using References to your MySQL service "
                            + "(see backend/railway.env.example). Without a reachable database the API "
                            + "never starts and the /health check will fail."
            );
        } else if (url.isBlank()) {
            log.error(
                    "Database connection failed: spring.datasource.url is empty. "
                            + "Configure SPRING_DATASOURCE_URL on Railway."
            );
        } else {
            log.error(
                    "Application failed to start. Verify MySQL is running and SPRING_DATASOURCE_* "
                            + "credentials match your Railway MySQL service. JDBC host in use: {}",
                    sanitizeJdbcHost(url)
            );
        }
    }

    private static String sanitizeJdbcHost(String jdbcUrl) {
        int scheme = jdbcUrl.indexOf("://");
        if (scheme < 0) {
            return "(unparseable URL)";
        }
        int hostStart = scheme + 3;
        int hostEnd = jdbcUrl.indexOf('/', hostStart);
        if (hostEnd < 0) {
            hostEnd = jdbcUrl.length();
        }
        String hostPort = jdbcUrl.substring(hostStart, hostEnd);
        int at = hostPort.lastIndexOf('@');
        return at >= 0 ? hostPort.substring(at + 1) : hostPort;
    }
}
