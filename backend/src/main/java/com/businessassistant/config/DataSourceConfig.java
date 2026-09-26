package com.businessassistant.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Automatically configures PostgreSQL for Supabase / Render / Cloud database.
 * Supports both URI (postgresql://...) and JDBC (jdbc:postgresql://...) formats,
 * and ensures SSL compatibility required by Supabase.
 */
@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    @ConditionalOnExpression("T(System).getenv('DATABASE_URL') != null && !T(System).getenv('DATABASE_URL').isEmpty()")
    public DataSource cloudPostgresDataSource() {
        String rawUrl = System.getenv("DATABASE_URL").trim();
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");

        if (rawUrl.startsWith("jdbc:postgresql://")) {
            // User provided JDBC URL directly
            config.setJdbcUrl(rawUrl);
            String user = System.getenv("SPRING_DATASOURCE_USERNAME");
            if (user == null || user.isEmpty()) user = System.getenv("DB_USERNAME");
            if (user != null) config.setUsername(user);

            String pass = System.getenv("SPRING_DATASOURCE_PASSWORD");
            if (pass == null || pass.isEmpty()) pass = System.getenv("DB_PASSWORD");
            if (pass != null) config.setPassword(pass);
        } else {
            // User provided Supabase / Render standard URI (postgresql:// or postgres://)
            try {
                URI uri = new URI(rawUrl);
                String username = "";
                String password = "";
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    username = java.net.URLDecoder.decode(parts[0], java.nio.charset.StandardCharsets.UTF_8.name());
                    password = java.net.URLDecoder.decode(parts[1], java.nio.charset.StandardCharsets.UTF_8.name());
                } else if (userInfo != null) {
                    username = java.net.URLDecoder.decode(userInfo, java.nio.charset.StandardCharsets.UTF_8.name());
                }

                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String host = uri.getHost();
                String path = uri.getPath(); // /postgres

                StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://" + host + ":" + port + path);
                String query = uri.getQuery();

                // Supabase requires SSL
                if (host != null && host.contains("supabase")) {
                    if (query == null || query.isEmpty()) {
                        jdbcUrl.append("?sslmode=require");
                    } else if (!query.contains("sslmode")) {
                        jdbcUrl.append("?").append(query).append("&sslmode=require");
                    } else {
                        jdbcUrl.append("?").append(query);
                    }
                } else if (query != null && !query.isEmpty()) {
                    jdbcUrl.append("?").append(query);
                }

                config.setJdbcUrl(jdbcUrl.toString());
                config.setUsername(username);
                config.setPassword(password);
            } catch (Exception e) {
                // If URI parsing fails (e.g. unencoded special characters in password), fallback to raw JDBC prefix
                String fallbackUrl = rawUrl.replaceFirst("^(postgres|postgresql)://", "jdbc:postgresql://");
                config.setJdbcUrl(fallbackUrl);
            }
        }

        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        System.out.println("DataSourceConfig: Configured Cloud PostgreSQL DataSource for Supabase / Render.");
        return new HikariDataSource(config);
    }
}
