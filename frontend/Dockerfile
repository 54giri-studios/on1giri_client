FROM "debian:bullseye-slim"

# Update and install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    libsoup2.4-dev \
    libwebkit2gtk-4.0-dev

# Install Node.js 21.6.2

WORKDIR /app

RUN curl -sL https://deb.nodesource.com/setup_21.x | bash -
RUN apt-get install -y nodejs


RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

ENV PATH="/root/.cargo/bin:${PATH}"

#RUN rustup component add rust-analyzer

# Copy the source code from parent directory to the working directory
COPY . .

RUN cargo install tauri-cli

# Install tauri dependencies
RUN npm install @tauri-apps/api@latest


# Build the application for release purpose
#RUN cargo build --release --manifest-path=./src-tauri/Cargo.toml --no-default-features

WORKDIR /app/src-tauri

# Run the application for release purpose
# CMD ["./src-tauri/target/release/app"]

# Run the application for development purpose
#CMD ["cargo", "test", "--", "--test-threads=1"]
CMD ["cargo", "tauri", "dev"]
