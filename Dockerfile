FROM frankframework/frankframework:latest

# Copy dependencies
COPY --chown=tomcat lib/server/* /usr/local/tomcat/lib/

# Copy Frank!
COPY --chown=tomcat src/main/ /opt/frank/
